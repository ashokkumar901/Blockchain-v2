const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_BLOCK = {
    timestamp: 1,
    lastHash: '----',
    hash: 'hash',
    data: [],
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0
}

const STARTING_BALANCE = 1000;

module.exports = { GENESIS_BLOCK, MINE_RATE, STARTING_BALANCE };