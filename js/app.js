$(document).ready(function() {
    $.etsyApp = {
        settings: {
            lastRefresh: 'Never',
            firstRun: true,
            shopName: 'JessicaAnnsEmporium',
            updateOnStartEnabled: false,
            updateOnStartType: 'all',
            autoUpdateEnabled: false,
            autoUpdateType: 'recent',
            autoUpdateInterval: 10,
            autoUpdateMinInterval: 10
        },

        inventoryCounts: {
            newProducts: 0,
            totalBins: 0,
            totalProducts: 0
        },

        setAutoUpdateTimer: function() {
            clearInterval($.etsyApp.settings.autoUpdateTimer);

            if ($.etsyApp.settings.autoUpdateType == 'recent') {
                $.etsyApp.autoUpdateTimer = setInterval($.etsyAPIHelper.getRecentListings, ($.etsyApp.settings.autoUpdateInterval * 60000));
            } else if ($.etsyApp.settings.autoUpdateType == 'all') {
                $.etsyApp.autoUpdateTimer = setInterval($.etsyAPIHelper.getAllListings, ($.etsyApp.settings.autoUpdateInterval * 60000));
            }
        },

        removeAutoUpdateTimer: function() {
            console.log('Cleared');
            clearInterval($.etsyApp.settings.autoUpdateTimer);
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

        appStart: function() {
            $.display.page.dashboard.load();
            if ($.etsyApp.settings.firstRun) {
                $.etsyApp.settings.firstRun = false;
                $.etsyApp.appFirstRun();
            }

            if ($.etsyApp.settings.updateOnStartEnabled) {
                if ($.etsyApp.settings.updateOnStartType == 'recent') {
                    $('#startUpdateRecent').prop('checked', true);
                    $.etsyAPIHelper.getRecentListings();
                } else if ($.etsyApp.settings.updateOnStartType == 'all') {
                    $('#startUpdateAll').prop('checked', true);
                    $.etsyAPIHelper.getAllListings();
                }
                $('#chkEnableStartUpdate').prop('checked', true);
                $('.start-update').prop('disabled', false);
            }

            $('#autoUpdateInterval').val($.etsyApp.settings.autoUpdateInterval);
            if ($.etsyApp.settings.autoUpdateEnabled) {
                $('#chkEnableAutoUpdate').prop('checked', true);
                if ($.etsyApp.settings.autoUpdateType == 'recent') {
                    $('#autoUpdateRecent').prop('checked', true);
                } else {
                    $('#autoUpdateAll').prop('checked', true);
                }
                $('.auto-update').prop('disabled', false);
            }

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