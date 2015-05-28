$(document).ready(function() {
    $.display.page.products = {
        load: function() {
            $.display.toggleLoadingScreen($.etsyDB.products.getAll($.display.page.products.drawProducts));
        },

        drawProducts: function(products) {
            var appendString = '';

            $.each(products, function(key, val) {
                var product = productTemplate;
                product.removeClass('template');

                var product_url = product.find('.listing-url');
                product_url.attr('href', 'http://www.etsy.com/listing/' + val.listing_id);
                product_url.attr('title', val.title);
                product_url.html(val.title);

                if (val.bin_id == -1) product.find('.bin-id').html('<i class="mdi-content-clear"></i>');
                else product.find('.bin-id').html(val.bin_id);

                product.find('.price').html(val.price);
                product.find('.created').html(moment(val.created).format('MMM D, h:mm a'));
                product.find('.original-created').html(moment(val.original_creation).format('MMM D, h:mm a'));

                appendString += ('<tr>' + product.html() + '</tr>');
            });

            // Try and cut some repaint time by using vanilla JS
            var productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = appendString;
        }
    };

    var productTemplate = $('#productTemplate').clone();
    $('#productTemplate').remove();


    $('#reloadProducts').on('click', function() {
        $.display.page.products.load();
    });
});