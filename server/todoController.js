const fs = require('fs');
const { handlebars } = require('hbs');
const engine = require('engine-handlebars')(handlebars)
const path = require('path')

const todoFilePath = path.join(__dirname,  'todo.json');
const templateFilePath = path.join(__dirname, 'views', 'add-task.hbs')


class TodoController {

  static getTasks(req, res) {
    fs.readFile(todoFilePath, (err, data) => {
      if (err) {
        return res.status(500).json({message: 'Internal Server Error'})
      }

      const template = fs.readFileSync(templateFilePath, 'utf8');
      const compileTasks = handlebars.compile(template);

      const taskList = JSON.parse(data);

      if (taskList.tasks.length > 0) {
        const renderedTasks = taskList.tasks.map(item => {
          if(item.status === 'completed') {
            return compileTasks({task: item.task, id: item.id, status: 'checked'}) 
          }
          return compileTasks({task: item.task, id: item.id})
        }) 
        const combinedHTML = renderedTasks.join('')
        return res.send(combinedHTML)
      }
      return res.status(204).send('')
    })
  }

  static createTask (req, res)  {
    fs.readFile(todoFilePath, (err, data) => {
      if (err) {
        return res.status(500).json({message: 'Internal Server Error'})
      }

      const taskList = JSON.parse(data);
      const id = taskList.tasks.length > 0 ? taskList.tasks[taskList.tasks.length - 1].id + 1 : 1;
      const task = {id: id,  task: req.body.task, status: "incomplete"}

      taskList.tasks.push(task)
      
      fs.writeFile(path.join(__dirname, '/todo.json'), JSON.stringify(taskList), (err) => {
        if (err) {
          return res.status(500).json({message: 'Internal Server Error'})
        }
      return res.status(201).render('add-task.hbs', {task: req.body.task, id:id })
      })
    })
  }

  static changeTaskStatus(req, res)  {
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

      const newStatus = neededTask.status === 'completed' ? 'incomplete' : 'completed'

      const changedTasks = taskList.tasks.map(task => {
        if (task.id === id) {
          return {...task, status : newStatus}
        }
          return task 
      })

      taskList.tasks = changedTasks;

      fs.writeFile(todoFilePath, JSON.stringify(taskList), (err) => {
        if (err) {
          return res.status(500).json({message: 'Internal Server Error'})
        }
       return res.status(200).json({...neededTask, status: newStatus})
      })
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
