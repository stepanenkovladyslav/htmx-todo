const fs = require('fs')
const path = require('path')

const todoFilePath = path.join(__dirname,  'todo.json');

class TodoController {

  static createTask (req, res)  {
    fs.readFile(todoFilePath, (err, data) => {
      if (err) {
        return res.status(500).json({message: 'Internal Server Error'})
      }

      const taskList = JSON.parse(data);
      const id = taskList.tasks.length > 0 ? taskList.tasks.length + 1 : 1;
      const task = {id: id,  task: req.body.task, status: "incomplete"}

      taskList.tasks.push(task)
      
      fs.writeFile(path.join(__dirname, '/todo.json'), JSON.stringify(taskList), (err) => {
        if (err) {
          return res.status(500).json({message: 'Internal Server Error'})
        }
      })

      return res.status(201).render('add-task.hbs', {task: req.body.task, id:id })
    })
  }

  static completeTask (req, res)  {
    fs.readFile(todoFilePath, (err, data) => {
      if (err) {
       return res.status(500).json({message: 'Internal Server Error'})
      }

      const id = +req.body.id;
      const taskList = JSON.parse(data);
      const neededTask = taskList.tasks.find(task => task.id === id)

      if (!neededTask) {
        return res.status(404).json({message: "Task not found"})
      }

      if (neededTask.status === 'completed') {
        return res.status(200).json(neededTask)
      }

      const changedTasks = taskList.tasks.map(task => {
        if (task.id === id) {
          return {...task, status : 'completed'}
        }
          return task 
      })

      taskList.tasks = changedTasks;

      fs.writeFile(path.join(__dirname, '/todo.json'), JSON.stringify(taskList), (err) => {
        if (err) {
          return res.status(500).json({message: 'Internal Server Error'})
        }
      })

       return res.status(200).json({...neededTask, status: "completed"})
    })
  }

  static deleteTask (req, res)  {
    fs.readFile(todoFilePath, (err, data) => {
      if (err) {
        return res.status(500).json({message: 'Internal Server Error'})
      }
      
      const id = +req.params.id;
      const taskList = JSON.parse(data);
      const neededTask = taskList.tasks.find(task => task.id === id)

      if (!neededTask) {
        return res.status(404).json({message: 'Task not found'})
      }

      const newTaskList = taskList.tasks.filter(task => task.id !== id)          
      taskList.tasks = newTaskList;

      fs.writeFile(path.join(__dirname, '/todo.json'), JSON.stringify(taskList), (err) => {
        if (err) {
          return res.status(500).json({message: 'Internal Server Error'})
        }

        return res.status(200).end('')
      })
    })
  }

}

module.exports = TodoController;
