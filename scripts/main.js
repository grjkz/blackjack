// console.log("linked");
var deck = [];
var playerBank = 1000;
var bankOutput = $('.bank');
var bet = 0;
var betButton = $('.betButton');
var hit = $('.hit');
var stand = $('.stand');
var dbl = $('.double');
hit.prop('disabled',true);
stand.prop('disabled',true);
dbl.prop('disabled',true);
var playerTotal;
var dealerTotal;
var playerCards = [];
var dealerCards = [];
var dealerHand = $('.dealerHand'); //output of .png area
var playerHand = $('.playerHand');
var betAmt = $('.betAmt');
var comment = $('.comment');
var dealAreas = $('.dealArea');
//initState();
/////////////////	INITIAL STUFF


betButton.click(function() {
	initState();  // 
	console.log("bet clicked");
	bet = parseInt(betAmt.val());
	if (bet > playerBank) {
		comment.text("You don't have that much money.");
	}
	// Start the round
	else if (bet > 0) {
		playerBank -= bet;
		bankOutput.text(playerBank);
		deal(0); 
		toggleButtons(false);
		checkBJ();
	}
	else {
		comment.text("Please enter a valid bet.");
	}
})


hit.click(function() {
	console.log("hit button clicked");
	deal(1);
	
});

dbl.click(function() {
	console.log("double button clicked");
	playerBank -= bet;
	bet *=2;
	bankOutput.text(playerBank);
	deal(1);
	if (playerTotal < 22) {
		deal(2);
	}
	else {
		winner()
	}
})

stand.click(function() {
	console.log("stand button clicked");
	deal(2);
})




///////////////////////////  FUNCTIONS
function initState() {
	dealAreas.empty();
	$('.deck').empty();
	playerCards = [];
	dealerCards = [];
	deck = [];
	newDeck();
	// shuffle();
	comment.text('');
	playerTotal = dealerTotal = 0;
	console.log("init ran");
}




function newDeck() {
	// push each card into deck[]
	for (var i = 0; i < 4; i++) {
	    for (var j = 0; j < 13; j++) {
		// image: value info
		// if 3 digits, last 2 values = card rank + 1
		// if 2 digits, first value = suit and last value = rank
		// 010.png = diamond 11
		// 01.png = diamond 2
		// remember that card 00 is diamond ACE and +13 is club ACE
		if (j === 0) {
			var card = {
		    	rank: j+1, 
		    	suit: i+1,
				value: 11,
				image: "deckimg/"+ i.toString()+j.toString() +".png"
			}
		}
		else if (j >= 10) {
			var card = {
		    	rank: j+1, 
		    	suit: i+1,
				value: 10,
				image: "deckimg/"+ i.toString()+j.toString() +".png"
			};
		}
	   	else {
	   		var card = {
		    	rank: j+1, 
		    	suit: i+1,
				value: j+1,
				image: "deckimg/"+ i.toString()+j.toString() +".png"
			};
		}
	    deck.push(card);  //puts newly created card(assoArray) into the deck array
	    }
	}
	// console.log("deck of "+deck.length+" has been created");

	//shuffle the deck
	for (var i = 0; i < deck.length; i++) {
		var randomIndex = Math.floor(Math.random()*52);
		var moveThis = deck[randomIndex];
		deck[randomIndex] = deck[i];
		deck[i] = moveThis;
	}
	// console.log("deck has been shuffled");
	
	
	//displays imgs of the shuffled deck
	for (var i = 0; i < deck.length; i++) {
//		console.log("rank: "+deck[i].rank + "  suit: "+ deck[i].suit);
		$('.deck').append($('<img class="smallImg" src="'+ deck[i].image +'">'));
	}
}


function deal(num) {
	if (num === 0) {
//		console.log("dealing...");
		playerCards.push(deck.shift());
		//playerTotal += playerCards[0].value;
		playerHand.append($('<img class="smallImg" src="'+ playerCards[0].image +'">'));
		
		dealerCards.push(deck.shift());
		//dealerTotal += dealerCards[0].value;
		dealerHand.append($('<img class="smallImg" src="'+ dealerCards[0].image +'">'));
		
		playerCards.push(deck.shift());
		//playerTotal += playerCards[1].value;
		playerHand.append($('<img class="smallImg" src="'+ playerCards[1].image +'">'));

		dealerCards.push(deck.shift());
		//dealerTotal += dealerCards[1].value;
		dealerHand.append($('<img class="smallImg" src="'+ dealerCards[1].image +'">'));
		
		for (var t = 0; t < playerCards.length; t++) {
			playerTotal += playerCards[t].value;
			dealerTotal += dealerCards[t].value;
		}

		console.log("PlayerTotal: "+playerTotal);
		console.log("DealerTotal: "+dealerTotal);

		comment.text(handValues());
	}

	if (num === 1) {
		playerCards.push(deck.shift());
		playerTotal += playerCards[playerCards.length-1].value;
		playerHand.append($('<img class="smallImg" src="'+ playerCards[playerCards.length-1].image +'">'));
		comment.text(handValues());
		
		if (playerTotal > 21) {
			checkAce(playerCards, playerTotal);
		}
		// player still over 21?
		if (playerTotal > 21) {
			debugger
			winner();
			console.log("you busted");
		}

	}
	if (num === 2) {
		// Dealer draws cards
		var z = 2;
		while (dealerTotal < 17) {
			dealerCards.push(deck.shift());
			dealerTotal += dealerCards[z].value;
			dealerHand.append($('<img class="smallImg" src="'+ dealerCards[z].image +'">'));
			console.log("Dealer Got: "+dealerCards[z].value);
			z++;
		}
		//console.log("Dealer has a total of: "+dealerTotal);

		winner();
		
	}
}


// deactivate bet button and activate others
function toggleButtons(bool) {
	hit.prop('disabled',bool);
	stand.prop('disabled',bool);
	dbl.prop('disabled',bool);
	betButton.prop('disabled',!bool);
}

// ONLY CALL WHEN PLAYER CAN'T HIT OR GET ANY MORE CARDS
function winner() {  //checks for bust and compares hands
	if (playerTotal > 21) {
		comment.text("Dealer Wins");
	}
	else if (dealerTotal > 21) {
		comment.text("You win: "+bet*2);
		playerBank += bet*2;
		bankOutput.text(playerBank);
	}
	else if (playerTotal > dealerTotal) {
		comment.text("You win: $"+bet*2);
		playerBank += bet*2;
		bankOutput.text(playerBank);
	}
	else if (dealerTotal > playerTotal) {
		comment.text("Dealer Wins");
	}
	else if (dealerTotal === playerTotal) {
		comment.text("Push");
		playerBank += bet;
		bankOutput.text(playerBank);
	}
	else {
		handValues();
	}
	toggleButtons(true);
}

function checkBJ() {
	if (playerTotal === 21) {
		comment.text("Blackjack! You win: $"+bet*2.5);
		playerBank += bet*2.5;
		bankOutput.text(playerBank);
		toggleButtons(true);
	}
}
function checkAce(hand, total) {  //hand = playerHand or dealerHand
	total = 0;
	for (var i = 0; i < hand.length; i++) {
		if (hand[i].rank === 1) {
			hand[i].value = 1;
		} 
			total += hand[i].value;
	}
}
function handValues() {
	comment.text("Player: "+playerTotal+ "   Dealer: "+dealerTotal);
}