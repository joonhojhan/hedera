require('dotenv').config();

const { Client, MirrorClient, MirrorConsensusTopicQuery, ConsensusTopicCreateTransaction, ConsensusMessageSubmitTransaction } = require('@hashgraph/sdk');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

	// Configure Client
	const myClient = Client.forTestnet();
	myClient.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

	// Create new Consensus Topic Transaction and configure with Client
	const transactionId = await new ConsensusTopicCreateTransaction().execute(myClient);
	// Get transaction receipt
	const transactionReceipt = await transactionId.getReceipt(myClient);
	// Get topic id
	const topicId = transactionReceipt.getConsensusTopicId();

	console.log('topic id =', topicId);

	await sleep(5000);

	// Subscribe
	// Create Client Mirror Node
	const myMirrorClient = new MirrorClient('api.testnet.kabuto.sh:50211');

	// Subscribe to topics using topic id and Mirror Node
	new MirrorConsensusTopicQuery()
		.setTopicId(topicId)
		.subscribe(
			myMirrorClient,
			(message) => console.log(message.toString()),
			(error) => console.log(`Error: ${error}`)
		);

	// Publish
	for (let i = 0; i < 10; i++) {
		// Submit Consensus Message Transaction by setting topic id, message, and executing on Client
		const hcsMessage = await new ConsensusMessageSubmitTransaction().setTopicId(topicId).setMessage(`Hello, HCS! From message ${i}.`).execute(myClient);

		// Get receipt of submitted consensus message transaction
		const hcsMessageReceipt = await hcsMessage.getReceipt(myClient);

		console.log(`Sent message ${i}: ${hcsMessageReceipt.toString()}`);
	}

}

main();
