pragma solidity ^0.8.0;

import "OpenZeppelin/openzeppelin-contracts@4.5.0/contracts/token/ERC20/ERC20.sol";
import "./Caroken.sol";

// As of now I want carokens to be non refundible

contract PaymentProcessor {
    IERC20 public caroken;
    address public owner;

    constructor(address carokenAddress) {
        owner = msg.sender;
        caroken = IERC20(carokenAddress);
    }

    event CarokenTransfer(address sender, address receiver, uint256 amount);

    function getCarokens() external payable {
        require(msg.value != 0, "Should send > 0 ethers");
        require(
            msg.value < msg.sender.balance,
            "Sender doesn't have enough ethers"
        );

        // 1 wei == 1 caroken as of now
        require(
            caroken.balanceOf(owner) > msg.value,
            "Owner should have enough ethers to give"
        );

        // Transferred ethers from sender to the owner
        payable(owner).transfer(msg.value);

        // Owner transfers coins from his account to the one requesting.
        caroken.transfer(msg.sender, msg.value);

        emit CarokenTransfer(owner, msg.sender, msg.value);
    }
}
