$(document).ready(function() {
    $(".dropdown-button").dropdown();


    $.db = new Dexie('etsyDB');
    $.initDB();

    $.db.on('ready', function () {
        //$.deleteDatabase();
        //$.listTables();

        $.etsy.recentListings(updateListings);

        //exportDatabase(db).then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});
    });

    function updateListings(listings) {
        $.each(listings, function(index, listing) {
            $.addListing(listing);
        });
    }
});