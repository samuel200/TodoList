const express = require('express');
const router = express.Router();
const { getDB, getPK } = require('../db');

// Route to get all the todo items
router.get('/', (req, res)=>{
    getDB().collection('todos').find({}).toArray((err, result)=>{
        if(err)
            console.log(err);
        else{
            res.header({'Content-Type': 'application/json'})
            res.json(result);
        }
    });
})


// Route to create specific todo
router.post('/', (req, res)=>{
    const { name } = req.body;
    getDB().collection('todos').insertOne({name, done: false}, (err, result)=>{
        if(err)
            console.log(err);
        else{
            res.header({'Content-Type': 'application/json'});
            res.json(result.ops);
        }
    })
})


// Route to get specific todo
router.get('/:id/', (req, res)=>{
    getDB().collection('todos').find({'_id': getPK(req.params.id)}).toArray((err, result)=>{
        if(err)
            console.log(err);
        else{
            res.header({'Content-Type': 'application/json'});
            res.json(result);
        }
    })
})

//Route to update a todo item
router.put('/:id/', (req, res)=>{
    const { name, done } = req.body;

    getDB().collection('todos').findOneAndUpdate({_id: getPK(req.params.id)}, {$set: { name,  done} }, {returnOriginal: false}, (err, result)=>{
        if(err)
            console.log(err);
        else{
            res.header({'Content-Type': 'application/json'});
            res.json(result.value);
        }
    })
})

// Route to delete a todo item
router.delete('/:id/', (req, res)=>{
    getDB().collection('todos').deleteOne({_id: getPK(req.params.id)}, (err, result)=>{
        if(err)
            console.log(err);
        else{
            res.header({'Content-Type': 'application/json'});
            res.json(result);
        }
    })
})


module.exports = router;