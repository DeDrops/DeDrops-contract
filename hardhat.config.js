require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
	const accounts = await ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {

		},
		kovan: {
			url: 'https://kovan.infura.io/v3/c7cd730e3f1e4f9a8c702c6cb9d17f3f',
			chainId: 42,
			from: process.env.ETH_ADDRESS_0,
			accounts: [
				process.env.ETH_PK_0,
				process.env.ETH_PK_1,
				process.env.ETH_PK_2
			]
		},
		okex_testnet: {
			url: 'https://exchaintestrpc.okex.org',
			chainId: 65,
			from: process.env.ETH_ADDRESS_0,
			accounts: [
				process.env.ETH_PK_0,
				process.env.ETH_PK_1,
				process.env.ETH_PK_2
			]
		},
		heco_testnet: {
			url: 'https://http-testnet.hecochain.com',
			chainId: 256,
			from: process.env.ETH_ADDRESS_0,
			accounts: [
				process.env.ETH_PK_0,
				process.env.ETH_PK_1,
				process.env.ETH_PK_2
			]
		},
		bsc_testnet: {
			url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
			chainId: 97,
			from: process.env.ETH_ADDRESS_0,
			accounts: [
				process.env.ETH_PK_0,
				process.env.ETH_PK_1,
				process.env.ETH_PK_2
			]
		},
		bsc_mainnet: {
			url: 'https://bsc-dataseed2.binance.org/',
			chainId: 56,
			from: process.env.ETH_ADDRESS_0,
			accounts: [
				process.env.ETH_PK_0,
				process.env.ETH_PK_1,
				process.env.ETH_PK_2
			]
		},
		matic_mainnet: {
			// url: 'https://rpc-mainnet.maticvigil.com/v1/6ca36da1323f40dc42d64ed9ba89da9a6f59c23d',
			url: 'https://rpc-mainnet.matic.network',
			chainId: 137,
			from: process.env.DEDROPS_SERVER,
			accounts: [
				process.env.DEDROPS_PK,
				process.env.ETH_PK_1,
				process.env.ETH_PK_2
			]
		}
	},
	// solidity: {
	// 	compilers: [
	// 		{
	// 		  version: "0.6.12",
	// 		}
	// 	  ]
	// }
	solidity: {
		version: "0.6.12",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	}
};