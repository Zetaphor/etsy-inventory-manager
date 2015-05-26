$(document).ready(function() {
    $.etsyAPI = {
        apiURL: "https://openapi.etsy.com/v2/",
        apiKey: "tpgge44ziiwldztbd8hx7b1r",
        recentResultsLimit: 20,
        resultLimit: 100,
        storeName: 'JessicaAnnsEmporium',
        listingParams: {
            fields: [
                'listing_id',
                'title',
                'category_path',
                'category_id',
                'price',
                'quantity',
                'style',
                'state',
                'taxonomy_id',
                'creation_tsz',
                'original_creation_tsz'
            ]
        },

        // https://www.etsy.com/developers/documentation/reference/listing#method_getlisting
        buildURL: function(resource, offset, limit) {
            limit = typeof limit !== 'undefined' ? limit : $.etsyAPI.resultLimit;
            offset = typeof offset !== 'undefined' ? offset : 0;
            var requestURL = $.etsyAPI.apiURL + resource + '?api_key=' + $.etsyAPI.apiKey + '&' + 'offset=' + offset + '&' + 'limit=' + limit + '&';
            var paramString = '';
            $.each($.etsyAPI.listingParams, function(key, val) {
                paramString += key + '=' + val.toString() + '&';
            });
            return requestURL + paramString;
        },

        getListings: function(callback, offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : $.etsyAPI.resultLimit;
            var requestURL = $.etsyAPI.buildURL('shops/' + $.etsyAPI.storeName + '/listings/active.js', offset, limit);
            $.ajax({
                url: requestURL,
                dataType: 'jsonp',
                success: function(data) {
                    if (data.ok) {
                        if (data.count > 0) callback(data);
                        else callback([]);
                    } else {
                        console.log("API Error: " + data.error);
                        callback([]);
                    }
                }
            });
        }
    };
});
