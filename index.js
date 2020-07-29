const express = require('express');
const exphb = require('express-handlebars');
const path = require('path');
const apiRouter = require('./routers/apiRouter');
const pagesRouter = require('./routers/pagesRouter');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// hosting static files
app.use(express.static(path.join(__dirname, "/views/static")));

// setting up body parser
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Setting up the handlebars template engine
app.engine('handlebars', exphb());
app.set('view engine', 'handlebars');


// Initializing api route
app.use('/api', apiRouter);
app.use('', pagesRouter);

// Connect to database
db.connect((err)=>{
    if(err){
        console.log("failed to connect to database");
        console.log(err);
        process.exit(1);
    }else{
        // start server
        app.listen(PORT, ()=>{ console.log(`Server running on http://localhost:${PORT}`)})
    }
})
