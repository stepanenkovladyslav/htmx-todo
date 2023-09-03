const fs = require('fs')

class TodoController {

static async createTask (req, res)  {
  fs.readFile(__dirname + '/todo.json', (err, data) => {
      const content = JSON.parse(data);
      const task = {task: req.body.task, status: "incomplete"}
      content.tasks.push(task)
      const newTasks = JSON.stringify(content)
      fs.writeFile(__dirname + '/todo.json', newTasks, (err) => {
        if (err) {
          console.log(err)
        }
        console.log('File is written successfully')
      })
    })
  res.render('add-task.hbs', {task: req.body.task})
}

static async completeTask (req, res)  {
  fs.readFile(__dirname + '/todo.json', (err, data) => {
      const currentTaskList = JSON.parse(data);
      const changedTasks = currentTaskList.tasks.map(todo => {
        console.log(req.body.task)
        if (todo.task === req.body.task) {
          todo.status = 'complete'
        }
        return todo 
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
  res.send('')
}

}

module.exports = TodoController;
