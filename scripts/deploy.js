const { ethers, upgrades } = require("hardhat");
const { txParams } = require("../utils/transactionHelpers.js");

async function main() {
  const ethParams = await txParams();

  const [deployer] = await ethers.getSigners();

  const MyToken = await ethers.getContractFactory("MyToken");
  const instance = await upgrades.deployProxy(MyToken, {
    gasPrice: ethParams.txGasPrice,
    gasLimit: ethParams.txGasLimit,
  });

  await instance.deployed();

  console.log("MyToken deployed at:", instance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
