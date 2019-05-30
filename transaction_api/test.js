const Web3 = require('web3');
const web3 = new Web3("http://127.0.0.1:7545");
const Tx = require("ethereumjs-tx");

//const user = '0x28bfC651f2F8396350daE7E3883952a7F053E828';
const u_priv = Buffer('9c6f137a9c254ae3fa844d877f62cab6bd863ddccedc2cb7912c9a096ff1f210','hex');
const abi = [{"constant":false,"inputs":[{"name":"_premium","type":"uint256"}],"name":"setPremium","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_reason","type":"string"}],"name":"requestRecords","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recordID","type":"uint256"},{"name":"_masterkey","type":"string"}],"name":"getRecordsRenewal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"policyGrace","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_coverage","type":"uint256"}],"name":"renewPolicy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmRenewal","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"applyPolicy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"recordID","type":"uint256"},{"name":"_masterkey","type":"string"}],"name":"getRecordsApplied","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRecords","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renewPolicy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPremium","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"policyLapse","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"confirmPolicy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"policyInactive","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getDetails","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint8"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"prevState","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"contractBuyer","type":"address"},{"name":"contractSeller","type":"address"},{"name":"_coverage","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"constructor"}];

//const recv = '0xa577C9d2BA3bB4aD1e09df6dFf697Cb3A639eB7a';

const Agenda = require('agenda');
const agenda = new Agenda({db:{address:'mongodb://localhost:27017/agenda-test',options:{useNewUrlParser: true,}}});

async function getTransactionCount(data){
  let raw;
  const contract = data.contract
  const worker = data.worker
  console.log("Inside: ",contract,worker)
  //await web3.eth.getBlockNumber().then(console.log);
  await web3.eth.getTransactionCount(worker, async (err, txCount) => {
    var data = new web3.eth.Contract(abi, contract);
    var x = data.methods.policyLapse().encodeABI();
    console.log("ABI:",x)
    const txObject = {
      nonce : web3.utils.toHex(txCount),
      to : contract,   
      gasLimit : web3.utils.toHex(600000),
      gasPrice : web3.utils.toHex(web3.utils.toWei('0','gwei')),
      data : x,
    }

    //Sign a transaction
  const tx = new Tx(txObject);
  tx.sign(u_priv);

  const serializedTransaction = tx.serialize();
  raw = "0x" + serializedTransaction.toString("hex");
  console.log("raw:",raw);
  //Broadcast a transaction
  });
  await web3.eth.sendSignedTransaction(raw, (err, txHash) => {
    if(err)
      console.log(err)
    else
      console.log("txHash : ", txHash);
    });
  // return count;
}

async function run(org_address, contract_address){
  //const db = await MongoClient.connect('mongodb://localhost:27017/agendatest');
  let orgz_address = '0x1C48060F0eAeb380495755aa9E5F98Cdde7be14E' 
  let contractz_address = '0x267339697f3D6cdFa2C099f58Fa4c6eca0a9F602'
  // Agenda will use the given mongodb connection to persist data, so jobs
  // will go in the "agendatest" database's "jobs" collection.
  console.log("in run: ", orgz_address, contractz_address);
  let job_name = `transact${contractz_address}`
  console.log(job_name);
  // Define a "job", an arbitrary function that agenda can execute
  agenda.define(job_name, async (job,done) => {
    console.log('transact : in job');
    //console.log(job.attrs.data.contract);
    await getTransactionCount(job.attrs.data, () => {
      console.log("done")
    })
    return true;
  });
  
  // Wait for agenda to connect. Should never fail since connection failures
  // should happen in the `await MongoClient.connect()` call.
  await new Promise(resolve => agenda.once('ready', resolve));

  // Schedule a job for 1 second from now and persist it to mongodb.
  // Jobs are uniquely defined by their name, in this case "hello"

  agenda.schedule(new Date(Date.now() + 20000), job_name,{contract : contractz_address, worker : orgz_address});
  agenda.start();
}

run();