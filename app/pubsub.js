const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-5d56191a-2f86-468c-b26e-08c582637c87',
    subscribeKey: 'sub-c-cd872d12-0ebb-11eb-ae19-92aa6521e721',
    secretKey: 'sec-c-NWZhNGQ4OWYtYThlNS00YjhlLWE5NDUtZWZhYWZlYzIzMjE3'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        this.pubnub = new PubNub(credentials);
        this.subscribeToChannels();

        this.pubnub.addListener(this.listener());
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: [Object.values(CHANNELS)]
        });
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message :${message}`);

                const parseMesssage = JSON.parse(message);

                switch (channel) {
                    case CHANNELS.BLOCKCHAIN:
                        this.blockchain.replaceChain(parseMesssage);
                        break;
                    case CHANNELS.TRANSACTION:
                        if (!this.transactionPool.existingTransaction({
                            inputAddress: this.wallet.publicKey
                        })) {
                            this.transactionPool.setTransaction(parseMesssage);
                        }
                        break;
                    default:
                        return;
                }

            }
        }
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;