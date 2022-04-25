const { ethers, upgrades } = require("hardhat");
const { txParams } = require("../utils/transactionHelpers.js");
const { EvmRpcProvider } = require("@acala-network/eth-providers");


async function main() {
  const ethParams = await txParams();

  /* -------------------------------------------------------------------------------------- */
  // https://github.com/OpenZeppelin/openzeppelin-upgrades/issues/85#issuecomment-1028435049

  // Wrap the provider so we can override fee data.
  const provider = EvmRpcProvider.from('ws://localhost:9944');
  await provider.isReady();

  provider.getFeeData = async () => ({
    gasPrice: ethParams.txGasPrice,
    gasLimit: ethParams.txGasLimit,
  });

  // Create the signer for the mnemonic, connected to the provider with hardcoded fee data
  const signer = ethers.Wallet.fromMnemonic('fox sight canyon orphan hotel grow hedgehog build bless august weather swarm').connect(provider);

  /* -------------------------------------------------------------------------------------- */

  const MyToken = await ethers.getContractFactory("MyToken", signer);
  const instance = await upgrades.deployProxy(MyToken);

  await instance.deployed();

  console.log("MyToken deployed at:", instance.address);

  await provider.disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
