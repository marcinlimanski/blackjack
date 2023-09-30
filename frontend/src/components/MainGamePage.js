import React from 'react';
import Card from './Card';

function MainGamePage({ player, dealer, hit, stand, resetGame }) {
    if (!player || !dealer) return null;

    const renderCards = (cards) => {
        if (!Array.isArray(cards)) return null;
        return cards.map((card, index) => <Card key={index} value={card} />);
    };

    return (
        <div>
            <h2>Dealer Cards:</h2>
            <div className="card-container">
                {renderCards(dealer.cards)}
            </div>
            <h2>Player Cards:</h2>
            <div className="card-container">
                {renderCards(player.cards)}
            </div>
            <h2>Player Score: {player.score}</h2>
            <button onClick={hit}>Hit</button>
            <button onClick={stand}>Stand</button>
            <button onClick={resetGame}>Reset Game</button>
        </div>
    );
}

export default MainGamePage;
