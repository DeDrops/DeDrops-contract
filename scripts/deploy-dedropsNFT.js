const hre = require('hardhat')
const fs = require('fs')
const { BigNumber, utils } = require('ethers')


//matic
var bankAddress = '0xc44dc52e259352B6C26AfFcEf9ce280836AD6860'
var nftAddress = '0x27c6bA2d108E754805eACFD87e6394f75075f96c'
var DOMAIN_SEPARATOR = '0xa88c15decb7b31a157043f3cd4b8d44025fab8127a1ace79a4e42f4b4705550c'
var CLAIM_TYPEHASH = '0xb6a24ef5c5f68d9d0b21ed8a8f65af560e5c67ed6271d8c36130e21b56be877e'
var PASSWORD_TYPEHASH = '0x892bed353848c2d77daa7dec64601cc101e9d4dabd543a881719f8f210924128'


async function main() {
	const accounts = await hre.ethers.getSigners()

	// const Bank1155 = await ethers.getContractFactory('Bank1155')
	// let bank = await Bank1155.deploy()
	// await bank.deployed()
	// DOMAIN_SEPARATOR = await bank.DOMAIN_SEPARATOR()
	// CLAIM_TYPEHASH = await bank.CLAIM_TYPEHASH()
	// PASSWORD_TYPEHASH = await bank.PASSWORD_TYPEHASH()
	// console.log('Bank1155 deployed to:', bank.address, 'DOMAIN_SEPARATOR:', DOMAIN_SEPARATOR, 'CLAIM_TYPEHASH:', CLAIM_TYPEHASH, 'PASSWORD_TYPEHASH:', PASSWORD_TYPEHASH)
	
	// const NFT = await ethers.getContractFactory('DeDropsNFT')
	// let nft = await NFT.deploy(bankAddress)
	// await nft.deployed()
	// console.log('DeDropsNFT deployed to:', nft.address)
}


async function mint() {
	const accounts = await hre.ethers.getSigners()

	const nftAbi = getAbi('./artifacts/contracts/badland/DeDropsNFT.sol/DeDropsNFT.json')
    let nft = new ethers.Contract(nftAddress, nftAbi, accounts[0])

	await nft.connect(accounts[1]).mint('1stNFT', 'ipfs://dedrops', b(100), '测试第一批NFT', '谁都可以来领')
	console.log('mint done')
}


async function view() {
	const accounts = await hre.ethers.getSigners()

	const nftAbi = getAbi('./artifacts/contracts/badland/DeDropsNFT.sol/DeDropsNFT.json')
    let nft = new ethers.Contract(nftAddress, nftAbi, accounts[0])

	const bankAbi = getAbi('./artifacts/contracts/badland/Bank1155.sol/Bank1155.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[0])

	let info = await nft.idToNFT(b(1))
	console.log('id', n(info.id))
	console.log('name', info.name)
	console.log('url', info.url)
	console.log('amount', n(info.amount))
	console.log('info', info.info)
	console.log('info2', info.info2)

	console.log('bank nft1:', n(await nft.balanceOf(bank.address, b(1))))

	let amount = n(await bank.tokenUserBalance(nftAddress, b(1), accounts[0].address))
	console.log('nft amount:', amount)
}


function getAbi(jsonPath) {
	let file = fs.readFileSync(jsonPath)
	let abi = JSON.parse(file.toString()).abi
	return abi
}

function m(num) {
	return BigNumber.from('1000000').mul(num)
}

function d(bn) {
	return bn.div('1000').toNumber() / 1000
}

function b(num) {
	return BigNumber.from(num)
}

function n(bn) {
	return bn.toNumber()
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
