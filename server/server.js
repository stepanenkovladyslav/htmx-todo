const express = require('express');
const TodoController = require('./todoController')

const hbs = require('hbs')
const cors = require('cors')

const app = express()
app.set('view engine', 'hbs')
app.use(cors())
app.use('/views' , express.static((__dirname, 'views')))
app.use(express.urlencoded({extended: true}))

app.post('/api/v1/', TodoController.createTask)
app.put('/api/v1/complete', TodoController.completeTask)
app.delete('/api/v1/', TodoController.deleteTask)

app.listen(3000, () => console.log('started listening'))
