$(document).ready(function() {
    $.etsyApp = {
        settings: {
            lastRefresh: 'Never',
            firstRun: true
        },

        inventoryCounts: {
            newProducts: 0,
            totalBins: 0,
            totalProducts: 0
        },

        loadSettings: function() {
            if (localStorage.getItem('settings') === null) {
                localStorage.setItem('settings', JSON.stringify($.etsyApp.settings));
            } else {
                $.etsyApp.settings = JSON.parse(localStorage.getItem('settings'));
            }

            $.display.updateLastUpdateText($.etsyApp.settings.lastRefresh);
        },

        saveSettings: function() {
            localStorage.setItem('settings', JSON.stringify($.etsyApp.settings));
        },

        appFirstRun: function() {
            console.log('Welcome to the first time!');
        },

        appStart: function(first_run) {
            first_run = typeof first_run !== 'undefined' ? first_run : false;

            $.display.page.dashboard.load();

            if (first_run) $.etsyApp.appFirstRun();

            //$.etsyDB.delete();
            //$.etsyDB.listTables();

            //$.etsyDB.export().then(function (dbObj) {
            //    var json = JSON.stringify(dbObj);
            //    alert (json);
            //});
        }
    };

    $.etsyApp.loadSettings();
    $.etsyDB.init();

    $(window).unload(function() {
        $.etsyApp.saveSettings();
    });

    $.db.on('ready', function () {
        $.etsyApp.appStart();
    });
});