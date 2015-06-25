$(document).ready(function() {
    var socket = null;
    if ( typeof io === 'function' ) {
        socket = io.connect('http://localhost:8001');
        if (!socket) {
            console.log('io was available, but deskSock isn\'t available. Is the nwk-socket.io app running on your local machine and providing "somenamespace"?');
        }
    } else {
        console.log('io isn\'t available. Is the nwk-socket.io app running on your local machine?');
    }

    socket.on('connect', function() {
        console.log('socket.io connected');
        $('#serverStatusImg').removeClass().addClass('right mdi-device-wifi-tethering');
        $('#serverStatus').html('Waiting For Device');
    });

    socket.io.on('connect_error', function(err) {
        // handle server error here
        console.log('Error connecting to server');
        $('#serverStatusImg').removeClass().addClass('right mdi-navigation-cancel');
        $('#serverStatus').html('Server Error');
    });
});