$(document).ready(function() {
    var deskSock = null;
    if ( typeof io === 'function' ) {
        deskSock = io('localhost:8883/somenamespace');
        if (deskSock) {
            deskSock.on('connect', function() {
                console.log('socket.io connect to: deskSock.io.nsps["/somenamespace"].io.', deskSock.io.nsps["/somenamespace"].io.uri );
                deskSock.emit('ping', { from: "deskSock:connect" } );
            });

            deskSock.on('pong', function (data) {
                console.log( 'deskSock/desk:pong:', data );
            });
        } else {
            console.log('io was available, but deskSock isn\'t available. Is the nwk-socket.io app running on your local machine and providing "somenamespace"?');
        }
    } else {
        console.log('io isn\'t available. Is the nwk-socket.io app running on your local machine?');
    }
});