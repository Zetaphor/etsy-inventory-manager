var app = require('http').createServer(handler), io = require('socket.io').listen(app), fs = require('fs');

app.listen(80);

var indexedUsers = [];

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

function isUserIndexed(username) {
    var index = -1;
    for (var i = 0; i < indexedUsers.length; i++) {
        if (indexedUsers[i][0] == username) {
            index = i;
            break;
        }
    }
    return index;
}

function sendEvent(socketID, eventName, data) {
    io.sockets.socket(socketID).emit(eventName, data);
}

io.sockets.on('connection', function (socket) {
    console.log("Client connected succesfully");

    socket.on('updateUsers', function(data) {
        // Split out the username and remote user name
        var users = data.split(',');
        // Check for an existing user
        var userIndex = isUserIndexed(users[0]);
        if (userIndex == -1) {
            // Add the users current socket ID to the array
            users.push(socket.id);
            indexedUsers.push(users);
            console.log('User '+ users[0] +' added to index');
            console.log('Total Users: '+indexedUsers.length);
        } else {
            // Update the remote username
            indexedUsers[userIndex][1] = users[1];
            // Update the users socket ID
            indexedUsers[userIndex][2] = socket.id;
            console.log('User '+users[0]+' re-added to index');
        }
        sendEvent(socket.id, 'userUpdateSuccess');
    });

    socket.on('colorChange', function(data) {
        var remoteIndex = isUserIndexed(data[1]);
        if (remoteIndex != -1) {
            if (indexedUsers[remoteIndex][1] == data[0]) {
                // Remote user has this user indexed as their remote user
                sendEvent(indexedUsers[remoteIndex][2], 'colorChange', Array(data[0], data[2]));
                console.log('User '+ data[0] +' sent color '+ data[2] +' to user '+data[1]);
            } else {
                console.log('User '+ data[0] +' is not paired with user '+ data[1] +' sending aborted');
                sendEvent(socket.id, 'userNotPaired', data[1]);
            }
        } else {
            sendEvent(socket.id, 'userNotFound', data[1]);
        }
    });
});