// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {Inverse} from "../src/Inverse.sol";

contract InverseScript is Script {
    Inverse inverse;
    uint256 deployerPrivateKey;
    address deployer;

    function setUp() public {
        deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        deployer = vm.addr(deployerPrivateKey);
        vm.createSelectFork("baseMainnet");
    }

    function deploy() public {
        vm.startBroadcast(deployerPrivateKey);
        inverse = new Inverse(deployer, address(0), 0.001 ether);
        vm.stopBroadcast();
        console2.log("Deployment Address:", address(inverse));
    }
}
