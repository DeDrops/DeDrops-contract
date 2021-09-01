// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract TestNFT1155 is ERC1155('TestNFT1155') {

    mapping (uint256 => address) public creator;

    mapping (uint256 => uint256) public totalSupply;

    mapping (uint256 => string) internal _uri;

    constructor() public {
    }

    function uri(uint256 id) external view override returns (string memory) {
        return _uri[id];
    }

    function exists(uint256 id) public view returns (bool) {
        return totalSupply[_id] > 0;
    }

    function maxSupply(uint256 id) public view returns (uint256) {
        return totalSupply[_id];
    }

    function mint(address account, uint256 id, uint256 amount, string calldata tokenURI) external {
        _mint(account, id, amount, '');
        creator[id] = account;
        totalSupply[id] = amount;
        _uri[id] = tokenURI;
    }

    
}