import { expect } from "chai";
import { starknet } from "hardhat";
import { pedersenHash, getLeaves, generate_merkle_root, generate_merkle_proof } from './MerkleUtils';
import { ethers } from "ethers";
import {
	Contract,
	defaultProvider,
	ec,
	json,
	number,
	hash,
  } from "starknet";


describe("My Test", function () {
    it("should work with arrays", async function () {
        // console.log("devnet restart.................")
        // await starknet.devnet.restart()


        // before to deploy, compute the root of the tree
        
        //################################################################################""
        // Addresses
        const predeployedAccounts = await starknet.devnet.getPredeployedAccounts()
        const predeployedAddresses = []
        for (let i = 0; i < predeployedAccounts.length; i++) {
            predeployedAddresses.push(predeployedAccounts[i].address);
        }

        // Token ids
        const tokenIds = []
        for (let i = 0; i < predeployedAccounts.length; i++) {
            tokenIds.push((i+1).toString());
        }

        // Leaves
        const leaves = getLeaves(tokenIds, predeployedAddresses);

        // prompt
        for (let i = 0; i < predeployedAccounts.length; i++) {
            console.log(tokenIds[i]);
            console.log(predeployedAccounts[i].address);
            console.log(leaves[i]);
        }
        console.log("leaves:", leaves);

        // Root
        const merkle_root = generate_merkle_root(leaves);
        console.log("merkle root:", merkle_root);

        // Merkle proof corresponding to leaf at index 2
        const proof = generate_merkle_proof(leaves, 2);
        console.log("proof", proof);
        //################################################################################""


        const contractFactory = await starknet.getContractFactory("ERC721MerkleDrop");
        const contract = await contractFactory.deploy({ root: merkle_root }); // pass hex
        console.log("contract address:", contract.address)
        // const account1 = await starknet.deployAccount("OpenZeppelin");
        // console.log("----------------", account1)

        const {root} = await contract.call("getRoot"); // return ...n
        console.log("root:", root);


        const {computedHash} = await contract.call("processProof", {proof: proof, leaf: leaves[2], proof_idx: 0, leaf_idx:2}); 
        console.log("computedHash:", computedHash);

        //################################################################################""
        // const { name } = await contract.call("name");
        // const { symbol } = await contract.call("symbol");
        // console.log(name);
        // console.log(symbol);
        // expect(name).to.equal(21806976760243566n);
        // expect(symbol).to.equal(5067851n);
        //################################################################################""



        //################################################################################""
        // await contract.invoke("mint", {to: predeployedAccounts[0].address, tokenId: {high:77, low: 0}})
        // const { owner } = await contract.call("ownerOf", {token_id: {high:77, low: 0}}); // return ...n
        // console.log("owner:", owner)
        // console.log("0x" + owner.toString(16));
        // expect(predeployedAccounts[0].address).to.equal("0x" + owner.toString(16));

        // await contract.invoke("mint", {to: predeployedAccounts[0].address, tokenId: {high:88, low: 0}})
        // const { balance } = await contract.call("balanceOf", {owner: owner});
        // console.log(balance);
        //################################################################################""

        //################################################################################""
        // const x = predeployedAccounts[0].address
        // const { pedersen_hash } = await contract.call("leaf", {account: x, tokenId: {high:0, low: 88}})
        // console.log("-------", pedersen_hash);
        //################################################################################""



        // coulisse:
        // list of persons that can redeem their tokens + give a proof to each person
        // contract:
        // let each person redeem its token by providing a proof that a contract can verify
    });
});

