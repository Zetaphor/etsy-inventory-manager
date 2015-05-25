$(document).ready(function() {
    $(".dropdown-button").dropdown();


    $.db = new Dexie('etsyDB');
    $.initDB();

    $.db.on('ready', function () {
        //$.deleteDatabase();
        //$.listTables();

        //$.etsy.getListings(updateRecentListings, 0, $.etsy.recentResultsLimit);
        //$.etsy.getListings(updateAllListings);

        //$.exportDatabase().then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});
    });

    function updateRecentListings(listings) {
        $.each(listings.results, function(index, listing) {
            $.addListing(listing);
        });
        console.log('Updated recent listings');
    }

    function updateAllListings(listings) {
        $.each(listings.results, function(index, listing) {
            $.addListing(listing);
        });

        if (listings.pagination.next_offset !== null) {
            $.etsy.getListings(updateAllListings, listings.pagination.next_offset);
        } else {
            console.log('Updated all listings');
        }
    }
});