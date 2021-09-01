const hre = require('hardhat')
const fs = require('fs')
const { BigNumber, utils } = require('ethers')


//matic
var nft721Address = '0x14bc40AABb8706794D67965e924954df35965119'


async function main() {
	const accounts = await hre.ethers.getSigners()

	const TestNFT721 = await ethers.getContractFactory('TestNFT721')
	nft721 = await TestNFT721.deploy()
	await nft721.deployed()
	console.log('TestNFT721 deployed to:', nft721.address)
}


async function mint() {
	const accounts = await hre.ethers.getSigners()

	const testNFT721Abi = getAbi('./artifacts/contracts/test/TestNFT721.sol/TestNFT721.json')
    let nft721 = new ethers.Contract(nft721Address, testNFT721Abi, accounts[0])

	// await nft721.mint(accounts[1].address, b(1))
	// console.log('mint done')

	let tokenJSON = 
	{
		"name": "荒地",
		"description": "测试一下，这里是描述",
		"image": "https://pic4.zhimg.com/v2-75585fa3d2a1330fe23ee11019e92151_b.jpg",
		"attributes": ""
	}
	
	await nft721.setTokenURI(b(1), JSON.stringify(tokenJSON), {gasLimit:BigNumber.from('8000000')})
	console.log('setTokenURI done')
}


async function view() {
	const accounts = await hre.ethers.getSigners()

	const testNFT721Abi = getAbi('./artifacts/contracts/test/TestNFT721.sol/TestNFT721.json')
    let nft721 = new ethers.Contract(nft721Address, testNFT721Abi, accounts[0])

	console.log('balanceOf', n(await nft721.balanceOf(accounts[1].address)))
	console.log('ownerOf', await nft721.ownerOf(b(1)))
	console.log('tokenURI', await nft721.tokenURI(b(1)))
}


function getAbi(jsonPath) {
	let file = fs.readFileSync(jsonPath)
	let abi = JSON.parse(file.toString()).abi
	return abi
}

function b(num) {
	return BigNumber.from(num)
}

function n(bn) {
	return bn.toNumber()
}

function s(bn) {
	return bn.toString()
}

async function delay(sec) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, sec * 1000);
	})
}

view()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
