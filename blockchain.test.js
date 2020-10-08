const Blockchain = require('./blockchain');
const Block = require('./block');

describe('blockchain()', () => {
    let blockchain, newChain, originalChain;
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
    });
    it('checks if the chain is an instance of an array', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('checks if the first block is the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds the block the to the blockchain', () => {
        const newData = 'new data';
        blockchain.addBlock({ data: newData });
        const chain = blockchain.chain;
        expect(chain[chain.length - 1].data)
            .toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('Chain does not start with the genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'fake-data' };
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        describe('Chain starts with the genesis block and has multiple blocks', () => {
            beforeEach(() => {
                blockchain.addBlock({ data: 'data1' });
                blockchain.addBlock({ data: 'data2' });
                blockchain.addBlock({ data: 'data3' });
            });
            describe('and a lasthash referenced has been changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'broken-lastHash';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('and a block with an invalid field exists', () => {
                it('returns false', () => {
                    blockchain.chain[2].data = 'broken-data';
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });
            describe('and a chain with no invalid blocks', () => {
                it('returns true', () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
    describe('replaceChain()', () => {
        let errorMock, logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();
            global.console.error = errorMock;
            global.console.log = logMock;
        });
        describe('When the new chain is not longer', () => {
            beforeEach(() => {
                newChain.chain[0]['new'] = 'chain';
                blockchain.replaceChain(newChain.chain);
            });
            it('does not replace the chain', () => {
                expect(blockchain.chain).toEqual(originalChain);
            });
            it('logs the error', () => {
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('When the new chain is longer', () => {
            beforeEach(() => {
                newChain.addBlock({ data: 'data1' });
                newChain.addBlock({ data: 'data2' });
                newChain.addBlock({ data: 'data3' });
            });

            describe('and the chain is invalid', () => {
                beforeEach(() => {
                    newChain.chain[2].hash = 'fake-hash';
                    blockchain.replaceChain(newChain.chain);
                });
                it('does not replace the chain', () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it('logs the error', () => {
                    expect(errorMock).toHaveBeenCalled();
                });
            });
            describe('and the chain is valid', () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                it('replaces the chain', () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
                it('logs about the chain being replaced', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });

        });
    });
});