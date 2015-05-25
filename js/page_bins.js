$(document).ready(function() {
    $.display.page.bins = {};

    $.display.page.bins.load = function() {
        $.display.toggleLoadingScreen($.etsyDB.getAllBins($.display.page.bins.drawBins));
    };

    $.display.page.bins.drawBins = function(bins) {
        console.log('Got bins');
        console.log(bins);
    };

    $('#createBin').on('click', function() {
        var bin_name = $('#bin_name').val();
        var bin_notes = $('#bin_notes').val();

        if (bin_name === '') Materialize.toast('Please enter a bin name', 4000);
        else {
            $('#modalCreateBin').closeModal();
            $.etsyDB.createBin(bin_name, bin_notes, null);
            $('#bin_name').val('');
            $('#bin_notes').val('');
        }
    });
});