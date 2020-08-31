const Sequelize = require("sequelize") //for things like Sequelize.STRING
//import your db
const { db } = require('../db')
const { STRING, DATE, BOOLEAN } = Sequelize
//define your model
const Tasks = db.define('tasks', {
    name: {
        type: STRING
    },
    // dueDate: {
    //     type: DATE
    // },
    completed: {
        type: BOOLEAN,
        defaultValue: false
    }
})

const Types = db.define('types', {
    typeName: {
        type: STRING
    }
})

Tasks.belongsTo(Types)
Types.hasMany(Tasks)

//define any class or instance methods

//export your model
module.exports = { db, Tasks, Types }