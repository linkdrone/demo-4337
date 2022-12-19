import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import fs from "fs-extra";
import { ethers } from "hardhat";
import path from "path";

import type { PlonkVerifier } from "../types/PlonkVerifier";
import type { Signers } from "./types";

const snarkjs = require("snarkjs");
const { utils } = require("ffjavascript");
const { unstringifyBigInts } = utils;

describe("PlonkVerifier test", function () {
  let plonkVerifier: PlonkVerifier;

  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    const plonkVerifierFactory = await ethers.getContractFactory("PlonkVerifier");
    plonkVerifier = <PlonkVerifier>await plonkVerifierFactory.connect(signers[0]).deploy();
  });

  it("verifyProof", async function () {
    const circomsDir = path.resolve(__dirname, "..", "circoms");

    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      { a: "1", b: "2" },
      path.join(circomsDir, "example_js", "example.wasm"),
      path.join(circomsDir, "example_final.zkey"),
    );

    const proofBT = unstringifyBigInts(proof);

    // console.log("Proof: ");
    // console.log(JSON.stringify(proof, null, 1));

    // const vKey = JSON.parse((await fs.readFile(path.join(circomsDir, "verification_key.json"))).toString());
    // // console.warn("vKey:", vKey);

    // const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);

    // if (res === true) {
    //   console.log("Verification OK");
    // } else {
    //   console.log("Invalid proof");
    // }
  });
});
