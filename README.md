## Setting up the environment (WSL2)

```shell
python3.8 -m venv ~/my_venv
```
```shell
source ~/my_venv/bin/activate
```
```shell
pip install cairo-lang==0.9.1
```
```shell
pip install starknet-devnet==0.2.11
```
```shell
pip install openzeppelin-cairo-contracts==0.3.2
```

## Run

```shell
git clone https://github.com/lhadri/ERC721MerkleDrop.git
```
```shell
cd ERC721MerkleDrop/
```
```shell
npm install
```
```shell
npx hardhat starknet-compile
```
```shell
npx hardhat test
```

## Preconditions

- 2^n accounts
- 2^n NFTs (token ids are felts)
- Each account is offered 1 NFT


## Inspiration

- https://github.com/OpenZeppelin/workshops/blob/master/06-nft-merkle-drop/contracts/ERC721MerkleDrop.sol
- https://github.com/MakC-Ukr/Merkle-Tree-in-Cairo/blob/main/src/cairo-part/MerkleTreeUtils.cairo
- https://gist.github.com/EvolveArt/da9fd888ea6c305775f672ae0001714a