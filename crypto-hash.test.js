const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
    it('generates the hash in sha-256 format', () => {
        expect(cryptoHash('foo'))
            .toEqual('2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae');
    });

    it('generates the hash for inputs in any order', () => {
        expect(cryptoHash('one', 'two', 'three'))
            .toEqual(cryptoHash('three', 'two', 'one'));
    });
});