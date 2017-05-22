// module
var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');
var expressValidator = require('express-validator');

// express settings
var app = express();
var appPort = process.env.port || 7250;

// mysql settings
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'db_scriptsi'
});

connection.connect(function(err){
    if(err){
        console.log('something wrong with mysql database connection');
        connection.end();
    }
});

// routeModule.
var noteRouter = require('./routeModule/note.js')(connection);

// use body parser
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressValidator());
app.use(bodyparser.json());


// use route.
app.use('/note', noteRouter);

app.listen(appPort,function(){
    console.log('running....');
});