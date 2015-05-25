$(document).ready(function() {
    $.initDB = function() {
        Dexie.getDatabaseNames(function(databases) {
            if (databases.indexOf('etsyDB') == -1) $.createDB();
            else $.db.open();
        });
    };

    $.createDB = function() {
        $.db.version(1).stores(
            {
                products: '++id, bin_id, listing_id, title, categories, price, created, original_created',
                bins: '++id, name'
            }
        );
        console.log("Created database");
        $.db.open();
    };

    $.listTables = function() {
        $.db.tables.forEach(function (table, i) {
            console.log('Table ' + i + ": " + table.name);
        });
    };

    $.deleteDatabase = function() {
        $.db.delete().then(function() {
            console.log('Deleted database');
        });
    };

    $.exportDatabase = function(db) {
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
