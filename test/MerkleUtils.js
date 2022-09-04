const starknet = require("starknet");
import {pedersen} from './signature'




function get_next_level(level) {
	var next_level, node;
	next_level = [];

	for (var i = 0, _pj_a = level.length; i < _pj_a; i += 2) {
		node = 0;

		if (level[i] < level[i + 1]) {
			node = starknet.hash.pedersen([level[i], level[i + 1]]);
		} else {
			node = starknet.hash.pedersen([level[i + 1], level[i]]);
		}

		next_level.push(node);
	}

	return next_level;
}

function generate_proof_helper(level, index, proof) {
	var index_parent, next_level;

	if (level.length === 1) {
		return proof;
	}

	if (level.length % 2 !== 0) {
		level.push(0);
	}

	next_level = get_next_level(level);
	index_parent = 0;

	for (var i = 0, _pj_a = level.length; i < _pj_a; i += 1) {
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

function generate_merkle_proof(values, index) {
	return generate_proof_helper(values, index, []);
}

function generate_merkle_root(values) {
	var next_level;

	if (values.length === 1) {
		return values[0];
	}

	if (values.length % 2 !== 0) {
		values.append(0);
	}

	next_level = get_next_level(values);
	return generate_merkle_root(next_level);
}

const getLeaf = (recipient, amount) => {
	const leaf = starknet.hash.pedersen([recipient, amount]);
	return leaf;
};

const getLeaves = (recipients, amounts) => {
	let values = [];
	for (let index = 0; index < recipients.length; index++) {
		const leaf = getLeaf(recipients[index], amounts[index]);
		const value = [leaf, recipients[index], amounts[index]];
		values.push(value);
	}

	if (values.length % 2 != 0) {
		const last_value = [0, 0, 0];
		values.push(last_value);
	}
	return values;
};


// To delete
// export const pedersenHash = (data) => {
// 	return Buffer.from(starknet.hash.pedersen([data, 0]), "hex");
// };

export function pedersenHash(input) {
	return pedersen(input);
};
