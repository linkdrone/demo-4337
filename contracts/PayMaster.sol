// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PayMaster is Ownable {
    uint256 gasERC20PoolSum = 0;
    address _entryPoint;

    mapping(address => uint256) private userERC20Gas;
    mapping(bytes32 => bool) private FeeBatchDataHash;

    // constructor (address entryPointAddress) {
    //   _entryPoint = entryPointAddress;
    // }

    struct UserFee {
        address user;
        uint256 fee;
    }

    function _refundGasFee(UserFee[] memory TxBatchFee) private {
        uint256 feeDatalen = TxBatchFee.length;
        for (uint256 i = 0; i < feeDatalen; i++) {
            // should not check User existence or minus overflow for gas saving
            userERC20Gas[TxBatchFee[i].user] -= TxBatchFee[i].fee;
        }
    }

    function hashUserFeeData(UserFee[] calldata feeDatas) public pure returns (bytes32) {
        uint256 feeDatasLen = feeDatas.length;
        bytes32 hashResult = keccak256(abi.encode(uint256(0)));
        for (uint i = 0; i < feeDatasLen; i++) {
            hashResult = keccak256(abi.encode(feeDatas[i].user, feeDatas[i].fee, hashResult));
        }
        return hashResult;
    }

    function validateHash(bytes32 feeBatchDataHash) public view returns (bool) {
        if (FeeBatchDataHash[feeBatchDataHash] == false) {
            return true;
        }
        return false;
    }

    function refundTxGasFee(UserFee[] calldata feeDatas) public {
        uint256 feeDatasLen = feeDatas.length;
        uint256 batchTxsNum = 128;
        for (uint256 i = 0; i < feeDatasLen; i += batchTxsNum) {
            UserFee[] calldata sliceFeeDatas = feeDatas[i:i + batchTxsNum];
            bytes32 hashResult = hashUserFeeData(sliceFeeDatas);
            require(validateHash(hashResult), "Hash not valid");
            _refundGasFee(sliceFeeDatas);
            FeeBatchDataHash[hashResult] = true;
        }
    }

    //Only Can invoked by EntryPoint!
    function addTxBatchHash(bytes32 feeBatchDataHash) public {
        // require(msg.sender == _entryPoint, "only EntryPoint can operate this");

        FeeBatchDataHash[feeBatchDataHash] = false;
    }

    function syncData() public {}

    function userDeposit(address userAdd, uint256 wad) public payable {
        userERC20Gas[userAdd] += wad;
    }

    function userWithdraw(uint256 wad) public {}

    // Only For PayMaster
    function pmWithdraw() public onlyOwner {}

    function pmDeposit() public onlyOwner {}
}
