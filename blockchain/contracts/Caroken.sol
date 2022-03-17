pragma solidity ^0.8.0;

import "OpenZeppelin/openzeppelin-contracts@4.5.0/contracts/token/ERC20/ERC20.sol";

contract Caroken is ERC20 {
    // THe deployer of the token
    address private admin;

    constructor(uint256 amountToBeMinted) ERC20("Caroken", "CRK") {
        admin = msg.sender;
        _mint(msg.sender, amountToBeMinted * 10**18);
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == admin, "Only the admin can mint more coins");
        _mint(to, amount * 10**18);
    }

    function burn(uint256 amount) public {
        /*
            If the admin feels there are too many coins in the blockchain he can burn some of them
            No require statement added as anyone can burn their coins to avoid inflation.
         */
        _burn(msg.sender, amount);
    }
}
