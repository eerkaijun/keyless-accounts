// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/Account.sol";
import "../src/AccountFactory.sol";
import "../src/MockContract.sol";

contract AccountTest is Test {

    AccountFactory public factory;
    SmartAccount public account;
    MockContract public mockContract;

    function setUp() public {
        factory = new AccountFactory(IEntryPoint(address(0x0)));
        // in real life, we would pass the address of the lit protocol pkp as the owner
        account = factory.createAccount(address(this), 0);
        mockContract = new MockContract();
    }

    function testAccount() external {
        // send a userOp to mint an nft from mock contract
        bytes memory functionSignature = abi.encodeWithSignature(
            "mint(address,uint256)", 
            address(account),
            1 // tokenId of 1
        );

        account.execute(address(mockContract), 0, functionSignature);

        // check that the nft is owned by the account
        assertEq(mockContract.ownerOf(1), address(account), "nft should be owned by account");
    }
}
