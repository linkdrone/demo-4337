// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Sender {
    uint256 private nonce = 1;

    constructor(address owner) {
        owner;
    }

    function exec(address to, uint amount) external returns (bool) {
        unchecked {
            nonce += 1;
        }

        require(nonce < 1000000, "Nonce is invalid");

        IERC20(msg.sender).transfer(to, amount);

        // Refund gas
        IERC20(msg.sender).transfer(msg.sender, amount);

        return true;
    }
}
