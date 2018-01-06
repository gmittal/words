/*
  * 2018-present Gautam Mittal
*/

const GAMEFIELD = `#gameField`;
const HELPER = `#helper`;
const DICTIONARY = `data/en-US.txt`;
let VOCAB = [];
const MIN_VALID_WORD_LENGTH = 5;

// State variables
let FIELD_LENGTH = 0;
let PLAYER_TURN = true;
let TURNS_PLAYED = 0;

// Reset state variables
function reset() {
    FIELD_LENGTH = 0;
    PLAYER_TURN = true;
    TURNS_PLAYED = 0;
}

// Game over.
function gameOver() {
    $(GAMEFIELD).prop('disabled', true);
    reset();
}

// Type something into the textbox
function scribble(text, callback) {
    setTimeout(() => {
	$(GAMEFIELD).val(`${$(GAMEFIELD).val()}${text}`);
	FIELD_LENGTH = $(GAMEFIELD).val().length;
	callback();
    }, 1000);
}

// Show a message to the user
function display(text, sentiment) {
    if (sentiment == -1)
	$(HELPER).removeClass().addClass('err').text(text);
    else if (sentiment == 1)
	$(HELPER).removeClass().addClass('great').text(text);
    else
	$(HELPER).removeClass().addClass('ok').text(text);
}

function alphabetic(text) {
    return /^[a-zA-Z]+$/.test(text);
}

// Verify strings typed into textbox
function verify(text) {
    let valid = true;
    if (text.length == 0)
	return;
    /* Check if string passes and react */
    if (alphabetic(text)) {
	display('Your move. Type a letter.', 0);
    } else {
	display('Invalid character.', -1);
	valid = false;
    }
    return valid;
}

// Given a string, return word candidates
function candidates(text) {
    let query = text.toLowerCase();
    return VOCAB.filter(word => word.substring(0, query.length) == query)
}

// Return the most likely letter given string
function letter(text) {
    let words = candidates(text);
    let chars = words.map(word => word.substring(text.length, text.length+1));
    chars = chars.filter(l => alphabetic(l));
    return chars[Math.floor(Math.random()*chars.length)];
}

// Is a word a real word?
function vocabContains(word) {
    return VOCAB.indexOf(word.toLowerCase()) > -1;
}

// Handle player turns
function turn() {
    if (score($(GAMEFIELD).val())) gameOver();
    
    PLAYER_TURN = !PLAYER_TURN; // rotate the board
    TURNS_PLAYED += 1;
    
    if (PLAYER_TURN == true) {
	/* User's move */
	display('Your move. Type a letter.', 0);
	$(GAMEFIELD).prop('disabled', false);
	$(GAMEFIELD).prop('maxlength', FIELD_LENGTH+1);

	if (score($(GAMEFIELD).val())) gameOver();
    } else {
	/* Computer's move */
	display('Computer\'s move.', 0);
	$(GAMEFIELD).prop('disabled', true);
	
	scribble(letter($(GAMEFIELD).val()), () => {
	    if (score($(GAMEFIELD).val())) gameOver();
	    turn();
	});
    }
}

// Evaluate whether the game is complete
/*
  Rules:
  - If a word completes on your turn, you lose.
  - If you type a word that doesn't exist, you lose.
  - The word cannot be shorter than MIN_VALID_WORD_LENGTH characters.
*/
function score(text) {
    let game_over = false;

    if (text.length < MIN_VALID_WORD_LENGTH) {
	if (typeof letter(text) == "undefined") {
	    if (PLAYER_TURN)
		display("You lose.", -1);
	    else
		display("You win.", 1);
	    return true;
	} else
	    return false;
    }
    
    if (vocabContains(text) || candidates(text).length == 0) {
	game_over = true;
	if (PLAYER_TURN)
	    display("You lose.", -1);
	else
	    display("You win.", 1);
    }
   
    return game_over;
}

// Setup the game board
function init() {
    reset();
    
    // Load all words known to man
    $.get(DICTIONARY, (data) => {
	VOCAB = data.split('\r\n').map((word) => {
	    return word.toLowerCase();
	});
	VOCAB.pop();

	// Add typing event handlers
	$(GAMEFIELD).keydown((evt) => {
	    let LAST = FIELD_LENGTH; 
	    FIELD_LENGTH = $(GAMEFIELD).val().length;
	    
	    // Condition for preventing typing
	    if (FIELD_LENGTH > LAST) {
		if (FIELD_LENGTH != 0)
		    $(GAMEFIELD).prop('maxlength', FIELD_LENGTH);
	    }

	    // Prevent backspace of played characters
	    if (evt.keyCode == 8) {
		if ($(GAMEFIELD).val().length >= TURNS_PLAYED+1)
		    return
		else {
		    return evt.keyCode != 8;
		}
	    }
	});

	// Add submission and verification event handlers
	$(GAMEFIELD).keyup((evt) => {
	    // Enter key is pressed
	    if (evt.keyCode == 13 && FIELD_LENGTH > TURNS_PLAYED) {
		if (!verify($(GAMEFIELD).val()))
		    return;
		if (score($(GAMEFIELD).val())) gameOver();
		turn();
	    }
	});
    });
}

$(document).ready(() => {
    init();
});
