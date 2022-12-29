import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { BigNumber, BigNumberish, constants, getDefaultProvider, utils } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

import type { FakeToken } from "../types/contracts/FakeToken";
import type { Signers } from "./types";

describe("FakeToken test", function () {
  let fakeToken: FakeToken;

  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    const fakeTokenFactory = await ethers.getContractFactory("FakeToken");
    fakeToken = <FakeToken>await fakeTokenFactory.connect(signers[0]).deploy();
  });

  it("transfer", async function () {
    const to = BigNumber.from(this.signers.admin.address).add(1).toHexString();
    await fakeToken.transfer(to, utils.parseEther("0.001"));

    const balance = await fakeToken.balanceOf(to);
    console.warn("balance:", balance);
  });

  it("batchTransfer", async function () {
    await this.signers.admin.sendTransaction({
      from: this.signers.admin.address,
      to: fakeToken.address,
      value: parseEther("1"),
    });

    const total = 200;
    const amount = utils.parseEther("0.001");
    const amounts: BigNumberish[] = [];
    const tos: string[] = [];
    const senders: string[] = [];

    const senderFactory = await ethers.getContractFactory("Sender");

    for (let i = 0; i < total; i++) {
      const _to = BigNumber.from(this.signers.admin.address)
        .add(i + 2)
        .toHexString();
      tos.push(_to);
      amounts.push(amount);

      const sender = await senderFactory.deploy(_to);
      senders.push(sender.address);
    }

    await fakeToken.batchTransfer(tos, amounts, senders);

    for (let i = 0; i < total; i++) {
      const balance = await fakeToken.balanceOf(tos[i]);

      console.warn(`address: ${tos[i]}, balance: ${balance.toString()}`);
    }
  });
});
