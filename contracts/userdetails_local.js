const Tx = require('ethereumjs-tx')
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545')

const government = '0x5578Ec2cb3994BC87823802071241726EBC40FDF'

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, 'hex')

//console.log(privateKeyGovernment)
const data = '0x608060405234801561001057600080fd5b50610aea806100206000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633dbfd97c1461007d578063598ee2c2146100c257806378bf1b2a1461012f5780638cad7d1b146101a2578063b93f9b0a146101f9578063e789af4814610266575b600080fd5b34801561008957600080fd5b506100a860048036038101908080359060200190929190505050610322565b604051808215151515815260200191505060405180910390f35b3480156100ce57600080fd5b506100ed60048036038101908080359060200190929190505050610462565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561013b57600080fd5b506101a060048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610495565b005b3480156101ae57600080fd5b506101e3600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610915565b6040518082815260200191505060405180910390f35b34801561020557600080fd5b506102246004803603810190808035906020019092919050505061092d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561027257600080fd5b506102a7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610969565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102e75780820151818401526020810190506102cc565b50505050905090810190601f1680156103145780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60008073ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515156103fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f4163636f756e7420646f6573206e6f742065786973740000000000000000000081525060200191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16149050919050565b60006020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600073ffffffffffffffffffffffffffffffffffffffff1660008084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561056b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f416164686172204361726420616c72656164792065786973747300000000000081525060200191505060405180910390fd5b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054141515610622576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f4164647265737320616c7265616479207573656400000000000000000000000081525060200191505060405180910390fd5b6000600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054600181600116156101000203166002900490501415156106ed576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260208152602001807f4b6579207061697220666f72207573657220616c72656164792065786973747381525060200191505060405180910390fd5b3360008084815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055507f8df1703981ec5eb9a5ed6a84742794cefdb8cea9703299b3f56e5314a13501163383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a180600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190610840929190610a19565b507f11b75c77887611dade722ce3543f16551fb4d4ad3a2916642b7e7c8fad9a7fa33382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b838110156108d65780820151818401526020810190506108bb565b50505050905090810190601f1680156109035780820380516001836020036101000a031916815260200191505b50935050505060405180910390a15050565b60016020528060005260406000206000915090505481565b600080600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60026020528060005260406000206000915090508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a115780601f106109e657610100808354040283529160200191610a11565b820191906000526020600020905b8154815290600101906020018083116109f457829003601f168201915b505050505081565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610a5a57805160ff1916838001178555610a88565b82800160010185558215610a88579182015b82811115610a87578251825591602001919060010190610a6c565b5b509050610a959190610a99565b5090565b610abb91905b80821115610ab7576000816000905550600101610a9f565b5090565b905600a165627a7a7230582037cb2ed8a83aeb4a64d4a0411854a965a014ef2df8b894c6d5534c308fb3bde60029'
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
