let Task = require("./tasks/def");
const task = new Task();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' })
})

app.post('/api/insert', async (req, res) => {
    console.log(req.body.orgAddress,req.body.contractAddress)
    let insertTask = await task.insert(req.body.orgAddress,req.body.contractAddress);
    console.log("Inserted Task : ", insertTask);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.orgAddress},${req.body.contractAddress}`,
      );
})
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

app.listen(port, () => console.log(`Listening on port ${port}`));