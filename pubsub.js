const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-5d56191a-2f86-468c-b26e-08c582637c87',
    subscribeKey: 'sub-c-cd872d12-0ebb-11eb-ae19-92aa6521e721',
    secretKey: 'sec-c-NWZhNGQ4OWYtYThlNS00YjhlLWE5NDUtZWZhYWZlYzIzMjE3'
};

const CHANNELS = {
    TEST: 'TEST'
};

class PubSub {
    constructor() {
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });
        this.pubnub.addListener(this.listener());
    }

    listener() {
        return {
            message: messageObject => {
                const { channel, message } = messageObject;
                console.log(`Message received. Channel: ${channel}. Message :${message}`)
            }
        }
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    }
}

const testPubSub = new PubSub();
testPubSub.publish({ channel: CHANNELS.TEST, message: 'hello pubnub' });

module.exports = PubSub;