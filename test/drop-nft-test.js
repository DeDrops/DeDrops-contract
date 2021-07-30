const { expect, assert } = require('chai')
const { BigNumber, utils} = require('ethers')
const fs = require('fs')
const hre = require('hardhat')


describe('drop-nft-test', function () {
    let DOMAIN_SEPARATOR = ''
    let CLAIM_TYPEHASH = ''
    let PASSWORD_TYPEHASH = ''
    let accounts
	let nft
    let id = b(1)
	let bank
	let deadline
    let vrs
    let owner
    let spender
    let chainId

	before(async function () {
		accounts = await ethers.getSigners()
        
		console.log('account 0', accounts[0].address)
		console.log('account 1', accounts[1].address)
		console.log('account 2', accounts[2].address)
	})
	
	it('deploy', async function () {
		const Bank1155 = await ethers.getContractFactory('Bank1155')
		bank = await Bank1155.deploy()
		await bank.deployed()
        DOMAIN_SEPARATOR = await bank.DOMAIN_SEPARATOR()
        CLAIM_TYPEHASH = await bank.CLAIM_TYPEHASH()
        PASSWORD_TYPEHASH = await bank.PASSWORD_TYPEHASH()
		console.log('Bank1155 deployed to:', bank.address, 'DOMAIN_SEPARATOR:', DOMAIN_SEPARATOR, 'CLAIM_TYPEHASH:', CLAIM_TYPEHASH, 'PASSWORD_TYPEHASH:', PASSWORD_TYPEHASH)
		
		const NFT = await ethers.getContractFactory('DeDropsNFT')
		nft = await NFT.deploy(bank.address)
		await nft.deployed()
		console.log('DeDropsNFT deployed to:', nft.address)

        await nft.setApprovalForAll(bank.address, true)
        console.log('setApprovalForAll done')

        await nft.connect(accounts[1]).mint('1stNFT', 'ipfs://dedrops', b(100), '测试第一批NFT', '谁都可以来领')
        console.log('mint done')
        
        let info = await nft.idToNFT(b(1))
        console.log('id', n(info.id))
        console.log('name', info.name)
        console.log('url', info.url)
        console.log('amount', n(info.amount))
        console.log('info', info.info)
        console.log('info2', info.info2)

        await print()
	})

	it('sign claim', async function () {
        owner = accounts[0].address
        spender = accounts[1].address
        deadline = b(parseInt(Date.now() / 1000) + 86400)
        chainId = accounts[0].provider._network.chainId
    
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
                            [CLAIM_TYPEHASH, nft.address, id, owner, spender, deadline]
                        )
                    )
                ]
            )
        )
            
        let privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' //account0 pk
        let signingKey = new ethers.utils.SigningKey(privateKey)
        let sign = signingKey.signDigest(digest)
        vrs = utils.splitSignature(sign)
        console.log(vrs)
	})

    it('claim', async function () {
        await bank.connect(accounts[1]).claim(nft.address, id, owner, spender, deadline
            , vrs.v, vrs.r, vrs.s, {gasLimit:BigNumber.from('8000000')})
        console.log('claim')
        
        await print()
    })

    async function print() {
        console.log('')

        console.log('account0 nft1:', n(await nft.balanceOf(accounts[0].address, b(1))))
        console.log('account1 nft1:', n(await nft.balanceOf(accounts[1].address, b(1))))
        console.log('account2 nft1:', n(await nft.balanceOf(accounts[2].address, b(1))))
        console.log('bank nft1:', n(await nft.balanceOf(bank.address, b(1))))

        let amount = n(await bank.tokenUserBalance(nft.address, b(1), accounts[0].address))
	    console.log('account0  nft1 in bank:', amount)
        amount = n(await bank.tokenUserBalance(nft.address, b(1), accounts[1].address))
	    console.log('account1  nft1 in bank:', amount)

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