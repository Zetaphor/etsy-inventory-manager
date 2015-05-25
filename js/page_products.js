$(document).ready(function() {
    $.display.page.products = {};
    var productTemplate = $('#productTemplate').clone();
    $('#productTemplate').remove();

    $.display.page.products.load = function() {
        $.display.toggleLoadingScreen($.etsy.getAllProducts($.display.page.products.drawProducts));
        $.etsy.getAllProducts($.display.page.products.drawProducts);
    };

    $.display.page.products.drawProducts = function(products) {
        var appendString = '';

        $.each(products, function(key, val) {
            var product = productTemplate;
            product.removeClass('template');

            var product_url = product.find('.listing-url');
            product_url.attr('href', 'http://www.etsy.com/listing/' + val.listing_id);
            product_url.html(val.title);

            if (val.bin_id == -1) product.find('.bin-id').html("None");
            else product.find('.bin-id').html(val.bin_id);

            product.find('.price').html(val.price);

            var created = new Date(val.created * 1000);
            product.find('.created').html(created.toGMTString());

            var original_date = new Date(val.original_creation * 1000);
            product.find('.original-created').html(original_date.toGMTString());

            appendString += ('<tr>' + product.html() + '</tr>');
        });

        // Try and cut some repaint time by using vanilla JS
        var productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = appendString;
    };
});