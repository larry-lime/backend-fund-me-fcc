const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const {verify} = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  // if chainID is x use address Y
  // if chainID is A use address C
  // const ethUsdPriceFeedAddress = networkConfig[chainID]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethUsdPriceAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdPriceAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  // When going for localhost or hardhat network, use mocks
  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // put pricefeed address
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  }
  log("------------------------------------------")
}
