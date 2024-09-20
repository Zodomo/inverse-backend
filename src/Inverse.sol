// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721} from "./ERC721.sol";
import {OwnableRoles} from "../lib/solady/src/auth/OwnableRoles.sol";
import {SignatureCheckerLib as SCL} from "../lib/solady/src/utils/SignatureCheckerLib.sol";

contract Inverse is ERC721, OwnableRoles {
    error AlreadySet();
    error AlreadyMinted();
    error TransferFailed();
    error ExcessiveInput();
    error ArrayLengthMismatch();

    event Signer(address indexed signer);
    event TokenURI(uint256 indexed tokenId, string indexed metadataUri);
    event GasStipend(address indexed addr, uint256 indexed amount);
    event GasStipendSet(uint256 indexed amount);

    struct SigData {
        string collection;
        uint256 identifier;
        address addr;
    }

    string private constant _NAME = "Inverse";
    string private constant _SYMBOL = "INVRS";
    uint256 private constant _OPERATOR = _ROLE_0;

    mapping(uint256 tokenId => string) private _metadata;

    mapping(address addr => bool) public hasMinted;
    mapping(bytes32 hash => bool) public alreadyMinted;
    uint256 public totalSupply;
    uint256 public gasStipend;
    address public signer;

    // Verifies signature is from frontend
    modifier checkSignature(SigData calldata sigData, bytes calldata signature) {
        bytes32 messageHash = getMessageHash(sigData);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        if (!SCL.isValidSignatureNowCalldata(signer, ethSignedMessageHash, signature)) revert Unauthorized();
        if (!alreadyMinted[ethSignedMessageHash]) alreadyMinted[ethSignedMessageHash] = true;
        else revert AlreadyMinted();
        _;
    }

    constructor(address newOwner, address newSigner, uint256 newGasStipend) payable {
        _initializeOwner(newOwner);
        signer = newSigner;
        gasStipend = newGasStipend;
        emit Signer(newSigner);
        emit GasStipendSet(newGasStipend);
    }

    function name() public pure override returns (string memory) {
        return _NAME;
    }

    function symbol() public pure override returns (string memory) {
        return _SYMBOL;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        return _metadata[tokenId];
    }

    function getMessageHash(SigData calldata sigData) public pure returns (bytes32 hash) {
        return keccak256(abi.encode(sigData));
    }

    function getEthSignedMessageHash(bytes32 messageHash) public pure returns (bytes32 hash) {
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
    }

    // Pays gas stipend to each minter once
    function _payStipend(address to) private {
        uint256 stipend = gasStipend;
        if (!hasMinted[to] && address(this).balance >= stipend) {
            hasMinted[to] = true;
            (bool success,) = payable(to).call{value: stipend}("");
            if (!success) revert TransferFailed();
            emit GasStipend(to, stipend);
        }
    }

    // Mint logic
    function _mint(address to, string memory metadataUri) private {
        uint256 tokenId = ++totalSupply;
        _metadata[tokenId] = metadataUri;
        _mint(to, tokenId);
        emit TokenURI(tokenId, metadataUri);
    }

    // Mint via frontend for user with gas
    function mint(string memory metadataUri, SigData calldata sigData, bytes calldata signature) external checkSignature(sigData, signature) {
        _payStipend(msg.sender);
        _mint(msg.sender, metadataUri);
    }

    // Sponsored mint by frontend
    function mint(address to, string memory metadataUri, SigData calldata sigData, bytes calldata signature) external checkSignature(sigData, signature) onlyRolesOrOwner(_OPERATOR) {
        _payStipend(to);
        _mint(to, metadataUri);
    }

    // Update token metadata
    function updateTokenURI(uint256[] calldata tokenIds, string[] calldata metadataUri) external onlyRolesOrOwner(_OPERATOR) {
        if (tokenIds.length != metadataUri.length) revert ArrayLengthMismatch();
        for (uint256 i; i < tokenIds.length; ++i) {
            _metadata[tokenIds[i]] = metadataUri[i];
            emit TokenURI(tokenIds[i], metadataUri[i]);
        }
    }

    // Withdraw native token stipend or excessive funds
    function withdraw(address to, uint256 amount) external onlyRolesOrOwner(_OPERATOR) {
        if (amount > address(this).balance) revert TransferFailed();
        (bool success,) = payable(to).call{value: amount}("");
        if (!success) revert TransferFailed();
    }

    // Assign/Revoke Operator role
    function assignOperator(address addr, bool status) external onlyOwner {
        if (status) _grantRoles(addr, _OPERATOR);
        else _removeRoles(addr, _OPERATOR);
    }

    // Change signer
    function changeSigner(address newSigner) external onlyOwner {
        if (signer == newSigner) revert AlreadySet();
        signer = newSigner;
        emit Signer(newSigner);
    }

    // Change native token gas stipend
    function changeStipend(uint256 newGasStipend) external onlyOwner {
        if (newGasStipend > 1 ether) revert ExcessiveInput();
        gasStipend = newGasStipend;
        emit GasStipendSet(newGasStipend);
    }

    receive() external payable {}
}
