import { starknet } from "hardhat";
import { getLeaves, generate_merkle_root, generate_merkle_proof } from './MerkleUtils';
import { randomAddress } from "starknet/dist/utils/stark";
import { toFelt } from "starknet/dist/utils/number";
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
  

        // compute leaves
        const leaves = getLeaves(tokenIds, predeployedAddresses);

        // compute root
        const merkle_root = generate_merkle_root(leaves);


        // prompt
        console.log("-----> Whitelisted accounts with their allowed NFTs to redeem <-----");
        for (let i = 0; i < predeployedAccounts.length; i++) {
            console.log(predeployedAccounts[i].address, ":", tokenIds[i]);
        }

        // deploy
        const contractFactory = await starknet.getContractFactory("ERC721MerkleDrop");
        const contract = await contractFactory.deploy({ root: merkle_root }); // pass hex
  
        // test
        console.log("-----> Simulating minting.................................... <-----");
        for (let i = 0; i < predeployedAccounts.length; i++) {

            // Merkle proof corresponding to leaf at index i
            let proof = generate_merkle_proof(leaves, i);
            let leaf_index = i
            console.log("Account", predeployedAccounts[leaf_index].address, "redeems token", tokenIds[i]);

            // Convert token id felt value to be passed as uint256
            let tokenId_uint256: Uint256 = bnToUint256(tokenIds[leaf_index]);
            let low_part: bigint = tokenId_uint256.low;
            let high_part: bigint = tokenId_uint256.high;

            await contract.invoke("redeem", { proof: proof, account: predeployedAccounts[leaf_index].address, tokenId: { low: low_part, high: high_part }, leaf_idx: leaf_index });
            console.log("Token", tokenIds[i], "minted successfully");
        };
    });
});