// The entirety of your Hardhat setup (i.e. your config, plugins and custom tasks) is contained in this file.
import { HardhatUserConfig } from "hardhat/types";
import "@shardlabs/starknet-hardhat-plugin";
import "@nomiclabs/hardhat-ethers";
import'@starkware-industries/starkware-crypto-utils';
import * as dotenv from "dotenv";
dotenv.config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    starknet: {
        // dockerizedVersion: "0.9.1", // alternatively choose one of the two venv options below
        // uses (my-venv) defined by `python -m venv path/to/my-venv`
        // venv: "path/to/my-venv",

        // uses the currently active Python environment (hopefully with available Starknet commands!)
        venv: "active",
        recompile: false,
        network: "integrated-devnet",
        wallets: {
            OpenZeppelin: {
                accountName: "MyOpenZeppelinAccount",
                modulePath: "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
                accountPath: "~/.starknet_accounts"
            }
        }
    },
    networks: {
        // devnet: {
        //     url: "http://127.0.0.1:5050"
        // },
        integratedDevnet: {
            url: "http://localhost:5050",
            venv: "active",
            // dockerizedVersion: "<DEVNET_VERSION>",

            // optional devnet CLI arguments
            args: ["--accounts" , "8"] // number of random accounts to generate
        },
        hardhat: {}
    }
};

export default config;