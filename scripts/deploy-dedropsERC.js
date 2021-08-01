const hre = require('hardhat')
const fs = require('fs')
const { BigNumber, utils } = require('ethers')


//matic
var tokenAddress = '0x9D8c588A1fddF2575266bEf1a6a479eA46faBdd9'
var bankAddress = '0x13d6f4529c2a003f14cde0a356cee66637cd739a'
var DOMAIN_SEPARATOR = '0x3b4ce86ee8d7aab11e1f2deedfa185c8268cc4b1061ee70f69e020328fff4ac1'
var CLAIM_TYPEHASH = '0xa05335bcb0b0413b06aebf7578cda47f15e56bda72a634ee823fc1ef42ec1994'
var PASSWORD_TYPEHASH = '0x3dce4743a9c307489689d5a78849d8466d3d3fa3806e2e97961cead248e9a34b'
var dedropsAddress = '0x793102D329aAaC0BC990DEABD68Af5a422C53Ef7'


async function main() {
    const accounts = await hre.ethers.getSigners()

    // const Bank20 = await ethers.getContractFactory('Bank20')
    // let bank = await Bank20.deploy()
    // await bank.deployed()
    // DOMAIN_SEPARATOR = await bank.DOMAIN_SEPARATOR()
    // CLAIM_TYPEHASH = await bank.CLAIM_TYPEHASH()
    // PASSWORD_TYPEHASH = await bank.PASSWORD_TYPEHASH()
    // console.log('Claim deployed to:', bank.address, 'DOMAIN_SEPARATOR:', DOMAIN_SEPARATOR, 'CLAIM_TYPEHASH:', CLAIM_TYPEHASH, 'PASSWORD_TYPEHASH:', PASSWORD_TYPEHASH)

    // const DeDropsERC = await ethers.getContractFactory('DeDropsERC')
    // let dedrops = await DeDropsERC.deploy(bankAddress)
    // await dedrops.deployed()
    // console.log('DeDropsERC deployed to:', dedrops.address)

    // const ERC = await ethers.getContractFactory('MockERC20')
	// let erc = await ERC.deploy('TEST', m(100000000), 18)
	// await erc.deployed()
	// console.log('ERC deployed to:', erc.address)

    const tokenAbi = getAbi('./artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json')
    let token = new ethers.Contract('0xc0F7cDd3d57F68f828ccdBA8D356B12836f771E8', tokenAbi, accounts[0])
    
    await token.transfer('0x37f88413AADb13d85030EEdC7600e31573BCa3c3', m(100000000), {gasLimit:BigNumber.from('8000000')})
	console.log('transfer done')
}


async function drop() {
    const accounts = await hre.ethers.getSigners()

    const tokenAbi = getAbi('./artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json')
    let token = new ethers.Contract(tokenAddress, tokenAbi, accounts[0])

	const dedropsAbi = getAbi('./artifacts/contracts/DeDropsERC.sol/DeDropsERC.json')
    let dedrops = new ethers.Contract(dedropsAddress, dedropsAbi, accounts[0])

    await token.connect(accounts[1]).approve(dedrops.address, b(100))
    console.log('approve done')

    await dedrops.connect(accounts[1]).drop(token.address, b(100), '测试空投', '测试的空投，有问题联系DeDrops.xyz', {gasLimit:BigNumber.from('8000000')})
    console.log('drop done')
}


async function view() {
    const accounts = await hre.ethers.getSigners()

    const tokenAbi = getAbi('./artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json')
    let token = new ethers.Contract(tokenAddress, tokenAbi, accounts[0])

    const dedropsAbi = getAbi('./artifacts/contracts/DeDropsERC.sol/DeDropsERC.json')
    let dedrops = new ethers.Contract(dedropsAddress, dedropsAbi, accounts[0])

    const bankAbi = getAbi('./artifacts/contracts/Bank20.sol/Bank20.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[0])

    let item = await dedrops.idToItem(b(3))
    console.log('id', n(item.id))
    console.log('token', item.token)
    console.log('amount', s(item.amount))
    console.log('info', item.info)
    console.log('info2', item.info2)

    console.log('bank balance:', s(await token.balanceOf(bank.address)))

    let amount = s(await bank.tokenUserBalance(tokenAddress, accounts[0].address))
    console.log('account0 balance in bank:', amount)
}


async function signAndClaim() {
	const accounts = await hre.ethers.getSigners()

	const dedropsAbi = getAbi('./artifacts/contracts/DeDropsERC.sol/DeDropsERC.json')
    let dedrops = new ethers.Contract(dedropsAddress, dedropsAbi, accounts[0])

	const bankAbi = getAbi('./artifacts/contracts/Bank20.sol/Bank20.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[0])

    let token = "0x9D8c588A1fddF2575266bEf1a6a479eA46faBdd9"
	let owner = accounts[0].address
	// let spender = accounts[1].address
	let spender = '0x37f88413AADb13d85030EEdC7600e31573BCa3c3'
	let deadline = b(parseInt(Date.now() / 1000) + 86400)
	let value = b(1)

	let digest = utils.keccak256(
        utils.solidityPack(
            ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
            [
                '0x19',
                '0x01',
                DOMAIN_SEPARATOR,
                utils.keccak256(
                    utils.defaultAbiCoder.encode(
                        ['bytes32', 'address', 'address', 'address', 'uint256', 'uint256'],
                        [CLAIM_TYPEHASH, token, owner, spender, value, deadline]
                    )
                )
            ]
        )
    )
		
	let privateKey = '0x' + process.env.DEDROPS_PK;
	let signingKey = new ethers.utils.SigningKey(privateKey)
	let sign = signingKey.signDigest(digest)
	vrs = utils.splitSignature(sign)
	console.log(n(deadline), vrs, digest)

	// await bank.connect(accounts[1]).claim(dedrops.address, owner, spender, value, deadline
	// 	, vrs.v, vrs.r, vrs.s, {gasLimit:BigNumber.from('8000000')})
	// console.log('claim done')
}


async function claim() {
	const accounts = await hre.ethers.getSigners()

	const bankAbi = getAbi('./artifacts/contracts/Bank20.sol/Bank20.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[1])

	let token = "0x9D8c588A1fddF2575266bEf1a6a479eA46faBdd9"
	let owner = "0xFa7577a6198aA77A2F443091D85E6DB5b16bE7a7"
	let spender = "0x37f88413AADb13d85030EEdC7600e31573BCa3c3"
	let value = b("2000")
	let deadline = b(1627764595688)
	let v = 27
	let s = "0x7789e02af57abd8512b2ed297dd3bb93e586e2c8c444d31861034c68b58e27b4"
	let r = "0x262b842be28ca3aaa3de112722f58c90aa9305f7f51dc1a1edde3f4e20c402f8"

	await bank.connect(accounts[1]).claim(token, owner, spender, value, deadline, v, r, s, {gasLimit:BigNumber.from('8000000')})
    console.log('claim')

    // console.log('is claim?', digest, await bank.nonces(digest))
}


function getAbi(jsonPath) {
    let file = fs.readFileSync(jsonPath)
    let abi = JSON.parse(file.toString()).abi
    return abi
}

function m(num) {
    return BigNumber.from('1000000000000000000').mul(num)
}

function d(bn) {
    return bn.div('1000000000000000').toNumber() / 1000
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

signAndClaim()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
