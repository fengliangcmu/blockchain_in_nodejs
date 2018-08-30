const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulity){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulity = difficulity || DIFFICULTY;  //for the first difficulity.
    }

    toString(){
        return `Block - 
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0,10)}
            Hash     : ${this.hash.substring(0,10)}
            Nonce    : ${this.nonce}
            Difficulity    : ${this.difficulity}
            Data     : ${this.data}
            
        `;
    }

    static genesis(){
        return new this('Genesis time','_____', 'dea_2genesis', [], 0);
    }

    static mineBlock(lastBlock, data){
        const lastHash = lastBlock.hash;
        let {difficulity} = lastBlock;
        let nonce = 0;
        let hash, timestamp;
        do{
            nonce++;
            timestamp = Date.now();
            difficulity = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulity);
        } while(hash.substring(0, difficulity) !== '0'.repeat(difficulity));

        return new this(timestamp, lastHash, hash, data, nonce, difficulity);

    }

    static hash(timestamp, lastHash, data, nonce, difficulity){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulity}`).toString();
    }

    static blockHash(block){
        const {timestamp, lastHash, data, nonce, difficulity} = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulity);
    }

    static adjustDifficulty(lastBlock, currentTime){
        let{ difficulity } = lastBlock;
        difficulity = lastBlock.timestamp + MINE_RATE > currentTime ? difficulity + 1 : difficulity -1;
        return difficulity;
    }

}
module.exports = Block;