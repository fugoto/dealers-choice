const { db }= require("./db/db")
const { Tasks, Types } = require('./db/models/Tasks')

let tasks = [
    {
        name: "meditate",
        typeId: 1
    },
    {
        name: 'vitamins',
        typeId: 1
    },
    {
        name: 'code-stretch',
        typeId: 2
    },
    {
        name: 'groceries',
        typeId: 3
    }
]

// tasks = await Promise.all(tasks.map(task => Tasks.create(task)))

let types = [
    {
        typeName: 'health'
    },
    {
        typeName: 'work'
    },
    {
        typeName: 'chores'
    }
]

// types = await Promise.all(types.map(type => Types.create(type)))

async function seed(){
    try{
        console.log('seeding')
        await db.sync( {force: true} )
        await Types.bulkCreate(types)
        await Tasks.bulkCreate(tasks)
        await db.close()
        console.log('seeded')
    } catch(err){ console.error(err) }
}

seed()