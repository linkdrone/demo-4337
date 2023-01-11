import { BigNumber, BytesLike, Signer, ethers } from "ethers";
import { ethers as ethersHardhat } from "hardhat";

import { PayMaster__factory } from "../types";
import { PayMaster } from "../types/contracts/PayMaster";

export const randomSigners = (amount: number): Signer[] => {
  const signers: Signer[] = [];
  for (let i = 0; i < amount; i++) {
    signers.push(ethers.Wallet.createRandom());
  }
  return signers;
};

async function main() {
  const abiCoder = new ethers.utils.AbiCoder();
  const account0 = (await ethersHardhat.getSigners())[0];
  const accounts = await ethersHardhat.getSigners();
  const provider = ethersHardhat.provider;
  const payMaster = await new PayMaster__factory(account0).deploy();
  let FeeBatchData: PayMaster.UserFeeStruct[] = [];
  let FeeBatchData2: PayMaster.UserFeeStruct[] = [];
  let FeeBatchDataHash: BytesLike = ethers.utils.keccak256(abiCoder.encode(["uint"], [0]));
  let FeeBatchDataHash2: BytesLike = ethers.utils.keccak256(abiCoder.encode(["uint"], [0]));
  const randomAccounts = randomSigners(128);
  const randomAccounts2 = randomSigners(128);
  for (var i = 0; i < 128; i++) {
    const address = await randomAccounts[i].getAddress();
    FeeBatchData.push({
      user: address,
      fee: BigNumber.from(100),
    });
    FeeBatchDataHash = ethers.utils.keccak256(
      abiCoder.encode(["address", "uint256", "bytes32"], [address, BigNumber.from(100), FeeBatchDataHash]),
    );
    payMaster.userDeposit(address, BigNumber.from(1000000));
  }
  for (var i = 0; i < 128; i++) {
    const address = await randomAccounts2[i].getAddress();
    FeeBatchData2.push({
      user: address,
      fee: BigNumber.from(100),
    });
    FeeBatchDataHash2 = ethers.utils.keccak256(
      abiCoder.encode(["address", "uint256", "bytes32"], [address, BigNumber.from(100), FeeBatchDataHash2]),
    );
    payMaster.userDeposit(address, BigNumber.from(1000000));
  }

  const tx = await payMaster.addTxBatchHash(FeeBatchDataHash);
  await tx.wait();
  const txResult = await provider.getTransactionReceipt(tx.hash);
  console.log(`addTxBatchHash txHash ${tx.hash} gasUsed ${txResult.gasUsed}`);
  const tx2 = await payMaster.addTxBatchHash(FeeBatchDataHash2);
  await tx2.wait();
  const txResult2 = await provider.getTransactionReceipt(tx2.hash);
  console.log(`addTxBatchHash2 txHash ${tx2.hash} gasUsed ${txResult2.gasUsed}`);

  const refundGasTx = await payMaster.refundTxGasFee(FeeBatchData.concat(FeeBatchData2));
  await refundGasTx.wait();
  const refundGasTxResult = await provider.getTransactionReceipt(refundGasTx.hash);
  console.log(`refundGasTx 128*2 txHash ${refundGasTx.hash} gasUsed ${refundGasTxResult.gasUsed}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
