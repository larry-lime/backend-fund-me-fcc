const { network } = require("hardhat")
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts
  const chainID = network.config.chainID
}
