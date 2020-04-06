var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator/check');
var sql = require("mssql/msnodesqlv8");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var path = require('path');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/views')));
app.use('/assets', express.static('assets'));


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

//PHL - Took out get route for quiz because it should only be accessible via post from index
//app.get('/quiz', function (req, res) { //quiz handler !IMPORTANT!
    //res.render('quiz');
//});

app.post('/quiz', urlencodedParser, function (req, res) { //quiz handler !IMPORTANT!
    var difficulty = req.body.difficulty;
    var category = req.body.category;
    var query = 'SELECT * FROM QUESTIONS ';
    console.log('Difficulty: ' + difficulty + '\nCategory: ' + category);

    if(difficulty != 'Any' || category != 'Any'){
      var whereClause = 'WHERE ';

      if(difficulty != 'Any'){
          whereClause += 'DIFFICULTY = ' + difficulty + ' '
        }

        if(category != 'Any'){
          if(difficulty != 'Any'){
            whereClause += 'AND CATEGORY = ' + category + ' '
          }else{
            whereClause += 'CATEGORY = ' + category + ''
          }
        }
    }
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records

        request.query(query + whereClause, function (err, data) {
            if (err) console.log(err)

            var questionList = data.recordset;
            console.log(questionList[0]);
            res.render('quiz', {questions: questionList});
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
        request.query('select * from CATEGORY ORDER BY CATEGORY_NAME', function (err, data) {
            if (err) console.log(err)

            categoryList = data.recordset;

            request.query('select * from DIFFICULTY', function (err, data) {
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
