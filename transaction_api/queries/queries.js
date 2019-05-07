module.exports = {
    insert_task: `INSERT INTO tasks(task, date) VALUES(?,now())`,
    read_task: `SELECT * FROM tasks`,
    update_task: `UPDATE tasks SET tasks.task = ?, tasks.date = now() WHERE tasks.task_id = ?`,
    delete_task: `DELETE FROM tasks WHERE tasks.task_id = ?`
}