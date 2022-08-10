const {getNamedAccounts, ethers} = require("hardhat")

async function main() {
  const {deployer} = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  console.log("Funding contract")
  const transsactionResponse = await fundMe.fund({value: ethers.utils.parseEther("0.1")})
  await transsactionResponse.wait(1)
  console.log("Funded!")
}
