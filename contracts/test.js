const Tx = require('ethereumjs-tx')
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8540')

const government = '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e'

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, 'hex')

//console.log(privateKeyGovernment)
const data = '0x608060405234801561001057600080fd5b50610ff6806100206000396000f300608060405260043610610083576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631a3cd59a146100885780632c4f5a171461016857806351d70bc4146101c5578063935a108d1461031157806396282ba3146103d4578063b93f9b0a1461043d578063ba99af70146104aa575b600080fd5b34801561009457600080fd5b506100b360048036038101908080359060200190929190505050610566565b60405180806020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828103825285818151815260200191508051906020019080838360005b8381101561012b578082015181840152602081019050610110565b50505050905090810190601f1680156101585780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561017457600080fd5b506101ab60048036038101908080359060200190929190803590602001908201803590602001919091929391929390505050610678565b604051808215151515815260200191505060405180910390f35b3480156101d157600080fd5b506101f0600480360381019080803590602001909291905050506108d9565b60405180806020018581526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001838103835287818151815260200191508051906020019080838360005b8381101561026c578082015181840152602081019050610251565b50505050905090810190601f1680156102995780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156102d25780820151818401526020810190506102b7565b50505050905090810190601f1680156102ff5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34801561031d57600080fd5b506103d260048036038101908080359060200190929190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610a59565b005b3480156103e057600080fd5b5061043b600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610d20565b005b34801561044957600080fd5b5061046860048036038101908080359060200190929190505050610d76565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104b657600080fd5b506104eb600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610db6565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561052b578082015181840152602081019050610510565b50505050905090810190601f1680156105585780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60606000806001600085815260200190815260200160002060000160016000868152602001908152602001600020600101546001600087815260200190815260200160002060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106645780601f1061063957610100808354040283529160200191610664565b820191906000526020600020905b81548152906001019060200180831161064757829003601f168201915b505050505092509250925092509193909250565b60008073ffffffffffffffffffffffffffffffffffffffff166001600086815260200190815260200160002060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610754576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f4163636f756e7420646f6573206e6f742065786973740000000000000000000081525060200191505060405180910390fd5b8282604051602001808383808284378201915050925050506040516020818303038152906040526040518082805190602001908083835b6020831015156107b0578051825260208201915060208101905060208303925061078b565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020600019166001600086815260200190815260200160002060030160405160200180828054600181600116156101000203166002900480156108555780601f10610833576101008083540402835291820191610855565b820191906000526020600020905b815481529060010190602001808311610841575b50509150506040516020818303038152906040526040518082805190602001908083835b60208310151561089e5780518252602082019150602081019050602083039250610879565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040518091039020600019161490509392505050565b6001602052806000526040600020600091509050806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109855780601f1061095a57610100808354040283529160200191610985565b820191906000526020600020905b81548152906001019060200180831161096857829003601f168201915b5050505050908060010154908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806003018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a4f5780601f10610a2457610100808354040283529160200191610a4f565b820191906000526020600020905b815481529060010190602001808311610a3257829003601f168201915b5050505050905084565b610a61610e66565b600073ffffffffffffffffffffffffffffffffffffffff166001600087815260200190815260200160002060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610b3b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601a8152602001807f416164686172204361726420616c72656164792065786973747300000000000081525060200191505060405180910390fd5b8381600001819052508281602001818152505033816040019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff168152505081816060018190525080600160008781526020019081526020016000206000820151816000019080519060200190610bbf929190610ea5565b506020820151816001015560408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506060820151816003019080519060200190610c2d929190610ea5565b509050507fedddd1e46a8352ac33053db63122c02ccd1e402ffa2fec9e0c8ad5d02798d587338260000151836020015188604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001848152602001838152602001828103825285818151815260200191508051906020019080838360005b83811015610cdc578082015181840152602081019050610cc1565b50505050905090810190601f168015610d095780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15050505050565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190610d72929190610f25565b5050565b60006001600083815260200190815260200160002060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006020528060005260406000206000915090508054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e5e5780601f10610e3357610100808354040283529160200191610e5e565b820191906000526020600020905b815481529060010190602001808311610e4157829003601f168201915b505050505081565b6080604051908101604052806060815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001606081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610ee657805160ff1916838001178555610f14565b82800160010185558215610f14579182015b82811115610f13578251825591602001919060010190610ef8565b5b509050610f219190610fa5565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610f6657805160ff1916838001178555610f94565b82800160010185558215610f94579182015b82811115610f93578251825591602001919060010190610f78565b5b509050610fa19190610fa5565b5090565b610fc791905b80821115610fc3576000816000905550600101610fab565b5090565b905600a165627a7a723058203715fe5f3b012e4d1a39a326e39573548c556e886d15fa4c9c976d33baddd5370029'
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