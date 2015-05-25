$(document).ready(function() {
    $(".dropdown-button").dropdown();
    $('.page').not('#pageDashboard').hide().css({left: '-200vw'});

    $.db = new Dexie('etsyDB');
    $.etsyDB.init();

    $.inventory = {
        newProducts: 0,
        totalBins: 0,
        totalProducts: 0
    };

    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        $('.nav-link').not($(this)).parent().removeClass('active');
        $(this).parent().addClass('active');
        var page = $(this).attr('href');
        $.display.switchPage(page);
    });

    $.db.on('ready', function () {
        //$.etsyDB.deleteDatabase();
        //$.etsyDB.listTables();

        //$.etsy.getListings($.etsy.updateRecentListings, 0, $.etsy.recentResultsLimit);
        //$.etsy.getListings($.etsy.updateAllListings);

        $.display.updateCounts();

        //$.etsyDB.exportDatabase().then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});

    });
});