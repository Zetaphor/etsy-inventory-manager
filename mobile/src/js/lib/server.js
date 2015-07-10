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

    function sendEvent(eventName, data) {
        data = typeof data !== 'undefined' ? data : '';
        socket.emit(eventName, data);
    }

    socket.on('connect', function() {
        console.log('Connected');
        sendEvent('mobileConnect');
    });

    socket.on('desktopConnected', function() {
        console.log('Desktop connected');
    });

    socket.io.on('connect_error', function(err) {
        console.log('Connection error');
    });
});