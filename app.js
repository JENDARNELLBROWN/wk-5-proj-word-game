const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toUpperCase().split("\n");

//An array to hold letters of the word
var wordArray = [];
//correct letter guess array
var correctGuess = [];
//Guesses left
var guessesLeft = 8;
//Array to hold list of letters guessed
var myGuesses = [];
//Variable to hold word to be guessed
var wordToGuess = '';

app.use(bodyParser.urlencoded({ extended: false }));
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
app.set('view engine', 'mustache');

//check word to see if guess letter is in word
//if letter is in word add to correct space, add letter to guessed letters
//if letter isn't in the word, subtract 1 from guesses left and add to lett```ers guessed
//if user guesses all letters correctly in 8 or less guesses game is won
// if user choooses previously guessed letter they do not lose a guess
//if user uses all 8 guesses and doesn't get word, they lose and word should be revealed
//when game ends, ask user to play again
app.get('/', function (req, res) {
  if (myGuesses.length < 1) {
    resetGame(req);
  }
  res.render("index", { errors: "", numGuesses: guessesLeft, mysteryWord: correctGuess.join(" "), lettersGuessed: myGuesses.join(", ") });
});

app.post('/', function (req, res) {
  var guess = req.body.guess.toUpperCase();
  var validate = validateInput(guess);
  if (validate.valid) {
    //add to list of  guesses
    myGuesses.push(guess);

    checkGuess(guess);
    var completed = checkIfComplete();
    if (completed.complete) {
      res.render("gameover", { errors: completed.message, numGuesses: guessesLeft, mysteryWord: correctGuess.join(" "), lettersGuessed: myGuesses.join(", ") });
    } else {
      res.render("index", { errors: completed.message, numGuesses: guessesLeft, mysteryWord: correctGuess.join(" "), lettersGuessed: myGuesses.join(", ") });
    }
  }
  else {
    res.render("index", { errors: validate.message, numGuesses: guessesLeft, mysteryWord: correctGuess.join(" "), lettersGuessed: myGuesses.join(", ") });
  }
})

app.post('/newGame', function (req, res) {
  resetGame(req);
  res.render("index", { errors: "", numGuesses: guessesLeft, mysteryWord: correctGuess.join(" "), lettersGuessed: myGuesses.join(", ") });
})

function validateInput(guess) {
  if (guess == "") {
    return {
      valid: false, message: "No letter chosen, please enter a letter!"
    };
  }
  if (guess.length > 1) {
    return {
      valid: false, message: "Only one letter can be chosen each time!"
    };
  }
  if (myGuesses.includes(guess)) {
    return {
      valid: false, message: "You have already tried this letter, please guess another letter!"
    };
  }
  return {
    valid: true, message: ""
  };
}

function checkGuess(guess) {
  var found = false;
  for (i = 0; i < wordArray.length; i++) {
    if (wordArray[i] == guess) {
      correctGuess[i] = guess;
      found = true;
    }
  }
  if (!found) {
    guessesLeft--;
  }
}

function checkIfComplete() {
  if (correctGuess.join("") == wordToGuess) {
    return {
      complete: true, message: "Congratulations! You Won!"
    };
  }
  else if (guessesLeft == 0) {
    return {
      complete: true, message: "Sorry, you lost. The mystery word was " + wordToGuess
    };
  }
  return {
    complete: false, message: ""
  };
}

function resetGame(req) {
  req.session.destroy();
  myGuesses = [];
  correctGuess = [];
  guessesLeft = 8;
  wordToGuess = words[Math.trunc(Math.random() * words.length)];
  wordArray = wordToGuess.split("");
  for (i = 0; i < wordToGuess.length; i++) {
    correctGuess[i] = "_";
  }
}

module.exports = app;

app.listen(8080, function () {
  console.log("Hangman... Listening on 8080");
});