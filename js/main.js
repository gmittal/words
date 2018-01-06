/*
  * 2018-present Gautam Mittal
*/

const GAMEFIELD = `#gameField`;
const HELPER = `#helper`;
const DICTIONARY = `data/en-US.txt`;
let VOCAB = [];

// State variables
let FIELD_LENGTH = 0;
let PLAYER_TURN = true;

// Reset state variables
function reset() {
    FIELD_LENGTH = 0;
    PLAYER_TURN = true;
}

// Type something into the textbox
function scribble(text) {
    $(GAMEFIELD).val(`${$(GAMEFIELD).val()}${text}`);
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

// Verify strings typed into textbox
function verify(text) {
    if (text.length == 0) {
	display('Your move. Type a letter.', 0);
	return;
    }

    /* Check if string passes and react */
    if (/^[a-zA-Z]+$/.test(text))
	display('Your move. Type a letter.', 0);
    else
	display('Invalid character.', -1);
}

// Given a string, return word candidates
function candidates(text) {
    query = text.toLowerCase();
    return VOCAB.filter(word => word.substring(0, query.length) == query)
}

// Handle player turns
function turn() {
    PLAYER_TURN = !PLAYER_TURN;
    if (PLAYER_TURN == true) {
	/* User's move */
	display("Your move. Type a letter.", 0);
	$(GAMEFIELD).prop('disabled', false);
    } else {
	/* Computer's move */
	display("Computer's move.", 0);
	$(GAMEFIELD).prop('disabled', true);
    }
}

// Setup the game board
function init() {
    reset();
    
    // Load all words known to man
    $.get(DICTIONARY, (data) => {
	VOCAB = data.split('\n').map((word) => {
	    return word.toLowerCase();
	});
	VOCAB.pop();

	// Add typing event handlers
	$(GAMEFIELD).keydown(() => {
	    let LAST = FIELD_LENGTH; 
	    FIELD_LENGTH = $(GAMEFIELD).val().length;
	    
	    // Condition for preventing typing
	    if (FIELD_LENGTH > LAST) {
		if (FIELD_LENGTH != 0)
		    $(GAMEFIELD).prop('maxlength', FIELD_LENGTH);
	    }
	});

	// Add submission and verification event handlers
	$(GAMEFIELD).keyup((evt) => {
	    // Verify that game receives valid text
	    verify($(GAMEFIELD).val());
	    
	    // Enter key is pressed
	    if (evt.keyCode == 13)
		turn();
	});
    });
}

$(document).ready(() => {
    init();
});
