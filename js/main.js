$(document).ready(function() {
    $(".dropdown-button").dropdown();

    $.db = new Dexie('etsyDB');
    $.initDB();

    $.db.on('ready', function () {
        console.log("Opened database");
        $.listTables();

        $.etsy.recentListings();

        //deleteDatabase();

        //exportDatabase(db).then(function (dbObj) {
        //    var json = JSON.stringify(dbObj);
        //    alert (json);
        //});
    });
});