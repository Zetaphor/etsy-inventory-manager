$(document).ready(function() {
    $.display.page.bins = {
        load: function() {
            console.log('Load bins');
        },

        getBinList: function() {
            console.log('Requesting bin list');
            $.sendToDesktop('getBinList', false);
        },

        drawBinList: function(bin_data) {
            console.log(bin_data);
        }
    };

    $('#getBinList').on('click', function() {
        $.display.page.bins.getBinList();
    });

    $.socket.on('binData', function(data) {
        console.log('Received bin data');
        console.log(data);
    });
});