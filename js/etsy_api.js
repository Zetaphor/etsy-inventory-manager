$(document).ready(function() {
    $.etsy = {};
    $.etsy.apiURL = "https://openapi.etsy.com/v2/";
    $.etsy.apiKey = "tpgge44ziiwldztbd8hx7b1r";
    $.etsy.recentResultsLimit = 20;
    $.etsy.resultLimit = 100;
    $.etsy.storeName = 'JessicaAnnsEmporium';
    $.etsy.listingParams = {
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
    };

    // https://www.etsy.com/developers/documentation/reference/listing#method_getlisting
    $.etsy.buildURL = function(resource, offset, limit) {
        limit = typeof limit !== 'undefined' ? limit : $.etsy.resultLimit;
        offset = typeof offset !== 'undefined' ? offset : 0;
        var requestURL = $.etsy.apiURL + resource + '?api_key=' + $.etsy.apiKey + '&' + 'offset=' + offset + '&' + 'limit=' + limit + '&';
        var paramString = '';
        $.each($.etsy.listingParams, function(key, val) {
            paramString += key + '=' + val.toString() + '&';
        });
        return requestURL + paramString;
    };

    $.etsy.getListings = function(callback, offset, limit) {
        offset = typeof offset !== 'undefined' ? offset : 0;
        limit = typeof limit !== 'undefined' ? limit : $.etsy.resultLimit;
        var requestURL = $.etsy.buildURL('shops/' + $.etsy.storeName + '/listings/active.js', offset, limit);
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
    };
});
