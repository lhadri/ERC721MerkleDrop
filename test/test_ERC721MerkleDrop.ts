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
import { randomAddress } from "starknet/dist/utils/stark";
import { hexToDecimalString, toFelt } from "starknet/dist/utils/number";
import { bnToUint256, Uint256 } from "starknet/dist/utils/uint256";


describe("ERC721MerkleDrop", function () {

    it("should mint all elements", async function () {
        // get random accounts
        const predeployedAccounts = await starknet.devnet.getPredeployedAccounts()
        const predeployedAddresses = []
        for (let i = 0; i < predeployedAccounts.length; i++) {
            predeployedAddresses.push(predeployedAccounts[i].address); // addresses seem to be felts
        }
        console.log("Accounts: ", predeployedAddresses)


        // get random Token ids as felts
        const tokenIds = []
        for (let i = 0; i < predeployedAccounts.length; i++) {
            tokenIds.push(toFelt(randomAddress()));
        }

        console.log("Token ids: ", tokenIds)



        // 115792089237316195423570985008687907853269984665640564039457584007913129639935 = 2^256 - 1
        //   3618502788666131213697322783095070105623107215331596699973092056135872020480 = 2^251 + 17*2^192 = P-1  (felt needs 252 bits)
        //   340282366920938463463374607431768211455                                      = 2^128 - 1
        // BigInt = It seems like there is no maximum limit
        // So we have to generate 
        

        // compute leaves
        const leaves = getLeaves(tokenIds, predeployedAddresses);

        // compute root
        const merkle_root = generate_merkle_root(leaves);
        // console.log("merkle root:", merkle_root);


        // prompt
        console.log("-----> Whitelisted accounts with their allowed NFTs to redeem <-----");
        for (let i = 0; i < predeployedAccounts.length; i++) {
            console.log(predeployedAccounts[i].address, ":", tokenIds[i]);
        }


        // prompt
        // for (let i = 0; i < predeployedAccounts.length; i++) {
        //     console.log(tokenIds[i]);
        //     console.log(predeployedAccounts[i].address);
        //     console.log(leaves[i]);
        // }
        // console.log("tokenIds:", tokenIds);
        // console.log("leaves:", leaves);

        //***************************************************************************************************** */
        const contractFactory = await starknet.getContractFactory("ERC721MerkleDrop");
        const contract = await contractFactory.deploy({ root: merkle_root }); // pass hex
        // console.log("contract address:", contract.address)
        // const account1 = await starknet.deployAccount("OpenZeppelin");
        // console.log("----------------", account1)

        // const {root} = await contract.call("getRoot"); // return ...n
        // console.log("root:", root);

        // test verify()
        // await contract.call("verify", {proof: proof, leaf: leaves[leaf_index], proof_idx: 0, leaf_idx:leaf_index}); 

        // test redeem()
        // await contract.invoke("redeem", {proof: proof, account: predeployedAccounts[leaf_index].address, tokenId: {low: tokenIds[leaf_index], high:0}, leaf_idx: leaf_index}); 

        //################################################################################""
        // const { name } = await contract.call("name");
        // const { symbol } = await contract.call("symbol");
        // console.log(name);
        // console.log(symbol);
        // expect(name).to.equal(21806976760243566n);
        // expect(symbol).to.equal(5067851n);
        //################################################################################""



        //################################################################################""
        // await contract.invoke("mint", {to: predeployedAccounts[leaf_index].address, tokenId: {high:0, low: tokenIds[leaf_index]}})
        // const { owner } = await contract.call("ownerOf", {token_id: {low: tokenIds[leaf_index], high:0}}); // return ...n
        // console.log("owner:", owner)
        // console.log("0x" + owner.toString(16));
        // expect(predeployedAccounts[0].address).to.equal("0x" + owner.toString(16));

        // await contract.invoke("mint", {to: predeployedAccounts[leaf_index].address, tokenId: {low: 88, high:0}})
        // const { balance } = await contract.call("balanceOf", { owner: predeployedAccounts[leaf_index].address });
        // console.log(balance);
        //################################################################################""

        //################################################################################""
        // const x = predeployedAccounts[0].address
        // const { pedersen_hash } = await contract.call("leaf", {account: toFelt("0x1"), tokenId: {low: BigInt("0"), high:BigInt("1")}})
        // console.log("-------", pedersen_hash);
        //################################################################################""

        console.log("-----> Simulating minting.................................... <-----");
        for (let i = 0; i < predeployedAccounts.length; i++) {

            // Merkle proof corresponding to leaf at index i
            let proof = generate_merkle_proof(leaves, i);
            let leaf_index = i
            console.log("Account", predeployedAccounts[leaf_index].address, "redeems token", tokenIds[i]);

            // Transform token id felt value to be passed as uint256
            let tokenId_uint256: Uint256 = bnToUint256(tokenIds[leaf_index]);
            let low_part: bigint = tokenId_uint256.low;
            let high_part: bigint = tokenId_uint256.high;

            await contract.invoke("redeem", { proof: proof, account: predeployedAccounts[leaf_index].address, tokenId: { low: low_part, high: high_part }, leaf_idx: leaf_index });
            console.log("Token", tokenIds[i], "minted successfully");
        };

        

    });



});





// console.log("devnet restart.................")
// await starknet.devnet.restart()
