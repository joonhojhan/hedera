require('dotenv').config();

const { Client, CryptoTransferTransaction } = require('@hashgraph/sdk');

async function transferHbar() {

	// Define Client connection to Hedera test network
	const myClient = Client.forTestnet();
	myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

	const transactionId = await new CryptoTransferTransaction().addSender(process.env.ACCOUNT_ID, 100).addRecipient('0.0.3', 100).execute(myClient);

}
