// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("BiddingTokenUSDC", {
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    // waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  // const AuctioningToken = await ethers.getContract("AuctionTestSite", deployer);
  /*  await AuctionTestSite.setPurpose("Hello");
  
    // To take ownership of auctionTestSite using the ownable library uncomment next line and add the 
    // address you want to be the owner. 
    
    await AuctionTestSite.transferOwnership(
      "ADDRESS_HERE"
    );

    //const AuctionTestSite = await ethers.getContractAt('AuctionTestSite', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const auctionTestSite = await deploy("AuctionTestSite", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const auctionTestSite = await deploy("AuctionTestSite", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here during the deployment process
  try {
    if (chainId !== localChainId) {
      // await run("verify:verify", {
      //   address: AuctionTestSite.address,
      //   contract: "contracts/AuctionTestSite.sol:AuctionTestSite",
      //   constructorArguments: [],
      // });
    }
  } catch (error) {
    console.error("Verification Error =>", error);
  }
};
module.exports.tags = ["AuctionTestSite"];
