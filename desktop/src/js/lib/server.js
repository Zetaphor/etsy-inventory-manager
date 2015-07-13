$(document).ready(function() {
    $.socket = null;
    $.mobileSocketID = null;

    if ( typeof io === 'function' ) {
        $.socket = io.connect('http://localhost:8001', {query: 'type=desktop'});
        if (!$.socket) {
            console.log('Websocket unable to connect');
        }
    } else {
        console.log('Socket.IO object unavailable');
    }

    function sendEvent(eventName, data) {
        data = typeof data !== 'undefined' ? data : '';
        $.socket.emit(eventName, data);
    }

    $.sendToMobile = function(eventName, data) {
        $.socket.emit('sendCommand', {target: $.mobileSocketID, event: eventName, data: data});
    };

    $.socket.on('test', function(data) {
        console.log('Received message');
        console.log(data);
    });

    $.socket.on('connect', function() {
        $('#serverStatusImg').removeClass().addClass('right mdi-device-wifi-tethering');
        $('#serverStatus').html('Waiting For Device');
        console.log('Connected');
        //sendEvent('desktopConnect');
    });

    $.socket.on('mobileConnected', function(socketID) {
        $.mobileSocketID = socketID;
        console.log('Mobile connected: ' + $.mobileSocketID);
        $('#serverStatus').html('Connected');
        $.sendToMobile('test', {dsa: 123});
    });

    $.socket.on('mobileDisconnected', function() {
        console.log('Mobile disconnected');
    });

    $.socket.io.on('connect_error', function(err) {
        $('#serverStatusImg').removeClass().addClass('right mdi-navigation-cancel');
        $('#serverStatus').html('Server Error');
    });

    $.socket.io.on('getBinList', function() {
        console.log('Bin list requested');
    });


});