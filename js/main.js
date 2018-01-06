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
    if (/^[a-zA-Z]+$/.test(text))
	display('Invalid text')
}

function turn() {
    PLAYER_TURN = !PLAYER_TURN;
    if (PLAYER_TURN == true) {
	display("Your move. Type a character.", 0);
    } else {
	display("Computer's move.", 0);
    }
}

function init() {
    reset();
    
    // Load all words known to man
    $.get(DICTIONARY, (data) => {
	VOCAB = data.split('\n');
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

	// Add submit event handlers
	$(GAMEFIELD).keyup((evt) => {
	    // Enter key is pressed
	    if (evt.keyCode == 13)
		turn();
	});
    });
}

$(document).ready(() => {
    init();
});
