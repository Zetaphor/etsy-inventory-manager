$(document).ready(function() {
    $(".dropdown-button").dropdown();
    $.db = new Dexie('etsyDB');
    $.etsyDB.init();

    $.db.on('ready', function () {
        //$.etsyDB.deleteDatabase();
        //$.etsyDB.listTables();

        //$.etsy.getListings($.etsy.updateRecentListings, 0, $.etsy.recentResultsLimit);
        $.etsy.getListings($.etsy.updateAllListings);

        //$.etsyDB.exportDatabase().then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});
    });
});