// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {Inverse} from "../src/Inverse.sol";

contract InverseScript is Script {
    Inverse inverse = Inverse(payable(0x5A06811Fb0EcF10B98eF4243d5b16fF9b0efbf0C)); // Sepolia: 0x5a06811fb0ecf10b98ef4243d5b16ff9b0efbf0c // Aleph Zero Testnet: 0x2E28b5Cc90D8A9e4D661417568eb83bdd2DF26C3
    uint256 deployerPrivateKey;
    address deployer;
    address signer = 0xfAC83e3eb856e9349bd999843dFB67b9719fA43A;

    function setUp() public {
        deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);
        vm.createSelectFork("sepolia");
    }

    function deploy() public {
        vm.startBroadcast(deployerPrivateKey);
        inverse = new Inverse(deployer, deployer, 0.001 ether);
        vm.stopBroadcast();
        console2.log("Deployment Address:", address(inverse));
    }

    function changeSigner() public {
        vm.startBroadcast(deployerPrivateKey);
        inverse.changeSigner(signer);
        inverse.assignOperator(signer, true);
        vm.stopBroadcast();
    }
}