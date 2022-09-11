# SPDX-License-Identifier: MIT
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.uint256 import Uint256
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.math import unsigned_div_rem

from openzeppelin.token.erc721.library import ERC721
from openzeppelin.introspection.erc165.library import ERC165


@storage_var
func merkle_root() -> (res : felt):
end

@constructor
func constructor{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(root: felt):
    ERC721.initializer('MyToken', 'MTK')
    merkle_root.write(root)
    return ()
end


@view
func supportsInterface{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(interfaceId: felt) -> (success: felt):
    let (success) = ERC165.supports_interface(interfaceId)
    return (success)
end

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






func mint{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(to: felt, tokenId: Uint256):
    ERC721._mint(to, tokenId)
    return ()
end

@storage_var
func tokenId_high() -> (res : felt):
end

func leaf{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr
    }(account: felt, tokenId: Uint256) -> (pedersen_hash: felt):

    # let tokenId_felt = tokenId.low + tokenId.high * 2 ** 128  (not working: issues coming from Hardhat plugin)
    tokenId_high.write(tokenId.high * 2 ** 128)
    let (high) = tokenId_high.read()
    let tokenId_felt = high + tokenId.low
    let (pedersen_hash) = hash2{hash_ptr=pedersen_ptr}(tokenId_felt, account)

    return (pedersen_hash)
end

func verify{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr
    }(proof_len: felt, proof: felt*, leaf: felt, proof_idx: felt, leaf_idx: felt):

    if proof_len == 0:
        let (root) = merkle_root.read()
        with_attr error_message("Computed root is not valid ..."):
            assert root = leaf
        end
        return ()
    end

    let (dividend, remainder) = unsigned_div_rem(leaf_idx, 2)
    if remainder == 0:
        let (hash) = hash2{hash_ptr=pedersen_ptr}(leaf, proof[proof_idx])
    else:
        let (hash) = hash2{hash_ptr=pedersen_ptr}(proof[proof_idx], leaf)
    end

    verify(proof_len=proof_len-1, proof=proof, leaf=hash, proof_idx=proof_idx+1, leaf_idx=dividend)

    return ()
end

@external
func redeem{
        syscall_ptr: felt*,
        pedersen_ptr: HashBuiltin*,
        range_check_ptr
    }(proof_len: felt, proof: felt*, account: felt, tokenId: Uint256, leaf_idx: felt): 

    let (hash) = leaf(account, tokenId)
    verify(proof_len=proof_len, proof=proof, leaf=hash, proof_idx=0, leaf_idx=leaf_idx)
    mint(to=account, tokenId=tokenId)
    return ()
end



