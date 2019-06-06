module.exports = {
    insert_task: `INSERT INTO tasks(org_address, contract_address, task, date) VALUES(?, ?, 'DEFAULT_TASK' ,now())`,
    read_task: `SELECT * FROM tasks`,
    //update_task: `UPDATE tasks SET tasks.task = ?, tasks.date = now() WHERE tasks.task_id = ?`,
    delete_task: `DELETE FROM tasks WHERE tasks.task_id = ?`
}