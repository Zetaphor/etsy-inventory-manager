$(document).ready(function() {
    $.display.page.bins = {};

    var binTemplate = $('#binTemplate').clone();
    $('#binTemplate').remove();

    $.display.page.bins.load = function() {
        $.display.toggleLoadingScreen($.etsyDB.getAllBins($.display.page.bins.drawBins));
    };

    $.display.page.bins.drawBins = function(bins) {
        var appendString = '';
        $.each(bins, function(key, val) {
            var bin = binTemplate;
            bin.removeClass('template');

            bin.find('.bin_id').html(val.id);
            bin.find('.bin-name').html(val.name);
            bin.find('.bin-total').html(val.total);
            bin.find('.bin-notes').html(val.notes);

            appendString += ('<tr>' + bin.html() + '</tr>');
        });

        // Try and cut some repaint time by using vanilla JS
        var binsTableBody = document.getElementById('binsTableBody');
        binsTableBody.innerHTML = appendString;
    };

    $('#reloadBins').on('click', function() {
        $.display.page.bins.load();
    });

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