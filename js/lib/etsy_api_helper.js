$(document).ready(function() {
    $.etsyAPIHelper = {
        getRecentListings: function() {
            $.etsyAPI.getListings($.etsyAPIHelper.updateRecentListings, 0, $.etsyAPI.recentResultsLimit);
        },

        getAllListings: function() {
            $.etsyAPI.getListings($.etsyAPIHelper.updateAllListings, 0, $.etsyAPI.resultLimit);
        },

        updateRecentListings: function(listings) {
            $.each(listings.results, function(index, listing) {
                $.etsyDB.products.add(listing);
            });
            //console.log('Updated recent listings');
            $.display.updateCounts();
            $.display.updateLastUpdateText();
            Materialize.toast('Successfully updated recent listings', 4000);
            $('#syncIcon').hide();
        },

        updateAllListings: function(listings) {
            $.each(listings.results, function(index, listing) {
                $.etsyDB.products.add(listing);
            });

            if (listings.pagination.next_offset !== null) {
                $.etsyAPI.getListings($.etsyAPIHelper.updateAllListings, listings.pagination.next_offset, $.etsyAPI.resultLimit);
            } else {
                //console.log('Updated all listings');
                $.display.updateCounts();
                $.display.updateLastUpdateText();
                Materialize.toast('Succesfully updated all listings', 4000);
                $('#syncIcon').hide();
            }
        }
    };
});