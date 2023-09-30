import React from 'react';
import Card from "./Card";

const renderDealerCards = (cards) => {
    if (!Array.isArray(cards)) return null;
    return cards.map((card, index) => <Card key={index} value={card} />);
};

function GameOver({ winner, player, dealer, onResetGame }) {
    return (
        <div>
            <h2>Game Over</h2>
            <h3>Winner: {winner}</h3>
            <p>Player Score: {player.score}</p>
            <p>Dealer Score: {dealer.score} </p>
            <p>Dealer cards: </p>
            <div className="card-container">
                {renderDealerCards(dealer.cards)}
            </div>
            <button onClick={onResetGame}>Reset Game</button>
        </div>
    );
}

export default GameOver;
