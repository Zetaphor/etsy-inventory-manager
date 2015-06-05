$(document).ready(function() {
    $.display.page.newproducts = {
        load: function() {
            $.display.toggleLoadingScreen($.etsyDB.products.getNew($.display.page.newproducts.drawProducts));
        },

        // Draw products table
        drawProducts: function(new_products) {
            var appendString = '';

            $.each(new_products, function(key, product_data) {
                var product = newProductTemplate;
                product.removeClass('template');

                var product_url = product.find('.listing-url');
                product_url.attr('href', 'http://www.etsy.com/listing/' + product_data.listing_id);
                product_url.attr('title', product_data.title);
                product_url.html(product_data.title);

                if (product_data.bin_id == -1) {
                    product.find('.bin-id').html('-1');
                    product.find('.bin-name').html('<i class="mdi-content-clear"></i>');
                }
                else {
                    product.find('.bin-id').html(product_data.bin_id);
                    product.find('.bin-name').html(product_data.bin_name);
                }

                product.find('.price').html(product_data.price);
                product.find('.created').html(moment(product_data.created).format('MMM D, h:mm a'));
                product.find('.original-created').html(moment(product_data.original_creation).format('MMM D, h:mm a'));

                var all_product_actions = product.find('.new-product-actions');
                all_product_actions.find('.btn-floating').attr({
                    "new-product-id": product_data.id.toString(),
                    "new-product-title": product_data.title,
                    "new-product-bin-id": product_data.bin_id
                });

                appendString += ('<tr id="new-product-row-' + product_data.id + '">' + product.html() + '</tr>');
            });

            // Try and cut some repaint time by using vanilla JS
            var newProductTableBody = document.getElementById('newProductTableBody');
            newProductTableBody.innerHTML = appendString;
        },

        // Draw product bin list
        drawBinList: function(bins) {
            var appendString = '';
            var currentBin = $('#newProductsBinID').html();
            $.each(bins, function(key, val) {
                if (currentBin == val.id) {
                    appendString += '<a href="#!" class="collection-item new-product-bin-list-item active" new-product-bin-id="' + val.id + '">';
                } else {
                    appendString += '<a href="#!" class="collection-item new-product-bin-list-item" new-product-bin-id="' + val.id + '">';
                }
                appendString += val.name + ' (' + val.total + ' Products)</a>';
            });

            // Try and cut some repaint time by using vanilla JS
            var newProductBinList = document.getElementById('newProductBinList');
            newProductBinList.innerHTML = appendString;
        },

        // Remove product after assigning bin
        updateProductBin: function(product_id, bin_id, bin_name) {
            $('#new-product-row-' + product_id).fadeOut('slow', function() {
                $(this).remove();
            });
        },

        // Remove product row
        removeProduct: function(product_id) {
            $('#new-product-row-' + product_id).fadeOut('slow', function() {
                $(this).remove();
            });
        },
    };

    var newProductTemplate = $('#newProductTemplate').clone();
    $('#newProductTemplate').remove();

    var newProductBinTemplate = $('#newProductBinTemplate');
    $('#newProductBinTemplate').remove();

    // Mark product as sold
    $('body').on('click', '.btn-new-product-sold', function() {
        // TODO: Open the dialog here
    });

    // Mark product bin list item active
    $('body').on('click', '.new-product-bin-list-item', function() {
        $('.new-product-bin-list-item').removeClass('active');
        $(this).addClass('active');
    });

    // Reload products
    $('#reloadNewProducts').on('click', function() {
        $.display.page.newproducts.load();
    });

    // Open product bin list modal
    $('body').on('click', '.btn-new-product-change-bin', function() {
        $('#newProductBinList').attr('new-product-id', $(this).attr('new-product-id'));
        $('#newProductBinTitle').html($(this).attr('new-product-title'));

        var bin_id = $('#new-product-row-' + $(this).attr('new-product-id')).find('.bin-id').html();
        $('#newProductsBinID').html(bin_id);

        if (bin_id == -1) $('#newProductBinName').html('None');
        else {
            var bin_name = $('#new-product-row-' + $(this).attr('new-product-id')).find('.bin-name').html();
            $('#newProductBinName').html(bin_name);
        }

        $.etsyDB.bins.getAll($.display.page.newproducts.drawBinList);
        $('#modalNewProductBin').openModal();
    });

    // Update product bin display
    $('#updateNewProductBin').on('click', function() {
        var product_id = $('#newProductBinList').attr('new-product-id'),
            bin_id =  $('#newProductBinList .active').attr('new-product-bin-id');
        $.etsyDB.products.setBin(product_id, bin_id, $.display.page.newproducts.updateProductBin);
        $('#modalNewProductBin').closeModal();
    });
});