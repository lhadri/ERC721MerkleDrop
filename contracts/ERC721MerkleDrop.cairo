# SPDX-License-Identifier: MIT

%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.uint256 import Uint256

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