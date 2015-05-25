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

        $.display.updateCounts();

        //$.etsyDB.exportDatabase().then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});

    });
});