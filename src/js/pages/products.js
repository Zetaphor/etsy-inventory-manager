$(document).ready(function() {
    $.display.page.products = {
        load: function() {
            $.display.toggleLoadingScreen($.etsyDB.products.getAll($.display.page.products.drawProducts));
        },

        drawProducts: function(all_products) {
            var appendString = '';

            $.each(all_products, function(key, product_data) {
                var product = allProductTemplate;
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

                var all_product_actions = product.find('.all-product-actions');
                all_product_actions.find('.btn-floating').attr({
                    "all-product-id": product_data.id.toString(),
                    "all-product-title": product_data.title,
                    "all-product-bin-id": product_data.bin_id
                });

                appendString += ('<tr id="all-product-row-' + product_data.id + '">' + product.html() + '</tr>');
            });

            // Try and cut some repaint time by using vanilla JS
            var productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = appendString;
        },

        drawBinList: function(bins) {
            var appendString = '';
            var currentBin = $('#allProductsBinID').html();
            $.each(bins, function(key, val) {
                if (currentBin == val.id) {
                    appendString += '<a href="#!" class="collection-item all-product-bin-list-item active" all-product-bin-id="' + val.id + '">';
                } else {
                    appendString += '<a href="#!" class="collection-item all-product-bin-list-item" all-product-bin-id="' + val.id + '">';
                }
                appendString += val.name + ' (' + val.total + ' Products)</a>';
            });

            // Try and cut some repaint time by using vanilla JS
            var allProductBinList = document.getElementById('allProductBinList');
            allProductBinList.innerHTML = appendString;
        },

        updateProductBin: function(product_id, bin_id, bin_name) {
            var product_row = $('#all-product-row-' + product_id);
            product_row.find('.bin-name').html(bin_name);
            product_row.find('.bin-id').html(bin_id);
            product_row.find('.all-product-actions').find('.btn-floating').attr({
                "all-product-bin-id": bin_id
            });
        }
    };

    var allProductTemplate = $('#allProductTemplate').clone();
    $('#allProductTemplate').remove();

    var allProductBinTemplate = $('#allProductBinTemplate');
    $('#allProductBinTemplate').remove();


    $('body').on('click', '.all-product-bin-list-item', function() {
        $('.all-product-bin-list-item').removeClass('active');
        $(this).addClass('active');
    });

    $('#reloadProducts').on('click', function() {
        $.display.page.products.load();
    });

    $('body').on('click', '.btn-all-product-change-bin', function() {
        $('#allProductBinList').attr('all-product-id', $(this).attr('all-product-id'));
        $('#allProductBinTitle').html($(this).attr('all-product-title'));

        var bin_id = $('#all-product-row-' + $(this).attr('all-product-id')).find('.bin-id').html();
        $('#allProductsBinID').html(bin_id);

        if (bin_id == -1) $('#allProductBinName').html('None');
        else {
            var bin_name = $('#all-product-row-' + $(this).attr('all-product-id')).find('.bin-name').html();
            $('#allProductBinName').html(bin_name);
        }

        $.etsyDB.bins.getAll($.display.page.products.drawBinList);
        $('#modalAllProductBin').openModal();
    });

    $('#updateAllProductBin').on('click', function() {
        var product_id = $('#allProductBinList').attr('all-product-id'),
            bin_id =  $('#allProductBinList .active').attr('all-product-bin-id');
        $.etsyDB.products.setBin(product_id, bin_id, $.display.page.products.updateProductBin);
        $('#modalAllProductBin').closeModal();
    });
});