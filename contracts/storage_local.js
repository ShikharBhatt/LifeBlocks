
const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const government = "0x5578Ec2cb3994BC87823802071241726EBC40FDF";

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, "hex");

//console.log(privateKeyGovernment)
const data = '0x60806040527378478e7666bcb38b2ddeddfe7cb0ba152301df07600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073f5e9037a2412db50c74d5a1642d6d3b99dd90f20600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561018057600080fd5b506115dd806101906000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063344610671461007d578063477ee707146102da5780634c58cd351461034757806364b5a9251461039e5780638f88708b146105fb578063de06b9941461067d575b600080fd5b34801561008957600080fd5b506100a8600480360381019080803590602001909291905050506107c2565b60405180806020018060200180602001878152602001806020018060200186810386528c818151815260200191508051906020019080838360005b838110156100fe5780820151818401526020810190506100e3565b50505050905090810190601f16801561012b5780820380516001836020036101000a031916815260200191505b5086810385528b818151815260200191508051906020019080838360005b83811015610164578082015181840152602081019050610149565b50505050905090810190601f1680156101915780820380516001836020036101000a031916815260200191505b5086810384528a818151815260200191508051906020019080838360005b838110156101ca5780820151818401526020810190506101af565b50505050905090810190601f1680156101f75780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b83811015610230578082015181840152602081019050610215565b50505050905090810190601f16801561025d5780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b8381101561029657808201518184015260208101905061027b565b50505050905090810190601f1680156102c35780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b3480156102e657600080fd5b5061030560048036038101908080359060200190929190505050610b05565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561035357600080fd5b50610388600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b38565b6040518082815260200191505060405180910390f35b3480156103aa57600080fd5b506103c960048036038101908080359060200190929190505050610b50565b60405180806020018060200180602001878152602001806020018060200186810386528c818151815260200191508051906020019080838360005b8381101561041f578082015181840152602081019050610404565b50505050905090810190601f16801561044c5780820380516001836020036101000a031916815260200191505b5086810385528b818151815260200191508051906020019080838360005b8381101561048557808201518184015260208101905061046a565b50505050905090810190601f1680156104b25780820380516001836020036101000a031916815260200191505b5086810384528a818151815260200191508051906020019080838360005b838110156104eb5780820151818401526020810190506104d0565b50505050905090810190601f1680156105185780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b83811015610551578082015181840152602081019050610536565b50505050905090810190601f16801561057e5780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b838110156105b757808201518184015260208101905061059c565b50505050905090810190601f1680156105e45780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b34801561060757600080fd5b5061062660048036038101908080359060200190929190505050610f3c565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b8381101561066957808201518184015260208101905061064e565b505050509050019250505060405180910390f35b34801561068957600080fd5b506107c060048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611140565b005b6000818154811015156107d157fe5b9060005260206000209060060201600091509050806000018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561087d5780601f106108525761010080835404028352916020019161087d565b820191906000526020600020905b81548152906001019060200180831161086057829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561091b5780601f106108f05761010080835404028352916020019161091b565b820191906000526020600020905b8154815290600101906020018083116108fe57829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109b95780601f1061098e576101008083540402835291602001916109b9565b820191906000526020600020905b81548152906001019060200180831161099c57829003601f168201915b505050505090806003015490806004018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a5d5780601f10610a3257610100808354040283529160200191610a5d565b820191906000526020600020905b815481529060010190602001808311610a4057829003601f168201915b505050505090806005018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610afb5780601f10610ad057610100808354040283529160200191610afb565b820191906000526020600020905b815481529060010190602001808311610ade57829003601f168201915b5050505050905086565b60016020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026020528060005260406000206000915090505481565b60608060606000606080600087815481101515610b6957fe5b9060005260206000209060060201600001600088815481101515610b8957fe5b9060005260206000209060060201600101600089815481101515610ba957fe5b906000526020600020906006020160020160008a815481101515610bc957fe5b90600052602060002090600602016003015460008b815481101515610bea57fe5b906000526020600020906006020160040160008c815481101515610c0a57fe5b9060005260206000209060060201600501858054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610cb05780601f10610c8557610100808354040283529160200191610cb0565b820191906000526020600020905b815481529060010190602001808311610c9357829003601f168201915b50505050509550848054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d4c5780601f10610d2157610100808354040283529160200191610d4c565b820191906000526020600020905b815481529060010190602001808311610d2f57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610de85780601f10610dbd57610100808354040283529160200191610de8565b820191906000526020600020905b815481529060010190602001808311610dcb57829003601f168201915b50505050509350818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e845780601f10610e5957610100808354040283529160200191610e84565b820191906000526020600020905b815481529060010190602001808311610e6757829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f205780601f10610ef557610100808354040283529160200191610f20565b820191906000526020600020905b815481529060010190602001808311610f0357829003601f168201915b5050505050905095509550955095509550955091939550919395565b606060008060606000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a876040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b158015610fd657600080fd5b505af1158015610fea573d6000803e3d6000fd5b505050506040513d602081101561100057600080fd5b8101908080519060200190929190505050935060009250600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546040519080825280602002602001820160405280156110855781602001602082028038833980820191505090505b509150600090505b600080549050811015611134578373ffffffffffffffffffffffffffffffffffffffff166001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156111275780828481518110151561111057fe5b906020019060200201818152505082806001019350505b808060010191505061108d565b81945050505050919050565b600060606000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a896040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1580156111d757600080fd5b505af11580156111eb573d6000803e3d6000fd5b505050506040513d602081101561120157600080fd5b81019080805190602001909291905050509250600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c89782a2336040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b1580156112d157600080fd5b505af11580156112e5573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f82011682018060405250602081101561130f57600080fd5b81019080805164010000000081111561132757600080fd5b8281019050602081018481111561133d57600080fd5b815185600182028301116401000000008211171561135a57600080fd5b505092919050505091506001600060c0604051908101604052808a8152602001898152602001888152602001428152602001858152602001878152509080600181540180825580915050906001820390600052602060002090600602016000909192909190915060008201518160000190805190602001906113dd92919061150c565b5060208201518160010190805190602001906113fa92919061150c565b50604082015181600201908051906020019061141792919061150c565b5060608201518160030155608082015181600401908051906020019061143e92919061150c565b5060a082015181600501908051906020019061145b92919061150c565b505050039050826001600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600081548092919060010191905055505050505050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061154d57805160ff191683800117855561157b565b8280016001018555821561157b579182015b8281111561157a57825182559160200191906001019061155f565b5b509050611588919061158c565b5090565b6115ae91905b808211156115aa576000816000905550600101611592565b5090565b905600a165627a7a7230582090a1646b8f77d8a0a0f6f1ed43cb8e82a2fcf39a94e72998827712fa92542bad0029';
//get the transaction count from account 1 as it is the sender
web3.eth.getTransactionCount(government, (err, txCount) => {
  //Transaction Object
  const txObject = {
    nonce: web3.utils.toHex(txCount), //all paramters should be in Hex
    gasLimit: web3.utils.toHex(4700000),
    gasPrice: web3.utils.toHex(web3.utils.toWei("0", "gwei")),
    data: data
  };

  //Sign a transaction
  const tx = new Tx(txObject);
  tx.sign(privateKeyGovernment);

  const serializedTransaction = tx.serialize();
  const raw = "0x" + serializedTransaction.toString("hex");

  //Broadcast a transaction
  web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    console.log("txHash : ", txHash);
  });
});
