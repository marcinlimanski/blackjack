const axios = require('axios');
const config = require('../config');

async function getDeckOfCards() {
    const url = config.DECK_OF_CARDS_URL_NO_ID + config.WALLET_ADDRESS;
    const headers = {
        'accept': 'application/json',
        'Authorization': config.DECK_OF_CARDS_AUTH_HEADER
    };

    try {
        const response = await axios.get(url, { headers });
        // TODO: fix this return type in the contract
        const return_deck = response.data.output.map((str) => parseInt(str, 10));
        return return_deck;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = {
    getDeckOfCards
};