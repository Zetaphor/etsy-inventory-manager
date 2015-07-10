var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(8001);
console.log('Server started');

function handler (req, res) {
    res.writeHead(200);
    res.end("Hello world!");
}

function sendEvent(eventName, data) {
    data = typeof data !== 'undefined' ? data : '';
    io.sockets.emit(eventName, data);
}

io.sockets.on('connection', function (socket) {

    socket.on('desktopConnect', function(data) {
        console.log("Desktop connected");
        sendEvent('desktopConnected');
    });

    socket.on('mobileConnect', function(data) {
        console.log("Mobile connected");
        sendEvent('mobileConnected');
    });
});