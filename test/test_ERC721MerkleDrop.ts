import { expect } from "chai";
import { starknet } from "hardhat";
  
describe("My Test", function () {
    it("should work with arrays", async function () {
        // console.log("devnet restart.................")
        // await starknet.devnet.restart()
        
        const contractFactory = await starknet.getContractFactory("ERC721MerkleDrop");
        const contract = await contractFactory.deploy();
        
        //################################################################################""
        // const { name } = await contract.call("name");
        // const { symbol } = await contract.call("symbol");
        // console.log(name);
        // console.log(symbol);
        // expect(name).to.equal(21806976760243566n);
        // expect(symbol).to.equal(5067851n);
        //################################################################################""


        // console.log(contract.address)
        // const account1 = await starknet.deployAccount("OpenZeppelin");
        const predeployedAccounts = await starknet.devnet.getPredeployedAccounts()
        console.log(predeployedAccounts[0].address)
        // console.log("----------------", account1)
     
        //################################################################################""
        // await contract.invoke("mint", {to: predeployedAccounts[0].address, tokenId: {high:77, low: 0}})
        // const { owner } = await contract.call("ownerOf", {token_id: {high:77, low: 0}});
        // console.log("0x" + owner.toString(16));
        // expect(predeployedAccounts[0].address).to.equal("0x" + owner.toString(16));

        // await contract.invoke("mint", {to: predeployedAccounts[0].address, tokenId: {high:88, low: 0}})
        // const { balance } = await contract.call("balanceOf", {owner: owner});
        // console.log(balance);
        //################################################################################""

        const x = predeployedAccounts[0].address
        const { pedersen_hash } = await contract.call("leaf", {account: x, tokenId: {high:0, low: 88}})
        console.log("-------", pedersen_hash);



    });
});

