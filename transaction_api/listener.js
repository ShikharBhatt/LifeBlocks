const mySqlEvents = require('mysql-events');
var Agenda = require('agenda');
const Web3 = require('web3');
const web3 = new Web3("http://127.0.0.1:7545");
const Tx = require("ethereumjs-tx");
const u_priv = Buffer('9c6f137a9c254ae3fa844d877f62cab6bd863ddccedc2cb7912c9a096ff1f210','hex');


var agenda = new Agenda({db: {address: 'localhost:27017/agenda-test'}});
var dbConfig = {
    user : "root",
    password : "306051",
    host : "localhost",
}

async function getTransactionCount(data){
    let raw;
    const contract = data.contract
    const worker = data.worker
    console.log("Inside: ",contract,worker)
    //await web3.eth.getBlockNumber().then(console.log);
    await web3.eth.getTransactionCount(worker, async (err, txCount) => {
      var data = new web3.eth.Contract(abi, contract);
      var x = data.methods.applyPolicy().encodeABI();
      console.log("ABI:",x)
      const txObject = {
        nonce : web3.utils.toHex(txCount),
        to : contract,   
        gasLimit : web3.utils.toHex(4700000),
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

var connection = mySqlEvents(dbConfig);

var listener = connection.add(
    'agenda_tasks.tasks',
    async function(oldRow, newRow, event){
        if(oldRow === null){
            //console.log("insert : ",event.rows);
            taskobj = event.rows
            
            if(taskobj[0].task == "DEFAULT_TASK"){
                
                console.log(taskobj[0].task_id,taskobj[0].date,taskobj[0].org_address,taskobj[0].contract_address)
                
                // const job_name = `transact${taskobj[0].contract_address}`;
                // console.log(job_name)
                
                agenda.define('transact', async (job,done) => {
                    console.log('transact : in job');
                    console.log(job.attrs.data.contract);
                    await getTransactionCount(job.attrs.data, () => {
                      console.log("done")
                    })
                    process.exit(0);
                  });
                  
                await new Promise(resolve => agenda.once('ready', resolve));

                  // Schedule a job for 1 second from now and persist it to mongodb.
                  // Jobs are uniquely defined by their name, in this case "hello"
                console.log("agenda")
                agenda.schedule(new Date(Date.now() + 20000),'transact',{contract : taskobj[0].contract_address, worker : taskobj[0].org_address});
                agenda.start();
            }
            else
                console.log("false")
        }
    },
    'Active'
);

console.log("listener : ",listener);

