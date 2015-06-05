$(document).ready(function() {
    $.display.page.bins = {
        load: function() {
            $.display.toggleLoadingScreen($.etsyDB.bins.getAll($.display.page.bins.drawBins));
        },

        // Draw bins table
        drawBins: function(bins, append) {
            append = typeof append !== 'undefined' ? append : false;
            var appendString = '';
            $.each(bins, function(key, val) {
                var bin = binTemplate;
                bin.removeClass('template');
                bin.find('.bin-id').html(val.id);
                bin.find('.bin-name').html(val.name);
                bin.find('.bin-total').html(val.total);
                bin.find('.bin-notes')
                    .html(val.notes)
                    .attr('title', val.notes);

                var bin_actions = bin.find('.bin-actions');
                bin_actions.find('.btn-floating').attr({
                    "bin-id": val.id.toString(),
                    "bin-name": val.name,
                    "bin-notes": val.notes,
                    "bin-total": val.total
                });

                appendString += ('<tr id="bin-row-' + val.id.toString() + '">' + bin.html() + '</tr>');
            });

            if (append) {
                $('#binsTableBody').append(appendString);
            } else {
                // Try and cut some repaint time by using vanilla JS
                var binsTableBody = document.getElementById('binsTableBody');
                binsTableBody.innerHTML = appendString;
            }
        },

        // Update bin info display
        updateBin: function(bin) {
            var bin_row = $('#bin-row-' + bin.id);
            bin_row.find('.bin-name').html(bin.name);
            bin_row.find('.bin-notes')
                .html(bin.notes)
                .attr('title', bin.notes);
        },

        // Remove bin row
        removeBin: function(bin_id) {
            $('#bin-row-' + bin_id).fadeOut('slow', function() {
                $(this).remove();
            });
        },

        // Draw bin contents modal
        drawBinContents: function(bin_products) {
            var appendString = '';

            $.each(bin_products, function(key, product_data) {
                var product = binProductTemplate;
                product.removeClass('template');

                var product_url = product.find('.listing-url');
                product_url.attr('href', 'http://www.etsy.com/listing/' + product_data.listing_id);
                product_url.attr('title', product_data.title);
                product_url.html(product_data.title);
                product.find('.price').html(product_data.price);
                product.find('.created').html(moment(product_data.created).format('MMM D, h:mm a'));
                product.find('.original-created').html(moment(product_data.original_creation).format('MMM D, h:mm a'));

                var all_product_actions = product.find('.all-product-actions');
                all_product_actions.find('.btn-floating').attr({
                    "all-product-id": product_data.id.toString(),
                    "all-product-title": product_data.title,
                    "all-product-bin-id": product_data.bin_id
                });

                appendString += ('<tr id="bin-product-row-' + product_data.id + '">' + product.html() + '</tr>');
            });

            // Try and cut some repaint time by using vanilla JS
            var binProductTableBody = document.getElementById('binProductTableBody');
            binProductTableBody.innerHTML = appendString;

            $('#modalViewBinContents').openModal();
        }
    };

    var binTemplate = $('#binTemplate').clone();
    $('#binTemplate').remove();

    var binProductTemplate = $('#binProductTemplate').clone();
    $('#binProductTemplate').remove();

    // Reload bins
    $('#reloadBins').on('click', function() {
        $.display.page.bins.load();
    });

    // Open bin view contents modal
    $('body').on('click', '.btn-view-bin', function() {
        $('#viewBinProductsName').html($(this).attr('bin-name'));
        $.etsyDB.bins.getContents($(this).attr('bin-id'), $.display.page.bins.drawBinContents);
    });

    // Create new bin
    $('#createBin').on('click', function() {
        var bin_name = $('#binCreateName').val();
        var bin_notes = $('#binCreateNotes').val();

        if (bin_name === '') $.display.toastInfo('Please enter a bin name');
        else {
            $('#modalCreateBin').closeModal();
            $.etsyDB.bins.add(bin_name, bin_notes, $.display.page.bins.drawBins);
            $('#binCreateName').val('');
            $('#binCreateNotes').val('');
        }
    });

    // Open bin edit modal
    $('body').on('click', '.btn-edit-bin', function() {
        $('#binEditID').val($(this).attr('bin-id'));
        $("label[for='binEditID']").addClass('active');

        $('#binEditName').val($(this).attr('bin-name'));
        $("label[for='binEditName']").addClass('active');

        $('#binEditNotes').val($(this).attr('bin-notes'));
        $("label[for='binEditNotes']").addClass('active');

        $('#modalEditBin').openModal();
    });

    // Edit bin info
    $('#editBin').on('click', function() {
        if ($('#binEditName').val() === '') $.display.toastError('Bin name cannot be empty!');
        else {
            $.etsyDB.bins.update($('#binEditID').val(), $('#binEditName').val(), $('#binEditNotes').val(), $.display.page.bins.updateBin);
            $('#modalEditBin').closeModal();
        }
    });

    // Open bin print label modal
    $('body').on('click', '.btn-print-bin', function() {
        $('#previewTitle').html($(this).attr('bin-name'));
        $('#previewImage').attr('src', $.display.getQRCode('Bin-ID:' + $(this).attr('bin-id'), 250));
        $('#modalPrintBinLabel').openModal();
    });

    // Confirm bin deletion
    $('body').on('click', '.btn-remove-bin', function() {
        $('.binDeleteName').html($(this).attr('bin-name'));
        $('#binDeleteID').html($(this).attr('bin-id'));
        $('.binDeleteTotal').html($(this).attr('bin-total'));
        $('#modalDeleteBin').openModal();
    });

    // Delete bin after confirmation
    $('body').on('click', '#confirmDeleteBin', function() {
        $('#modalDeleteBin').closeModal();
        $.etsyDB.bins.delete($('#binDeleteID').html(), $('.binDeleteName').html(), $.display.page.bins.removeBin);
    });

    // Update label size display on change
    $('input[type=radio][name=label-size]').on('change', function() {
        $('#labelImageSize').val($.display.labelSizes[$(this).attr('id')].image);
        $('#labelFontSize').val($.display.labelSizes[$(this).attr('id')].font);
    });

    // Print bin label
    $('#printBin').on('click', function() {
        var labelImageSize = $('#labelImageSize').val(),
            labelFontSize = $('#labelFontSize').val(),
            printWindow = window.open('', "Test Window", "height=600,width=800"),
            windowContent = printWindow.document.body;
        $('#modalPrintBinLabel').closeModal();
        windowContent.title = 'Test';
        $(windowContent).html($('#printPreview').html());
        $(windowContent).find('#previewImage').attr('src', $.display.getQRCode('Bin-ID:' + $(this).attr('bin-id'), labelImageSize));

        $(windowContent).find('#previewImage').css({
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            width: labelImageSize + 'px'
        });
        $(windowContent).find('#previewTitle').css({
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            width: labelImageSize + 'px',
            textAlign: 'center',
            top: '-1em',
            fontSize: labelFontSize + 'px',
            fontWeight: 'bold',
            wordWrap: 'break-word'
        });
        printWindow.print();
    });
});