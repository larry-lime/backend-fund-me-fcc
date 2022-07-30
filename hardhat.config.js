require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")

const RINKEBY_RPC_URL =
  process.env.RINKEBY_RPC_URL || "https://eth-rinkeby/example"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "key"

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6,
    }
  },
  remappings: ["@chainlink=/node_modules/@chainlink"],
  gasReporter: {
    enabled: false,
  },
  etherscan: {
    apiKey: {
      rinkeby: ETHERSCAN_API_KEY,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    user: {
      default: 1,
    },
  },
}
