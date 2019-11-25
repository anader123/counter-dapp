pragma solidity ^0.5.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Counter {
    using SafeMath for uint;
    uint256 public value;

    event Increased(uint256 indexed newValue);

    function increase() public {
        value = value.add(1);
        emit Increased(value);
    }
}