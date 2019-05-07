const dbConnection = require('../dbConnection');
const queries = require('../queries/queries');

module.exports = class task_def {
    async insert(org_address, contract_address) {
        let con = await dbConnection();
        try{
            await con.query("START TRANSACTION");
            let insertTask = await con.query(
                queries.insert_task,
                [org_address, contract_address]
            );
            await con.query("COMMIT");
            let id = insertTask.insertId;
            return id;
        }
        catch(ex){
            await con.query("ROLLBACK");
            console.log(ex);
            throw ex;
        }
        finally{
            await con.release();
            await con.destroy();
        }
    }

    async read() {
        let con = await dbConnection();
        try{
            await con.query("START TRANSACTION");
            let readTask = await con.query(queries.read_task);
            await con.query("COMMIT");
            readTask = JSON.parse(JSON.stringify(readTask));
            return readTask;
        }
        catch(ex){
            await con.query("ROLLBACK");
            console.log(ex);
            throw ex;
        }
        finally{
            await con.release();
            await con.destroy();
        }
    }

    // async update(task,id) {
    //     let con = await dbConnection();
    //     try{
    //         await con.query("START TRANSACTION");
    //         await con.query(
    //             queries.update_task,
    //             [task, id]
    //         );
    //         await con.query("COMMIT");
    //         return true;
    //     }
    //     catch(ex){
    //         await con.query("ROLLBACK");
    //         console.log(ex);
    //         throw ex;
    //     }
    //     finally{
    //         await con.release();
    //         await con.destroy();
    //     }
    // }

    async delete(id) {
        let con = await dbConnection();
        try{
            await con.query("START TRANSACTION");
            await con.query(
                queries.delete_task,
                [id]
            );
            await con.query("COMMIT");
            return true;
        }
        catch(ex){
            await con.query("ROLLBACK");
            console.log(ex);
            throw ex;
        }
        finally{
            await con.release();
            await con.destroy();
        }
    }
}