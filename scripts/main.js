console.log("linked");
var deck = [];
var playerBank = 1000;
var bankOutput = $('.bank')
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
var dealerHand = $('.dealerHand'); //output of dealer's hand
var playerHand = $('.playerHand');
var betAmt = $('.betAmt');
var comment = $('.comment');
var dealAreas = $('.dealArea');
initState();
/////////////////	INITIAL STUFF


betButton.click(function() {
	console.log("bet clicked");
	bet = parseInt(betAmt.val());
	if (bet > playerBank) {
		comment.text("You don't have that much money.");
	}
	// Start the round
	else if (bet > 0) {
		console.log("one");
		playerBank -= bet;
		deal(0);
		activateActions();
	}
	else {
		comment.text("Please enter a valid bet.");
	}
})


hit.click(function() {
	console.log("you clicked the hit button");
});




///////////////////////////  FUNCTIONS
function deal(num) {
	if (num === 0) {
//		console.log("dealing...");
		playerCards.push(deck.shift());
		playerTotal += playerCards[0].value;
		playerHand.append($('<img class="smallImg" src="'+ playerCards[0].image +'">'));
		debugger
		dealerCards.push(deck.shift());
		dealerTotal += deck.shift().value;
		dealerHand.append($('<img class="smallImg" src="'+ dealerCards[0].image +'">'));
		
		playerCards.push(deck.shift());
		playerTotal += deck.shift().value;
		playerHand.append($('<img class="smallImg" src="'+ playerCards[1].image +'">'));

		dealerCards.push(deck.shift());
		dealerTotal += deck.shift().value;
		dealerHand.append($('<img class="smallImg" src="'+ dealerCards[0].image +'">'));
	}
}

function initState() {
	dealAreas.empty();
	playerTotal = dealerTotal = 0;
	newDeck();

}

function newDeck() {
	playerTotal = dealerTotal = 0;
	deck = []; 

	for (var i = 0; i < 4; i++) {
	    for (var j = 0; j < 13; j++) {
		// image value info
		// if 3 digits, last 2 values = card rank + 1
		// if 2 digits, first value = suit and last value = rank
		// 010.png = diamond 11
		// 01.png = diamond 2
		// remember that card 00 is diamond ACE and +13 is club ACE
		if (j >= 10) {
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
	console.log("deck of "+deck.length+" has been created");

	//shuffle the deck
	for (var i = 0; i < deck.length; i++) {
		var randomIndex = Math.floor(Math.random()*52);
		var moveThis = deck[randomIndex];
		deck[randomIndex] = deck[i];
		deck[i] = moveThis;
	}
	console.log("deck has been shuffled");
	
	//displays imgs of the shuffled deck
	for (var i = 0; i < deck.length; i++) {
//		console.log("rank: "+deck[i].rank + "  suit: "+ deck[i].suit);
		$('body').append($('<img class="smallImg" src="'+ deck[i].image +'">'));
	}
}

function activateActions() {
	hit.prop('disabled',false);
	stand.prop('disabled',false);
	dbl.prop('disabled',false);
	betButton.prop('disabled',true);
}
