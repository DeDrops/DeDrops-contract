// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract TestNFT721 is ERC721('TestNFT721', 'NFT721') {
    
    function safeMint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }

    function safeMint(address to, uint256 tokenId, bytes memory _data) public {
        _safeMint(to, tokenId, _data);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public{
        _setTokenURI(tokenId, _tokenURI);
    }

    function setBaseURI(string memory baseURI_) public {
        _setBaseURI(baseURI_);
    }
}