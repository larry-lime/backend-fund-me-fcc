// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FundMe__NotOwner();

// Interfaces, Libraries, Contracts
/// @title A contract for crowd funding
/// @author Lawrence Lim
/// @notice This contract is to demo a sample funding contract
/// @dev This implements price feeds as our library
contract FundMe {
    // Type declarations
    using PriceConverter for uint256;

    // State variables
    mapping(address => uint256) private AddressToAmountFunded;
    address[] public s_funder;
    // Could we make this constant?
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    AggregatorV3Interface public s_priceFeed;

    // Events and modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    // Functions order:
    // constructor
    // recieve
    // fallback
    // external
    // public
    // internal
    // private
    // view / pure

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "You need to spend more ETH!"
        );
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        AddressToAmountFunded[msg.sender] += msg.value;
        s_funder.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funder.length;
            funderIndex++
        ) {
            address funder = s_funder[funderIndex];
            AddressToAmountFunded[funder] = 0;
        }
        s_funder = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funder;
        // mappings can't be in memory
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            AddressToAmountFunded[funder] = 0;
        }
        s_funder = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funder[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return AddressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
