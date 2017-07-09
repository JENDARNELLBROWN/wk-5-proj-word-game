for (var i = 0; i <lettersGuessed.length; i++) {


    guessedLetter = lettersGuessed[i];
    if(guessedLetter === req.body.userGuess) {
        messages.push ("Try Again,You've already guessed that letter.")
        match = true;
    }
}

if (match ===false)









if match === false {
guessesLeft = guessesLeft - 1;
}



