$(document).ready(function() {
    $.etsy.refreshRecentListings = function(listings) {
        $.each(listings.results, function(index, listing) {
            $.etsyDB.addListing(listing);
        });
        //console.log('Updated recent listings');
        $.display.updateCounts();
        $.display.updateLastUpdateText();
        Materialize.toast('Successfully updated recent listings', 4000);
    };

    $.etsy.refreshAllListings = function(listings) {
        $.each(listings.results, function(index, listing) {
            $.etsyDB.addListing(listing);
        });

        if (listings.pagination.next_offset !== null) {
            $.etsy.getListings($.etsy.refreshAllListings, listings.pagination.next_offset, $.etsy.resultLimit);
        } else {
            //console.log('Updated all listings');
            $.display.updateCounts();
            $.display.updateLastUpdateText();
            Materialize.toast('Succesfully updated all listings', 4000);
        }
    };
});