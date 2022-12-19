import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import fs from "fs-extra";
import { ethers } from "hardhat";
import path from "path";

import type { Signers } from "./types";

const snarkjs = require("snarkjs");

describe("PlonkVerifier test", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("verifyProof", async function () {
    const circomsDir = path.resolve(__dirname, "..", "circoms");
    console.warn("circomsDir:", circomsDir);

    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      { a: "1", b: "2" },
      path.join(circomsDir, "example_js", "example.wasm"),
      path.join(circomsDir, "example_final.zkey"),
    );

    console.log("Proof: ");
    console.log(JSON.stringify(proof, null, 1));

    const vKey = JSON.parse((await fs.readFile(path.join(circomsDir, "verification_key.json"))).toString());
    console.warn("vKey:", vKey);

    // const res = await snarkjs.plonk.verify(vKey, publicSignals, proof);

    // if (res === true) {
    //   console.log("Verification OK");
    // } else {
    //   console.log("Invalid proof");
    // }
  });
});
