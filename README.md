[![CI](https://github.com/marcinlimanski/developer-challenge/actions/workflows/node.js.yml/badge.svg)](https://github.com/marcinlimanski/developer-challenge/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/marcinlimanski/developer-challenge/graph/badge.svg?token=NBRDPD718A)](https://codecov.io/gh/marcinlimanski/developer-challenge)
# JackBlack The Game

<p align="center">
    <img src="./frontend/public/jackblack.png">
</p>

JackBlack The Game.

Dealer and player get 2 cards, player can only see dealers first card. Player has to decided whether to 'hit' or 'stand'.
- Hit: will deal one card and calculate the score, if the score is more than 21, its Game Over!
- Stand: will finish the round for the player and deal cards to dealer. Dealer will draw to 17.
- Reset Game: will start new round and deal new cards.
At the end, scores will be compared and who ever gets closer to 21 Wins!

Frontend is build using React.js + socket.io-client.
Backend is build with Node.js + socket+io.

### local environment build / run

Make sure node.js is installed

Backend:
1. cd ./backend
2. npm install
3. npm start

Frontend:
1. cd ./frontend
2. npm install
3. npm start

