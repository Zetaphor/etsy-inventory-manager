$(document).ready(function() {
    $.display = {};

    $.display.updateCounts = function() {
        $.db.table('products').where('bin_id').equals(-1).count(function(count) {
            $.inventory.newProducts = count;
            $('.num-total-new').html(count);
        });

        $.db.table('bins').count(function(count) {
            $.inventory.totalBins = count;
            $('.num-total-bins').html(count);
        });

        $.db.table('products').count(function(count) {
            $.inventory.totalProducts = count;
            $('.num-total-products').html(count);
        });
    };
});