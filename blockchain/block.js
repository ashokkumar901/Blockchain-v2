const hexToBinary = require('hex-to-binary');
const { GENESIS_BLOCK, MINE_RATE } = require("../config");
const { cryptoHash } = require('../util');

class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }
    static genesis() {
        return new this(GENESIS_BLOCK);
    }
    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce)
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this({ timestamp, lastHash, data, hash: hash, difficulty, nonce });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1;
        if (difficulty < 1) return 1;
        return difficulty + 1;
    }
}

module.exports = Block;