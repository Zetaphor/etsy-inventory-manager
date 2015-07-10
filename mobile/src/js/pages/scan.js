$(document).ready(function() {
    $.display.page.scan = {
        load: function() {
            console.log('Load scan');
        },

        scanSuccess: function(data) {
            if (!data.cancelled) {
                $('#binContents').html(data.text);
            }
        },

        scanFail: function(error) {
            $('#binContents').html(error);
        }
    };
});