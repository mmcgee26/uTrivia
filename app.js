var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator/check');
var sql = require("mssql/msnodesqlv8");
var path = require('path');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/views')));
app.use('/assets', express.static('assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//start business logic



var config = {
    server: 'localhost', 
    database: 'uTrivia',
    options: {
        trustedConnection: true
      }
};


app.use(session({secret: 'uncc'})); //initialize session


app.get('/', function(req, res){ //index handler
    res.render('index');
});

app.get('/about', function (req, res) { //about handler
    res.render('about');
});

app.get('/quiz', function (req, res) { //quiz handler !IMPORTANT!
   
    sql.connect(config, function (err) {
    
        if (err) console.log(err);
    
        // create Request object
        var request = new sql.Request();
        
        // query to the database and get the records
        request.query('select TOP 1 * from QUESTIONS', function (err, data) {
            if (err) console.log(err)
           // console.log(data.recordset[0].QUESTION);
           
           // console.table(data.recordset);
            res.render('quiz', {data: data});
            
        });
        
    });

    
});

app.get('/contact', function (req, res) { //contact handler
    res.render('contact');
});

app.get('/leaderboards', function (req, res) { //leaderboards handler
    res.render('leaderboards');
});

app.listen(3000); //open server