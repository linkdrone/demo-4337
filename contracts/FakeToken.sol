// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeToken is ERC20 {
    constructor() ERC20("FakeToken", "FTK") {
        _mint(msg.sender, 100 ether);
    }

    function batchTransfer(address[] memory tos, uint256[] memory amounts) external returns (bool) {
        for (uint256 i = 0; i < tos.length; i++) {
            transfer(tos[i], amounts[i]);
        }
        return true;
    }
}
