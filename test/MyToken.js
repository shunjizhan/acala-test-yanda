// const ethers = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const { calcEthereumTransactionParams, calcSubstrateTransactionParams, EvmRpcProvider } = require("@acala-network/eth-providers");

const txFeePerGas = '199999946752';
const storageByteDeposit = '100000000000000';

describe("MyToken contract", function () {
    it("returns the right value after the contract is deployed", async function () {
        const blockNumber = await ethers.provider.getBlockNumber();
      
        const ethParams = calcEthereumTransactionParams({
            gasLimit: '2100001',
            validUntil: (blockNumber + 100).toString(),
            storageLimit: '64001',
            txFeePerGas,
            storageByteDeposit
        });

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

        const value = await instance.totalSupply();

        expect(ethers.utils.formatEther(value)).to.equal('1000000.0');

        await provider.disconnect();
    });
});
