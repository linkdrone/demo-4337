# Compile circuit
circom example.circom --r1cs --wasm --sym --c

# Setup
snarkjs plonk setup example.r1cs pot12_final.ptau example_final.zkey