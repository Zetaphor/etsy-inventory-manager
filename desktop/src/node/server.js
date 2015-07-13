var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    desktop = false,
    mobile = false;

app.listen(8001);
console.log('Server started');

function handler (req, res) {
    res.writeHead(200);
    res.end("Hello world!");
}

function sendEvent(socketID, eventName, data) {
    data = typeof data !== 'undefined' ? data : '';
    io.to(socketID).emit(eventName, data);
}

io.sockets.on('connection', function (socket) {
    if (socket.handshake.query.type === 'mobile') {
        mobile = socket.id;
        console.log('Mobile connected');
    } else {
        desktop = socket.id;
        console.log('Desktop connected');
    }

    if (desktop && mobile) {
        sendEvent(mobile, 'desktopConnected', desktop);
        sendEvent(desktop, 'mobileConnected', mobile);
        sendEvent(mobile, 'receivedData', 'test');
    }

    socket.on('disconnect', function() {
        if (socket.id === desktop) {
            console.log('Desktop disconnected');
            desktop = false;
            if (mobile) sendEvent(mobile, 'desktopDisconnected');
        } else if (socket.id === mobile) {
            console.log('Mobile disconnected');
            mobile = false;
            if (desktop) sendEvent(desktop, 'mobileDisconnected');
        }
    });

    socket.on('sendCommand', function(command) {
        io.sockets.to(command.target).emit(command.event, command.data);
    });
});