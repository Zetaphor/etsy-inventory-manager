var app = io = require('socket.io').listen(app);
console.log('Test');

function sendEvent(socketID, eventName, data) {
    io.sockets.socket(socketID).emit(eventName, data);
}

io.sockets.on('connection', function (socket) {
    console.log("Client connected succesfully");

    socket.on('updateUsers', function(data) {
        sendEvent(socket.id, 'userUpdateSuccess');
    });

    socket.on('colorChange', function(data) {

    });
});