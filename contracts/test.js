const Tx = require('ethereumjs-tx')
const Web3 = require('web3');
const web3 = new Web3('http://104.211.188.197:7545')

const government = '0x266652513c56Fabc34a7080Dd60c7357417cd6c0'

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, 'hex')

//console.log(privateKeyGovernment)
const data = '0x608060405234801561001057600080fd5b506108d5806100206000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633dbfd97c1461007d57806367b8f43b146100c2578063b1a867d51461012b578063b93f9b0a14610158578063e789af48146101c5578063fe47d8d514610281575b600080fd5b34801561008957600080fd5b506100a8600480360381019080803590602001909291905050506102ee565b604051808215151515815260200191505060405180910390f35b3480156100ce57600080fd5b50610129600480360381019080803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061042e565b005b34801561013757600080fd5b5061015660048036038101908080359060200190929190505050610550565b005b34801561016457600080fd5b50610183600480360381019080803590602001909291905050506106e5565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101d157600080fd5b50610206600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610721565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561024657808201518184015260208101905061022b565b50505050905090810190601f1680156102735780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561028d57600080fd5b506102ac600480360381019080803590602001909291905050506107d1565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60008073ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515156103c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f4163636f756e7420646f6573206e6f742065786973740000000000000000000081525060200191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16149050919050565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054600181600116156101000203166002900490501415156104f9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4b6579207061697220666f72207573657220616c72656164792065786973747381525060200191505060405180910390fd5b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020908051906020019061054c929190610804565b5050565b600073ffffffffffffffffffffffffffffffffffffffff1660008083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610626576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f416164686172204361726420616c72656164792065786973747300000000000081525060200191505060405180910390fd5b3360008083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507f8df1703981ec5eb9a5ed6a84742794cefdb8cea9703299b3f56e5314a13501163382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150565b600080600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60016020528060005260406000206000915090508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107c95780601f1061079e576101008083540402835291602001916107c9565b820191906000526020600020905b8154815290600101906020018083116107ac57829003601f168201915b505050505081565b60006020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061084557805160ff1916838001178555610873565b82800160010185558215610873579182015b82811115610872578251825591602001919060010190610857565b5b5090506108809190610884565b5090565b6108a691905b808211156108a257600081600090555060010161088a565b5090565b905600a165627a7a723058207a55a2244c30f3848000169ba708b346e6d198412d3f005e0665d5c7d7fbb31b0029'
//get the transaction count from account 1 as it is the sender
web3.eth.getTransactionCount(government, (err , txCount) => {
    //Transaction Object
    const txObject = {
        nonce : web3.utils.toHex(txCount),          //all paramters should be in Hex
        gasLimit : web3.utils.toHex(4700000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('0','gwei')),
        data : data
    }

//Sign a transaction
    const tx = new Tx(txObject)
    tx.sign(privateKeyGovernment)

    const serializedTransaction = tx.serialize()
    const raw = '0x' + serializedTransaction.toString('hex')

//Broadcast a transaction
    web3.eth.sendSignedTransaction(raw , (err , txHash) => {
        console.log('txHash : ' , txHash)
    })
})

//Using the deployed contract