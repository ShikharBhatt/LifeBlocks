const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const government = "0x5578Ec2cb3994BC87823802071241726EBC40FDF";

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, "hex");

//console.log(privateKeyGovernment)
const data = "0x608060405273f3f0fac080e7babdc06dc5a2e2f68f36116a31c06000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507378478e7666bcb38b2ddeddfe7cb0ba152301df07600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561017e57600080fd5b50610d3e8061018e6000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806320c5429b1461007257806330c611051461009f57806344986389146101395780635051865d146101d157806356199504146102c4575b600080fd5b34801561007e57600080fd5b5061009d60048036038101908080359060200190929190505050610346565b005b3480156100ab57600080fd5b5061012360048036038101908080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610465565b6040518082815260200191505060405180910390f35b34801561014557600080fd5b5061017a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610783565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156101bd5780820151818401526020810190506101a2565b505050509050019250505060405180910390f35b3480156101dd57600080fd5b506101fc6004803603810190808035906020019092919050505061081a565b604051808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200183151515158152602001828103825284818151815260200191508051906020019060200280838360005b838110156102ad578082015181840152602081019050610292565b505050509050019550505050505060405180910390f35b3480156102d057600080fd5b506102ef60048036038101908080359060200190929190505050610a44565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610332578082015181840152602081019050610317565b505050509050019250505060405180910390f35b3373ffffffffffffffffffffffffffffffffffffffff1660028281548110151561036c57fe5b906000526020600020906004020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610429576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f596f7520617265206e6f7420617574686f72697a65640000000000000000000081525060200191505060405180910390fd5b600060028281548110151561043a57fe5b906000526020600020906004020160030160006101000a81548160ff02191690831515021790555050565b6000808360008060019150600090505b82518110156105aa573373ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166374163f6c85848151811015156104e157fe5b906020019060200201516040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b15801561053d57600080fd5b505af1158015610551573d6000803e3d6000fd5b505050506040513d602081101561056757600080fd5b810190808051906020019092919050505073ffffffffffffffffffffffffffffffffffffffff16141561059d57600091506105aa565b8080600101915050610475565b600115158215151415156105bd57600080fd5b600160026080604051908101604052808973ffffffffffffffffffffffffffffffffffffffff1681526020013373ffffffffffffffffffffffffffffffffffffffff1681526020018a8152602001600115158152509080600181540180825580915050906001820390600052602060002090600402016000909192909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020190805190602001906106e7929190610ca0565b5060608201518160030160006101000a81548160ff0219169083151502179055505050039350600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208490806001815401808255809150509060018203906000526020600020016000909192909190915055508394505050505092915050565b6060600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002080548060200260200160405190810160405280929190818152602001828054801561080e57602002820191906000526020600020905b8154815260200190600101908083116107fa575b50505050509050919050565b60008060606000843373ffffffffffffffffffffffffffffffffffffffff1660028281548110151561084857fe5b906000526020600020906004020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16148061090757503373ffffffffffffffffffffffffffffffffffffffff166002828154811015156108bd57fe5b906000526020600020906004020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16145b151561091257600080fd5b60028681548110151561092157fe5b906000526020600020906004020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660028781548110151561096257fe5b906000526020600020906004020160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166002888154811015156109a357fe5b90600052602060002090600402016002016002898154811015156109c357fe5b906000526020600020906004020160030160009054906101000a900460ff1681805480602002602001604051908101604052809291908181526020018280548015610a2d57602002820191906000526020600020905b815481526020019060010190808311610a19575b505050505091509450945094509450509193509193565b60608060008060606000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b93f9b0a886040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b158015610adf57600080fd5b505af1158015610af3573d6000803e3d6000fd5b505050506040513d6020811015610b0957600080fd5b8101908080519060200190929190505050935060009250600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020018280548015610ba957602002820191906000526020600020905b815481526020019060010190808311610b95575b50505050509150600090505b8151811015610c93573373ffffffffffffffffffffffffffffffffffffffff1660028383815181101515610be557fe5b90602001906020020151815481101515610bfb57fe5b906000526020600020906004020160000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610c86578181815181101515610c5757fe5b906020019060200201518584815181101515610c6f57fe5b906020019060200201818152505082806001019350505b8080600101915050610bb5565b8495505050505050919050565b828054828255906000526020600020908101928215610cdc579160200282015b82811115610cdb578251825591602001919060010190610cc0565b5b509050610ce99190610ced565b5090565b610d0f91905b80821115610d0b576000816000905550600101610cf3565b5090565b905600a165627a7a72305820c450eee8db3d4384a1ac17a0a59943b485abc1d3808b3110598364a4a76d5ee70029";
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