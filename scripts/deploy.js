const hre = require("hardhat");

async function main() {
  const Create = await hre.ethers.deployContract("MultiSwap", [
    "0x4ce3a7A6CAdbE423Fb90339813023A6c69a92CbC",
  ]);
  await Create.waitForDeployment();

  console.log("contract Address:", Create.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
