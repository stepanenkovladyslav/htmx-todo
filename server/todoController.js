const fs = require('fs')

class TodoController {

  static async createTask (req, res)  {
    fs.readFile(__dirname + '/todo.json', (err, data) => {
        const taskList = JSON.parse(data);
        const id = taskList.tasks.length > 0 ? taskList.tasks.length + 1 : 1;
        const task = {id: id,  task: req.body.task, status: "incomplete"}
        taskList.tasks.push(task)
        const newTaskList = JSON.stringify(taskList)
        fs.writeFile(__dirname + '/todo.json', newTaskList, (err) => {
          if (err) {
            console.log(err)
          }
          console.log('File is written successfully')
        })
        res.render('add-task.hbs', {task: req.body.task, id:id })
      })
  }

  static async completeTask (req, res)  {
    fs.readFile(__dirname + '/todo.json', (err, data) => {
        const id = +req.body.id;
        const taskList = JSON.parse(data);
        const changedTasks = taskList.tasks.map(task => {
          if (task.id === id) {
            return {...task, status : 'completed'}
          }
            return task 
        })
        taskList.tasks = changedTasks;
        fs.writeFile(__dirname + '/todo.json', JSON.stringify(taskList), (err) => {
          if (err) {
            console.log('error completing')
          }
          console.log('completed successfully')
        })
    })
  }

  static async deleteTask (req, res)  {
    fs.readFile(__dirname + '/todo.json', (err, data) => {
        const id = +req.params.id;
        const taskList = JSON.parse(data);
        const neededTask = taskList.tasks.find(task => task.id === id)
        if (!neededTask) {
          return res.status(404).json({message: 'Task not found'})
        }
        const newTaskList = taskList.tasks.filter(task => task.id !== id)          
        taskList.tasks = newTaskList;
        fs.writeFile(__dirname + '/todo.json', JSON.stringify(taskList), (err) => {
          if (err) {
            console.log('error completing')
          }
          res.status(204).end()
        })
    })
  }

}

module.exports = TodoController;
