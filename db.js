const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017';
const options = {useNewUrlParser: true, useUnifiedTopology: true};
const dbName = 'todo_app';

const state = {
    db: null
}

const connect = (cb)=>{
    if(state.db)
        cb()
    
    else{
        MongoClient.connect(url, options, (err, client)=>{
            if(err)
                cb(err);
                
            else{
                state.db = client.db(dbName);
                cb();
            }
        })
    }
}

const getDB = ()=> state.db

const getPK = (id)=> ObjectId(id)

module.exports = {
    connect, getDB, getPK
}