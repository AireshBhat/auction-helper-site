import { Button, DatePicker, Divider, Input, Switch, Form, InputNumber, Select } from "antd";
import React, { useState, useCallback, useRef } from "react";
import { utils, BigNumber, constants } from "ethers";
import { notification } from "antd";

import { Address, Events, AddressInput } from "../components";
import generateSignatures from "../helpers/generateSignatures";
import uploadSignature from "../helpers/uploadSignature";
import { initialNetwork } from "../constants";

export default function ExampleUI({
  address,
  userSigner,
  mainnetProvider,
  localProvider,
  tx,
  readContracts,
  writeContracts,
  targetNetwork,
}) {
  const [auctioningTokenAmount, setAuctioningTokenAmount] = useState(0);
  const [biddingTokenAmount, setBiddingTokenAmount] = useState(0);
  const [biddingTokenUSDCAmount, setBiddingTokenUSDCAmount] = useState(0);
  const [isPrivateAuction, setIsPrivateAuction] = useState(false);

  const formRef = useRef(null);

  const onFinish = useCallback(
    async values => {
      const {
        auctioningToken,
        biddingToken,
        orderCancellationEndDate,
        auctionEndDate,
        auctionedSellAmount,
        minBuyAmount,
        minimumBiddingAmountPerOrder,
        minimumFundingThreshold,
        isAtomicClosureAllowed,
        isPrivateAuction,
        signersAddress,
        whitelistAddresses,
      } = values;
      const currentAuctionCount = (await readContracts?.EasyAuction?.auctionCounter()).toNumber();

      const auctioningTokenAddress = auctioningToken;
      const biddingTokenAddress = biddingToken;
      const orderCancellationEndDateTimestamp = orderCancellationEndDate.unix();
      const auctionEndDateTimestamp = auctionEndDate.unix();
      const auctionedSellAmountInWei = BigNumber.from(utils.parseUnits("" + auctionedSellAmount, 18)).toString();
      const minBuyAmountInWei = BigNumber.from(utils.parseUnits("" + minBuyAmount, 6)).toString();
      const minimumBiddingAmountPerOrderInWei = BigNumber.from(
        utils.parseUnits("" + minimumBiddingAmountPerOrder, 6),
      ).toString();
      const minimumFundingThresholdInWei = BigNumber.from(utils.parseUnits("" + minimumFundingThreshold, 6)).toString();
      const isAtomicClosureAllowedBool = !!isAtomicClosureAllowed;
      let accessManagerAddress = constants.AddressZero;
      let accessManagerContractData = "0x";
      if (!!isPrivateAuction && signersAddress) {
        accessManagerAddress = "0xE0AD16EB7Ea467C694E6cFdd5E7D61FE850e8B53";
        accessManagerContractData = utils.defaultAbiCoder.encode(["address"], [signersAddress]);
      }
      console.log({
        auctioningTokenAddress,
        biddingTokenAddress,
        orderCancellationEndDateTimestamp,
        auctionEndDateTimestamp,
        auctionedSellAmountInWei,
        minBuyAmountInWei,
        minimumBiddingAmountPerOrderInWei,
        minimumFundingThresholdInWei,
        isAtomicClosureAllowedBool,
        accessManagerAddress,
        accessManagerContractData,
      });
      tx(
        writeContracts.EasyAuction.initiateAuction(
          auctioningTokenAddress,
          biddingTokenAddress,
          orderCancellationEndDateTimestamp,
          auctionEndDateTimestamp,
          auctionedSellAmountInWei,
          minBuyAmountInWei,
          minimumBiddingAmountPerOrderInWei,
          minimumFundingThresholdInWei,
          isAtomicClosureAllowedBool,
          accessManagerAddress,
          accessManagerContractData,
        ),
        async update => {
          console.log("📡 Easy Auction Transaction Update:", update);
          if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log(" 🍾 Easy Auction Transaction " + update.hash + " finished!");
            console.log(
              " ⛽️ " +
                update.gasUsed +
                "/" +
                (update.gasLimit || update.gas) +
                " @ " +
                parseFloat(update.gasPrice) / 1000000000 +
                " gwei",
            );
            if (!!isPrivateAuction && signersAddress) {
              onGenerateSignatures({ auctionId: currentAuctionCount + 1, whitelistAddresses });
            }
          }
        },
      );
    },
    [readContracts?.EasyAuction, onGenerateSignatures],
  );

  const onFinishFailed = () => {};
  const onGenerateSignatures = useCallback(
    async values => {
      const { auctionId, whitelistAddresses } = values;

      const signatures = await generateSignatures(
        whitelistAddresses,
        userSigner,
        auctionId,
        "0xE0AD16EB7Ea467C694E6cFdd5E7D61FE850e8B53",
      );

      await Promise.all(
        signatures.map(async signature => {
          const { user, signature: auctioneerSignedMessage } = signature;
          await uploadSignature(targetNetwork.chainId, auctionId, user, auctioneerSignedMessage);
        }),
      );
    },
    [targetNetwork.chainId, userSigner],
  );

  const approveAuctioningToken = useCallback(async () => {
    if (auctioningTokenAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    /* look how you call setPurpose on your contract: */
    /* notice how you pass a call back for tx updates too */
    const result = tx(
      writeContracts.AuctioningToken.mint(
        address,
        // "" + auctioningTokenAmount * 10 ** 18,
        BigNumber.from(utils.parseUnits("" + auctioningTokenAmount, 18)),
      ),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );

          tx(
            writeContracts.AuctioningToken.approve(
              initialNetwork.easyAuctionAddress,
              BigNumber.from(utils.parseUnits("" + auctioningTokenAmount, 18)),
            ),
            update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            },
          );
        }
      },
    );
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  }, [auctioningTokenAmount, address, writeContracts.AuctioningToken]);

  const approveBiddingTokenUSDC = useCallback(async () => {
    if (biddingTokenUSDCAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    /* look how you call setPurpose on your contract: */
    /* notice how you pass a call back for tx updates too */
    const result = tx(
      writeContracts.BiddingTokenUSDC.mint(address, BigNumber.from(utils.parseUnits("" + biddingTokenUSDCAmount, 6))),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );

          tx(
            writeContracts.BiddingTokenUSDC.approve(
              initialNetwork.easyAuctionAddress,
              BigNumber.from(utils.parseUnits("" + biddingTokenUSDCAmount, 6)),
            ),
            update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            },
          );
        }
      },
    );
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  }, []);

  const approveBiddingToken = useCallback(async () => {
    if (biddingTokenAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    /* look how you call setPurpose on your contract: */
    /* notice how you pass a call back for tx updates too */
    const result = tx(
      writeContracts.BiddingToken.mint(address, BigNumber.from(utils.parseUnits("" + biddingTokenAmount, 18))),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );

          tx(
            writeContracts.BiddingToken.approve(
              initialNetwork.easyAuctionAddress,
              BigNumber.from(utils.parseUnits("" + biddingTokenAmount, 18)),
            ),
            update => {
              console.log("📡 Transaction Update:", update);
              if (update && (update.status === "confirmed" || update.status === 1)) {
                console.log(" 🍾 Transaction " + update.hash + " finished!");
                console.log(
                  " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
                );
              }
            },
          );
        }
      },
    );
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  }, [biddingTokenAmount, address, writeContracts.BiddingToken]);

  const onSettleAuction = useCallback(
    async values => {
      const { auctionId } = values;
      await tx(writeContracts.EasyAuction.settleAuction(auctionId), update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );
          notification.info({
            message: `Auction ID: ${auctionId} has been settled`,
            description: "",
            placement: "topRight",
          });
        }
      });
    },
    [writeContracts?.EasyAuction],
  );

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: "80%", margin: "auto", marginTop: 64 }}>
        <h2>Auction Test Site</h2>
        <Divider />
        <h3>Mint tokens</h3>
        <div style={{ display: "flex", alignContent: "center", flexDirection: "row", justifyContent: "center" }}>
          <InputNumber
            min={1}
            onChange={e => {
              setAuctioningTokenAmount(e);
            }}
            style={{ width: 200, marginRight: 20 }}
          />
          <Button style={{ marginTop: 8, marginRight: 10 }} onClick={approveAuctioningToken}>
            Mint Auctioning Token and Approve
          </Button>
          <Address address={writeContracts?.AuctioningToken?.address} />
        </div>
        <div
          style={{
            display: "flex",
            alignContent: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <InputNumber
            min={1}
            onChange={e => {
              setBiddingTokenAmount(e);
            }}
            style={{ width: 200, marginRight: 20 }}
          />
          <Button style={{ marginTop: 8, marginRight: 10 }} onClick={approveBiddingToken}>
            Mint Bidding Token and Approve
          </Button>
          <Address address={writeContracts?.BiddingToken?.address} />
        </div>
        {writeContracts?.BiddingTokenUSDC && (
          <div
            style={{
              display: "flex",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <InputNumber
              min={1}
              onChange={e => {
                setBiddingTokenUSDCAmount(e);
              }}
              style={{ width: 200, marginRight: 20 }}
            />
            <Button style={{ marginTop: 8, marginRight: 10 }} onClick={approveBiddingTokenUSDC}>
              Mint Bidding Token(USDC) and Approve
            </Button>
            <Address address={writeContracts?.BiddingTokenUSDC?.address} />
          </div>
        )}
        <Divider />
        <div style={{ margin: 8 }}>
          <h3>Initiate Auction</h3>
          <Form
            name="Initiate Auction Form"
            ref={formRef}
            labelAlign="right"
            layout="inline"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 800,
              display: "flex",
              justifyContent: "center",
              alignContent: "left",
              flexDirection: "column",
            }}
            initialValues={{
              remember: true,
              auctioningToken: writeContracts?.AuctioningToken?.address || "",
              biddingToken: writeContracts?.BiddingToken?.address || "",
              accessManagerContractAddress: "0xE0AD16EB7Ea467C694E6cFdd5E7D61FE850e8B53",
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Auctioning Token address"
              name="auctioningToken"
              rules={[{ required: true, message: "Please input the address of the auctioning token" }]}
              style={{ marginBottom: 12 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Bidding Token address"
              name="biddingToken"
              rules={[{ required: true, message: "Please input the address of the bidding token" }]}
              style={{ marginBottom: 12 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Order Cancellation End Date"
              name="orderCancellationEndDate"
              rules={[{ required: true, message: "Please enter the order cancellation end date" }]}
              style={{ marginBottom: 12 }}
            >
              <DatePicker showTime onChange={() => {}} onOk={() => {}} />
            </Form.Item>
            <Form.Item
              label="Auction End Date"
              name="auctionEndDate"
              rules={[{ required: true, message: "Please enter the auction end date" }]}
              style={{ marginBottom: 12 }}
            >
              <DatePicker showTime onChange={() => {}} onOk={() => {}} />
            </Form.Item>
            <Form.Item
              label="Auctioned Sell Amount"
              name="auctionedSellAmount"
              rules={[{ required: true, message: "Please input the auctioned sell amount" }]}
              style={{ marginBottom: 12 }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Minimum Buy Amount"
              name="minBuyAmount"
              rules={[{ required: true, message: "Please input the minimum buy amount" }]}
              style={{ marginBottom: 12 }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Minimum Bidding Amount Per Order"
              name="minimumBiddingAmountPerOrder"
              rules={[{ required: true, message: "Please input the minimum bidding amount per order." }]}
              style={{ marginBottom: 12 }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Minimum Funding Threshold"
              name="minimumFundingThreshold"
              rules={[{ required: true, message: "Please input the minimum funding threshold." }]}
              style={{ marginBottom: 12 }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Is Atomic Closure Allowed?"
              name="isAtomicClosureAllowed"
              valuePropName="isAtomicClosureAllowed"
              rules={[{ required: false, message: "Is Atomic Closure Allowed?" }]}
              style={{ marginBottom: 12 }}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="Is Private Auction?"
              name="isPrivateAuction"
              valuePropName="isPrivateAuction"
              rules={[{ required: false, message: "Is Private Auction?" }]}
              style={{ marginBottom: 12 }}
            >
              <Switch onChange={setIsPrivateAuction} />
            </Form.Item>
            {isPrivateAuction && (
              <>
                <Form.Item label="Private Auctions Signers Address" name="signersAddress" style={{ marginBottom: 12 }}>
                  <AddressInput />
                </Form.Item>
                <Form.Item label="Whitelist addresses" name="whitelistAddresses" style={{ marginBottom: 12 }}>
                  <Select mode="tags" tokenSeparators={[","]} />
                </Form.Item>
              </>
            )}
            <Button style={{ width: 100, marginLeft: 300 }} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
        <Divider />
        <h3>Generate signature for private auctions</h3>
        <p>Please note the signatures will be generated from the account connected to this website</p>
        <div>
          <Form
            name="Generate Signatures form"
            labelAlign="right"
            layout="inline"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{
              maxWidth: 800,
              display: "flex",
              justifyContent: "center",
              alignContent: "left",
              flexDirection: "column",
            }}
            initialValues={{ remember: true }}
            onFinish={onGenerateSignatures}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Auction ID"
              name="auctionId"
              rules={[{ required: true, message: "Please input the auction ID to generate signature for" }]}
              style={{ marginBottom: 12 }}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              label="Whitelist addresses"
              name="whitelistAddresses"
              style={{ marginBottom: 12 }}
              rules={[{ required: true, message: "Please enter the whitelisted addresses" }]}
            >
              <Select mode="tags" tokenSeparators={[","]} />
            </Form.Item>
            <Button style={{ width: 100, marginLeft: 300 }} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </div>
        <Divider />
        <h3>Settle Auction</h3>
        <Form
          name=""
          labelAlign="right"
          layout="inline"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{
            maxWidth: 800,
            display: "flex",
            justifyContent: "center",
            alignContent: "left",
            flexDirection: "column",
          }}
          initialValues={{ remember: true }}
          onFinish={onSettleAuction}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Auction ID"
            name="auctionId"
            rules={[{ required: true, message: "Please input the auction ID to generate signature for" }]}
            style={{ marginBottom: 12 }}
          >
            <InputNumber />
          </Form.Item>
          <Button style={{ width: 100, marginLeft: 300 }} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <Events
        contracts={readContracts}
        contractName="YourContract"
        eventName="SetPurpose"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />
    </div>
  );
}
