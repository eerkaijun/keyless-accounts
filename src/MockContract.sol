// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockContract is ERC721 {

    constructor() ERC721("SHITNFT", "SHITNFT") {}

    /// @dev this is a shitcoin, so anyone can mint, please do not deploy in production
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

}