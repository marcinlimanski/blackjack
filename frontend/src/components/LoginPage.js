import React from 'react';

function LoginPage({ player, dealer, startGame, addressInput, handleInputChange }) {
    if (player || dealer) return null;

    return (
        <div>
            <input
                type="text"
                id="addressTextbox"
                placeholder="Enter email address"
                value={addressInput}
                onChange={handleInputChange}
                required
            />
            <button onClick={startGame} disabled={!addressInput.trim()}>Start Game</button>
        </div>
    );
}

export default LoginPage;
