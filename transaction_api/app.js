let Task = require("./tasks/def");
const task = new Task();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// async () => {
//     let insertTask = await task.insert("send ethers");
//     console.log("Inserted Task : ", insertTask);

//     let updateTask = await task.update("lapse policy", insertTask);
//     console.log("Task updated ? :",updateTask);

//     let readTask = await task.read();
//     console.log("Tasks : ", readTask);

//     let deleteTask = await task.delete(insertTask);
//     console.log("Task deleted ? : ", deleteTask);
// }

app();