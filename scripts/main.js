// console.log("linked");
var deck = [];
var playerBank = 0;
var bankOutput = $('.bank');
var bet = 0;
var betButton = $('.betButton');
var hit = $('.hit');
var stand = $('.stand');
var dbl = $('.double');
hit.prop('disabled',true);
stand.prop('disabled',true);
dbl.prop('disabled',true);
betButton.prop('disabled',true);
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
	// console.log("bet clicked");
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
	// console.log("hit button clicked");
	deal(1);
	dbl.prop('disabled',true);
	
});

dbl.click(function() {
	// console.log("double button clicked");
	if (bet > playerBank) {
		comment.text("You don't have enough money");
	}
	else {
		playerBank -= bet;
		bet *=2;
		bankOutput.text(playerBank);
		deal(1);
		if (playerTotal < 22) { // player is still good with aces
			deal(2);
		}
		else { // over 21: check for aces
			playerTotal = checkAce(playerCards, playerTotal);	//update playerTotal
			if (playerTotal < 22) {  //if player is still less than 22
				deal(2);
			}
			else {					//player busted
				winner();
			}
		}
	}
})

stand.click(function() {
	// console.log("stand button clicked");
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
	
	// console.log("init ran");
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
	
	
	// //displays imgs of the shuffled deck
	// for (var i = 0; i < deck.length; i++) {
		// console.log("rank: "+deck[i].rank + "  suit: "+ deck[i].suit);
	// 	$('.deck').append($('<img class="smallImg" src="'+ deck[i].image +'">'));
	// }
}


function deal(num) {
	if (num === 0) {
		// console.log("dealing...");
		playerCards.push(deck.shift());
		playerHand.append($('<img class="smallImg" src="'+ playerCards[0].image +'">'));
		
		dealerCards.push(deck.shift());
		dealerHand.append($('<img class="smallImg" src="'+ dealerCards[0].image +'">'));
		
		playerCards.push(deck.shift());
		playerHand.append($('<img class="smallImg" src="'+ playerCards[1].image +'">'));

		//hole card
		dealerCards.push(deck.shift());
		dealerHand.append($('<img class="smallImg" src="deckimg/hole.png">')); // hole card img
		
		for (var t = 0; t < 2; t++) {
			playerTotal += playerCards[t].value;
			dealerTotal += dealerCards[t].value;
		}
		//playerTotal += playerCards[0].value;
		//dealerTotal += dealerCards[0].value;
		//playerTotal += playerCards[1].value;
		//dealerTotal += dealerCards[1].value;

		// console.log("PlayerTotal: "+playerTotal);
		// console.log("DealerTotal: "+dealerTotal);

		comment.text(handValues());
	}

	if (num === 1) {
		playerCards.push(deck.shift());
		playerTotal += playerCards[playerCards.length-1].value;
		playerHand.append($('<img class="smallImg" src="'+ playerCards[playerCards.length-1].image +'">'));
		if (playerTotal > 21) { 	//if over 21, check for aces
			playerTotal = checkAce(playerCards, playerTotal);
		}
		comment.text(handValues());
		if (playerTotal > 21) { 	// player is still over 21? end game
			// console.log("player busted");
			winner();
		}
	}
	if (num === 2) {

		// replaces hold card src with actual index 1 card in dealerHand
		dealerHand[0].lastChild.src = dealerCards[1].image;
		// document.querySelector('.dealerHand').lastChild.src = '';
		
		// Dealer draws cards
		var z = 2;
		while (dealerTotal < 17) {
			dealerCards.push(deck.shift());
			dealerTotal += dealerCards[z].value;
			dealerHand.append($('<img class="smallImg" src="'+ dealerCards[z].image +'">'));
			// console.log("Dealer Got: "+dealerCards[z].value);
			dealerTotal = checkAce(dealerCards, dealerTotal);
			z++;
		}
		// console.log("Dealer has a total of: "+dealerTotal);

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
		comment.text("Player Bust");
		dealerHand[0].lastChild.src = dealerCards[1].image;
	}
	else if (dealerTotal > 21) {
		comment.text("Dealer Bust. You win: "+bet*2);
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
	if (playerBank <= 0) {
		retry();
	}
}

function checkBJ() {
	if (playerTotal === 21) {
		comment.text("Blackjack! You win: $"+bet*2.5);
		playerBank += bet*2.5;
		bankOutput.text(playerBank);
		toggleButtons(true);
	}
}

// checks for any aces and RETURNS ADJUSTED TOTAL when below 22
function checkAce(hand, total) {  //hand = playerCards or dealerCards     //total = playerTotal or dealerTotal
	//WHAT IF I HAD TWO ACES?  probably can use a for loop for this
	
	var i = 0;
	while (total > 21) {  //while the playerTotal is greater than 21  //what if there are no aces? it never turns false
		
		if (hand[i].value === 11) {	 
			hand[i].value = 1;	//decrease the ace value to 1
			total -= 10; // manually adjust the playerTotal
			// console.log("ace found");
		}
		i++;
		if (i === hand.length) {	// if all cards are checked and no ace found, stop loop using return;
			return total;
		}
	}
	// console.log('new total'+total);
	return total;	// return when total < 22
}


// outputs the total value of face up cards for each player
function handValues() {
	comment.text("[Player: "+playerTotal+"]" + " [Dealer: "+(dealerTotal-dealerCards[1].value)+"]");
}


// <div id="sitDown">
//   <h1 id="howMuch">How much money do you have?</h2>
//   <p class="doYouHave">Enter the amount of money you are bringing to the table.</p>
//   <input class="submitBankAmt" placeholder="$"/>
//   <button class="submitBankroll">Sit Down</button>
//   <button class="closeModal">X</button>
// </div>

// $('#sitDown')

$('.submitBankroll').click(function() {
	if (parseInt($('.submitBankAmt').val()) > 0) {
		initState();
		playerBank = parseInt($('.submitBankAmt').val());
		bankOutput.text(playerBank);
		//close modal
		$('#sitDown').toggle();
		betButton.prop('disabled',false);
	}
});

function retry() {
	$('#sitDown').toggle();
	$('#howMuch').text("You lost all your money");
	$('.doYouHave').text("Would you like to play again?");
}
