<div align="center">
  <h1 align="center">ERC721MerkleDrop contract</h1>  
  <h3 align="center">An attempt to implement the Merkle-Drop pattern using Cairo programming language. This pattern is an efficient way to airdrop NFTs when the number of users is large.</h3>
</div>

<p>&nbsp;</p>
<p>&nbsp;</p>



## Preconditions

- 2^n accounts
- 2^n NFTs
- Each account is offered 1 NFT


## Setting up the environment (Windows11 + WSL2 + Ubuntu 20.04.5 LTS)

```shell
sudo apt update
sudo apt upgrade
```
```shell
sudo apt install npm
sudo npm install -g n
sudo n 14.17.3
# restart terminal
sudo npm install -g npm@7.19.1
```
```shell
sudo apt install python3.8-venv
python3.8 -m venv ~/my_venv
source ~/my_venv/bin/activate
```
```shell
sudo apt install libgmp3-dev
```
```shell
pip install ecdsa
```
```shell
pip install wheel
sudo apt-get install python3.8-dev
sudo apt-get install gcc
pip install fastecdsa
```
```shell
pip install sympy
```
```shell
# if error
pip install eth-hash==0.3.3
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
npm install --save-dev hardhat
```
```shell
npx hardhat starknet-compile
```
```shell
npx hardhat test
```


## Inspiration

- https://github.com/OpenZeppelin/workshops/blob/master/06-nft-merkle-drop/contracts/ERC721MerkleDrop.sol
- https://github.com/MakC-Ukr/Merkle-Tree-in-Cairo/blob/main/src/cairo-part/MerkleTreeUtils.cairo
- https://gist.github.com/EvolveArt/da9fd888ea6c305775f672ae0001714a