$(document).ready(function() {
    $.display = {
        pageSpeed: 300,
        loadingTime: 1500,
        page: {}, // Container for all page function objects

        labelSizes: {
            large: {
                image: 500,
                font: 60
            },
            medium: {
                image: 250,
                font: 40
            },
            small: {
                image: 100,
                font: 11
            }
        },

        switchPage: function(page) {
            $('.page').not(page).css('Index', 0);
            $(page).css('Index', 10);

            $(page).show();
            var pageName = page.split('page')[1].toLowerCase();

            $.display.page[pageName].load();

            $('.page').not(page).css({
                left: '-200vw'
            }).hide();

            $(page).css({
                left: '0'
            }).show();
        },

        updateCounts: function() {
            $.db.table('products').where('bin_id').equals(-1).count(function(count) {
                $.etsyApp.inventoryCounts.newProducts = count;
                $('.num-total-new').html(count);
            });

            $.db.table('bins').count(function(count) {
                $.etsyApp.inventoryCounts.totalBins = count;
                $('.num-total-bins').html(count);
            });

            $.db.table('products').count(function(count) {
                $.etsyApp.inventoryCounts.totalProducts = count;
                $('.num-total-products').html(count);
            });
        },

        updateLastUpdateText: function(time) {
            if (typeof time == 'undefined') {
                time = moment().format('M/D/YY, h:mm a');
                $('#lastUpdatedText').html('Last Refresh: ' + time);
            } else {
                $('#lastUpdatedText').html('Last Refresh: ' + time);
            }
            $.etsyApp.settings.lastRefresh = time;
            $.etsyApp.saveSettings();
        },

        toggleLoadingScreen: function() {
            $('#loadingOverlay').show();
            setTimeout(function() {
                $('#loadingOverlay').fadeOut('slow', function() {
                    $(this).hide();
                });
            }, $.display.loadingTime);
        },

        getQRCode: function(data, size) {
            return 'https://chart.googleapis.com/chart?chs=' + size + 'x' + size + '&cht=qr&chl=' + data;
        }
    };
});