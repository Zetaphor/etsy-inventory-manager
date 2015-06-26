$(document).ready(function() {
    var socket = null;
    if ( typeof io === 'function' ) {
        socket = io.connect('http://localhost:8001');
        if (!socket) {
            console.log('Websocket unable to connect');
        }
    } else {
        console.log('Socket.IO object unavailable');
    }

    socket.on('connect', function() {
        console.log('Connected');
    });

    socket.io.on('connect_error', function(err) {
        console.log('Connection error');
    });
});