$(document).ready(function() {
    $.etsy.updateRecentListings = function(listings) {
        $.each(listings.results, function(index, listing) {
            $.etsyDB.addListing(listing);
        });
        console.log('Updated recent listings');
    };

    $.etsy.updateAllListings = function(listings) {
        $.each(listings.results, function(index, listing) {
            $.etsyDB.addListing(listing);
        });

        if (listings.pagination.next_offset !== null) {
            $.etsy.getListings($.etsy.updateAllListings, listings.pagination.next_offset, $.etsy.resultLimit);
        } else {
            console.log('Updated all listings');
        }
    };
});