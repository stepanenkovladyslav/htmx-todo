const fs = require('fs')

class TodoController {

  static async createTask (req, res)  {
    fs.readFile(__dirname + '/todo.json', (err, data) => {
        const content = JSON.parse(data);
        const id = content.tasks.length > 0 ? content.tasks.length + 1 : 1;
        const task = {id: id,  task: req.body.task, status: "incomplete"}
        content.tasks.push(task)
        const newTasks = JSON.stringify(content)
        fs.writeFile(__dirname + '/todo.json', newTasks, (err) => {
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
        const currentTaskList = JSON.parse(data);
        const changedTasks = currentTaskList.tasks.map(task => {
          if (task.id === id) {
            return {...task, status : 'completed'}
          }
            return task 
        })
        currentTaskList.tasks = changedTasks;
        fs.writeFile(__dirname + '/todo.json', JSON.stringify(currentTaskList), (err) => {
          if (err) {
            console.log('error completing')
          }
          console.log('completed successfully')
        })
    })
  }

  static async deleteTask (req, res)  {
      res.send().status(204)
    fs.readFile(__dirname + '/todo.json', (err, data) => {
        const id = +req.params.id;
        const currentTaskList = JSON.parse(data);
        const neededTask = currentTaskList.tasks.find(task => task.id === id)
        if (neededTask) {
          const newTaskList = currentTaskList.tasks.filter(task => task.id !== id)          
          currentTaskList.tasks = newTaskList;
        fs.writeFile(__dirname + '/todo.json', JSON.stringify(currentTaskList), (err) => {
          if (err) {
            console.log('error completing')
          }
          console.log('completed successfully')
        })
        }
    })
  }

}

module.exports = TodoController;
