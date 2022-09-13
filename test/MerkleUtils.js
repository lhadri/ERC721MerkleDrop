import {hash} from "starknet";

// input elements as strings
function pedersenHash(input) {
	var e1 = BigInt(input[0]);
	var e2 = BigInt(input[1]);

	return hash.pedersen([e1, e2]);
};

function get_next_level(level) {
	var next_level, node;
	next_level = [];

	for (var i = 0; i < level.length; i += 2) {
		node = pedersenHash([level[i], level[i + 1]]);
		next_level.push(node);
	}

	return next_level;
}

function generate_proof_helper(level, index, proof) {
	var index_parent, next_level;

	if (level.length === 1) {
		return proof;
	}

	next_level = get_next_level(level);
	index_parent = 0;

	for (var i = 0; i < level.length; i += 1) {
		if (i === index) {
			index_parent = Math.floor(i / 2);

			if (i % 2 === 0) {
				proof.push(level[index + 1]);
			} else {
				proof.push(level[index - 1]);
			}
		}
	}

	return generate_proof_helper(next_level, index_parent, proof);
}

function getLeaf(tokenId, account) {
	const leaf = pedersenHash([tokenId, account]);
	return leaf;
};

export function getLeaves(tokenIds, accounts){
	let leaves = [];
	for (let index = 0; index < accounts.length; index++) {
		const leaf = getLeaf(tokenIds[index], accounts[index]);
		leaves.push(leaf);
	}
	return leaves;
};

export function generate_merkle_root(leaves) {
	var next_level;

	if (leaves.length === 1) {
		return leaves[0];
	}

	next_level = get_next_level(leaves);
	return generate_merkle_root(next_level);
}

export function generate_merkle_proof(values, index) {
	return generate_proof_helper(values, index, []);
}