// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721} from "../lib/solady/src/tokens/ERC721.sol";
import {OwnableRoles} from "../lib/solady/src/auth/OwnableRoles.sol";
import {SignatureCheckerLib as SCL} from "../lib/solady/src/utils/SignatureCheckerLib.sol";

contract Inverse is ERC721, OwnableRoles {
    error AlreadySet();
    error TransferFailed();
    error ExcessiveInput();
    error ArrayLengthMismatch();

    event Signer(address indexed signer);
    event TokenURI(uint256 indexed tokenId, string indexed metadata);
    event GasStipend(address indexed addr, uint256 indexed amount);
    event GasStipendSet(uint256 indexed amount);

    string private constant _NAME = "Inverse";
    string private constant _SYMBOL = "INVRS";
    uint256 private constant _OPERATOR = _ROLE_0;

    mapping(uint256 tokenId => string) private _metadata;

    mapping(address addr => bool) public hasMinted;
    uint256 public totalSupply;
    uint256 public gasStipend;
    address public signer;

    // Verifies signature is from frontend
    modifier checkSignature(bytes32 hash, bytes calldata signature) {
        if (!SCL.isValidSignatureNowCalldata(signer, hash, signature)) revert Unauthorized();
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
    function _mint(address to, string memory metadata) private {
        uint256 tokenId = ++totalSupply;
        _metadata[tokenId] = metadata;
        _mint(to, tokenId);
        emit TokenURI(tokenId, metadata);
    }

    // Mint via frontend for user with gas
    function mint(string memory metadata, bytes32 hash, bytes calldata signature) external checkSignature(hash, signature) {
        _payStipend(msg.sender);
        _mint(msg.sender, metadata);
    }

    // Sponsored mint by frontend
    function mint(address to, string memory metadata) external onlyRolesOrOwner(_OPERATOR) {
        _payStipend(to);
        _mint(to, metadata);
    }

    // Update token metadata
    function updateTokenURI(uint256[] calldata tokenIds, string[] calldata metadata) external onlyRolesOrOwner(_OPERATOR) {
        if (tokenIds.length != metadata.length) revert ArrayLengthMismatch();
        for (uint256 i; i < tokenIds.length; ++i) {
            _metadata[tokenIds[i]] = metadata[i];
            emit TokenURI(tokenIds[i], metadata[i]);
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
