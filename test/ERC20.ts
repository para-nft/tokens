import { expect } from "chai";
import { ethers, network, waffle } from "hardhat";
import { BigNumber } from "@ethersproject/bignumber";

const supply = ethers.utils.parseEther("100000000");
const vestingPeriod = 31536000;
const vestingRate = supply.div(vestingPeriod);

describe("ParaToken", function () {
  it("Should mint total of 9 * supply amount after it's created", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act

    // Assert
    await expect(await paraToken.balanceOf(wallet.address)).to.be.equal(
      supply.mul(9)
    );
  });
});

describe("ParaToken", function () {
  it("Should not allow non owner to claim", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act

    // Assert
    await expect(
      paraToken.connect(wallet).claimOutstanding()
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});

describe("ParaToken", function () {
  it("Should return the vested amount when less than vesting period passed", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act
    await network.provider.send("evm_increaseTime", [vestingPeriod / 2]);
    await network.provider.send("evm_mine");

    // Assert
    expect(await paraToken.checkClaim()).to.be.closeTo(
      BigNumber.from(vestingRate.mul(vestingPeriod / 2)),
      10
    );
  });
});

describe("ParaToken", function () {
  it("Should return the supply when grater than vesting period passed", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act
    await network.provider.send("evm_increaseTime", [2 * vestingPeriod]);
    await network.provider.send("evm_mine");

    // Assert
    expect(await paraToken.checkClaim()).to.be.closeTo(supply, 10);
  });
});

describe("ParaToken", function () {
  it("Should return 0 on claim after already claimed", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act
    await network.provider.send("evm_increaseTime", [vestingPeriod / 2]);
    await network.provider.send("evm_mine");
    await paraToken.claimOutstanding();

    // Assert
    expect(await paraToken.checkClaim()).to.be.equal(BigNumber.from(0));
  });
});

describe("ParaToken", function () {
  it("Should not allow to claim after supply amount is claimed", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act
    await network.provider.send("evm_increaseTime", [vestingPeriod]);
    await network.provider.send("evm_mine");
    await paraToken.claimOutstanding();

    // Assert
    await expect(paraToken.claimOutstanding()).to.be.revertedWith(
      "already claimed the supply amount"
    );
  });
});

describe("ParaToken", function () {
  it("Should mint total of supply amount after supply amount is claimed", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act
    await network.provider.send("evm_increaseTime", [vestingPeriod]);
    await network.provider.send("evm_mine");
    await paraToken.claimOutstanding();

    // Assert
    await expect(await paraToken.balanceOf(wallet.address)).to.be.equal(
      supply.mul(10)
    );
  });
});

describe("ParaToken", function () {
  it("Should emit Claimed event", async function () {
    const [, wallet] = await ethers.getSigners();

    // Arrange
    const ParaToken = await ethers.getContractFactory("ParaToken");
    const paraToken = await ParaToken.deploy(wallet.address);

    // Act

    // Assert
    await expect(paraToken.claimOutstanding()).to.emit(paraToken, "Claimed");
  });
});
