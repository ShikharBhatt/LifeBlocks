
const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const government = "0x5578Ec2cb3994BC87823802071241726EBC40FDF";

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, "hex");

//console.log(privateKeyGovernment)
const data = '0x60806040527378478e7666bcb38b2ddeddfe7cb0ba152301df07600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073f5e9037a2412db50c74d5a1642d6d3b99dd90f20600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561018057600080fd5b50611dfd806101906000396000f300608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063088598241461009e578063344610671461010b57806364b5a9251461036857806374163f6c146105c55780638f88708b14610632578063b93a89f7146106b4578063d3d84572146108a5578063d80c78ea14610906578063de06b99414610988575b600080fd5b3480156100aa57600080fd5b506100c960048036038101908080359060200190929190505050610acd565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561011757600080fd5b5061013660048036038101908080359060200190929190505050610b00565b60405180806020018060200180602001878152602001806020018060200186810386528c818151815260200191508051906020019080838360005b8381101561018c578082015181840152602081019050610171565b50505050905090810190601f1680156101b95780820380516001836020036101000a031916815260200191505b5086810385528b818151815260200191508051906020019080838360005b838110156101f25780820151818401526020810190506101d7565b50505050905090810190601f16801561021f5780820380516001836020036101000a031916815260200191505b5086810384528a818151815260200191508051906020019080838360005b8381101561025857808201518184015260208101905061023d565b50505050905090810190601f1680156102855780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156102be5780820151818401526020810190506102a3565b50505050905090810190601f1680156102eb5780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b83811015610324578082015181840152602081019050610309565b50505050905090810190601f1680156103515780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b34801561037457600080fd5b5061039360048036038101908080359060200190929190505050610e43565b60405180806020018060200180602001878152602001806020018060200186810386528c818151815260200191508051906020019080838360005b838110156103e95780820151818401526020810190506103ce565b50505050905090810190601f1680156104165780820380516001836020036101000a031916815260200191505b5086810385528b818151815260200191508051906020019080838360005b8381101561044f578082015181840152602081019050610434565b50505050905090810190601f16801561047c5780820380516001836020036101000a031916815260200191505b5086810384528a818151815260200191508051906020019080838360005b838110156104b557808201518184015260208101905061049a565b50505050905090810190601f1680156104e25780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b8381101561051b578082015181840152602081019050610500565b50505050905090810190601f1680156105485780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b83811015610581578082015181840152602081019050610566565b50505050905090810190601f1680156105ae5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b3480156105d157600080fd5b506105f06004803603810190808035906020019092919050505061122f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561063e57600080fd5b5061065d6004803603810190808035906020019092919050505061126c565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156106a0578082015181840152602081019050610685565b505050509050019250505060405180910390f35b3480156106c057600080fd5b506106df600480360381019080803590602001909291905050506113d4565b604051808060200180602001806020018681526020018060200185810385528a818151815260200191508051906020019080838360005b83811015610731578082015181840152602081019050610716565b50505050905090810190601f16801561075e5780820380516001836020036101000a031916815260200191505b50858103845289818151815260200191508051906020019080838360005b8381101561079757808201518184015260208101905061077c565b50505050905090810190601f1680156107c45780820380516001836020036101000a031916815260200191505b50858103835288818151815260200191508051906020019080838360005b838110156107fd5780820151818401526020810190506107e2565b50505050905090810190601f16801561082a5780820380516001836020036101000a031916815260200191505b50858103825286818151815260200191508051906020019080838360005b83811015610863578082015181840152602081019050610848565b50505050905090810190601f1680156108905780820380516001836020036101000a031916815260200191505b50995050505050505050505060405180910390f35b3480156108b157600080fd5b506108f0600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050611701565b6040518082815260200191505060405180910390f35b34801561091257600080fd5b5061093160048036038101908080359060200190929190505050611731565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610974578082015181840152602081019050610959565b505050509050019250505060405180910390f35b34801561099457600080fd5b50610acb60048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611946565b005b60026020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600081815481101515610b0f57fe5b9060005260206000209060060201600091509050806000018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bbb5780601f10610b9057610100808354040283529160200191610bbb565b820191906000526020600020905b815481529060010190602001808311610b9e57829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c595780601f10610c2e57610100808354040283529160200191610c59565b820191906000526020600020905b815481529060010190602001808311610c3c57829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610cf75780601f10610ccc57610100808354040283529160200191610cf7565b820191906000526020600020905b815481529060010190602001808311610cda57829003601f168201915b505050505090806003015490806004018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d9b5780601f10610d7057610100808354040283529160200191610d9b565b820191906000526020600020905b815481529060010190602001808311610d7e57829003601f168201915b505050505090806005018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610e395780601f10610e0e57610100808354040283529160200191610e39565b820191906000526020600020905b815481529060010190602001808311610e1c57829003601f168201915b5050505050905086565b60608060606000606080600087815481101515610e5c57fe5b9060005260206000209060060201600001600088815481101515610e7c57fe5b9060005260206000209060060201600101600089815481101515610e9c57fe5b906000526020600020906006020160020160008a815481101515610ebc57fe5b90600052602060002090600602016003015460008b815481101515610edd57fe5b906000526020600020906006020160040160008c815481101515610efd57fe5b9060005260206000209060060201600501858054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610fa35780601f10610f7857610100808354040283529160200191610fa3565b820191906000526020600020905b815481529060010190602001808311610f8657829003601f168201915b50505050509550848054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561103f5780601f106110145761010080835404028352916020019161103f565b820191906000526020600020905b81548152906001019060200180831161102257829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156110db5780601f106110b0576101008083540402835291602001916110db565b820191906000526020600020905b8154815290600101906020018083116110be57829003601f168201915b50505050509350818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111775780601f1061114c57610100808354040283529160200191611177565b820191906000526020600020905b81548152906001019060200180831161115a57829003601f168201915b50505050509150808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156112135780601f106111e857610100808354040283529160200191611213565b820191906000526020600020905b8154815290600101906020018083116111f657829003601f168201915b5050505050905095509550955095509550955091939550919395565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60606000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a846040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b15801561130157600080fd5b505af1158015611315573d6000803e3d6000fd5b505050506040513d602081101561132b57600080fd5b81019080805190602001909291905050509050600160008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054806020026020016040519081016040528092919081815260200182805480156113c757602002820191906000526020600020905b8154815260200190600101908083116113b3575b5050505050915050919050565b6060806060600060606000868154811015156113ec57fe5b906000526020600020906006020160000160008781548110151561140c57fe5b906000526020600020906006020160020160008881548110151561142c57fe5b906000526020600020906006020160010160008981548110151561144c57fe5b90600052602060002090600602016003015460008a81548110151561146d57fe5b9060005260206000209060060201600401848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115135780601f106114e857610100808354040283529160200191611513565b820191906000526020600020905b8154815290600101906020018083116114f657829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115af5780601f10611584576101008083540402835291602001916115af565b820191906000526020600020905b81548152906001019060200180831161159257829003601f168201915b50505050509350828054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561164b5780601f106116205761010080835404028352916020019161164b565b820191906000526020600020905b81548152906001019060200180831161162e57829003601f168201915b50505050509250808054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116e75780601f106116bc576101008083540402835291602001916116e7565b820191906000526020600020905b8154815290600101906020018083116116ca57829003601f168201915b505050505090509450945094509450945091939590929450565b60016020528160005260406000208181548110151561171c57fe5b90600052602060002001600091509150505481565b606060006060806000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a876040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1580156117cb57600080fd5b505af11580156117df573d6000803e3d6000fd5b505050506040513d60208110156117f557600080fd5b81019080805190602001909291905050509350600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561189157602002820191906000526020600020905b81548152602001906001019080831161187d575b5050505050925082516040519080825280602002602001820160405280156118c85781602001602082028038833980820191505090505b509150600090505b825181101561193a57600083828151811015156118e957fe5b906020019060200201518154811015156118ff57fe5b906000526020600020906006020160030154828281518110151561191f57fe5b906020019060200201818152505080806001019150506118d0565b81945050505050919050565b600060606000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a896040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1580156119dd57600080fd5b505af11580156119f1573d6000803e3d6000fd5b505050506040513d6020811015611a0757600080fd5b81019080805190602001909291905050509250600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c89782a2336040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b158015611ad757600080fd5b505af1158015611aeb573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052506020811015611b1557600080fd5b810190808051640100000000811115611b2d57600080fd5b82810190506020810184811115611b4357600080fd5b8151856001820283011164010000000082111715611b6057600080fd5b505092919050505091506001600060c0604051908101604052808a815260200189815260200188815260200142815260200185815260200187815250908060018154018082558091505090600182039060005260206000209060060201600090919290919091506000820151816000019080519060200190611be3929190611d2c565b506020820151816001019080519060200190611c00929190611d2c565b506040820151816002019080519060200190611c1d929190611d2c565b50606082015181600301556080820151816004019080519060200190611c44929190611d2c565b5060a0820151816005019080519060200190611c61929190611d2c565b505050039050600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819080600181540180825580915050906001820390600052602060002001600090919290919091505550826002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611d6d57805160ff1916838001178555611d9b565b82800160010185558215611d9b579182015b82811115611d9a578251825591602001919060010190611d7f565b5b509050611da89190611dac565b5090565b611dce91905b80821115611dca576000816000905550600101611db2565b5090565b905600a165627a7a7230582082f2fc9cd80596605c0b730ec287a97b91f3330871dd32d2bbae914331dcc04e0029';
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
