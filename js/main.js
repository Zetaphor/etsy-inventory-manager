$(document).ready(function() {
    $(".dropdown-button").dropdown();
    $.db = new Dexie('etsyDB');
    $.etsyDB.init();

    $.inventory = {
        newProducts: 0,
        totalBins: 0,
        totalProducts: 0
    };

    $.db.on('ready', function () {
        //$.etsyDB.deleteDatabase();
        //$.etsyDB.listTables();

        //$.etsy.getListings($.etsy.updateRecentListings, 0, $.etsy.recentResultsLimit);
        //$.etsy.getListings($.etsy.updateAllListings);

        updateDisplayCounts();

        //$.etsyDB.exportDatabase().then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});

    });

    function updateDisplayCounts() {
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
    }
});