var deck = [];
var playerBank = 0;
var bankOutput = $('.bank');
var bet = 0;
var sBet = 0;
var betButton = $('.betButton');
var hit = $('.hit');
var stand = $('.stand');
var dbl = $('.double');
var split = $('.split');
var playerTotal;
var playerTotal2;
var dealerTotal;
var playerCards = [];
var playerCards2 = []; //split hand
var dealerCards = [];
var dealerHand = $('.dealerHand'); //output of .png area || DOM
var playerHand = $('.playerHand');
var playerHand2 = $('.splitArea');
var splitArea = $('.splitArea');
var betAmt = $('.betAmt');
var comment = $('.comment');
var dealAreas = $('.dealArea');
var splitTurn = false;

/////////////////	INITIAL STUFF


/**
 * Load old save if exists
 */
if (typeof(Storage) !== 'undefined') {
	if (!Number(localStorage.grjkz_blackjack_bank)) {
		$('#sitDown').toggle();
	}
	else {
		playerBank = Number(localStorage.grjkz_blackjack_bank);
		startGame(playerBank);
	}

}
else {
	$('#sitDown').toggle();
}


/**
 * Buy-in handler
 */
$('.submitBankroll').click(function() {
	if (parseInt($('.submitBankAmt').val()) > 0) {
		playerBank = Number($('.submitBankAmt').val());
		startGame(playerBank);
		//close modal
		$('#sitDown').toggle();
	}
});


/**
 * Bet handler
 */
betButton.click(function() {
	initState();
	bet = Number(betAmt.val());
	if (bet > playerBank) {
		comment.text("You don't have that much money.");
	}
	// Start the round
	else if (bet <= playerBank && bet > 0) {
		playerBank -= bet;
		bankOutput.text(playerBank);
		deal(0); 
		toggleButtons(false);
		checkSplit();
		checkBJ();
	}
	else {
		comment.text("Please enter a valid bet.");
	}
});


/**
 * Hit handler
 */
hit.click(function() {
	split.css('visibility','hidden');
	
	// no split hand available
	if (!playerTotal2) {
		dbl.prop('disabled',true);
		deal(1);
		if (playerTotal > 21) { // if over 21, check for aces
			playerTotal = checkAce(playerCards, playerTotal);
		}
		comment.text(handValues());
		if (playerTotal > 21) { // player is still over 21? end game
			winner();
		}
		if ((playerCards.length === 5) && (playerTotal < 22)) {
			deal(2);
		}
	}

	// split hand exists
	else {
		if (!splitTurn) {
			deal(1);
			if (playerTotal > 21) {
				playerTotal = checkAce(playerCards, playerTotal);
			}
			comment.text(handValues());
			if (playerTotal > 21) {
				splitTurn = true;
				playAreaHighlight();
			}
			if ((playerCards.length === 5) && (playerTotal < 22)) {
				splitTurn = true;
				playAreaHighlight();
			}
		}
		else {
			deal(3);
			if (playerTotal2 > 21) {
				playerTotal2 = checkAce(playerCards2, playerTotal2);
			}
			comment.text(handValues());
			if (playerTotal2 > 21) {
				winner();
			}
			if ((playerCards2.length === 5) && (playerTotal2 < 22)) {
				deal(2);
			}
		}
	}
});


/**
 * Double Down handler
 */
dbl.click(function() {
	// console.log("double button clicked");
	if (bet > playerBank) {
		comment.text("You don't have enough money");
	}
	else {
		split.css('visibility','hidden');
		
		//no split hand
		if (!playerTotal2) {
			playerBank -= bet;
			bet *= 2;
			bankOutput.text(playerBank);
			deal(1);
			if (playerTotal > 21) {
					playerTotal = checkAce(playerCards, playerTotal);	//update playerTotal
				}
			if (playerTotal > 21) {
					winner();
				}
			else { // player is still good with aces
					deal(2);
				}
		}

		//split exists
		else {
			if (!splitTurn) {		// original hand's turn
				playerBank -= bet;
				bet *=2;
				bankOutput.text(playerBank);
				deal(1);
				if (playerTotal > 21) {
					playerTotal = checkAce(playerCards, playerTotal);	//update playerTotal
				}
				splitTurn = true;
				playAreaHighlight();
				comment.text(handValues());
			}

			else {					// split hand's turn
				if (bet > playerBank) {
					comment.text("You don't have enough money");
				}
				else {
					playerBank -= sBet;
					sBet *=2;
					bankOutput.text(playerBank);
					deal(3);
					if (playerTotal2 > 21) {
						playerTotal2 = checkAce(playerCards2, playerTotal2);	//update playerTotal						
					}
					if (playerTotal2 > 21) {
						deal(2);
					}
					else {
						deal(2);
					}
				}
			}
		}
	}
});


/**
 * Stand handler
 */
stand.click(function() {
	// console.log("stand button clicked");
	split.css('visibility','hidden');
	if (!playerTotal2) {		//no split
			deal(2);
		}

	else {		//split exists
		if (!splitTurn) {
			splitTurn = true;
			playAreaHighlight();
		}
		else {
			deal(2);
		}
	}
});


/**
 * Split handler
 */
split.click(function() {
	split.css('visibility','hidden');
	$('.playerHand img:last-child').remove();
	sBet = bet;
	playerBank -= sBet;
	bankOutput.text(playerBank);
	// update hands
	playerCards2.push(playerCards.pop());
	playerCards.push(deck.shift());
	playerCards2.push(deck.shift());
	// update hand values
	playerTotal = playerCards[0].value + playerCards[1].value;
	playerTotal2 = playerCards2[0].value + playerCards2[1].value;
	comment.text(handValues());
	// update hand images
	playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[1].image +'">'));
	splitArea.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards2[0].image +'">'));
	splitArea.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards2[1].image +'">'));

	playAreaHighlight();
});


//////////////
//FUNCTIONS //
//////////////

/**
 * Initialize 
 */
function initState() {
	dealAreas.empty();
	$('.animated').removeClass('flash animated slideInRight faceInDown');
	$('.deck').empty();
	split.css('visibility','hidden');
	splitTurn = false;
	playerHand2.removeClass('red');
	playerCards = [];
	playerCards2 = [];
	dealerCards = [];
	deck = [];
	newDeck();
	comment.text('Place your bet');
	bet = 0;
	sBet = 0;
	playerTotal = 0;
	playerTotal2 = 0;
	dealerTotal = 0;
}


/**
 * Creates a new in-order deck
 */
function newDeck() {
	// push each card into deck[]
	for (var i = 0; i < 4; i++) {
	    for (var j = 0; j < 13; j++) {
				// image info
				// first digit is the suit. following digit(s) = rank/value
				// 010.png = diamond Jack
				// 01.png = diamond 2
				// 20.png = heart A
				
				var img = i.toString()+j.toString(); // file name of corresponding card
				var card = {};
				
				if (j === 0) { // if ace, value = 11
					card = {
				    // rank: j+1, 
				    suit: i+1,
						value: 11,
						image: "deckimg/"+ img +".png"
					};
				}
				else if (j >= 10) { // if face card, value = 10
					card = {
				    // rank: j+1, 
				    suit: i+1,
						value: 10,
						image: "deckimg/"+ img +".png"
					};
				}
		   	else {
		   		card = {
				    // rank: j+1, 
				    suit: i+1,
						value: j+1,
						image: "deckimg/"+ img +".png"
					};
				}
			    deck.push(card);  // push newly created card(assoArray) into the deck array
	    }
	}
	//shuffle the deck
	for (var i = 0; i < deck.length; i++) {
		var randomIndex = Math.floor(Math.random()*deck.length);
		// swap cards
		var moveThis = deck[randomIndex];
		deck[randomIndex] = deck[i];
		deck[i] = moveThis;
	}
}


/**
 * Deals cards depending on instruction
 * @param  {int} num Specified to whom cards should be dealt
 * @return {null}     NULL
 */
function deal(num) {
	if (num === 0) {
		// console.log("dealing...");
		playerCards.push(deck.shift());
		playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[0].image +'">'));
		
		dealerCards.push(deck.shift());
		dealerHand.append($('<img class="fadeInDown animated smallImg" src="'+ dealerCards[0].image +'">'));
		
		playerCards.push(deck.shift());
		playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[1].image +'">'));
		//hole card
		dealerCards.push(deck.shift());
		dealerHand.append($('<img class="fadeInDown animated smallImg" src="deckimg/hole.png">')); // hole card img
		
		for (var t = 0; t < 2; t++) {
			playerTotal += playerCards[t].value;
			dealerTotal += dealerCards[t].value;
		}
		// check for double aces in hands
		if (playerTotal > 21) {
			playerTotal = checkAce(playerCards, playerTotal);
		}
		if (dealerTotal > 21) {
			dealerTotal = checkAce(dealerCards, dealerTotal);
		}

		comment.text(handValues());
	}
	/*
	Deal to player
	 */
	if (num === 1) {
		playerCards.push(deck.shift());
		playerTotal += playerCards[playerCards.length-1].value;
		playerHand.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards[playerCards.length-1].image +'">'));
		comment.text(handValues());
	}
	/*
	Deal to Dealer
	 */
	if (num === 2) {
		// replaces hold card img with actual index 1 card in dealerHand
		dealerHand[0].lastChild.src = dealerCards[1].image;
		// document.querySelector('.dealerHand').lastChild.src = '';
		
		// Dealer draws cards
		var z = 2;
		while (dealerTotal < 17) {
			dealerCards.push(deck.shift());
			dealerTotal += dealerCards[z].value;
			dealerHand.append($('<img class="fadeInDown animated smallImg" src="'+ dealerCards[z].image +'">'));
			// console.log("Dealer Got: "+dealerCards[z].value);
			if (dealerTotal > 21) {
				dealerTotal = checkAce(dealerCards, dealerTotal);
			}
			z++;
		}
		// console.log("Dealer has a total of: "+dealerTotal);
		winner();
	}
	/*
	Deal to player's split hand
	 */
	if (num === 3) {
		playerCards2.push(deck.shift());
		playerTotal2 += playerCards2[playerCards2.length-1].value;
		playerHand2.append($('<img class="fadeInDown animated smallImg" src="'+ playerCards2[playerCards2.length-1].image +'">'));
	}
}


/**
 * Deactivate bet button and activate others
 */
function toggleButtons(bool) {
		hit.prop('disabled',bool);
		stand.prop('disabled',bool);
		dbl.prop('disabled',bool);
		betButton.prop('disabled',!bool);
}


/**
 * Determine's the winner
 */
function winner() {  //checks for bust and compares hands
	if (playerTotal > 21) {
		comment.text("Player Bust");
		dealerHand[0].lastChild.src = dealerCards[1].image;
		dealerHand.addClass('flash animated');
	}
	else if (dealerTotal > 21) {
		comment.text("Dealer Bust. You win: $"+bet*2);
		playerBank += bet*2;
		bankOutput.text(playerBank);
		playerHand.addClass('flash animated');
	}
	else if (playerTotal > dealerTotal) {
		comment.text("You win: $"+bet*2);
		playerBank += bet*2;
		bankOutput.text(playerBank);
		playerHand.addClass('flash animated');
	}
	else if (dealerTotal > playerTotal) {
		comment.text("Dealer Wins");
		dealerHand.addClass('flash animated');
	}
	else if (dealerTotal === playerTotal) {
		comment.text("Push");
		playerBank += bet;
		bankOutput.text(playerBank);
	}
	else {
		comment.text("Error?");
	}

	// determine winner for split hand
	if (playerTotal2) {
		if (playerTotal2 > 21) {
			// console.log("split bust");
			comment.text("Player Bust");
			dealerHand[0].lastChild.src = dealerCards[1].image;
			dealerHand.addClass('flash animated');
		}
		else if (dealerTotal > 21 || playerTotal2 > dealerTotal) {
			if (playerTotal2 > dealerTotal) {
				comment.text("You win: $"+sBet*2);	
			}
			else {
				comment.text("Dealer Bust. You win: "+sBet*2);
			}
			playerBank += sBet*2;
			bankOutput.text(playerBank);
			playerHand2.addClass('flash animated');
		}
		
		else if (dealerTotal > playerTotal2) {
			comment.text("Dealer Wins");
			dealerHand.addClass('flash animated');
		}
		else if (dealerTotal === playerTotal2) {
			comment.text("Push");
			playerBank += sBet;
			bankOutput.text(playerBank);
		}
		else {
			comment.text("Error?");
		}
		comment.text("[Player: "+playerTotal+"]" + " [Split Hand: "+playerTotal2+"]"+ " [Dealer: "+dealerTotal+"]");
	}
	toggleButtons(true);
	
	// save bank to local storage
	if (typeof(Storage) !== 'undefined') {
	localStorage.grjkz_blackjack_bank = playerBank;
	}

	if (playerBank <= 0) {
		retry();
	}
}


/**
 * Checks for Blackjack in both hands
 */
function checkBJ() {
	if ((playerTotal === 21) && (dealerTotal === 21)) {
		dealerHand[0].lastChild.src = dealerCards[1].image;
		winner();
	}
	else if (playerTotal === 21) {
		comment.text("Blackjack! You win: $"+bet*2.5);
		comment.addClass('slideInRight animated');
		dealerHand[0].lastChild.src = dealerCards[1].image;
		playerBank += bet*2.5;
		bankOutput.text(playerBank);
		toggleButtons(true);
	}
	else if (dealerTotal === 21) {
		comment.text("Dealer won with Blackjack.");
		dealerHand[0].lastChild.src = dealerCards[1].image;
		toggleButtons(true);

		if (playerBank <= 0) {
			retry();
		}
	}
}


/**
 * checks for any aces and RETURNS ADJUSTED TOTAL when below 22
 * @param  {array} hand  player or computer's target hand
 * @param  {int} total current hand value total
 */
function checkAce(hand, total) {
	//WHAT IF I HAD TWO ACES?  probably can use a for loop for this
	
	for (var i = 0; i < hand.length; i++) {
		if (hand[i].value === 11) { // if ace found
			hand[i].value = 1;	// decrease the ace value to 1
			total -= 10; // manually adjust the playerTotal
		}

		if (total < 22) {
			return total; // didn't bust
		}	
	}

	return total;	// busted
}


/**
 * Enables split button if requirements met
 */
function checkSplit() {
	if (playerCards[0].value === playerCards[1].value && playerBank >= bet) {
		split.css('visibility', 'visible');
	}
}


/**
 * Outputs the total value of face up cards for each player
 */
function handValues() {
	if (playerTotal2) {
		comment.text("[Player: "+playerTotal+"]" + " [Split Hand: "+playerTotal2+"]"+ " [Dealer: "+(dealerTotal-dealerCards[1].value)+"]");
	}
	else {
		comment.text("[Player: "+playerTotal+"]" + " [Dealer: "+(dealerTotal-dealerCards[1].value)+"]");
	}	
}


/**
 * Highlights a hand's turn
 */
function playAreaHighlight() {
	if (!splitTurn) {
		playerHand.addClass('red');
	}
	else {
		playerHand.removeClass('red');
		playerHand2.addClass('red');
	}
}


/**
 * Start game
 */
function startGame(cash) {
	initState();
	bankOutput.text(cash);
	betButton.prop('disabled',false);
}


/**
 * Show buy-in Modal
 * */
function retry() {
	$('#sitDown').toggle();
	$('#howMuch').text("You lost all your money");
	$('.doYouHave').text("Would you like to play again?");
}


/////////////////
// Extra Stuff //
/////////////////

/**
 * Switches the set of buttons and player hands from left to right and vice versa
 * This is for people who want to use their right or left hands
 */
$('#swapSides').click(function() {
	$('.playerArea > div:first-child').appendTo($('.playerArea'));
});
