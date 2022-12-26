import { defaultAbiCoder } from "@ethersproject/abi";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { utils } from "ethers";
import fs from "fs-extra";
import { ethers } from "hardhat";
import path from "path";

import type { PlonkVerifier } from "../types/PlonkVerifier";
import type { Signers } from "./types";
import { plonkExportSolidityCallData } from "./utils/plonk_export";

const snarkjs = require("snarkjs");

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
      { a: "2", b: "3" },
      path.join(circomsDir, "example_js", "example.wasm"),
      path.join(circomsDir, "example_final.zkey"),
    );

    // const rest = await plonkVerifier.verifyProof(
    //   "0x287d52c45f7f9b04505a2b916231399e81faa0156a071f94e28b97003d93d0790ac146cc438830e4f95e2e7d253a873cb3c779503601fea23b9ce2929fd45ee516a4ce40367628a3f62818acdf6d91549c5b204f07283d8226231a30c74ca8aa1abdc2439c665c7b7f4b18be36bee6d7ee91e7ee177c1a55be20fc812cb786a613e536b52af3e5cac1279724424f74f1445a6635758aee1c2c906c58935d7aab1d57c8564b07ccd84a82ffaffec54a17b9feb546cf6ea3838e3895776e6e1f86295988f6948d3ec4e8e2a88e1c72f27000a2b324746d0f83146a205eb6a6b14e0c2aff408d32e411bbca7bef0d3afd22321b1f135f0d147594b603f5ab1bc52a1be272ce1bf88fab29df73e745d28f46bd8294ecb5189ae7d78061362ce1b7033053cbe39c41728aefe4e51ac0d1782165fff7fbc6798201aaa612aa9dab2d8f058ae29bc96f69fe10df86d46040e13b25f90010f1b887287b436378c2476895117a840bb79c1e73185eceb2bbea95dc5118d6261ff11101a7f773c115afb5471c7e629ae9179001c012af827391ad681a71a341bc4ce02968ab192e5842985402a08253561573996c097da7e38fef6e7e20667f302114159d2e1698182a61c81d3d9182bf19c220e00325b70c7f2076981c99206eab513b9f2b9d98587713f513c84a7e38e2bd5c6196f161a70ff43b8b0c4a23d78a18e3f2f7c11b7449a24a19e23e5dcbc2114adce807dfe51c03a7fb6bb5efa4ab003c101af4ffafcc70a61c44f924f80ba0307c10f975e92f10a4350c7b2c86c6b69842c58636fda0fbab0f4742e2362a12a82391f059724fd2764de153bdf67db0b553d57885294cc5572afcad095e0cdf6555d083e69479061fd404edf2b41276637b62e6d4f6414acd03cdd0f7ac3be529affa2019e5f28ceb8dd88063683c0941ed48fe54022516140ed30ab516d426318f98507599e9c3a8b837008efb28a61bb873b72dd4fce64e05ce631f0801c2b27c250078488b0b9437053f373c02d1764d91e8791809d5a42f22d6ed94cffe7bd7aba4bbe7367f44603307b2bd867e61aadeef9d1449abca1bd40a67b8d1ce92877753d862f23af33176d0713282d3fba34fee1236221007",
    //   ["0x1455c06a2765fd6345dc08c751fd3ad6709177a1624af78e75c77d64ec8a56d4"],
    // );
    // console.warn("rest:", rest)

    const calldata = await plonkExportSolidityCallData(proof, publicSignals);
    console.warn("calldata.inputs:", calldata.inputs);

    const res = await plonkVerifier.writeVerifyProof(calldata.proofHex, calldata.inputs);
    console.warn("res:", res);

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
