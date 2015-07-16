//console.log('linked');

var deck = [];
var playerBank = 1000;
var bankOutput = $('.bank')
var bet = 0;
var betButton = $('.betButton');
var hit = $('.hit');
var stand = $('.stand');
var dbl = $('.double');
var playerTotal = 0;
var dealerTotal = 0;
var playerCards = [];
var dealerCards = [];
var $dealerCArea = $('.dealerCards'); //output of dealer's hand
var $playerCArea = $('.playerCards');
var betInput = $('.betValue');
var comment = $('.comment');

// GAME
betButton.click(function() {
	$('.cardsArea').empty();
	playerTotal = 0;
	bet = parseInt(betInput.val());
	if (bet < 1) {
		comment.text("Please bet a number amount above 0")
	}
	else if (bet > playerBank) {
		comment.text("You don't have that much money");
	}
	else if (bet <= playerBank) {
		playerBank -= bet = parseInt(betInput.val());
		comment.text("Bet: "+bet);
		bankOutput.text(playerBank);
		betButton.toggle();
		//$('.bet').empty()
		activateRound();
	}
});


function activateRound() {
	newDeck();
	deal(0);
	activateActions();
	dbl.click( function() {
		playerBank -= bet;
		bet *= 2;
//		console.log("bet is now = "+bet);
		dbl.toggle();
		checkBust(1)
	});

	hit.click( function() {
		console.log("dealing one");
		deal(1);
//		console.log("bet is now = "+bet);
		dbl.toggle();
		checkBust(1)
	});

	stand.click( function() {

	});
	
}

function endRound () {
	disableActions();
//	console.log('play buttons deactivated');
//	console.log('bet reactivated');
	betButton.toggle();
}

function nextCard() {

}

function newDeck() {
	playerTotal = dealerTotal = 0;
	console.log(playerTotal);
	deck = []; 
	var suit = [1, 2, 3, 4];
	var rank = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

	for (var i = 0; i < suit.length; i++) {
	    for (var j = 0; j < rank.length; j++) {
		// image value info
		// if 3 digits, last 2 values = card rank + 1
		// if 2 digits, first value = suit and last value = rank
		// 010.png = diamond 11
		// 01.png = diamond 2
		// remember that card 00 is diamond ACE and +13 is club ACE
		if (j>=10) {
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
			}
		};
	    deck.push(card);
		
	    }
	}
//	console.log("deck of "+deck.length+" has been created");

	// //shuffle the deck
	for (var i = 0; i < deck.length; i++) {
		var randomIndex = Math.floor(Math.random()*52);
		var moveThis = deck[randomIndex];
		deck[randomIndex] = deck[i];
		deck[i] = moveThis;
//		console.log(i);
	}
	console.log("deck has been shuffled");
	
	for (var i = 0; i < deck.length; i++) {
//		console.log("rank: "+deck[i].rank + "  suit: "+ deck[i].suit);
		$('body').append($('<img class="smallImg" src="'+ deck[i].image +'">'));
//		console.log("displayed");
	}
}

function deal(num) {
	// num = 0 opening hand
	// num = 1 player deal
	// num = 2 dealer deal
	if (num === 0) {
		
//		console.log("dealing...");
		playerCards.push(deck.shift());
		playerTotal += playerCards[0].value;
		$playerCArea.append($('<img class="smallImg" src="'+ deck[1].image +'">'));
		dealerTotal += deck.shift().value;
		playerTotal += deck.shift().value;
		dealerTotal += deck.shift().value;
	}
	else if (num === 1) {
		var temp = deck.shift();
		console.log("gave " +temp.rank+ " card to player");
		playerTotal += temp.value;
		$playerCArea.text(playerTotal);
		$playerCArea.append($('<img class="smallImg" src="'+ temp.image +'">'));
	}
	else if (num === 2) {
		console.log("giving card to dealer");
		dealerTotal += deck.shift().value;
		$dealerCArea.text(dealerTotal);
	}

	// check for blackjack
	if (playerTotal === 11) {
		comment.text("Blackjack!")
		bankOutput.text(playerBank += bet *= 1.5);


	}
}

function checkBust(num) {
	if (num === 1 && playerTotal > 21) {
		console.log(playerTotal);
		endRound();
	}
	if (num === 0 && dealerTotal > 21) {
			endRound();
	}
}

function activateActions() {
	dbl.show();
	hit.show();
	stand.show();
}

function disableActions() {
	dbl.toggle();
	hit.toggle();
	stand.toggle();
}






