// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './Bank20.sol';

// import 'hardhat/console.sol';

contract DeDropsERC is Ownable {

    uint256 public length = 0;

    Bank20 public bank;

    struct Drop {
        uint256 id;
        address token;
        uint256 amount;
        string title;
        uint256 startTime;
        uint256 endTime;
        uint256 claimNum;
        string info;
    }

    mapping (uint256 => Drop) public idToDrop;


    constructor(address bankAddress) public {
        bank = Bank20(bankAddress);
    }


    function drop(address token, uint256 amount, string calldata title, uint256 startTime, uint256 endTime, uint256 claimNum, string calldata info) external {
        uint256 id = ++length;
        idToDrop[id] = Drop(id, token, amount, title, startTime, endTime, claimNum, info);

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        IERC20(token).approve(address(bank), amount);
        bank.deposit(token, owner(), amount);
    }
}