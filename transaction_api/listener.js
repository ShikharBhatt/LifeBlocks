const mySqlEvents = require('mysql-events');
// var Agenda = require('agenda');
// const Web3 = require('web3');
// const web3 = new Web3("http://127.0.0.1:7545");
// const Tx = require("ethereumjs-tx");
// const u_priv = Buffer('9c6f137a9c254ae3fa844d877f62cab6bd863ddccedc2cb7912c9a096ff1f210','hex');


//var agenda = new Agenda({db: {address: 'localhost:27017/agenda-test'}});
let Scheduler = require('./agenda');
const scheduler = new Scheduler();

var dbConfig = {
    user : "root",
    password : "306051",
    host : "localhost",
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
                //run(taskobj[0].contract_address)
                //console.log(func)
                await scheduler.policygrace(taskobj[0].org_address, taskobj[0].contract_address);
                setTimeout(async()=>{
                    await scheduler.policylapse(taskobj[0].org_address, taskobj[0].contract_address)}
                ,30000);
                setTimeout(async()=>{
                    await scheduler.policydefunct(taskobj[0].org_address, taskobj[0].contract_address)}
                ,60000);
            }
            else
                console.log("false")
        }
    },
    'Active'
);

console.log("listener : ",listener);
