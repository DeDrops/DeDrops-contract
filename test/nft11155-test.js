const { expect, assert } = require('chai')
const { BigNumber, utils} = require('ethers')
const fs = require('fs')
const hre = require('hardhat')


describe('nft1155-test', function () {
    let accounts
    let nft1155

	before(async function () {
		accounts = await ethers.getSigners()
        
		console.log('account 0', accounts[0].address)
		console.log('account 1', accounts[1].address)
		console.log('account 2', accounts[2].address)
	})
	
	it('deploy', async function () {
		const TestNFT1155 = await ethers.getContractFactory('TestNFT1155')
		nft1155 = await TestNFT1155.deploy()
		await nft1155.deployed()
		console.log('TestNFT1155 deployed to:', nft1155.address)
	})

    it('mint', async function () {
		let tokenJSON = 
        {
            "name": "自定义螺蛳粉1155",
            "description": "螺蛳粉就是好吃1155",
            "image": "https://lh3.googleusercontent.com/voMBqwRcDV8Pfqf56-fkrFO85sRfKWz8yxQSRM93wyivv88a7rl__79s3_g94GtG8XYZju29CftFm0mpMU8mYfZ7MQjJKWlyJ9j0zw=w600",
            "attributes": ""
        }

		let str = JSON.stringify(tokenJSON)
		console.log(str)

        await nft1155.mint(accounts[1].address, b(1), b(99), str)
        console.log('mint done')

        await print()
    })

    async function print() {
        console.log('')

        console.log('balanceOf', n(await nft1155.balanceOf(accounts[1].address, b(1))))
        console.log('creator', await nft1155.creators(b(1)))
        console.log('tokenSupply', n(await nft1155.tokenSupply(b(1))))
        console.log('uri', await nft1155.uri(b(1)))

        console.log('')
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
})