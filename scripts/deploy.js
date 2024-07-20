const hre = require("hardhat");

async function main() {
  const Create = await hre.ethers.deployContract("MultiSwap", [
    "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  ]);
  await Create.waitForDeployment();

  console.log("contract Address:", Create.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
