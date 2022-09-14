/* Pokdeng4 is the next version of Pokdeng3, In This version the player and dealer can request the 3rd card if the dealer didn't get the 'Pok 8 or Pok 9' */

const prompt = require('prompt-sync')();

class Pokdeng3 {
    constructor() {
        this.totalBet = 0;
        this.currentBet = 0;
        this._cardSet = ['ACE','2','3','4','5','6','7','8','9','10','JACK','QUEEN','KING'];
        this._suites = ['Clubs','Diamonds','Hearts','Spades'];
        this.deck = [];             //  For keep the (random) deck in each game.
        this.handOutCard = [];      //  For store previous handout card stats
    }

    get cardSet() { return this._cardSet } // prevent touching the default card set.
    get suites() { return this._suites } // prevent touching the default suites.

    getDeck() { this.suites.forEach( suite => this.cardSet.forEach( card => this.deck.push([[suite],[card]])) ); }  //  Create 2D array deck
    shuffle() { this.deck.sort( () => Math.random() - 0.5 ); }  //  Shuffle the item in arrays
    getCard() { return this.deck.shift(); } //  Always hand out the first card of the deck to the player.

    calculateScore(cardsArr) {
        /* The values of the cards are ACE is 1, 2-9 is Face value and (King,Queen,Jack,10) are 10 */
        /* We have to calculate the total score and modulus by 10 to get the remainders */
        let score = 0;
        cardsArr.forEach( card => {
            if(card[1][0]==='ACE') score+=1;
            else if(card[1][0] === 'JACK' || card[1][0] === 'QUEEN' || card[1][0] === 'KING' || card[1][0] === '10') score+=10;
            else score += Number(card[1][0]);
        });
        return score%10;
    }

    addHandedOutStatistic(cards) {
        /* For Checking the handout statistic of each card in the previous game  */
        cards.forEach( card => {
            /* Check if the receiving cards are already in the previous stats or not */
            const cardIndex = this.handOutCard.findIndex( handoutcard => handoutcard[0]===card.join("-"));
            /* if yes add one more count, if not push the card name into arr and start the first count */
            cardIndex != -1 ? this.handOutCard[cardIndex][1]++ : this.handOutCard.push([card.join("-"),1]);
        });
    }

    dealCard() {
        const [playerCard1,playerCard2,dealerCard1,dealerCard2] = [this.getCard(),this.getCard(),this.getCard(),this.getCard()];
        this.addHandedOutStatistic([playerCard1,playerCard2,dealerCard1,dealerCard2]);  //  Store the history of handed out cards

        let playerScore = this.calculateScore([playerCard1,playerCard2]);
        let dealerScore = this.calculateScore([dealerCard1,dealerCard2]);

        /* Decision point if dealer get Pok 8 or Pok 9 */
        let dealerIsPok = false;
        /* Pok 8 Case */
        if(dealerCard1[1][0] === '8' && (dealerCard2[1][0]==='10' || dealerCard2[1][0]==='JACK' || dealerCard2[1][0]==='QUEEN' || dealerCard2[1][0]==='KING' )) dealerIsPok = true;
        if(dealerCard2[1][0] === '8' && (dealerCard1[1][0]==='10' || dealerCard1[1][0]==='JACK' || dealerCard1[1][0]==='QUEEN' || dealerCard1[1][0]==='KING' )) dealerIsPok = true;
        /* Pok 9 Case */
        if(dealerCard1[1][0] === '9' && (dealerCard2[1][0]==='10' || dealerCard2[1][0]==='JACK' || dealerCard2[1][0]==='QUEEN' || dealerCard2[1][0]==='KING' )) dealerIsPok = true;
        if(dealerCard2[1][0] === '9' && (dealerCard1[1][0]==='10' || dealerCard1[1][0]==='JACK' || dealerCard1[1][0]==='QUEEN' || dealerCard1[1][0]==='KING' )) dealerIsPok = true;

        /* If the dealer didn't get Pok, The player and dealer can draw the 3rd card if they want. */
        if(!dealerIsPok) {
            /* Ask player if they need the 3rd card */
            const newPlayerCard = prompt(`You got ${playerCard1.join("-")}, ${playerCard2.join("-")}. Do you want the 3rd card ? [(Y)es/(N)o]: `).toLowerCase();

            if(newPlayerCard === 'y' || newPlayerCard === 'yes') {
                const playerCard3 = this.getCard();
                this.addHandedOutStatistic([playerCard3]);
                playerScore = this.calculateScore([playerCard1,playerCard2,playerCard3]);
                console.log(`You got ${playerCard1.join("-")}, ${playerCard2.join("-")} and ${playerCard3.join("-")}.`);
            } 

            /* Dealer algorithm, If the dealer score is less than 5, the dealer will draw the 3rd card */
            if(dealerScore<5) {
                const dealerCard3 = this.getCard();
                this.addHandedOutStatistic([dealerCard3]);
                dealerScore = this.calculateScore([dealerCard1,dealerCard2,dealerCard3]);
                console.log(`The Dealer draw the 3rd card. The dealer got ${dealerCard1.join("-")}, ${dealerCard2.join("-")} and ${dealerCard3.join("-")}.`);
            } else {
                console.log(`The dealer got ${dealerCard1.join("-")}, ${dealerCard2.join("-")}`);
            }

        } else {
            /* If the dealer got Pok, Both player and dealer cannot draw the 3rd card */
            console.log(`You got ${playerCard1.join("-")}, ${playerCard2.join("-")}`);
            console.log(`The dealer got ${dealerCard1.join("-")}, ${dealerCard2.join("-")}`);
        }

        console.log(`playerScore is ${playerScore} and dealerScore is ${dealerScore}.`);

        if(playerScore>dealerScore) {
            console.log(`You won!!!, received ${this.currentBet} chips.`);
            this.totalBet += this.currentBet;           //  Add the current bet to total bet
        } 
        else if (playerScore<dealerScore)  console.log(`You lost!!!, Paided ${this.currentBet} chips.`);
        else console.log(`You tied!!!`);
    }

    setBet() {
        let bet ;   /* Bet should be number and the value should be more than 0 */
        while(bet != Number(bet) || Number(bet) <= 0) bet = prompt('Please put your bet: ');
        this.currentBet = Number(bet);
    }

    newGame() {
        this.currentBet = 0;                                                    //  Reset the current bet
        this.deck = [];                                                         //  Reset the deck
        // const playMore = prompt(`Wanna play more ? Or See the card handout statistic [(Y)es/(N)o/(S)tats]? `).toLowerCase();
        const playMore = prompt(`Wanna play more [(Y)es/(N)o], Check handout statistic or total chips [(S)tats,(C)hips]: `).toLowerCase();

        if(playMore === 'y' || playMore === 'yes') this.gameStart();
        else if (playMore === 'n' || playMore === 'no') console.log(`You got total ${this.totalBet} chips.`);
        else if (playMore === 'c' || playMore === 'chips') {
            console.log(`You have ${this.totalBet} chips.`);
            this.newGame();
        }
        else if (playMore === 's' || playMore === 'stats') {
            console.log(this.handOutCard.map( card => card.join(" : ") + " Times"));
            // console.log(`Handed out ${this.handOutCard.length} times.`);
            console.log(`Handed out ${this.handOutCard.reduce( (total,num) => total+=num[1],0) } Times.`);
            this.newGame();
        }
        else this.newGame();
    }

    gameStart() {
        this.setBet();
        this.getDeck();
        this.shuffle();
        this.dealCard();
        this.newGame();
    }
}

const game = new Pokdeng3();
game.gameStart();
