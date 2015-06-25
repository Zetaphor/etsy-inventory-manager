$(document).ready(function() {
    var socket = null;
    if ( typeof io === 'function' ) {
        socket = io.connect('http://localhost:8001');
        if (socket) {
            socket.on('connect', function() {
                console.log('socket.io connected');
            });
        } else {
            console.log('io was available, but deskSock isn\'t available. Is the nwk-socket.io app running on your local machine and providing "somenamespace"?');
        }
    } else {
        console.log('io isn\'t available. Is the nwk-socket.io app running on your local machine?');
    }
});