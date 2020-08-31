const router = require("express").Router()
//import models from /db
const { Tasks, Types, db } = require('../db')

//routes go here
router.get('/', async(req,res,next) => {
    try{
        res.sendFile(path.join(__dirname, 'index.html'))
    }catch(error) { console.error(error) }
})

//Q: the below did not work when it was just '/' - why? jsut gave me 304 error
router.get('/api/tasks', async(req,res,next) => {
    try{
        const tasks = await Tasks.findAll()
        res.send(tasks)
    }catch(error) { next(error) }
})

router.delete('/api/tasks/:id',async(req,res,next) => {
    try{
        const deletedId = req.params.id
        const deleted = await Tasks.findByPk(req.params.id)
        await deleted.destroy()
        res.send(await Types.findAll( {include: Tasks} ))
    }catch(error) { next(error) }
})

router.get('/api/types', async(req,res,next) => {
    try{
        const types = await Types.findAll({
            include: Tasks
        })
        res.send(types)
    }catch(error) { next(error) }
})

router.post('/api/types/:id',async(req,res,next) => {
    try{
        const typeId = req.params.id
        const taskName = req.body.name
        console.log(typeId, taskName)
        const newTask = await Tasks.create({
            name: taskName,
            typeId: typeId
        })
        res.send(await Types.findAll( {include: Tasks} ))
    } catch(err) { next(err) }
})

router.get('/api/types/:id',async(req,res,next)=>{
    try{
        const typeId = req.params.id
        const tasksForType = await Types.findAll({
            include: Tasks,
            where: {
                id: typeId
            }
        })
        res.send(tasksForType)
    }catch(err){ next(err) }
})
module.exports = router
