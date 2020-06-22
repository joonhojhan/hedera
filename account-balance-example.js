const { AccountBalanceQuery } = require('@hashgraph/sdk');
const HederaClient = require('./hedera-client');

async function getBalance() {
	const balance = await new AccountBalanceQuery().setAccountId('0.0.1249').execute(HederaClient);

	console.log(`${HederaClient._operatorAccount} balance = ${balance.value()}`);
};

getBalance();
