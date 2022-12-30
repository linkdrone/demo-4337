// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Sender.sol";

contract FakeToken is ERC20 {
    constructor() ERC20("FakeToken", "FTK") {
        _mint(msg.sender, 10000 ether);
    }

    function batchTransfer(
        address[] memory tos,
        uint256[] memory amounts,
        Sender[] memory senders,
        IERC20 feeToken
    ) external returns (bool, bytes32) {
        bytes32 kAll;
        for (uint256 i = 0; i < tos.length; i++) {
            kAll = keccak256(abi.encodePacked(kAll, tos[i], amounts[i]));

            senders[i].exec(tos[i], amounts[i], msg.sender, feeToken);

            // (bool sent, ) = payable(tos[i]).call{ value: 0.001 ether }("");
            // sent;
        }

        return (true, kAll);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
