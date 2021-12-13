import { ethers } from "hardhat";

const walletAddress = "0x";

async function main() {
  const ParaToken = await ethers.getContractFactory("ParaToken");
  const paraToken = await ParaToken.deploy(walletAddress);

  await paraToken.deployed();

  console.log("ParaToken deployed to:", paraToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
