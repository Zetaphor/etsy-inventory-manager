$(document).ready(function() {
    $(".dropdown-button").dropdown();
    $('.tooltipped').tooltip({delay: 50});

    $('.page').not('#pageDashboard').hide().css({left: '-200vw'});

    $.db = new Dexie('etsyDB');
    $.etsyDB.init();
    $.display.page.dashboard.load();

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

    $('#updateRecent').on('click', function() {
        Materialize.toast('Refreshing recent listings...', 4000);
        $.etsy.getListings($.etsy.updateRecentListings, 0, $.etsy.recentResultsLimit);
    });

    $('#updateAll').on('click', function() {
        Materialize.toast('Refreshing all listings...', 4000);
        $.etsy.getListings($.etsy.updateAllListings);
    });



    $.db.on('ready', function () {
        //$.etsyDB.deleteDatabase();
        //$.etsyDB.listTables();

        //$.etsyDB.exportDatabase().then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});

    });
});