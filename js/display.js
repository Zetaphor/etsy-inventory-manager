$(document).ready(function() {
    $.display = {};
    $.display.pageSpeed = 300;

    $.display.page = {};

    $.display.switchPage = function(page) {
        $('.page').not(page).css("zIndex", 0);
        $(page).css("zIndex", 10);

        $(page).show();
        var pageName = page.split('page')[1].toLowerCase();

        $.display.page[pageName].load();

        $('.page').not(page).animate({
            left: '-200vw'
        }, $.display.pageSpeed, function() {
            $(this).hide();
        });

        $(page).animate({
            left: 0
        }, $.display.pageSpeed);
    };

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

    $.display.updateLastUpdateText = function() {
        var currentdate = new Date();
        var datetime = "Last Refresh: " + (currentdate.getMonth()+1) + "/"
            + currentdate.getDate()  + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes();

        $('#lastUpdatedText').html(datetime);
    };
});