// module.exports.default = deployFunc
const { networkConfig } = require("../helper-hardhat-config")
const {network} = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts
  const chainID = network.config.chainID

  // if chainID is x use address Y
  // if chainID is A use address C
  const ethUsdPriceFeedAddress = networkConfig[chainID]["ethUsdPriceFeed"]

  // When going for localhost or hardhat network, use mocks
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [] // put pricefeed address
  })
}
