$(document).ready(function() {
    $.etsyAPIHelper = {
        getRecentListings: function() {
            $.display.toastInfo('Refreshing recent listings...');
            $.etsyAPI.getListings($.etsyAPIHelper.updateRecentListings, 0, $.etsyAPI.recentResultsLimit);
            $('#syncIcon').show();
        },

        getAllListings: function() {
            $.display.toastInfo('Refreshing all listings...');
            $.etsyAPI.getListings($.etsyAPIHelper.updateAllListings, 0, $.etsyAPI.resultLimit);
            $('#syncIcon').show();
        },

        updateRecentListings: function(listings) {
            $.each(listings.results, function(index, listing) {
                $.etsyDB.products.add(listing);
            });
            //console.log('Updated recent listings');
            $.display.updateCounts();
            $.display.updateLastUpdateText();
            $.display.toastSuccess('Successfully updated recent listings');
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
                $.display.toastSuccess('Succesfully updated all listings');
                $('#syncIcon').hide();
            }
        }
    };
});