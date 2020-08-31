//import your db
const { db } = require('./db')
//import your models
const { Tasks, Types } = require('./models/Tasks')

//state your model associations (hasOne etc)

//export your db and Models (so they all can be imported from a single central location)
module.exports = { db, Tasks, Types }