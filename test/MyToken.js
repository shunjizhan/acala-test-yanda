// const ethers = require("ethers");
const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");
const { EvmRpcProvider } = require("@acala-network/eth-providers");


describe("MyToken contract", function () {
    it("returns the right value after the contract is deployed", async function () {
        /* -------------------------------------------------------------------------------------- */
        // https://github.com/OpenZeppelin/openzeppelin-upgrades/issues/85#issuecomment-1028435049

        // Wrap the provider so we can override fee data.
        const provider = EvmRpcProvider.from('ws://localhost:9944');
        await provider.isReady();

        // we will implement getFeeData like this in the future, so don't need this line anymore
        provider.getFeeData = provider._getEthGas;      

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
