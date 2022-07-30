const { assert, expect } = require('chai')
const { deployments, ethers, getNamedAccounts } = require('hardhat')

describe('FundMe', () => {
  let fundMe
  let mockV3Aggregator
  let deployer
  const sendValue = ethers.utils.parseEther('1')

  beforeEach(async () => {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(['all'])
    fundMe = await ethers.getContract('FundMe', deployer)
    mockV3Aggregator = await ethers.getContract('MockV3Aggregator', deployer)
  })

  describe('constructor', async () => {
    it('sets the aggregator addresses correctly', async () => {
      const response = await fundMe.priceFeed()
      assert.equal(response, mockV3Aggregator.address)
    })
  })

  describe('fund', () => {
    it('Fails if not enough ETH is sent', async () => {
      await expect(fundMe.fund()).to.be.revertedWith(
        'You need to spend more ETH!'
      )
    })
    it('Updates the amount funded data structure', async () => {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.addressToAmountFunded(deployer)
      assert.equal(response.toString(), sendValue.toString())
    })
    it('Adds funder to array of funders', async () => {
      await fundMe.fund({ value: sendValue })
      const funder = await fundMe.funders(0)
      assert.equal(funder, deployer)
    })
  })

  describe('withdraw', () => {
    beforeEach(async () => {
      await fundMe.fund({ value: sendValue })
    })
    it('withdraw ETH from single founder', async () => {
      // Arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )
      const startingDeployerBalance = await fundMe.providergetBalance(deployer)
      // Act
      const transactionResponse = await fundme.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
      // Assert
      assert.equal(endingFundMeBalance, 0)
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalance),
        endingDeployerBalance.add(gasCost).toString()
      )
    })
  })
})
