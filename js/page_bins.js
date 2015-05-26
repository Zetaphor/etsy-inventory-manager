$(document).ready(function() {
    $.display.page.bins = {};

    var binTemplate = $('#binTemplate').clone();
    $('#binTemplate').remove();

    $.display.page.bins.load = function() {
        $.display.toggleLoadingScreen($.etsyDB.bins.getAll($.display.page.bins.drawBins));
    };

    $.display.page.bins.drawBins = function(bins) {
        var appendString = '';
        $.each(bins, function(key, val) {
            var bin = binTemplate;
            bin.removeClass('template');
            bin.find('.bin-id').html(val.id);
            bin.find('.bin-name').html(val.name);
            bin.find('.bin-total').html(val.total);
            bin.find('.bin-notes').html(val.notes);

            var bin_actions = bin.find('.bin-actions');
            bin_actions.find('.btn-remove-bin').attr({
                "bin-id": val.id.toString(),
                "bin-name": val.name
            });

            bin_actions.find('.btn-edit-bin').attr({
                "bin-id": val.id.toString(),
                "bin-name": val.name,
                "bin-total": val.total
            });

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
            $.etsyDB.bins.add(bin_name, bin_notes, null);
            $('#bin_name').val('');
            $('#bin_notes').val('');
        }
    });

    $('body').on('click', '.btn-edit-bin', function() {
        console.log($(this).attr('bin-id'));
        console.log($(this).attr('bin-name'));
    });

    $('body').on('click', '.btn-remove-bin', function() {
        $('.binDeleteName').html($(this).attr('bin-name'));
        $('#binDeleteID').html($(this).attr('bin-id'));
        $('.binDeleteTotal').html($(this).attr('bin-total'));
        $('#modalDeleteBin').openModal();
    });

    $('#confirmDeleteBin').on('click', function() {
        $('#modalDeleteBin').closeModal();
        $.etsyDB.bins.delete(parseInt($('#binDeleteID').html()), $('.binDeleteName').html());
    });
});