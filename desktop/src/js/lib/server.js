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
        $('#serverStatusImg').removeClass().addClass('right mdi-device-wifi-tethering');
        $('#serverStatus').html('Waiting For Device');
        console.log('Connected');
        sendEvent('desktopConnect');
    });

    socket.on('mobileConnected', function() {
        console.log('Mobile connected');
    });

    socket.io.on('connect_error', function(err) {
        $('#serverStatusImg').removeClass().addClass('right mdi-navigation-cancel');
        $('#serverStatus').html('Server Error');
    });
});