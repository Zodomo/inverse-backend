// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {Inverse} from "../src/Inverse.sol";

contract InverseScript is Script {
    Inverse inverse = Inverse(payable(0xe900A9e0E76E1DaeD69F954F4F15dedECa382F02));
    uint256 deployerPrivateKey;
    address deployer;
    address signer = 0xfAC83e3eb856e9349bd999843dFB67b9719fA43A;

    function setUp() public {
        deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);
        vm.createSelectFork("testnet");
    }

    function deploy() public {
        vm.startBroadcast(deployerPrivateKey);
        inverse = new Inverse(deployer, signer, 0.001 ether);
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
