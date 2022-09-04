# SPDX-License-Identifier: MIT
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.hash import hash2

from openzeppelin.token.erc721.library import ERC721
# from openzeppelin.introspection.erc165.library import ERC165


@constructor
func constructor{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }():
    ERC721.initializer('MyToken', 'MTK')
    return ()
end

#
# Getters
#

# @view
# func supportsInterface{
#         syscall_ptr: felt*,
#         pedersen_ptr: HashBuiltin*,
#         range_check_ptr
#     }(interfaceId: felt) -> (success: felt):
#     let (success) = ERC165.supports_interface(interfaceId)
#     return (success)
# end

@view
func name{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }() -> (name: felt):
    let (name) = ERC721.name()
    return (name)
end

@view
func symbol{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }() -> (symbol: felt):
    let (symbol) = ERC721.symbol()
    return (symbol)
end

@view
func balanceOf{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(owner: felt) -> (balance: Uint256):
    let (balance) = ERC721.balance_of(owner)
    return (balance)
end

@view
func ownerOf{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(token_id: Uint256) -> (owner: felt):
    let (owner) = ERC721.owner_of(token_id)
    return (owner)
end

@view
func getApproved{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(token_id: Uint256) -> (approved: felt):
    let (approved) = ERC721.get_approved(token_id)
    return (approved)
end

@view
func isApprovedForAll{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(owner: felt, operator: felt) -> (isApproved: felt):
    let (isApproved) = ERC721.is_approved_for_all(owner, operator)
    return (isApproved)
end

# @view
# func tokenURI{
#         syscall_ptr: felt*,
#         pedersen_ptr: HashBuiltin*,
#         range_check_ptr
#     }(tokenId: Uint256) -> (tokenURI: felt):
#     let (tokenURI) = ERC721.token_uri(tokenId)
#     return (tokenURI)
# end

#
# Externals
#

@external
func approve{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(to: felt, tokenId: Uint256):
    ERC721.approve(to, tokenId)
    return ()
end

@external
func setApprovalForAll{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(operator: felt, approved: felt):
    ERC721.set_approval_for_all(operator, approved)
    return ()
end

@external
func transferFrom{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(from_: felt, to: felt, tokenId: Uint256):
    ERC721.transfer_from(from_, to, tokenId)
    return ()
end

@external
func safeTransferFrom{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(from_: felt, to: felt, tokenId: Uint256, data_len: felt, data: felt*):
    ERC721.safe_transfer_from(from_, to, tokenId, data_len, data)
    return ()
end





# @external
# func safeMint{
#         syscall_ptr: felt*,
#         pedersen_ptr: HashBuiltin*,
#         range_check_ptr
#     }(to: felt, tokenId: Uint256, data_len: felt, data: felt*, tokenURI: felt):
#     Ownable.assert_only_owner()
#     ERC721._safe_mint(to, tokenId, data_len, data)
#     ERC721._set_token_uri(tokenId, tokenURI)
#     return ()
# end

@external
func mint{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(to: felt, tokenId: Uint256):
    ERC721._mint(to, tokenId)
    return ()
end

#
# Internal functions
#

@storage_var
func tokenId_high() -> (res : felt):
end

@view
func leaf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr
    }(account: felt, tokenId: Uint256) -> (pedersen_hash: felt):

    # let tokenId_felt = tokenId.low + tokenId.high * 2 ** 128  (not working: issues coming from Hardhat plugin)
    tokenId_high.write(tokenId.high * 2 ** 128)
    let (high) = tokenId_high.read()
    let tokenId_felt = high + tokenId.low
    let (pedersen_hash) = hash2{hash_ptr=pedersen_ptr}(tokenId_felt, account)

    return (pedersen_hash)
end


# https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol
# * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
#      * defined by `root`. For this, a `proof` must be provided, containing
#      * sibling hashes on the branch from the leaf to the root of the tree. Each
#      * pair of leaves and each pair of pre-images are assumed to be sorted.
@view
func verify{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr
    }(leaf: felt, proof: felt*) -> (bool: felt):
    let (res) = processProof(leaf, proof)
    if res == root:
        return (bool=1)
    else:
        return (bool=0)
end

#  @dev Returns the rebuilt hash obtained by traversing a Merkle tree up
#      * from `leaf` using `proof`. A `proof` is valid if and only if the rebuilt
#      * hash matches the root of the tree. When processing the proof, the pairs
#      * of leafs & pre-images are assumed to be sorted.
@view
func processProof{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr
    }(leaf: felt, proof: felt*) -> (computedHash: felt):
    let computedHash = leaf
    for (uint256 i = 0; i < proof.length; i++) {
        computedHash = _hashPair(computedHash, proof[i]);
    }

    return (computedHash=computedHash)
end

    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }



