$(document).ready(function() {
    $.etsyDB = {};
    $.etsyDB.init = function() {
        Dexie.getDatabaseNames(function(databases) {
            if (databases.indexOf('etsyDB') == -1) $.createDB();
            else $.db.open();
        });
    };

    $.etsyDB.create = function() {
        $.db.version(1).stores(
            {
                products: '++id, bin_id, listing_id, title, categories, price, created, original_created',
                bins: '++id, name, notes'
            }
        );
        console.log("Created database");
        $.db.open();
    };

    $.etsyDB.addListing = function(listing) {
        $.db.table('products').where("listing_id").equals(listing.listing_id).count(function(count) {
            if (count === 0) {
                $.db.table('products').add({
                    bin_id: -1,
                    listing_id: listing.listing_id,
                    title: listing.title,
                    categories: listing.category_path.toString(),
                    price: listing.price,
                    created: listing.creation_tsz,
                    original_creation: listing.original_creation_tsz
                }).then(function() {
                    console.log("Added listing #" + listing.listing_id);
                });
            } else {
                //console.log("Attempted to add duplicate listing #" + listing.listing_id + ' - ' + listing.title);
            }
        });
    };

    $.etsyDB.listTables = function() {
        $.db.tables.forEach(function (table, i) {
            console.log('Table ' + i + ": " + table.name);
        });
    };

    $.etsyDB.deleteDB = function() {
        $.db.delete().then(function() {
            console.log('Deleted database');
        });
    };

    $.etsyDB.export = function() {
        return $.db.transaction('r', $.db.tables, function() {
            // Map to transaction-bound table instances because instances in $.db.tables are not bound
            // to current transaction by default (may change in future versions of Dexie)
            var tables = $.db.tables.map(function (t) {
                return Dexie.currentTransaction.tables[t.name];
            });
            // Prepare a result: An array of {tableName: "name", contents: [objects...]}
            var result = [];
            // Recursively export each table:
            return exportNextTable ();

            function exportNextTable () {
                var table = tables.shift();
                return table.toArray().then(function(a) {
                    result.push({
                        tableName: table.name,
                        contents: a
                    });
                    return tables.length > 0 ?
                        exportNextTable() :
                        result;
                });
            }
        });
    };
});