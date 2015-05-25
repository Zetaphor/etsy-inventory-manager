$(document).ready(function() {
    $.display.page.bins = {};

    $.display.page.bins.load = function() {
        $.display.toggleLoadingScreen($.etsy.getBins($.display.page.products.drawProducts));
    };
});