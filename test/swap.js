const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSwap", function () {
  const contract_address = "0x96D5a4a41c946F6D180945681aEb6196D7Aee6e3";
  it("swap", async function () {
    const contract = await ethers.getContractAt(contract_address);
    console.log(contract);
  });
});
