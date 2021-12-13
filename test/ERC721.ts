import { expect } from "chai";
import { ethers, waffle } from "hardhat";

describe("PARANFT", function () {
  it("Should not allow non owner to set URI, activate sale, withdraw or forge", async function () {
    const [, nonOwner] = await ethers.getSigners();

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy("", "", 10, 2, 1);

    // Act

    // Assert
    await expect(paraNFT.connect(nonOwner).setURI("")).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    await expect(paraNFT.connect(nonOwner).flipSale()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    await expect(paraNFT.connect(nonOwner).withdraw()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );

    await expect(
      paraNFT.connect(nonOwner).forge(nonOwner.address, 1)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
});

describe("PARANFT", function () {
  it("Should not allow to forge more than max supply", async function () {
    const [owner] = await ethers.getSigners();

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy("", "", 10, 2, 1);

    // Act
    await paraNFT.forge(owner.address, 5);
    await paraNFT.forge(owner.address, 5);

    // Assert
    await expect(paraNFT.forge(owner.address, 1)).to.be.revertedWith(
      "Supply limit!"
    );
  });
});

describe("PARANFT", function () {
  it("Should not allow to mint when sale is not active", async function () {
    const [owner, minter] = await ethers.getSigners();

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy("", "", 10, 2, 1);

    // Act

    // Assert
    await expect(
      paraNFT.connect(minter).mint(owner.address, 1)
    ).to.be.revertedWith("Sale inactive");
  });
});

describe("PARANFT", function () {
  it("Should not allow to mint more than 10 tokens in one call", async function () {
    const [owner, minter] = await ethers.getSigners();

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy("", "", 10, 2, 1);

    // Act
    await paraNFT.flipSale();

    // Assert
    await expect(
      paraNFT.connect(minter).mint(owner.address, 11)
    ).to.be.revertedWith("Exceeds 10");
  });
});

describe("PARANFT", function () {
  it("Should not allow to mint more than max supply - reserve supply", async function () {
    const [owner, minter] = await ethers.getSigners();

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy("", "", 10, 2, 1);

    // Act
    await paraNFT.flipSale();
    await paraNFT.connect(minter).mint(owner.address, 8, { value: 8 });

    // Assert
    await expect(
      paraNFT.connect(minter).mint(owner.address, 1, { value: 1 })
    ).to.be.revertedWith("Supply limit");
  });
});

describe("PARANFT", function () {
  it("Should not allow to mint when not enough ether is provided", async function () {
    const [owner, minter] = await ethers.getSigners();

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy("", "", 10, 2, 1);

    // Act
    await paraNFT.flipSale();

    // Assert
    await expect(
      paraNFT.connect(minter).mint(owner.address, 2, { value: 1 })
    ).to.be.revertedWith("Incorrect ETH");
  });
});

describe("PARANFT", function () {
  it("Should return the new URI once it's changed", async function () {
    const [owner] = await ethers.getSigners();

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy("", "", 10, 2, 1);

    // Act
    await paraNFT.setURI("http://example.org/wiki/Main_Page/");
    await paraNFT.forge(owner.address, 1);

    // Assert
    await expect(await paraNFT.tokenURI(0)).to.be.equal(
      "http://example.org/wiki/Main_Page/0"
    );
  });
});

describe("PARANFT", function () {
  it("Should allow owner to withdraw", async function () {
    const [owner, minter] = await ethers.getSigners();
    const provider = waffle.provider;

    // Arrange
    const PARANFT = await ethers.getContractFactory("PARANFT");
    const paraNFT = await PARANFT.deploy(
      "",
      "",
      10,
      2,
      ethers.utils.parseEther("1")
    );
    const balanceBeforeWithdraw = await provider.getBalance(owner.address);

    // Act
    await paraNFT.flipSale();
    await paraNFT
      .connect(minter)
      .mint(owner.address, 8, { value: ethers.utils.parseEther("8") });
    await paraNFT.withdraw();

    // // Assert
    const balanceAfterWithdraw = await provider.getBalance(owner.address);
    await expect(balanceAfterWithdraw.sub(balanceBeforeWithdraw)).to.be.closeTo(
      ethers.utils.parseEther("8"),
      1000000000000000
    );
  });
});
