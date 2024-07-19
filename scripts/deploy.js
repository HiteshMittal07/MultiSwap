const hre = require("hardhat");

async function main() {
  const Create = await hre.ethers.deployContract("MultiTokenSwapper", [
    "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E",
  ]);
  await Create.waitForDeployment();

  console.log("contract Address:", Create.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
