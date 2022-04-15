const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const { calcEthereumTransactionParams } = require("@acala-network/eth-providers");

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

        const MyToken = await ethers.getContractFactory("MyToken");
        
        const instance = await upgrades.deployProxy(MyToken, {
            gasPrice: ethParams.txGasPrice,
            gasLimit: ethParams.txGasLimit,
        });

        const value = await instance.totalSupply();

        expect(ethers.utils.formatEther(value)).to.equal('1000000.0');
    });
});
