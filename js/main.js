$(document).ready(function() {
    $(".dropdown-button").dropdown();
    $('.tooltipped').tooltip({delay: 50});
    $('.modal-trigger').leanModal();

    $('.page').not('#pageDashboard').hide().css({left: '-200vw'});

    $.settings = {
        lastRefresh: 'Never'
    };

    $.saveSettings = function() {
        localStorage.setItem('settings', JSON.stringify($.settings));
        console.log('Saved settings');
    };

    $.loadSettings = function() {
        $.display.updateLastUpdateText($.settings.lastRefresh);
    };

    if (localStorage.getItem('settings') === null) {
        localStorage.setItem('settings', JSON.stringify($.settings));
        $.loadSettings();
    } else {
        $.settings = JSON.parse(localStorage.getItem('settings'));
        $.loadSettings();
    }

    $.db = new Dexie('etsyDB');
    $.etsyDB.init();

    $.inventory = {
        newProducts: 0,
        totalBins: 0,
        totalProducts: 0
    };

    $(window).unload(function() {
        $.settings.save();
    });

    $.db.on('ready', function () {
        $.display.page.dashboard.load();
        //$.etsyDB.deleteDatabase();
        //$.etsyDB.listTables();

        //$.etsyDB.exportDatabase().then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});
    });

    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        $('.nav-link').not($(this)).parent().removeClass('active');
        $(this).parent().addClass('active');
        var page = $(this).attr('href');
        $.display.toggleLoadingScreen();
        $.display.switchPage(page);
    });

    $('#refreshRecent').on('click', function() {
        Materialize.toast('Refreshing recent listings...', 4000);
        $.etsy.getListings($.etsy.refreshRecentListings, 0, $.etsy.recentResultsLimit);
    });

    $('#refreshAll').on('click', function() {
        Materialize.toast('Refreshing all listings...', 4000);
        $.etsy.getListings($.etsy.refreshAllListings, 0, $.etsy.resultLimit);
    });
});