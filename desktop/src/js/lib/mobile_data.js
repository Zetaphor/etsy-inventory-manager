$(document).ready(function() {
    $.socket.on('getBinList', function() {
        $.etsyDB.bins.getAll(function(data) {
            $.sendToMobile('binData', data);
        });
    });
});