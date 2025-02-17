require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;
module.exports = {
  solidity: "0.7.6",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/006a677fe90346f9bf6cb52a2a6b340b",
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      forking: {
        url: "https://polygon-mainnet.infura.io/v3/6ee38d8487b64702a7736903e3e8e690",
        accounts: [PRIVATE_KEY2],
      },
    },
    zkEVM: {
      url: "https://rpc.cardona.zkevm-rpc.com",
      accounts: [PRIVATE_KEY],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: [PRIVATE_KEY],
    },
    BNB_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [PRIVATE_KEY],
    },
    polygon: {
      url: "https://polygon-mainnet.infura.io/v3/6ee38d8487b64702a7736903e3e8e690",
      accounts: [PRIVATE_KEY2],
    },
  },
};
