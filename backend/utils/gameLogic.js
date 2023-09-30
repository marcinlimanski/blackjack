const {getDeckOfCards} = require('../api/apiDeckOfCards')

class GameLogic {

    constructor() {
        this.player = { cards: [], score: 0 };
        this.dealer = { cards: [], score: 0 };
        this.gameDeck = [];
    }

    getPlayer() {
        return this.player;
    }

    getTempDealer() {
        const returnDealer = { cards: [], score: 0 };
        returnDealer.cards[0] = this.dealer.cards[0];
        return returnDealer
    }

    getDealer() {
        return this.dealer;
    }

    getPlayDeck() {
        return this.gameDeck;
    }

    async getNewDeck() {
        let deck = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
        ];
        this.gameDeck = this.shuffleDeck(deck);
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            // Generate a random index between 0 and i (inclusive)
            const randomIndex = Math.floor(Math.random() * (i + 1));

            // Swap elements at i and randomIndex
            const temp = deck[i];
            deck[i] = deck[randomIndex];
            deck[randomIndex] = temp;
        }
        return deck;
    }

    async startGame() {
        if (this.gameDeck.length === 0) {
            await this.getNewDeck();
            console.log('DEBUG: getting new game deck!');
        }

        // Deal a card to the player 1
        const newCard1 = await this.dealCard();
        this.player.cards.push(newCard1);
        this.player.score += newCard1;

        // Deal a card to the player 2
        const newCard2 = await this.dealCard();
        this.player.cards.push(newCard2);
        this.player.score += newCard2;

        // Deal card to dealer
        const newDealerCard = await this.dealCard();
        this.dealer.cards.push(newDealerCard);
        this.dealer.score += newDealerCard;

        // Deal card to dealer 2
        const newDealerCard2 = await this.dealCard();
        this.dealer.cards.push(newDealerCard2);
        this.dealer.score += newDealerCard2;
    }

    async dealCard () {
        if (this.gameDeck.length !== 0) {
            let card = this.gameDeck.shift();
            return card
        } else {
            await this.getNewDeck();
            let card = this.gameDeck.shift();
            return card
        }
    }

    restGame() {
        this.player.cards = [];
        this.player.score = 0;

        this.dealer.cards = [];
        this.dealer.score = 0;
    }

    async hit() {
        // Deal a card to the player
        const newCard = await this.dealCard();
        this.player.cards.push(newCard);

        // Calculate new score for the player
        this.player.score += newCard;
    }

    async stand() {
        // Deal a card to the player

        while (this.dealer.score <= 17) {
            const newDealerCard = await this.dealCard();
            this.dealer.cards.push(newDealerCard);

            // Calculate new score for the player
            this.dealer.score += newDealerCard;
        }
    }

    checkScore() {
        let winner = ''
        let dealer_score = this.getDealer().score;
        let player_score = this.getPlayer().score;

        if (dealer_score === player_score) {
            winner = 'Draw!';
        } else if (dealer_score === 21 ) {
            winner = 'dealer';
        } else if (player_score === 21) {
            winner = 'player';
        } else if (dealer_score > 21) {
            winner = 'player';
        } else if (player_score > 21) {
            winner = 'dealer';
        } else if (dealer_score > player_score && dealer_score < 21) {
            winner = 'dealer';
        } else if (player_score > dealer_score && player_score < 21) {
            winner = 'player';
        }

        return {
            'playerStats': this.getPlayer(),
            'dealerStats': this.getDealer(),
            'winner': winner
        }
    }
}

module.exports = GameLogic;
