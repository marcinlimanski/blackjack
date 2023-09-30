const express = require('express');
const http = require('http');
const cors = require('cors'); // Import the cors package
const GameLogic = require('./utils/gameLogic');
const config = require('./config');
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

const connectedSockets = []; // Store connected sockets

io.on('connection', (socket) => {
    console.log(`User:${socket.id} connected`);
    connectedSockets.push(socket); // Add the socket to the list

    socket.on('disconnect', () => {
        console.log(`A user disconnected with ID: ${socket.id}`);
        connectedSockets.forEach(element => {
            console.log('socket id in array'+element.id);
        });
        const index = connectedSockets.indexOf(socket);
        if (index !== -1) {
            connectedSockets.splice(index, 1); // Remove the socket from the list
        }
    });

    const game = new GameLogic();

    // Reset game
    socket.on('resetGame', async () => {
        try {
            game.restGame();
            await game.startGame();
            console.log('DEBUG: ' + game.getPlayDeck())
            let player = game.getPlayer();
            let dealer = game.getTempDealer();
            if (player.score === 21) {
                socket.emit('gameOver', (game.checkScore()));
            } else {
                socket.emit('gameStarted', {player, dealer});
            }
        } catch (e) {
            console.log('Error: resetGame' + e)
        }
    });

    // Reset game
    socket.on('startGame', async ({ address }) => {
        try {
            config.WALLET_ADDRESS = address;
            await game.startGame();
            console.log('DEBUG start game: ' + game.getPlayDeck())
            let player = game.getPlayer();
            let dealer = game.getTempDealer();
            if (player.score === 21) {
                socket.emit('gameOver', (game.checkScore()));
            } else {
                socket.emit('gameStarted', {player, dealer});
            }
        } catch (e) {
            console.log('Error: startGame' + e);
        }
    });

    // Player actions
    socket.on('hit', async () => {
        try {
            await game.hit();
            let player = game.getPlayer();
            let dealer = game.getTempDealer();
            if (player.score >= 21) {
                socket.emit('gameOver', (game.checkScore()));
            } else {
                socket.emit('playersUpdated', {player, dealer});
            }
        } catch (e) {
            console.log('Error: hit' + e);
        }
    });

    // Player actions
    socket.on('stand', async () => {
        try {
            await game.stand(); // Deal rest of dealer cards
            let player = game.getPlayer();
            let dealer = game.getDealer();
            socket.emit('gameOver', (game.checkScore()));
        } catch (e) {
            console.log('Error: stand' + e);
        }
    });

});

server.listen(3001, () => {
    console.log('Server listening on port 3001');
});

const closeServer = () => {
    console.log('Closing server...');
    // Close all connected sockets
    for (const socket of connectedSockets) {
        socket.disconnect(true); // Force disconnect the socket
    }

    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', closeServer);
