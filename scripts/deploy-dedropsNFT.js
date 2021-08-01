const hre = require('hardhat')
const fs = require('fs')
const { BigNumber, utils } = require('ethers')


//matic
var bankAddress = '0x9e5f0d1028007DEB7432AF0cF3787B804207A68b'
var DOMAIN_SEPARATOR = '0xe63847ae1a10cb5676eb4d63bf3205a1a80c2a6f51889434c197583343aaefb0'
var CLAIM_TYPEHASH = '0x242444289e23ce6db820d71eb5a872b74ab417877a6bc4b88ff9c0c982f42aa8'
var PASSWORD_TYPEHASH = '0xe1a52c71772aeec2cad9cac0dbd56513ea655223347c5201ca618b6d314300ec'
var dedropsAddress = '0x72C62fA08b0209e49048C00c896100684e19e887'


async function main() {
	const accounts = await hre.ethers.getSigners()

	const Bank1155 = await ethers.getContractFactory('Bank1155')
	let bank = await Bank1155.deploy()
	await bank.deployed()
	DOMAIN_SEPARATOR = await bank.DOMAIN_SEPARATOR()
	CLAIM_TYPEHASH = await bank.CLAIM_TYPEHASH()
	PASSWORD_TYPEHASH = await bank.PASSWORD_TYPEHASH()
	console.log('Bank1155 deployed to:', bank.address, 'DOMAIN_SEPARATOR:', DOMAIN_SEPARATOR, 'CLAIM_TYPEHASH:', CLAIM_TYPEHASH, 'PASSWORD_TYPEHASH:', PASSWORD_TYPEHASH)
	
	const DeDropsNFT = await ethers.getContractFactory('DeDropsNFT')
	let dedrops = await DeDropsNFT.deploy(bank.address)
	await dedrops.deployed()
	console.log('DeDropsNFT deployed to:', dedrops.address)
}


async function mint() {
	const accounts = await hre.ethers.getSigners()

	const dedropsAbi = getAbi('./artifacts/contracts/DeDropsNFT.sol/DeDropsNFT.json')
    let dedrops = new ethers.Contract(dedropsAddress, dedropsAbi, accounts[0])

	await dedrops.connect(accounts[1]).mint(b(100), '测试第一批NFT', '谁都可以来领')
	console.log('mint done')
}


async function view() {
	const accounts = await hre.ethers.getSigners()

	const dedropsAbi = getAbi('./artifacts/contracts/DeDropsNFT.sol/DeDropsNFT.json')
    let dedrops = new ethers.Contract(dedropsAddress, dedropsAbi, accounts[1])

	const bankAbi = getAbi('./artifacts/contracts/Bank1155.sol/Bank1155.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[1])

	let id = b(1)

	// let item = await dedrops.idToItem(id)
	// console.log('id', n(item.id))
	// console.log('amount', n(item.amount))
	// console.log('info', item.info)
	// console.log('info2', item.info2)

	// console.log('bank nft:', n(await dedrops.balanceOf(bank.address, id)))
	// console.log('account nft:', n(await dedrops.balanceOf('0x37f88413AADb13d85030EEdC7600e31573BCa3c3', id)))

	// let amount = n(await bank.tokenUserBalance(dedropsAddress, id, accounts[0].address))
	// console.log('nft amount:', amount)

	let digest = '0x3275d8d1ac8a3ec0126ea87d44a6b07622435271bd84662c8cfbf4e9dcee18c0'
	console.log('is claim?', digest, await bank.nonces(digest))
}


async function signAndClaim() {
	const accounts = await hre.ethers.getSigners()

	const dedropsAbi = getAbi('./artifacts/contracts/DeDropsNFT.sol/DeDropsNFT.json')
    let dedrops = new ethers.Contract(dedropsAddress, dedropsAbi, accounts[0])

	const bankAbi = getAbi('./artifacts/contracts/Bank1155.sol/Bank1155.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[0])

	let owner = accounts[0].address
	// let spender = accounts[1].address
	let spender = '0x37f88413AADb13d85030EEdC7600e31573BCa3c3'
	let deadline = b(parseInt(Date.now() / 1000) + 86400)
	let id = b(1)

	let digest = utils.keccak256(
		utils.solidityPack(
			['bytes1', 'bytes1', 'bytes32', 'bytes32'],
			[
				'0x19',
				'0x01',
				DOMAIN_SEPARATOR,
				utils.keccak256(
					utils.defaultAbiCoder.encode(
						['bytes32', 'address', 'uint256', 'address', 'address', 'uint256'],
						[CLAIM_TYPEHASH, dedrops.address, id, owner, spender, deadline]
					)
				)
			]
		)
	)
		
	let privateKey = '0x' + process.env.DEDROPS_PK;
	let signingKey = new ethers.utils.SigningKey(privateKey)
	let sign = signingKey.signDigest(digest)
	vrs = utils.splitSignature(sign)
	console.log(vrs)

	await bank.connect(accounts[1]).claim(dedrops.address, id, owner, spender, deadline
		, vrs.v, vrs.r, vrs.s, {gasLimit:BigNumber.from('8000000')})
	console.log('claim done')
}


async function claim() {
	const accounts = await hre.ethers.getSigners()

	const bankAbi = getAbi('./artifacts/contracts/Bank1155.sol/Bank1155.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[1])

	let token = "0x72C62fA08b0209e49048C00c896100684e19e887"
	let id = b("1")
	let owner = "0xFa7577a6198aA77A2F443091D85E6DB5b16bE7a7"
	let spender = "0x37f88413AADb13d85030EEdC7600e31573BCa3c3"
	let deadline = b(1627760115102)
	let v = 28
	let s = "0x07d2992e7dd31c8eeebb03dc4f850cd1be251e3b6ac3eac23c2e5bf95773f96a"
	let r = "0xbbf646fa429ecb9898b3bf4a8fbdc05b7c28a8d919b4c26316efd74d23f76041"

	await bank.claim(token, id, owner, spender, deadline , v, r, s, {gasLimit:BigNumber.from('8000000')})
	console.log('claim done')

	// console.log('is claim?', digest, await bank.nonces(digest))
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
