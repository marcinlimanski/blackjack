const assert = require('chai').assert;
const io = require('socket.io-client');const server = require('../server');

const socketURL = 'http://localhost:3001';

// Define options for socket.io-client
const socketOptions = {
    transports: ['websocket'],
    'force new connection': true,
};

describe('Socket.io Server', function () {
    let clientSocket;

    before(function (done) {
        // Connect a client socket before running tests
        clientSocket = io.connect(socketURL, socketOptions);
        clientSocket.on('connect', function () {
            done();
        });
    });

    after(function (done) {
        // Disconnect the client socket after tests
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }
        done();
    });

    it('should connect a client to the server', function (done) {
        assert.isNotNull(clientSocket, 'Client socket should not be null');
        done();
    });

});
