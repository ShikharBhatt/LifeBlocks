
const Tx = require("ethereumjs-tx");
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:7545");

const government = "0x5578Ec2cb3994BC87823802071241726EBC40FDF";

const privateKeyGovernment = Buffer.from(process.env.PRIVATE_KEY, "hex");

//console.log(privateKeyGovernment)

//get the transaction count from account 1 as it is the sender
web3.eth.getTransactionCount(government, (err, nonce) => {
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
