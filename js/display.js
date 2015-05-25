$(document).ready(function() {
    $.display = {};
    $.display.pageSpeed = 300;
    $.display.loadingTime = 1500;

    $.display.page = {};

    $.display.switchPage = function(page) {
        $('.page').not(page).css("zIndex", 0);
        $(page).css("zIndex", 10);

        $(page).show();
        var pageName = page.split('page')[1].toLowerCase();

        $.display.page[pageName].load();

        $('.page').not(page).css({
            left: '-200vw'
        }).hide();

        $(page).css({
            left: '0'
        }).show();
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

    $.display.updateLastUpdateText = function(time) {
        if (typeof time == 'undefined') {
            time = moment().format('M/D/YY, h:mm a');
            $('#lastUpdatedText').html("Last Refresh: " + time);
        } else {
            $('#lastUpdatedText').html(time);
        }
        $.settings.lastRefresh = time;
        $.saveSettings();
    };

    $.display.toggleLoadingScreen = function() {
        $('#loadingOverlay').show();
        setTimeout(function() {
            $('#loadingOverlay').fadeOut('slow', function() {
                $(this).hide();
            });
        }, $.display.loadingTime);
    };
});