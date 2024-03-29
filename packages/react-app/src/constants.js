// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = process.env.REACT_APP_INFURA_KEY ?? "460f40a260564ac4a4f4b3fffb032dad";
// My Alchemy Key, swap in yours from https://dashboard.alchemyapi.io/
export const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY ?? "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = process.env.REACT_APP_BLOCKNATIVE_DAPP_ID ?? "0b58206a-f3c0-4701-a62f-73c7243e8c77";

// Docker Hardhat Host
export const HARDHAT_HOST = process.env.REACT_APP_HARDHAT_HOST ?? "http://localhost";

export const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

/*
Decrease the number of RPC calls by passing this value to hooks
with pollTime (useContractReader, useBalance, etc.).
Set it to 0 to disable it and make RPC calls "onBlock".
Note: this is not used when you are in the local hardhat chain.
*/
export const RPC_POLL_TIME = 30000;

const localRpcUrl = process.env.REACT_APP_CODESPACES
  ? `https://${window.location.hostname.replace("3000", "8545")}`
  : "http://" + (global.window ? window.location.hostname : "localhost") + ":8545";

export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: localRpcUrl,
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
    easyAuctionAddress: "0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101",
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
    easyAuctionAddress: "0x1fbab40c338e2e7243da945820ba680c92ef8281",
  },
  sepolia: {
    name: "sepolia",
    color: "#87ff65",
    chainId: 11155111,
    faucet: "https://faucet.sepolia.dev/",
    blockExplorer: "https://sepolia.etherscan.io/",
    rpcUrl: `https://sepolia.infura.io/v3/${INFURA_ID}`,
  },
  gnosis: {
    name: "gnosis",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc.gnosischain.com",
    faucet: "https://gnosisfaucet.com",
    blockExplorer: "https://gnosisscan.io",
    easyAuctionAddress: "0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101",
  },
  zksyncalpha: {
    name: "zksyncalpha",
    color: "#45488f",
    chainId: 280,
    rpcUrl: "https://zksync2-testnet.zksync.dev",
    blockExplorer: "https://goerli.explorer.zksync.io/",
    gasPrice: 100000000,
  },
  chiado: {
    name: "chiado",
    color: "#48a9a6",
    chainId: 10200,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc.chiadochain.net",
    faucet: "https://gnosisfaucet.com",
    blockExplorer: "https://blockscout.chiadochain.net",
  },
  polygon: {
    name: "polygon",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://polygon-rpc.com/",
    blockExplorer: "https://polygonscan.com/",
    easyAuctionAddress: "0x0b7fFc1f4AD541A4Ed16b40D8c37f0929158D101",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    faucet: "https://faucet.polygon.technology/",
    blockExplorer: "https://mumbai.polygonscan.com/",
    easyAuctionAddress: "0x4100aF1E6e8bBc174fc5da4D409e1e3C03F1f85E",
  },
  localOptimismL1: {
    name: "localOptimismL1",
    color: "#f01a37",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":9545",
  },
  localOptimism: {
    name: "localOptimism",
    color: "#f01a37",
    chainId: 420,
    blockExplorer: "",
    rpcUrl: "http://" + (global.window ? window.location.hostname : "localhost") + ":8545",
    gasPrice: 0,
  },
  goerliOptimism: {
    name: "goerliOptimism",
    color: "#f01a37",
    chainId: 420,
    blockExplorer: "https://optimism.io",
    rpcUrl: `https://goerli.optimism.io/`,
    gasPrice: 0,
  },
  optimism: {
    name: "optimism",
    color: "#f01a37",
    chainId: 10,
    blockExplorer: "https://optimistic.etherscan.io/",
    rpcUrl: `https://mainnet.optimism.io`,
  },
  goerliArbitrum: {
    name: "goerliArbitrum",
    color: "#28a0f0",
    chainId: 421613,
    blockExplorer: "https://goerli-rollup-explorer.arbitrum.io",
    rpcUrl: "https://goerli-rollup.arbitrum.io/rpc/",
  },
  arbitrum: {
    name: "arbitrum",
    color: "#28a0f0",
    chainId: 42161,
    blockExplorer: "https://arbiscan.io/",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  devnetArbitrum: {
    name: "devnetArbitrum",
    color: "#28a0f0",
    chainId: 421612,
    blockExplorer: "https://nitro-devnet-explorer.arbitrum.io/",
    rpcUrl: "https://nitro-devnet.arbitrum.io/rpc",
  },
  localAvalanche: {
    name: "localAvalanche",
    color: "#666666",
    chainId: 43112,
    blockExplorer: "",
    rpcUrl: `http://localhost:9650/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  fujiAvalanche: {
    name: "fujiAvalanche",
    color: "#666666",
    chainId: 43113,
    blockExplorer: "https://cchain.explorer.avax-test.network/",
    rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  mainnetAvalanche: {
    name: "mainnetAvalanche",
    color: "#666666",
    chainId: 43114,
    blockExplorer: "https://cchain.explorer.avax.network/",
    rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  testnetHarmony: {
    name: "testnetHarmony",
    color: "#00b0ef",
    chainId: 1666700000,
    blockExplorer: "https://explorer.pops.one/",
    rpcUrl: `https://api.s0.b.hmny.io`,
    gasPrice: 1000000000,
  },
  mainnetHarmony: {
    name: "mainnetHarmony",
    color: "#00b0ef",
    chainId: 1666600000,
    blockExplorer: "https://explorer.harmony.one/",
    rpcUrl: `https://api.harmony.one`,
    gasPrice: 1000000000,
  },
  fantom: {
    name: "fantom",
    color: "#1969ff",
    chainId: 250,
    blockExplorer: "https://ftmscan.com/",
    rpcUrl: `https://rpcapi.fantom.network`,
    gasPrice: 1000000000,
  },
  testnetFantom: {
    name: "testnetFantom",
    color: "#1969ff",
    chainId: 4002,
    blockExplorer: "https://testnet.ftmscan.com/",
    rpcUrl: `https://rpc.testnet.fantom.network`,
    gasPrice: 1000000000,
    faucet: "https://faucet.fantom.network/",
  },
  moonbeam: {
    name: "moonbeam",
    color: "#53CBC9",
    chainId: 1284,
    blockExplorer: "https://moonscan.io",
    rpcUrl: "https://rpc.api.moonbeam.network",
  },
  moonriver: {
    name: "moonriver",
    color: "#53CBC9",
    chainId: 1285,
    blockExplorer: "https://moonriver.moonscan.io/",
    rpcUrl: "https://rpc.api.moonriver.moonbeam.network",
  },
  moonbaseAlpha: {
    name: "moonbaseAlpha",
    color: "#53CBC9",
    chainId: 1287,
    blockExplorer: "https://moonbase.moonscan.io/",
    rpcUrl: "https://rpc.api.moonbase.moonbeam.network",
    faucet: "https://discord.gg/SZNP8bWHZq",
  },
  moonbeamDevNode: {
    name: "moonbeamDevNode",
    color: "#53CBC9",
    chainId: 1281,
    blockExplorer: "https://moonbeam-explorer.netlify.app/",
    rpcUrl: "http://127.0.0.1:9933",
  },
  baseMainnet: {
    name: "baseMainnet",
    color: "#07297c",
    chainId: 8453,
    rpcUrl: "https://mainnet.base.org",
    blockExplorer: "https://mainnet.basescan.org/",
    easyAuctionAddress: "0xcAe780DdD607C2081fbB4654E719f77F5e8907BF",
  },
  baseGoerli: {
    name: "baseGoerli",
    color: "#07297c",
    chainId: 84531,
    blockExplorer: "https://goerli.basescan.org/",
    rpcUrl: "https://goerli.base.org",
    easyAuctionAddress: "0x231F3Fd7c3E3C9a2c8A03B72132c31241DF0a26C",
  },
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

export const initialNetwork = NETWORKS.baseGoerli; // <------- select your target frontend network (localhost, goerli, xdai, mainnet)
