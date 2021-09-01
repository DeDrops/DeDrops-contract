const hre = require('hardhat')
const fs = require('fs')
const { BigNumber, utils } = require('ethers')


//matic
var nft1155Address = '0xD83C09f53540c9085f8E8f85D7838fE33Dc41fE6'


async function main() {
	const accounts = await hre.ethers.getSigners()

	const TestNFT1155 = await ethers.getContractFactory('TestNFT1155')
	let nft1155 = await TestNFT1155.deploy()
	await nft1155.deployed()
	console.log('TestNFT1155 deployed to:', nft1155.address)
}


async function mint() {
	const accounts = await hre.ethers.getSigners()

	const testNFT1155Abi = getAbi('./artifacts/contracts/test/TestNFT1155.sol/TestNFT1155.json')
    let nft1155 = new ethers.Contract(nft1155Address, testNFT1155Abi, accounts[0])

	let tokenJSON = 
	{
		"name": "自定义螺蛳粉1155",
		"description": "螺蛳粉就是好吃1155",
		"image": "https://lh3.googleusercontent.com/voMBqwRcDV8Pfqf56-fkrFO85sRfKWz8yxQSRM93wyivv88a7rl__79s3_g94GtG8XYZju29CftFm0mpMU8mYfZ7MQjJKWlyJ9j0zw=w600",
		"attributes": ""
	}

	await nft1155.mint(accounts[1].address, b(1), b(99), JSON.stringify(tokenJSON), {gasLimit:BigNumber.from('8000000')})
	console.log('setTokenURI done')
}


async function view() {
	const accounts = await hre.ethers.getSigners()

	const testNFT1155Abi = getAbi('./artifacts/contracts/test/TestNFT1155.sol/TestNFT1155.json')
    let nft1155 = new ethers.Contract(nft1155Address, testNFT1155Abi, accounts[0])

	console.log('balanceOf', n(await nft1155.balanceOf(accounts[1].address, b(1))))
	console.log('creator', await nft1155.creators(b(1)))
	console.log('tokenSupply', n(await nft1155.tokenSupply(b(1))))
	console.log('uri', await nft1155.uri(b(1)))
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
