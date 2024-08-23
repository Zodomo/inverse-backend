// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721} from "../lib/solady/src/tokens/ERC721.sol";
import {OwnableRoles} from "../lib/solady/src/auth/OwnableRoles.sol";
import {SignatureCheckerLib as SCL} from "../lib/solady/src/utils/SignatureCheckerLib.sol";

contract Inverse is ERC721, OwnableRoles {
    error AlreadySet();
    error ArrayLengthMismatch();

    event Signer(address indexed signer);
    event TokenURI(uint256 indexed tokenId, string indexed metadata);

    string private constant _NAME = "Inverse";
    string private constant _SYMBOL = "INVRS";
    uint256 private constant _OPERATOR = _ROLE_0;

    mapping(uint256 tokenId => string) private _metadata;

    uint256 public totalSupply;
    address public signer;

    modifier checkSignature(bytes32 hash, bytes calldata signature) {
        if (!SCL.isValidSignatureNowCalldata(signer, hash, signature)) revert Unauthorized();
        _;
    }

    constructor(address newOwner, address newSigner) payable {
        _initializeOwner(newOwner);
        signer = newSigner;
        emit Signer(newSigner);
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

    function mint(string memory metadata, bytes32 hash, bytes calldata signature) external checkSignature(hash, signature) {
        uint256 tokenId = ++totalSupply;
        _mint(msg.sender, tokenId);
        emit TokenURI(tokenId, metadata);
    }

    function updateTokenURI(uint256[] calldata tokenIds, string[] calldata metadata) external onlyRolesOrOwner(_OPERATOR) {
        if (tokenIds.length != metadata.length) revert ArrayLengthMismatch();
        for (uint256 i; i < tokenIds.length; ++i) {
            _metadata[tokenIds[i]] = metadata[i];
            emit TokenURI(tokenIds[i], metadata[i]);
        }
    }

    function changeSigner(address newSigner) external onlyOwner {
        if (signer == newSigner) revert AlreadySet();
        signer = newSigner;
        emit Signer(newSigner);
    }
}
