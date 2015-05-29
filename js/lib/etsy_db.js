$(document).ready(function() {
    $.etsyDB = {
        init: function() {
            $.db = new Dexie('etsyDB');
            Dexie.getDatabaseNames(function(databases) {
                if (databases.indexOf('etsyDB') == -1) {
                    $.etsyDB.create();
                }
                else {
                    $.db.open();
                }
            });
        },

        create: function() {
            $.db.version(1).stores(
                {
                    products: '++id, bin_id, bin_name, listing_id, title, categories, price, created, original_created',
                    bins: '++id, name, notes'
                }
            );
            console.log("Created database");
            $.db.open();
        },

        listTables: function() {
            $.db.tables.forEach(function (table, i) {
                console.log('Table ' + i + ": " + table.name);
            });
        },

        delete: function() {
            $.db.delete().then(function() {
                console.log('Deleted database');

                // This is required, it seems that Dexie is only deleting the tables
                indexedDB.deleteDatabase("etsyDB");
            });
        },

        export: function() {
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
        },

        products: {
            add: function(listing) {
                $.db.table('products').where("listing_id").equals(listing.listing_id).count(function(count) {
                    if (count === 0) {
                        $.db.table('products').add({
                            bin_id: -1,
                            bin_name: 'None',
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
            },

            setBin: function(product_id, bin_id, callback) {
                $.db.table('products').update(product_id, {bin_id: bin_id}).then(function(success) {
                    if (success) {
                        $.db.table('bins').where("id").equals(bin_id).toArray().then(function(bin) {
                            $.display.toastSuccess('Updated product bin successfully');
                            callback(product_id, bin_id, bin[0].name);
                        });
                    } else {
                        $.display.toastSuccess('There was an error updating the product bin!');
                    }
                });
            },

            getNew: function(callback) {
                $.db.table('products').where("bin_id").equals(-1).toArray().then(function(data) {
                    callback(data);
                });
            },

            getAll: function(callback) {
                $.db.table('products').toArray().then(function(data) {
                    var new_data = data;
                    $.each(data, function(key) {
                        if (data[key].bin_id != -1) {
                            console.log(data[key].bin_id);
                            $.db.table('bins').where('id').equals(parseInt(data[key].bin_id)).toArray().then(function(bin_data) {
                                new_data[key]['bin_name'] = bin_data[0].name;
                                console.log(new_data[key]);
                            });
                        }

                        if (key + 1 === data.length) {
                            // TODO: Get this shit passing the actual fucking name back
                            //console.log(new_data);
                            callback(new_data);
                        }
                    });
                });
            }
        },

        bins: {
            getAll: function(callback) {
                var bins = [];
                $.db.table('bins').each(function(bin) {
                    $.db.table('products').where("bin_id").equals(bin.id).count(function(count) {
                        bin.total = count;
                        bins.push(bin);
                    });
                }).then(function() {
                    callback(bins);
                });
            },

            add: function(name, notes, callback) {
                $.db.table('bins').where("name").equals(name).count(function(count) {
                    if (count === 0) {
                        $.db.table('bins').add({
                            name: name,
                            notes: notes
                        }).then(function (id) {
                            $.display.toastSuccess("Created bin '" + name + "' successfully");
                            $.display.updateCounts();
                            callback([{id: id, name: name, notes: notes}], true);
                        });
                    } else {
                        $.display.toastError("Bin '" + name + "' already exists!");
                    }
                });
            },

            update: function(id, name, notes, callback) {
                $.db.table('bins').where("name").equals(name).count(function(count) {
                    if (count === 0) {
                        $.db.table('bins').update(id, {name: name, notes: notes}).then(function (success) {
                            if (success) {
                                $.display.toastSuccess("Bin #" + id + " updated successfully");
                                callback({id: id, name: name, notes: notes});
                            } else {
                                $.display.toastError("An error occured while updating bin #" + id);
                            }
                        });
                    } else {
                        $.display.toastError("Error! A bin already exists with the name '" + name + "'");
                    }
                });
            },

            delete: function(id, name, callback) {
                $.db.table('bins').where("id").equals(id).delete().then(function() {
                    $.display.toastSuccess('Bin #' + id + " - '" + name + "' deleted successfully");
                    callback(id);
                });
            }
        }
    };
});
