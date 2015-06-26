var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(8001);
console.log('Server started');

function handler (req, res) {
    res.writeHead(200);
    res.end("Hello world!");
}

function sendEvent(socketID, eventName, data) {
    io.sockets.socket(socketID).emit(eventName, data);
}

io.sockets.on('connection', function (socket) {
    console.log("Client connected successfully");

    socket.on('updateUsers', function(data) {
        sendEvent(socket.id, 'userUpdateSuccess');
    });

    socket.on('colorChange', function(data) {
        sendEvent(socket.id, 'userNotFound', 'test data');
    });
});