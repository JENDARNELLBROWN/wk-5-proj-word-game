const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
const myGuesses = [];
var wordtoguess = '';
var numEmptySpaces  ;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));

app.use(session({
  secret: 'hoHo7 e+13nu',
  resave: false,
  saveUninitialized: true
}));


app.engine('mustache', mustacheExpress());
 app.set('views', './views');
 app.set ('view engine', 'mustache');

app.get('/', function(req, res) {
  if (myGuesses.length<1){
    wordtoguess = words[Math.trunc(Math.random()*words.length)];
    numEmptySpaces = wordtoguess.length;
  }

  res.render("index", {numGuesses: 8, mysteryWord: numChararcters(wordtoguess), lettersGuessed: "none"});

});


function numChararcters (word) {
  let numSpaces = "";
  for (i=1; i <=word.length; i++) {
    numSpaces = numSpaces + "_ ";
  } 
  return numSpaces.trim();
}
//for (i = 0; i < cars.length; i++

app.post('/', function(req, res){
  var guess = req.body.guess;
  myGuesses.push(guess);
  res.render("index", {numGuesses: 8, mysteryWord: numChararcters(wordtoguess), lettersGuessed: myGuesses.join()});

})




module.exports = app;











app.listen(8080, function() {
  console.log("Hangman... Listening on 8080");
});