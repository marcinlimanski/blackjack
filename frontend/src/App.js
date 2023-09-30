import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './css/App.css';
import GameOver from './components/GameOver';
import LoginPage from './components/LoginPage';
import MainGamePage from './components/MainGamePage';

const config = require('./config');
const ENDPOINT = config.BACKEND_JACKBLACK_URL || 'http://localhost:3001';

function App() {
  const [player, setPlayer] = useState(null);
  const [dealer, setDealer] = useState(null);
  const [socket, setSocket] = useState(null);
  const [addressInput, setAddressInput] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    // Setting up listeners if socket is initialized
    if (newSocket) {
      newSocket.on('gameStarted', ({ player, dealer }) => {
        setPlayer(player);
        setDealer(dealer);
      });

      newSocket.on('playersUpdated', ({ player, dealer }) => {
        setPlayer(player);
        setDealer(dealer);
      });

      newSocket.on('gameOver', (gameWinner) => {
        setPlayer(gameWinner.playerStats);
        setDealer(gameWinner.dealerStats);
        setWinner(gameWinner.winner);
        setGameOver(true);
      });
    }

    // Clean up the socket connection and listeners
    return () => {
      if (newSocket) {
        newSocket.off('gameStarted');
        newSocket.off('playersUpdated');
        newSocket.off('gameOver');
        newSocket.disconnect();
      }
    };
  }, []);

  const startGame = () => {
    socket.emit('startGame', { address: addressInput });
  };

  const hit = () => {
    socket.emit('hit');
  };

  const stand = () => {
    socket.emit('stand');
  };

  const resetGame = () => {
    socket.emit('resetGame');
    setGameOver(false);
    setWinner(null);
  };


  const handleInputChange = (event) => {
    setAddressInput(event.target.value);
  };

  if (gameOver) {
    return (
        <div className="App">
          <header className="App-header">
            <h1>JackBlack Game</h1>
            <GameOver winner={winner} player={player} dealer={dealer} onResetGame={resetGame} />
          </header>
        </div>
    );
  }

  return (
      <div className="App">
        <header className="App-header">
          <h1>JackBlack Game</h1>
          <LoginPage
              player={player}
              dealer={dealer}
              startGame={startGame}
              addressInput={addressInput}
              handleInputChange={handleInputChange}
          />
          <MainGamePage
              player={player}
              dealer={dealer}
              hit={hit}
              stand={stand}
              resetGame={resetGame}
          />
        </header>
      </div>
  );
}

export default App;
