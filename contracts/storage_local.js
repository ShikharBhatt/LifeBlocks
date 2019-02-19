const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const government = "0x5578Ec2cb3994BC87823802071241726EBC40FDF";

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, "hex");

//console.log(privateKeyGovernment)
const data =
  "0x60806040527378478e7666bcb38b2ddeddfe7cb0ba152301df07600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503480156100c857600080fd5b50611319806100d86000396000f300608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063344610671461007d578063477ee7071461029a5780634c58cd351461030757806364b5a9251461035e5780638f88708b1461057b578063de06b994146105fd575b600080fd5b34801561008957600080fd5b506100a860048036038101908080359060200190929190505050610742565b604051808060200180602001806020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200185810385528a818151815260200191508051906020019080838360005b8381101561012657808201518184015260208101905061010b565b50505050905090810190601f1680156101535780820380516001836020036101000a031916815260200191505b50858103845289818151815260200191508051906020019080838360005b8381101561018c578082015181840152602081019050610171565b50505050905090810190601f1680156101b95780820380516001836020036101000a031916815260200191505b50858103835288818151815260200191508051906020019080838360005b838110156101f25780820151818401526020810190506101d7565b50505050905090810190601f16801561021f5780820380516001836020036101000a031916815260200191505b50858103825286818151815260200191508051906020019080838360005b8381101561025857808201518184015260208101905061023d565b50505050905090810190601f1680156102855780820380516001836020036101000a031916815260200191505b50995050505050505050505060405180910390f35b3480156102a657600080fd5b506102c560048036038101908080359060200190929190505050610a07565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561031357600080fd5b50610348600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a3a565b6040518082815260200191505060405180910390f35b34801561036a57600080fd5b5061038960048036038101908080359060200190929190505050610a52565b604051808060200180602001806020018673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200185810385528a818151815260200191508051906020019080838360005b838110156104075780820151818401526020810190506103ec565b50505050905090810190601f1680156104345780820380516001836020036101000a031916815260200191505b50858103845289818151815260200191508051906020019080838360005b8381101561046d578082015181840152602081019050610452565b50505050905090810190601f16801561049a5780820380516001836020036101000a031916815260200191505b50858103835288818151815260200191508051906020019080838360005b838110156104d35780820151818401526020810190506104b8565b50505050905090810190601f1680156105005780820380516001836020036101000a031916815260200191505b50858103825286818151815260200191508051906020019080838360005b8381101561053957808201518184015260208101905061051e565b50505050905090810190601f1680156105665780820380516001836020036101000a031916815260200191505b50995050505050505050505060405180910390f35b34801561058757600080fd5b506105a660048036038101908080359060200190929190505050610d9f565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156105e95780820151818401526020810190506105ce565b505050509050019250505060405180910390f35b34801561060957600080fd5b5061074060048036038101908080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610fa3565b005b60008181548110151561075157fe5b9060005260206000209060050201600091509050806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107fd5780601f106107d2576101008083540402835291602001916107fd565b820191906000526020600020905b8154815290600101906020018083116107e057829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561089b5780601f106108705761010080835404028352916020019161089b565b820191906000526020600020905b81548152906001019060200180831161087e57829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109395780601f1061090e57610100808354040283529160200191610939565b820191906000526020600020905b81548152906001019060200180831161091c57829003601f168201915b5050505050908060030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690806004018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156109fd5780601f106109d2576101008083540402835291602001916109fd565b820191906000526020600020905b8154815290600101906020018083116109e057829003601f168201915b5050505050905085565b60016020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026020528060005260406000206000915090505481565b606080606060006060600086815481101515610a6a57fe5b9060005260206000209060050201600001600087815481101515610a8a57fe5b9060005260206000209060050201600101600088815481101515610aaa57fe5b9060005260206000209060050201600201600089815481101515610aca57fe5b906000526020600020906005020160030160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008a815481101515610b0b57fe5b9060005260206000209060050201600401848054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bb15780601f10610b8657610100808354040283529160200191610bb1565b820191906000526020600020905b815481529060010190602001808311610b9457829003601f168201915b50505050509450838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c4d5780601f10610c2257610100808354040283529160200191610c4d565b820191906000526020600020905b815481529060010190602001808311610c3057829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610ce95780601f10610cbe57610100808354040283529160200191610ce9565b820191906000526020600020905b815481529060010190602001808311610ccc57829003601f168201915b50505050509250808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610d855780601f10610d5a57610100808354040283529160200191610d85565b820191906000526020600020905b815481529060010190602001808311610d6857829003601f168201915b505050505090509450945094509450945091939590929450565b606060008060606000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a876040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b158015610e3957600080fd5b505af1158015610e4d573d6000803e3d6000fd5b505050506040513d6020811015610e6357600080fd5b8101908080519060200190929190505050935060009250600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051908082528060200260200182016040528015610ee85781602001602082028038833980820191505090505b509150600090505b600080549050811015610f97578373ffffffffffffffffffffffffffffffffffffffff166001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610f8a57808284815181101515610f7357fe5b906020019060200201818152505082806001019350505b8080600101915050610ef0565b81945050505050919050565b600080600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a886040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b15801561103757600080fd5b505af115801561104b573d6000803e3d6000fd5b505050506040513d602081101561106157600080fd5b81019080805190602001909291905050509150600060a0604051908101604052808881526020018781526020018681526020013373ffffffffffffffffffffffffffffffffffffffff168152602001858152509080600181540180825580915050906001820390600052602060002090600502016000909192909190915060008201518160000190805190602001906110fb929190611248565b506020820151816001019080519060200190611118929190611248565b506040820151816002019080519060200190611135929190611248565b5060608201518160030160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506080820151816004019080519060200190611199929190611248565b5050509050816001600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000815480929190600101919050555050505050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061128957805160ff19168380011785556112b7565b828001600101855582156112b7579182015b828111156112b657825182559160200191906001019061129b565b5b5090506112c491906112c8565b5090565b6112ea91905b808211156112e65760008160009055506001016112ce565b5090565b905600a165627a7a72305820c9ffbea1907cf9e1a54104b9f17669fa64763e082989474826b548f89d662d360029";
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
