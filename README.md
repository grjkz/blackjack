Minimum.

Player can make a bet, hit, stand.
Game can calculate for win or lose.
Win - compare with computer - computer busts, player has blackjack
Lose - player busts, computer gets blackjack, compare with computer

player clicks bet
	
	begin game state

	take bet and store it
	subtract bet from playerBank
	create deck (and shuffle it)
	deal cards (using shift or pop)
		//give card to player
		//give card to comp
		//give card to player
		give card to comp but flipped and hidden
		check if either player has blackjack
			yes? immediate win and end game state
			no? game continues

	wait for player to click on hit/stand/double
		hit
			gives player a card and adds to playerTotal
				check to see if player busted
					yes? player loses and end game state
					no? continue game

		stand
			dealer draws if needed
				bust? player wins
				no bust? compare Totals
					if player>dealer
						playerBank += bet and end game state
					else 
						comment = dealer wins and end game state

		double (remove button after any other action)
			gives player a card and adds to playerTotal
				check to see if player busted
					yes? game ends and player loses
					no?  
						dealer draws if needed
						bust? player wins
						no bust? compare Totals
							if player > dealer
								playerBank += bet and end game state
							else
								comment = dealer wins and end game state
		



		//split
			activate button if the 2nd card value == the first card value
			takes each card and places it in a new variable
			
				


