// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

contract Sender {
    uint256 private nonce = 0;

    constructor(address owner) {
        owner;
    }

    function exec() external returns (bool) {
        unchecked {
            nonce += 1;
        }
        return true;
    }
}
