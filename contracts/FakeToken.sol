// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Sender.sol";

contract FakeToken is ERC20 {
    mapping(address => uint) private bills;

    constructor() ERC20("FakeToken", "FTK") {
        _mint(msg.sender, 100 ether);
    }

    function batchTransfer(
        address[] memory tos,
        uint256[] memory amounts,
        Sender[] memory senders
    ) external returns (bool, bytes32) {
        bytes32 kAll;
        for (uint256 i = 0; i < tos.length; i++) {
            transfer(tos[i], amounts[i]);

            kAll = keccak256(abi.encodePacked(kAll, tos[i], amounts[i]));

            // unchecked {
            //     bills[tos[i]] = bills[tos[i]] + amounts[i];
            // }
            senders[i].exec();

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
