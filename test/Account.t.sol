// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/Account.sol";
import "../src/AccountFactory.sol";

contract AccountTest is Test {

    AccountFactory public factory;
    SmartAccount public account;

    function setUp() public {
        factory = new AccountFactory(IEntryPoint(address(0x0)));
        // in real life, we would pass the address of the lit protocol pkp as the owner
        account = factory.createAccount(address(this), 0);
    }

    function testAccount() external {
        // send a userOp to mint an nft from mock contract

    }
}
