$(document).ready(function() {
    $.socket.on('binData', function(data) {
        console.log('Bin data received');
        console.log(data);
    });
});