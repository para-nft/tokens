import { ethers } from "hardhat";

const walletAddress = "0x";

const initValuesList = [
  {
    name: "",
    shortcode: "",
    supply: 10,
    reserve: 2,
    price: 1,
  },
  {
    name: "",
    shortcode: "",
    supply: 10,
    reserve: 2,
    price: 1,
  },
];

async function main() {
  const PARANFT = await ethers.getContractFactory("PARANFT");

  for (const initValues of initValuesList) {
    const { name, shortcode, supply, reserve, price } = initValues;
    const paraNFt = await PARANFT.deploy(
      name,
      shortcode,
      supply,
      reserve,
      price
    );
    await paraNFt.deployed();
    console.log("PARANFT deployed to:", paraNFt.address);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
