import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "account": indexed(p.address), "tokenId": indexed(p.uint256)}),
    ApprovalForAll: event("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", "ApprovalForAll(address,address,bool)", {"owner": indexed(p.address), "operator": indexed(p.address), "isApproved": p.bool}),
    GasStipend: event("0x54e1b905e319ef4ee53d99d9a4f206c6c53f48be039ea8d5606f605b610b9116", "GasStipend(address,uint256)", {"addr": indexed(p.address), "amount": indexed(p.uint256)}),
    GasStipendSet: event("0x377662af9d07be81f18cfc625bc0bdbf3b8168ca88ebd61b9aa4370c675eaf0f", "GasStipendSet(uint256)", {"amount": indexed(p.uint256)}),
    OwnershipHandoverCanceled: event("0xfa7b8eab7da67f412cc9575ed43464468f9bfbae89d1675917346ca6d8fe3c92", "OwnershipHandoverCanceled(address)", {"pendingOwner": indexed(p.address)}),
    OwnershipHandoverRequested: event("0xdbf36a107da19e49527a7176a1babf963b4b0ff8cde35ee35d6cd8f1f9ac7e1d", "OwnershipHandoverRequested(address)", {"pendingOwner": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"oldOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    RolesUpdated: event("0x715ad5ce61fc9595c7b415289d59cf203f23a94fa06f04af7e489a0a76e1fe26", "RolesUpdated(address,uint256)", {"user": indexed(p.address), "roles": indexed(p.uint256)}),
    Signer: event("0xf4b0650db61027ac5b4ec7eb8ba223cf23715631228786676084b09a56b77861", "Signer(address)", {"signer": indexed(p.address)}),
    TokenURI: event("0xe9dd2c01379f6033709e315d41f1a58fcbd937ae2512da16462852d1082e7b73", "TokenURI(uint256,string)", {"tokenId": indexed(p.uint256), "metadataUri": indexed(p.string)}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "tokenId": indexed(p.uint256)}),
}

export const functions = {
    alreadyMinted: viewFun("0x89df4c65", "alreadyMinted(bytes32)", {"hash": p.bytes32}, p.bool),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"account": p.address, "id": p.uint256}, ),
    assignOperator: fun("0x6732f32f", "assignOperator(address,bool)", {"addr": p.address, "status": p.bool}, ),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"owner": p.address}, p.uint256),
    cancelOwnershipHandover: fun("0x54d1f13d", "cancelOwnershipHandover()", {}, ),
    changeSigner: fun("0xaad2b723", "changeSigner(address)", {"newSigner": p.address}, ),
    changeStipend: fun("0x731a47b6", "changeStipend(uint256)", {"newGasStipend": p.uint256}, ),
    completeOwnershipHandover: fun("0xf04e283e", "completeOwnershipHandover(address)", {"pendingOwner": p.address}, ),
    gasStipend: viewFun("0x9434c910", "gasStipend()", {}, p.uint256),
    getApproved: viewFun("0x081812fc", "getApproved(uint256)", {"id": p.uint256}, p.address),
    getEthSignedMessageHash: viewFun("0xfa540801", "getEthSignedMessageHash(bytes32)", {"messageHash": p.bytes32}, p.bytes32),
    getMessageHash: viewFun("0xdd5feba4", "getMessageHash((string,uint256,address))", {"sigData": p.struct({"collection": p.string, "identifier": p.uint256, "addr": p.address})}, p.bytes32),
    grantRoles: fun("0x1c10893f", "grantRoles(address,uint256)", {"user": p.address, "roles": p.uint256}, ),
    hasAllRoles: viewFun("0x1cd64df4", "hasAllRoles(address,uint256)", {"user": p.address, "roles": p.uint256}, p.bool),
    hasAnyRole: viewFun("0x514e62fc", "hasAnyRole(address,uint256)", {"user": p.address, "roles": p.uint256}, p.bool),
    hasMinted: viewFun("0x38e21cce", "hasMinted(address)", {"addr": p.address}, p.bool),
    isApprovedForAll: viewFun("0xe985e9c5", "isApprovedForAll(address,address)", {"owner": p.address, "operator": p.address}, p.bool),
    'mint(string,(string,uint256,address),bytes)': fun("0x41be8765", "mint(string,(string,uint256,address),bytes)", {"metadataUri": p.string, "sigData": p.struct({"collection": p.string, "identifier": p.uint256, "addr": p.address}), "signature": p.bytes}, ),
    'mint(address,string,(string,uint256,address),bytes)': fun("0xc2861da5", "mint(address,string,(string,uint256,address),bytes)", {"to": p.address, "metadataUri": p.string, "sigData": p.struct({"collection": p.string, "identifier": p.uint256, "addr": p.address}), "signature": p.bytes}, ),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    ownerOf: viewFun("0x6352211e", "ownerOf(uint256)", {"id": p.uint256}, p.address),
    ownershipHandoverExpiresAt: viewFun("0xfee81cf4", "ownershipHandoverExpiresAt(address)", {"pendingOwner": p.address}, p.uint256),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    renounceRoles: fun("0x183a4f6e", "renounceRoles(uint256)", {"roles": p.uint256}, ),
    requestOwnershipHandover: fun("0x25692962", "requestOwnershipHandover()", {}, ),
    revokeRoles: fun("0x4a4ee7b1", "revokeRoles(address,uint256)", {"user": p.address, "roles": p.uint256}, ),
    rolesOf: viewFun("0x2de94807", "rolesOf(address)", {"user": p.address}, p.uint256),
    'safeTransferFrom(address,address,uint256)': fun("0x42842e0e", "safeTransferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "id": p.uint256}, ),
    'safeTransferFrom(address,address,uint256,bytes)': fun("0xb88d4fde", "safeTransferFrom(address,address,uint256,bytes)", {"from": p.address, "to": p.address, "id": p.uint256, "data": p.bytes}, ),
    setApprovalForAll: fun("0xa22cb465", "setApprovalForAll(address,bool)", {"operator": p.address, "isApproved": p.bool}, ),
    signer: viewFun("0x238ac933", "signer()", {}, p.address),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    tokenURI: viewFun("0xc87b56dd", "tokenURI(uint256)", {"tokenId": p.uint256}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "id": p.uint256}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    updateTokenURI: fun("0xf96ee342", "updateTokenURI(uint256[],string[])", {"tokenIds": p.array(p.uint256), "metadataUri": p.array(p.string)}, ),
    withdraw: fun("0xf3fef3a3", "withdraw(address,uint256)", {"to": p.address, "amount": p.uint256}, ),
}

export class Contract extends ContractBase {

    alreadyMinted(hash: AlreadyMintedParams["hash"]) {
        return this.eth_call(functions.alreadyMinted, {hash})
    }

    balanceOf(owner: BalanceOfParams["owner"]) {
        return this.eth_call(functions.balanceOf, {owner})
    }

    gasStipend() {
        return this.eth_call(functions.gasStipend, {})
    }

    getApproved(id: GetApprovedParams["id"]) {
        return this.eth_call(functions.getApproved, {id})
    }

    getEthSignedMessageHash(messageHash: GetEthSignedMessageHashParams["messageHash"]) {
        return this.eth_call(functions.getEthSignedMessageHash, {messageHash})
    }

    getMessageHash(sigData: GetMessageHashParams["sigData"]) {
        return this.eth_call(functions.getMessageHash, {sigData})
    }

    hasAllRoles(user: HasAllRolesParams["user"], roles: HasAllRolesParams["roles"]) {
        return this.eth_call(functions.hasAllRoles, {user, roles})
    }

    hasAnyRole(user: HasAnyRoleParams["user"], roles: HasAnyRoleParams["roles"]) {
        return this.eth_call(functions.hasAnyRole, {user, roles})
    }

    hasMinted(addr: HasMintedParams["addr"]) {
        return this.eth_call(functions.hasMinted, {addr})
    }

    isApprovedForAll(owner: IsApprovedForAllParams["owner"], operator: IsApprovedForAllParams["operator"]) {
        return this.eth_call(functions.isApprovedForAll, {owner, operator})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    ownerOf(id: OwnerOfParams["id"]) {
        return this.eth_call(functions.ownerOf, {id})
    }

    ownershipHandoverExpiresAt(pendingOwner: OwnershipHandoverExpiresAtParams["pendingOwner"]) {
        return this.eth_call(functions.ownershipHandoverExpiresAt, {pendingOwner})
    }

    rolesOf(user: RolesOfParams["user"]) {
        return this.eth_call(functions.rolesOf, {user})
    }

    signer() {
        return this.eth_call(functions.signer, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    tokenURI(tokenId: TokenURIParams["tokenId"]) {
        return this.eth_call(functions.tokenURI, {tokenId})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>
export type GasStipendEventArgs = EParams<typeof events.GasStipend>
export type GasStipendSetEventArgs = EParams<typeof events.GasStipendSet>
export type OwnershipHandoverCanceledEventArgs = EParams<typeof events.OwnershipHandoverCanceled>
export type OwnershipHandoverRequestedEventArgs = EParams<typeof events.OwnershipHandoverRequested>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type RolesUpdatedEventArgs = EParams<typeof events.RolesUpdated>
export type SignerEventArgs = EParams<typeof events.Signer>
export type TokenURIEventArgs = EParams<typeof events.TokenURI>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type AlreadyMintedParams = FunctionArguments<typeof functions.alreadyMinted>
export type AlreadyMintedReturn = FunctionReturn<typeof functions.alreadyMinted>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type AssignOperatorParams = FunctionArguments<typeof functions.assignOperator>
export type AssignOperatorReturn = FunctionReturn<typeof functions.assignOperator>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type CancelOwnershipHandoverParams = FunctionArguments<typeof functions.cancelOwnershipHandover>
export type CancelOwnershipHandoverReturn = FunctionReturn<typeof functions.cancelOwnershipHandover>

export type ChangeSignerParams = FunctionArguments<typeof functions.changeSigner>
export type ChangeSignerReturn = FunctionReturn<typeof functions.changeSigner>

export type ChangeStipendParams = FunctionArguments<typeof functions.changeStipend>
export type ChangeStipendReturn = FunctionReturn<typeof functions.changeStipend>

export type CompleteOwnershipHandoverParams = FunctionArguments<typeof functions.completeOwnershipHandover>
export type CompleteOwnershipHandoverReturn = FunctionReturn<typeof functions.completeOwnershipHandover>

export type GasStipendParams = FunctionArguments<typeof functions.gasStipend>
export type GasStipendReturn = FunctionReturn<typeof functions.gasStipend>

export type GetApprovedParams = FunctionArguments<typeof functions.getApproved>
export type GetApprovedReturn = FunctionReturn<typeof functions.getApproved>

export type GetEthSignedMessageHashParams = FunctionArguments<typeof functions.getEthSignedMessageHash>
export type GetEthSignedMessageHashReturn = FunctionReturn<typeof functions.getEthSignedMessageHash>

export type GetMessageHashParams = FunctionArguments<typeof functions.getMessageHash>
export type GetMessageHashReturn = FunctionReturn<typeof functions.getMessageHash>

export type GrantRolesParams = FunctionArguments<typeof functions.grantRoles>
export type GrantRolesReturn = FunctionReturn<typeof functions.grantRoles>

export type HasAllRolesParams = FunctionArguments<typeof functions.hasAllRoles>
export type HasAllRolesReturn = FunctionReturn<typeof functions.hasAllRoles>

export type HasAnyRoleParams = FunctionArguments<typeof functions.hasAnyRole>
export type HasAnyRoleReturn = FunctionReturn<typeof functions.hasAnyRole>

export type HasMintedParams = FunctionArguments<typeof functions.hasMinted>
export type HasMintedReturn = FunctionReturn<typeof functions.hasMinted>

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>

export type MintParams_0 = FunctionArguments<typeof functions['mint(string,(string,uint256,address),bytes)']>
export type MintReturn_0 = FunctionReturn<typeof functions['mint(string,(string,uint256,address),bytes)']>

export type MintParams_1 = FunctionArguments<typeof functions['mint(address,string,(string,uint256,address),bytes)']>
export type MintReturn_1 = FunctionReturn<typeof functions['mint(address,string,(string,uint256,address),bytes)']>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>

export type OwnershipHandoverExpiresAtParams = FunctionArguments<typeof functions.ownershipHandoverExpiresAt>
export type OwnershipHandoverExpiresAtReturn = FunctionReturn<typeof functions.ownershipHandoverExpiresAt>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RenounceRolesParams = FunctionArguments<typeof functions.renounceRoles>
export type RenounceRolesReturn = FunctionReturn<typeof functions.renounceRoles>

export type RequestOwnershipHandoverParams = FunctionArguments<typeof functions.requestOwnershipHandover>
export type RequestOwnershipHandoverReturn = FunctionReturn<typeof functions.requestOwnershipHandover>

export type RevokeRolesParams = FunctionArguments<typeof functions.revokeRoles>
export type RevokeRolesReturn = FunctionReturn<typeof functions.revokeRoles>

export type RolesOfParams = FunctionArguments<typeof functions.rolesOf>
export type RolesOfReturn = FunctionReturn<typeof functions.rolesOf>

export type SafeTransferFromParams_0 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256)']>
export type SafeTransferFromReturn_0 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256)']>

export type SafeTransferFromParams_1 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>
export type SafeTransferFromReturn_1 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>

export type SignerParams = FunctionArguments<typeof functions.signer>
export type SignerReturn = FunctionReturn<typeof functions.signer>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TokenURIParams = FunctionArguments<typeof functions.tokenURI>
export type TokenURIReturn = FunctionReturn<typeof functions.tokenURI>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpdateTokenURIParams = FunctionArguments<typeof functions.updateTokenURI>
export type UpdateTokenURIReturn = FunctionReturn<typeof functions.updateTokenURI>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

