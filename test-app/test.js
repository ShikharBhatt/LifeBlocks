const Tx = require('ethereumjs-tx')
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545')

const government = '0x266652513c56Fabc34a7080Dd60c7357417cd6c0'

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, 'hex')

//console.log(privateKeyGovernment)
const data = '0x6080604052730d41f1ea976b3a7a9371ec2ce4a5aafdbfb1aa31600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156100c857600080fd5b50611077806100d86000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063344610671461007d578063473987051461022e578063477ee7071461032d5780634c58cd351461039a57806364b5a925146103f15780638f88708b146105a2575b600080fd5b34801561008957600080fd5b506100a860048036038101908080359060200190929190505050610624565b6040518080602001806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001848103845288818151815260200191508051906020019080838360005b83811015610122578082015181840152602081019050610107565b50505050905090810190601f16801561014f5780820380516001836020036101000a031916815260200191505b50848103835287818151815260200191508051906020019080838360005b8381101561018857808201518184015260208101905061016d565b50505050905090810190601f1680156101b55780820380516001836020036101000a031916815260200191505b50848103825285818151815260200191508051906020019080838360005b838110156101ee5780820151818401526020810190506101d3565b50505050905090810190601f16801561021b5780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b34801561023a57600080fd5b5061032b60048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919291929050505061084b565b005b34801561033957600080fd5b5061035860048036038101908080359060200190929190505050610acc565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103a657600080fd5b506103db600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610aff565b6040518082815260200191505060405180910390f35b3480156103fd57600080fd5b5061041c60048036038101908080359060200190929190505050610b17565b6040518080602001806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001848103845288818151815260200191508051906020019080838360005b8381101561049657808201518184015260208101905061047b565b50505050905090810190601f1680156104c35780820380516001836020036101000a031916815260200191505b50848103835287818151815260200191508051906020019080838360005b838110156104fc5780820151818401526020810190506104e1565b50505050905090810190601f1680156105295780820380516001836020036101000a031916815260200191505b50848103825285818151815260200191508051906020019080838360005b83811015610562578082015181840152602081019050610547565b50505050905090810190601f16801561058f5780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b3480156105ae57600080fd5b506105cd60048036038101908080359060200190929190505050610da2565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156106105780820151818401526020810190506105f5565b505050509050019250505060405180910390f35b60008181548110151561063357fe5b9060005260206000209060040201600091509050806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106df5780601f106106b4576101008083540402835291602001916106df565b820191906000526020600020905b8154815290600101906020018083116106c257829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561077d5780601f106107525761010080835404028352916020019161077d565b820191906000526020600020905b81548152906001019060200180831161076057829003601f168201915b5050505050908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806003018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108415780601f1061081657610100808354040283529160200191610841565b820191906000526020600020905b81548152906001019060200180831161082457829003601f168201915b5050505050905084565b600080600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a876040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1580156108df57600080fd5b505af11580156108f3573d6000803e3d6000fd5b505050506040513d602081101561090957600080fd5b8101908080519060200190929190505050915060006080604051908101604052808781526020018681526020013373ffffffffffffffffffffffffffffffffffffffff1681526020018581525090806001815401808255809150509060018203906000526020600020906004020160009091929091909150600082015181600001908051906020019061099d929190610fa6565b5060208201518160010190805190602001906109ba929190610fa6565b5060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506060820151816003019080519060200190610a1e929190610fa6565b5050509050816001600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008154809291906001019190505550505050505050565b60016020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026020528060005260406000206000915090505481565b60608060006060600085815481101515610b2d57fe5b9060005260206000209060040201600001600086815481101515610b4d57fe5b9060005260206000209060040201600101600087815481101515610b6d57fe5b906000526020600020906004020160020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600088815481101515610bae57fe5b9060005260206000209060040201600301838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c545780601f10610c2957610100808354040283529160200191610c54565b820191906000526020600020905b815481529060010190602001808311610c3757829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610cf05780601f10610cc557610100808354040283529160200191610cf0565b820191906000526020600020905b815481529060010190602001808311610cd357829003601f168201915b50505050509250808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d8c5780601f10610d6157610100808354040283529160200191610d8c565b820191906000526020600020905b815481529060010190602001808311610d6f57829003601f168201915b5050505050905093509350935093509193509193565b606060008060606000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a876040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b158015610e3c57600080fd5b505af1158015610e50573d6000803e3d6000fd5b505050506040513d6020811015610e6657600080fd5b8101908080519060200190929190505050935060009250600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051908082528060200260200182016040528015610eeb5781602001602082028038833980820191505090505b509150600090505b600080549050811015610f9a578373ffffffffffffffffffffffffffffffffffffffff166001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610f8d57808284815181101515610f7657fe5b906020019060200201818152505082806001019350505b8080600101915050610ef3565b81945050505050919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610fe757805160ff1916838001178555611015565b82800160010185558215611015579182015b82811115611014578251825591602001919060010190610ff9565b5b5090506110229190611026565b5090565b61104891905b8082111561104457600081600090555060010161102c565b5090565b905600a165627a7a7230582062d7b58227e11f441ffa74ca778774a090e9e346cb28d93e361d260050082b9d0029'
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