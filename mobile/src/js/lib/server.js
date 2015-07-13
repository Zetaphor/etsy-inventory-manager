$(document).ready(function() {
    $.socket = null;
    $.desktopSocketID = null;

    if ( typeof io === 'function' ) {
        $.socket = io.connect('http://localhost:8001', {query: 'type=mobile'});
        if (!$.socket) {
            console.log('Websocket unable to connect');
        }
    } else {
        console.log('Socket.IO object unavailable');
    }

    $.sendEvent = function(eventName, data) {
        data = typeof data !== 'undefined' ? data : '';
        $.socket.emit(eventName, data);
    };

    $.sendToDesktop = function(eventName, data) {
        $.socket.emit('sendCommand', {target: $.desktopSocketID, event: eventName, data: data});
    };

    $.socket.on('test', function(data) {
        console.log('Received message');
        console.log(data);
    });

    $.socket.on('connect', function() {
        console.log('Connected');
        // TODO: Show connected status
    });

    $.socket.on('desktopConnected', function(socketID) {
        $.desktopSocketID = socketID;
        console.log('Desktop connected: ' + $.desktopSocketID);
        $.sendToDesktop('test', {wee: 123});
    });

    $.socket.on('desktopDisconnected', function() {
        console.log('Desktop disconnected');
    });

    $.socket.io.on('connect_error', function(err) {
        console.log('Connection error: ' + err);
    });

    $.socket.on('binData', function(data) {
        console.log('Received bin data');
        console.log(data);
    });
});