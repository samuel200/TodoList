const router = require('express').Router();
const { getDB } = require('../db');

router.get('/', (req, res)=>{
    getDB().collection('todos').find({}).toArray((err, result)=>{
        if(err)
            console.log(err);
        else{
            res.render('index', {todos: result})
        }
    })
})

module.exports = router;