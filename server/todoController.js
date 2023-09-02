
class TodoController {

static async createTask (req, res)  {
  console.log(req.body)
  res.render('add-task.hbs', {task: req.body.task})
}

static async completeTask (req, res)  {
  res.send()
}

static async deleteTask (req, res)  {
  console.log('delete request receieved')
  res.send('')
}

}

module.exports = TodoController;
