const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSwap", function () {
  let Contract;
  let contract;
  let token_contract1;
  let token_contract2;
  let output_token;

  it("swap", async function () {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mainnet.infura.io/v3/6ee38d8487b64702a7736903e3e8e690"
    );
    Contract = await ethers.getContractFactory("MultiSwap");
    contract = await Contract.deploy(
      "0xE592427A0AEce92De3Edee1F18E0157C05861564"
    );
    await contract.waitForDeployment();
    const selectedTokens = [
      "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    ];
    const tokenABI = [
      "function approve(address spender, uint256 amount) external returns (bool)",
    ];
    token_contract1 = new ethers.Contract(tokenAddress, tokenABI, provider);

    const amountsIn = [100000000000, 1000000000];
    const outputToken = "0xb33EaAd8d922B1083446DC23f610c2567fB5180f";
    const tx = await contract.multiSwapExactInputSingle(
      selectedTokens,
      amountsIn,
      outputToken,
      { gasLimit: 3000000 }
    );
    await tx.wait();
  });
});
