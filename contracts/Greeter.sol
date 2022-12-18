// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "hardhat/console.sol";

error GreeterError();

contract Greeter {
    string public greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);

        // uint256 sum = 0;
        // for (uint256 i = 0; i < 1000; i++) {
        //     sum += i;
        //     // console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        // }
        // sum;

        greeting = _greeting;
    }

    function throwError() external pure {
        revert GreeterError();
    }
}
