const hre = require('hardhat')
const fs = require('fs')
const { BigNumber, utils } = require('ethers')


//matic
var tokenAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
var bankAddress = '0x13d6f4529c2a003f14cde0a356cee66637cd739a'
var DOMAIN_SEPARATOR = '0x3b4ce86ee8d7aab11e1f2deedfa185c8268cc4b1061ee70f69e020328fff4ac1'
var CLAIM_TYPEHASH = '0xa05335bcb0b0413b06aebf7578cda47f15e56bda72a634ee823fc1ef42ec1994'
var PASSWORD_TYPEHASH = '0x3dce4743a9c307489689d5a78849d8466d3d3fa3806e2e97961cead248e9a34b'
var dropAddress = '0x89071e124A10C0C91e87Ba6Fb17CBDA468DC1340'


async function main() {
    const accounts = await hre.ethers.getSigners()

    // const Bank20 = await ethers.getContractFactory('Bank20')
    // let bank = await Bank20.deploy()
    // await bank.deployed()
    // DOMAIN_SEPARATOR = await bank.DOMAIN_SEPARATOR()
    // CLAIM_TYPEHASH = await bank.CLAIM_TYPEHASH()
    // PASSWORD_TYPEHASH = await bank.PASSWORD_TYPEHASH()
    // console.log('Claim deployed to:', bank.address, 'DOMAIN_SEPARATOR:', DOMAIN_SEPARATOR, 'CLAIM_TYPEHASH:', CLAIM_TYPEHASH, 'PASSWORD_TYPEHASH:', PASSWORD_TYPEHASH)

    const DeDropsERC = await ethers.getContractFactory('DeDropsERC')
    let drop = await DeDropsERC.deploy(bankAddress)
    await drop.deployed()
    console.log('DeDropsERC deployed to:', drop.address)
}


async function drop() {
    const accounts = await hre.ethers.getSigners()

    const tokenAbi = getAbi('./artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json')
    let token = new ethers.Contract(tokenAddress, tokenAbi, accounts[0])

	const dropAbi = getAbi('./artifacts/contracts/badland/DeDropsERC.sol/DeDropsERC.json')
    let drop = new ethers.Contract(dropAddress, dropAbi, accounts[0])

    // await token.connect(accounts[1]).approve(drop.address, b(100))
    // console.log('approve done')

    let startTime = b(parseInt(Date.now() / 1000))
    let endTime = startTime.add(86400)
    await drop.connect(accounts[1]).drop(token.address, b(100), '测试空投', startTime
        , endTime, b(100), '测试的空投，有问题联系DeDrops.xyz', {gasLimit:BigNumber.from('8000000')})
    console.log('drop done')
}


async function view() {
    const accounts = await hre.ethers.getSigners()

    const tokenAbi = getAbi('./artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json')
    let token = new ethers.Contract(tokenAddress, tokenAbi, accounts[0])

    const dropAbi = getAbi('./artifacts/contracts/badland/DeDropsERC.sol/DeDropsERC.json')
    let drop = new ethers.Contract(dropAddress, dropAbi, accounts[0])

    const bankAbi = getAbi('./artifacts/contracts/badland/Bank20.sol/Bank20.json')
    let bank = new ethers.Contract(bankAddress, bankAbi, accounts[0])

    let info = await drop.idToDrop(b(1))
    console.log('id', n(info.id))
    console.log('token', info.token)
    console.log('amount', n(info.amount))
    console.log('title', info.title)
    console.log('startTime', n(info.startTime))
    console.log('endTime', n(info.endTime))
    console.log('claimNum', n(info.claimNum))
    console.log('info', info.info)

    console.log('bank balance:', n(await token.balanceOf(bank.address)))

    let amount = n(await bank.tokenUserBalance(tokenAddress, accounts[0].address))
    console.log('account0 balance in bank:', amount)
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
