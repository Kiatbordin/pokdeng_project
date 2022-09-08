const prompt = require('prompt-sync')();

class Pokdeng {
    constructor() {
        this.totalBet = 0;
        this.currentBet = 0;
        this._cardSet = ['ACE','2','3','4','5','6','7','8','9','10','JACK','QUEEN','KING'];
        this._suites = ['Clubs','Diamonds','Hearts','Spades'];
    }
    
    get cardSet() { return this._cardSet } // prevent touching the default card set.
    get suites() { return this._suites } // prevent touching the default suites.

    setBet() {
        let bet ;
        /* Bet should be number and the value should be more than 0 */
        while(bet != Number(bet) || Number(bet) <= 0) bet = prompt('Please put your bet: ');
        this.currentBet = Number(bet);
    }

    getCard() {
        const card = this.cardSet[Math.round(Math.random()*(this.cardSet.length-1))];
        const suite = this.suites[Math.round(Math.random()*(this.suites.length-1))];
        return [suite,card];
    }

    calculateScore(card1,card2) {
        /* The values of the cards as shown
        a. Ace is one point.
        b. Numbers 2 to 9 have face values
        c. the King, Queen, Jack, and 10 should be 10 due to we have to calculate the total score and modulus by 10 to get the remainders */
        
        let card1Score,card2Score;

        if(card1[1] === 'ACE') card1Score = 1;
        else if(card1[1] === 'JACK' || card1[1] === 'QUEEN' || card1[1] === 'KING' || card1[1] === '10') card1Score = 10;
        else card1Score = Number(card1[1]);

        if(card2[1] === 'ACE') card2Score = 1;
        else if(card2[1] === 'JACK' || card2[1] === 'QUEEN' || card2[1] === 'KING' || card2[1] === '10') card2Score = 10;
        else card2Score = Number(card2[1]);

        return (card1Score+card2Score)%10;
    }

    dealCard() {
        let playerCard1,playerCard2,dealerCard1,dealerCard2;
        let [playerCardName1,playerCardName2,dealerCardName1,dealerCardName2] = ['card','card','card','card'];      //  Set default values of card name to be the same.
        
        /* Check if one of these four cards are duplicated using Set size */
        while(new Set([playerCardName1,playerCardName2,dealerCardName1,dealerCardName2]).size !== 4) {
            playerCard1 = this.getCard();
            playerCard2 = this.getCard();
            dealerCard1 = this.getCard();
            dealerCard2 = this.getCard();
            playerCardName1 = `${playerCard1[0]}-${playerCard1[1]}`;
            playerCardName2 = `${playerCard2[0]}-${playerCard2[1]}`;
            dealerCardName1 = `${dealerCard1[0]}-${dealerCard1[1]}`;
            dealerCardName2 = `${dealerCard2[0]}-${dealerCard2[1]}`;
        }

        console.log(`You got ${playerCardName1}, ${playerCardName2}`);
        console.log(`The dealer got ${dealerCardName1}, ${dealerCardName2}`);

        const playerScore = this.calculateScore(playerCard1,playerCard2);
        const dealerScore = this.calculateScore(dealerCard1,dealerCard2);

        if(playerScore>dealerScore) {
            console.log(`You won!!!, received ${this.currentBet} chips.`);
            this.totalBet += this.currentBet;           //  Add the current bet to total bet
        } else if (playerScore<dealerScore) {
            console.log(`You lost!!!, Paided ${this.currentBet} chips.`);
        } else {
            console.log(`You tied!!!`);
        }
    }

    newGame() {
        this.currentBet = 0;                             //  Reset the current bet
        const playMore = prompt(`Wanna play more (Yes/No)? `).toLowerCase();

        if(playMore === 'y' || playMore === 'yes') this.gameStart();
        else if (playMore === 'n' || playMore === 'no') console.log(`You got total ${this.totalBet} chips.`);
        else this.newGame();
    }

    gameStart() {
        this.setBet();
        this.dealCard();
        this.newGame();
    }
}

const game = new Pokdeng();
game.gameStart();