const Block = require("./block");
const { GENESIS_BLOCK, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'a-lastHash';
    const hash = 'a-hash';
    const data = ['Blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

    it('tests the block if it has all the properties', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        console.log('genesis block', genesisBlock);
        it('returns a block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });
        it('returns a genesis block', () => {
            expect(genesisBlock).toEqual(GENESIS_BLOCK);
        });
    });


    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data });
        it('returns a block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });
        it('sets the `lastHash` to be `hash` of the previous block', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        it('Checks the timestamp', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });
        it('checks the data', () => {
            expect(minedBlock.data).toEqual(data);
        });
        it('generates the sha-256 `hash` given proper inputs', () => {
            expect(minedBlock.hash)
                .toEqual
                (cryptoHash(
                    minedBlock.timestamp,
                    lastBlock.hash, data,
                    minedBlock.nonce,
                    minedBlock.difficulty
                )
                );
        });
        it('sets the `hash` that matches the difficulty criteria', () => {
            expect(minedBlock.hash.substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        })
    });

    describe('adjustDifficulty()', () => {
        it('raises the difficulty for quickly mined block', () => {
            expect(Block.adjustDifficulty(
                { originalBlock: block, timestamp: timestamp + MINE_RATE - 100 }))
                .toEqual(block.difficulty + 1);
        });

        it('lowers the difficulty for slowly mined block', () => {
            expect(Block.adjustDifficulty(
                { originalBlock: block, timestamp: timestamp + MINE_RATE + 100 }))
                .toEqual(block.difficulty - 1);
        });

    });

});


