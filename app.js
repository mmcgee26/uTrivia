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
    server: 'localhost\\SQLExpress',
    database: 'uTrivia',
    options: {
        trustedConnection: true
      }
};


app.use(session({secret: 'uncc'})); //initialize session

app.get('/about', function (req, res) { //about handler
    res.render('about');
});

app.get('/quiz', function (req, res) { //quiz handler !IMPORTANT!

    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select TOP 3 * from QUESTIONS', function (err, data) {
            if (err) console.log(err)

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

app.get('/', function(req, res){ //index handler
    var categoryList;
    var difficultyList;

    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select CATEGORY_NAME from CATEGORY ORDER BY CATEGORY_NAME', function (err, data) {
            if (err) console.log(err)

            categoryList = data.recordset;

            request.query('select LEVEL from DIFFICULTY', function (err, data) {
                if (err) console.log(err)

                difficultyList = data.recordset;

                console.log(difficultyList);
                console.log(categoryList);
                res.render('index', {difficulties: difficultyList, categories: categoryList});
            });
        });
    });
});

app.listen(3000); //open server
