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
            bin_actions.find('.btn-floating').attr({
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

    $('body').on('click', '.btn-print-bin', function() {
        $('#previewTitle').html($(this).attr('bin-name'));
        $('#previewImage').attr('src', $.display.getQRCode('Bin-ID:' + $(this).attr('bin-id'), 250));

        $('#modalPrintBinLabel').openModal();
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

    $('input[type=radio][name=label-size]').on('change', function() {
        var id = $(this).attr('id');
        if (id == 'custom') {
            console.log('custom');
            $('.input-label-size').fadeIn('slow');
        } else {
            $('.input-label-size').fadeOut('slow');
            console.log('Standard size');
        }
    });

    $('#printBin').on('click', function() {
        $('#modalPrintBinLabel').closeModal();
        var printWindow = window.open('', "Test Window", "height=600,width=800");
        var windowContent = printWindow.document.body;
        windowContent.title = 'Test';
        $(windowContent).html($('#printPreview').html());
        $(windowContent).find('#previewImage').css({
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50%' // Change this to the set width
        });
        $(windowContent).find('#previewTitle').css({
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50%', // Change this to the set width
            textAlign: 'center',
            top: '-1em',
            fontSize: '2em',
            fontWeight: 'bold',
            wordWrap: 'break-word'
        });
        printWindow.print();
    });
});