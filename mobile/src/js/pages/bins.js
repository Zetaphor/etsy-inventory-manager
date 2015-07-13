$(document).ready(function() {
    $.display.page.bins = {
        load: function() {
            console.log('Load bins');
        },

        getBinList: function() {
            console.log('Requesting bin list');
            $.sendEvent('getBinList');
        },

        drawBinList: function(bin_data) {
            console.log(bin_data);
        }
    };

    $('#getBinList').on('click', function() {
        $.display.page.bins.getBinList();
    });
});