const assert = require('chai').assert;
const chai = require('chai');
const GameLogic = require('../utils/gameLogic');
const nock = require('nock');
const expect = chai.expect;

describe('GameLogic', function () {
    let game;

    beforeEach(function () {
        // Create a new instance of GameLogic before each test
        game = new GameLogic();

    });

    afterEach(() => {
        // Clean up nock after each test
        nock.cleanAll();
    });

    it('should initialize a new game state', function () {
        // Assert that the player and dealer have empty cards and a score of 0
        const player = game.getPlayer();
        const dealer = game.getDealer();

        assert.deepEqual(player.cards, []);
        assert.equal(player.score, 0);

        assert.deepEqual(dealer.cards, []);
        assert.equal(dealer.score, 0);
    });

    it('should deal a card', async function () {

        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11'] });

        // Deal a card and assert that it's a valid card (between 1 and 10)
        await game.getNewDeck();

        const card = await game.dealCard();

        expect(game.getPlayDeck().length).to.equal(5);
        assert.isNumber(card);
        assert.isAtLeast(card, 1);
        assert.isAtMost(card, 11);
    });

    it('should handle player "hit" action', async function () {
        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11'] }); // Replace with your mock data

        await game.hit();
        const player = game.getPlayer();
        assert.isNotEmpty(player.cards);
    });

    it('should handle player "stand" action', async function () {
        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11'] }); // Replace with your mock data

        await game.stand();
        const dealer = game.getDealer();
        const player = game.getPlayer();
        assert.isNotEmpty(dealer.cards);
        assert.isEmpty(player.cards);
    });

    it('should handle player "reset" action', async function () {
        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11'] }); // Replace with your mock data

        game.restGame()
        const dealerReset = game.getDealer();
        const playerReset = game.getPlayer();
        assert.isEmpty(dealerReset.cards);
        assert.isEmpty(playerReset.cards);
    });

    it('should handle card deck reduce', async function () {
        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11'] }); // Replace with your mock data

        // After hit, player & dealer will have a card. Once rest, deck should be empty
        await game.getNewDeck();
        assert.equal(game.getPlayDeck().length, 6);

        const card = await game.dealCard();
        assert.equal(game.getPlayDeck().length, 5);
    });

    it('should handle new deck shuffle', async function () {
        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11'] }); // Replace with your mock data

        await game.getNewDeck();
        assert.equal(game.getPlayDeck().length, 6);
        assert.notEqual(game.getPlayDeck, [1,2,3,4,10,11]);
    });

    it('should handle temp dealer, only show one card in his deck', async function () {
        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11'] }); // Replace with your mock data


        await game.startGame();
        let dealerCards = game.getTempDealer();
        assert.equal(dealerCards.cards.length, 1);
    });

    it('should handle check score, and return game stats object', async function () {
        // Configure nock to mock the API endpoint
        nock('https://u0xv62mbgj-u0etdf90is-connect.us0-aws.kaleido.io')
            .get('/instances/0xd6a231bd45de2c6b1d200c2b5778c810e53cd134/shuffleCards')
            .query(true)
            .reply(200, { output: ['1', '2', '3', '4', '10', '11','1', '2', '3', '4', '10', '11'] });

        await game.startGame();
        await game.stand();
        let gameStats = game.checkScore();

        expect(gameStats.playerStats.cards).to.be.a('array');
        expect(gameStats.playerStats.score).to.be.a('number');
        expect(gameStats.dealerStats.cards).to.be.a('array');
        expect(gameStats.dealerStats.score).to.be.a('number');
        expect(gameStats.winner).to.be.a('string');
    });

});
