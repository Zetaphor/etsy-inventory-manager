$(document).ready(function() {
    $.display.page.products = {};

    $.display.page.products.load = function() {
        $.etsy.getAllProducts($.display.page.products.drawProducts);
    };

    $.display.page.products.drawProducts = function(products) {
        $.each(products, function(key, val) {
            var product = $('#productTemplate').clone();
            product.removeClass('template');

            product.find('.listing-id').html(val.listing_id);
            product.find('.title').html(val.title);

            if (val.bin_id == -1) product.find('.bin-id').html("None");
            else product.find('.bin-id').html(val.bin_id);
            
            product.find('.price').html(val.price);
            product.find('.created').html(val.created);
            product.find('.original-created').html(val.original_creation);

            product.appendTo('#productsTable tbody');
        });
    };
});