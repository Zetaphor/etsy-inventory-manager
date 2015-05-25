$(document).ready(function() {
    $.etsy = {};
    $.etsy.apiURL = "https://openapi.etsy.com/v2/";
    $.etsy.apiKey = "tpgge44ziiwldztbd8hx7b1r";
    $.etsy.storeName = 'JessicaAnnsEmporium';

    // https://www.etsy.com/developers/documentation/reference/listing#method_getlisting
    $.etsy.requestURL = function(resource, params, limit, offset) {
        limit = typeof limit !== 'undefined' ? limit : 5;
        offset = typeof offset !== 'undefined' ? offset : 0;
        var requestURL = $.etsy.apiURL + resource + '?api_key=' + $.etsy.apiKey + '&' + 'offset=' + offset + '&' + 'limit=' + limit + '&';
        return requestURL + params;
    };

    $.etsy.recentListings = function(callback) {
        var params = 'fields=listing_id,title,category_path,category_id,price,quantity,style,state,taxonomy_id,creation_tsz,original_creation_tsz';
        var requestURL = $.etsy.requestURL('shops/' + $.etsy.storeName + '/listings/active.js', params);
        //console.log(requestURL);
        $.ajax({
            url: requestURL,
            dataType: 'jsonp',
            success: function(data) {
                if (data.ok) {
                    if (data.count > 0) callback(data.results);
                    else callback([]);
                } else {
                    console.log("API Error: " + data.error);
                    callback([]);
                }
            }
        });
    };
});
