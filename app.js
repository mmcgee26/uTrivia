var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8");
var path = require('path');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/views')));
app.use('/assets', express.static('assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var urlencodedParser = bodyParser.urlencoded({ extended: false });
//start business logic



var config = {
    server: 'localhost',
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
app.get('/questions/:difficulty&:category', function (req, res) { //quiz handler !IMPORTANT!
    var difficulty = req.params.difficulty;
    var category = req.params.category;
    var query = 'SELECT Top 10 * FROM QUESTIONS ';
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

        request.query(query + whereClause + ' ORDER BY NEWID()', function (err, data) {
            if (err) console.log(err)

            var questionList = data.recordset;
            console.log(questionList[0]);
            res.json({questions: questionList});
        });
    });
});

app.post('/quiz', urlencodedParser, function (req, res) { //quiz handler !IMPORTANT!
    var difficulty = req.body.difficulty;
    var category = req.body.category;
    res.render('quiz', {difficulty: difficulty, category: category});
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