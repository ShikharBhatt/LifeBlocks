const mySqlEvents = require('mysql-events');

var dbConfig = {
    user : "root",
    password : "306051",
    host : "localhost",
}

var connection = mySqlEvents(dbConfig);

var listener = connection.add(
    'test.tasks',
    function(oldRow, newRow, event){
        if(oldRow === null){
            console.log("insert : ",event.rows);
            taskobj = event.rows
            if(taskobj[0].task == "send ethers"){
                console.log(taskobj[0].task_id,taskobj[0].date)
                
            }
            else
                console.log("false")
        }
    },
    'Active'
);

console.log("listener : ",listener);

