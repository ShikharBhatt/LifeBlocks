
const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const web3 = new Web3('http://139.59.3.216:7545')

const government = "0x5578Ec2cb3994BC87823802071241726EBC40FDF";

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, "hex");

//console.log(privateKeyGovernment)
const data = '0x608060405273f3f0fac080e7babdc06dc5a2e2f68f36116a31c06000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507378478e7666bcb38b2ddeddfe7cb0ba152301df07600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561017e57600080fd5b506110848061018e6000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806320c5429b14610072578063449863891461009f5780635051865d1461013757806356199504146102555780636ac321df146102d7575b600080fd5b34801561007e57600080fd5b5061009d6004803603810190808035906020019092919050505061039e565b005b3480156100ab57600080fd5b506100e0600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506104bd565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610123578082015181840152602081019050610108565b505050509050019250505060405180910390f35b34801561014357600080fd5b5061016260048036038101908080359060200190929190505050610554565b604051808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018060200183151515158152602001828103825284818151815260200191508051906020019080838360005b838110156102165780820151818401526020810190506101fb565b50505050905090810190601f1680156102435780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34801561026157600080fd5b5061028060048036038101908080359060200190929190505050610858565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156102c35780820151818401526020810190506102a8565b505050509050019250505060405180910390f35b3480156102e357600080fd5b5061038860048036038101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610c47565b6040518082815260200191505060405180910390f35b3373ffffffffffffffffffffffffffffffffffffffff166002828154811015156103c457fe5b906000526020600020906005020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610481576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f596f7520617265206e6f7420617574686f72697a65640000000000000000000081525060200191505060405180910390fd5b600060028281548110151561049257fe5b906000526020600020906005020160040160006101000a81548160ff02191690831515021790555050565b6060600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561054857602002820191906000526020600020905b815481526020019060010190808311610534575b50505050509050919050565b600080600060606000853373ffffffffffffffffffffffffffffffffffffffff1660028281548110151561058457fe5b906000526020600020906005020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16148061064357503373ffffffffffffffffffffffffffffffffffffffff166002828154811015156105f957fe5b906000526020600020906005020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b15156106b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f496e76616c6964206f7065726174696f6e00000000000000000000000000000081525060200191505060405180910390fd5b6002878154811015156106c657fe5b906000526020600020906005020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660028881548110151561070757fe5b906000526020600020906005020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660028981548110151561074857fe5b90600052602060002090600502016002015460028a81548110151561076957fe5b906000526020600020906005020160030160028b81548110151561078957fe5b906000526020600020906005020160040160009054906101000a900460ff16818054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561083d5780601f106108125761010080835404028352916020019161083d565b820191906000526020600020905b81548152906001019060200180831161082057829003601f168201915b50505050509150955095509550955095505091939590929450565b6060600080606060006060600080600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a8a6040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1580156108f757600080fd5b505af115801561090b573d6000803e3d6000fd5b505050506040513d602081101561092157600080fd5b8101908080519060200190929190505050965060009550600360008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054806020026020016040519081016040528092919081815260200182805480156109c157602002820191906000526020600020905b8154815260200190600101908083116109ad575b50505050509450600093505b8451841015610acb573373ffffffffffffffffffffffffffffffffffffffff16600286868151811015156109fd57fe5b90602001906020020151815481101515610a1357fe5b906000526020600020906005020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16148015610ab057506001151560028686815181101515610a7757fe5b90602001906020020151815481101515610a8d57fe5b906000526020600020906005020160040160009054906101000a900460ff161515145b15610abe5785806001019650505b83806001019450506109cd565b85604051908082528060200260200182016040528015610afa5781602001602082028038833980820191505090505b50925060009150600090505b8451811015610c38573373ffffffffffffffffffffffffffffffffffffffff1660028683815181101515610b3657fe5b90602001906020020151815481101515610b4c57fe5b906000526020600020906005020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16148015610be957506001151560028683815181101515610bb057fe5b90602001906020020151815481101515610bc657fe5b906000526020600020906005020160040160009054906101000a900460ff161515145b15610c2b578481815181101515610bfc57fe5b906020019060200201518383815181101515610c1457fe5b906020019060200201818152505081806001019250505b8080600101915050610b06565b82975050505050505050919050565b6000808273ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166374163f6c886040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b158015610cf257600080fd5b505af1158015610d06573d6000803e3d6000fd5b505050506040513d6020811015610d1c57600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff16141515610dde576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260268152602001807f596f7520646f206e6f7420686176652073756666696369656e74207065726d6981526020017f7373696f6e73000000000000000000000000000000000000000000000000000081525060400191505060405180910390fd5b6001600260a0604051908101604052808873ffffffffffffffffffffffffffffffffffffffff1681526020018673ffffffffffffffffffffffffffffffffffffffff168152602001898152602001878152602001600115158152509080600181540180825580915050906001820390600052602060002090600502016000909192909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550604082015181600201556060820151816003019080519060200190610f18929190610fb3565b5060808201518160040160006101000a81548160ff0219169083151502179055505050039050600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081908060018154018082558091505090600182039060005260206000200160009091929091909150555080915050949350505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610ff457805160ff1916838001178555611022565b82800160010185558215611022579182015b82811115611021578251825591602001919060010190611006565b5b50905061102f9190611033565b5090565b61105591905b80821115611051576000816000905550600101611039565b5090565b905600a165627a7a7230582002f770549e6d65b0679e43e292b03bbb67f6fa551651ffc57cd1fd1808accb6a0029'
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
