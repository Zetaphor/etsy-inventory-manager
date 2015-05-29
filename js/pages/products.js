$(document).ready(function() {
    $.display.page.products = {
        load: function() {
            $.display.toggleLoadingScreen($.etsyDB.products.getAll($.display.page.products.drawProducts));
        },

        drawProducts: function(products) {
            var appendString = '';

            $.each(products, function(key, val) {
                var product = allProductTemplate;
                product.removeClass('template');

                var product_url = product.find('.listing-url');
                product_url.attr('href', 'http://www.etsy.com/listing/' + val.listing_id);
                product_url.attr('title', val.title);
                product_url.html(val.title);

                if (val.bin_id == -1) {
                    product.find('.bin-id').html('-1');
                    product.find('.bin-name').html('<i class="mdi-content-clear"></i>');
                }
                else {
                    //console.log(val);
                    //console.log(val.bin_name);
                    //product.find('.bin-id').html(val.bin_id);
                    //product.find('.bin-name').html(val.bin_name);
                }

                product.find('.price').html(val.price);
                product.find('.created').html(moment(val.created).format('MMM D, h:mm a'));
                product.find('.original-created').html(moment(val.original_creation).format('MMM D, h:mm a'));

                var all_product_actions = product.find('.all-product-actions');
                all_product_actions.find('.btn-floating').attr({
                    "all-product-id": val.id.toString(),
                    "all-product-title": val.title,
                    "all-product-bin-id": val.bin_id
                });

                appendString += ('<tr id="all-product-row-' + val.id + '">' + product.html() + '</tr>');
            });

            // Try and cut some repaint time by using vanilla JS
            var productTableBody = document.getElementById('productTableBody');
            productTableBody.innerHTML = appendString;
        },

        drawBinList: function(bins) {
            var appendString = '';
            $.each(bins, function(key, val) {
                // var bin = allProductBinTemplate;
                //bin.removeClass('template');
                //bin.attr('bin_id', val.id);
                //bin.html(val.name + ' - ' + val.total + ' products');
                //console.log(bin.html());
                appendString += '<a href="#!" class="collection-item all-product-bin-list-item" all-product-bin-id="' + val.id + '">';
                appendString += val.name + ' (' + val.total + ' Products)</a>';

                //appendString += bin.html();
            });

            // Try and cut some repaint time by using vanilla JS
            var allProductBinList = document.getElementById('allProductBinList');
            allProductBinList.innerHTML = appendString;
        },

        updateProductBin: function(product_id, bin_id, bin_name) {
            $('#all-product-row-' + product_id).find('.bin_name').html(bin_name);
            //console.log(product_id);
            //console.log(bin_id);
            //console.log(bin_name);
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
        $('#allProductBinTitle').html($(this).attr('all-product-id'));
        $.etsyDB.bins.getAll($.display.page.products.drawBinList);
        $('#modalAllProductBin').openModal();
    });

    $('#updateAllProductBin').on('click', function() {
        var product_id = parseInt($('#allProductBinList').attr('all-product-id')),
            bin_id =  parseInt($('#allProductBinList .active').attr('all-product-bin-id'));
        $.etsyDB.products.setBin(product_id, bin_id, $.display.page.products.updateProductBin);
        $('#modalAllProductBin').closeModal();
    });
});