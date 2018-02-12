/**
 * ======================================================================
 * OFFLINE MANAGER
 * ======================================================================
 *
 * Offline Manager facilitate usage of any storage for Storing data offline.
 *
 * All items stored under offline storage will be assigned a unique id, which
 * can be used to remove the item from storage.
 *
 * Bundle Page
 * ----------
 * Every Bundle Page will store a list of items in the offline. This will be
 * a collection of all page information (containing the page model) plus the
 * bundleModel object. Items can be added, retrieved and removed from offline storage
 * using the `OfflineManager`. Bundle can inject offline manager
 *
 * */

irf.commons.factory('OfflineManager', ["$log","$q", "irfStorageService", "Utils", function($log,$q,irfStorageService, Utils){

    function randomStringForCollection(collection){
        var key = Utils.randomString(10);
        while(true) {
            if (_.hasIn(collection, key)){
                key = Utils.randomString(10);
                continue;
            }
            break;
        }
        return key;
    }

    var getOfflineKey = function(id) {
        if (id)
            return '$ID$'+id;
        else
            return Utils.generateUUID();
    };

    var getMasterKey = function(name) {
        return 'Offline__' + name;
    };

    var isSQLlite = function() {
        return false;// TODO: implement
    };

    var error = function(code, params) {
        switch(code) {
            case "NODATA":
                return {"data": {"error": "Data unavailabile on local storage for "+params[0]+":"+params[1]}};
        }
    }

    return {
        /**
         * Add a new item under a name.
         *
         * @param {string} collectionName  Usually the page name.
         * @param {object} item  The item to be saved in offline storage.
         */
        storeItem: function(collectionName, collectionId, item){
            if (!item.$$STORAGE_KEY$$)
                item.$$STORAGE_KEY$$ = getOfflineKey(collectionId);

            irfStorageService.putJSON(getMasterKey(collectionName), item);
            return item.$$STORAGE_KEY$$;
        },
        storeSqliteItem: function(collectionName, collectionId, item, offlineStrategy) {
            var deferred = $q.defer();
            if (offlineStrategy == 'SQLITE' && Utils.isCordova) {
                if (!item.$$STORAGE_KEY$$) {
                    item.$$STORAGE_KEY$$ = getOfflineKey(collectionId);
                    var Storekey = getMasterKey(collectionName);
                    cordova.plugins.irfSqlite.offlineStoreItem(function(a) {
                            $log.info("succ callback" + a);
                            deferred.resolve(item.$$STORAGE_KEY$$);
                        },
                        function(b) {
                            $log.info("err callback" + b);
                            deferred.reject(b);
                        }, [{
                            collection_name: Storekey,
                            collection_id: item.$$STORAGE_KEY$$,
                            item: JSON.stringify(item)
                        }]);
                } else {
                    var Storekey = getMasterKey(collectionName);
                    cordova.plugins.irfSqlite.offlineUpdateItem(function(a) {
                            $log.info("succ callback" + a);
                            deferred.resolve(item.$$STORAGE_KEY$$);
                        },
                        function(b) {
                            $log.info("err callback" + b);
                            deferred.reject(b);
                        }, [{
                            collection_name: Storekey,
                            collection_id: item.$$STORAGE_KEY$$,
                            item: JSON.stringify(item)
                        }]);
                }
            } else {
                try {
                    if (!item.$$STORAGE_KEY$$)
                        item.$$STORAGE_KEY$$ = getOfflineKey(collectionId);

                    irfStorageService.putJSON(getMasterKey(collectionName), item);
                    deferred.resolve(item.$$STORAGE_KEY$$);
                } catch (e) {
                    deferred.reject(e);
                }

            }
            return deferred.promise;

        },
        retrieveItem: function(collectionName, offlineKey) {
            irfStorageService.getJSON(getMasterKey(collectionName), offlineKey);
        },
        /**
         * Retrieve a list of items stored in offline.
         *
         * @param {string} collectionName Usually the pageName.
         */
        retrieveItems: function(collectionName){
            return irfStorageService.getMasterJSON(getMasterKey(collectionName));
        },
        /**
         * Remove an item from the offline storage.
         *
         * @param {string} offlineKey  Id of the item.
         */
        removeItem: function(collectionName, offlineKey){
            irfStorageService.deleteJSON(getMasterKey(collectionName), offlineKey);
        },

        /**
         * Insert data into SQL lite table or localStorage based on availability
         * @param {string} table table name to be used.
         * @param {object} key key columns. eg: 123
         * @param {array|object} data data to be stored.
         * @param {function} callback function to be called once the operation is completed.
        */
        insert: function(table, key, data) {
            var deferred = $q.defer();
            if (isSQLlite()) {

            } else {
                try {
                    var tableData = irfStorageService.retrieveJSON(table);
                    if (!tableData) {
                        tableData = {};
                    }
                    tableData[key] = data;
                    irfStorageService.storeJSON(table, tableData);
                    deferred.resolve(true);
                } catch(e) {
                    deferred.reject();
                }
            }
            return deferred.promise;
        },

        /**
         * Insert data into SQL lite table or localStorage based on availability
         * @param {string} table table name to be used.
         * @param {object} key key columns. eg: {id:12, centre_code:123}
         * @param {function} callback function to be called once the operation is completed.
         * @return {array|object} data data to be stored.
        */
        select: function(table, key) {
            var deferred = $q.defer();
            if (isSQLlite()) {

            } else {
                var tableData = irfStorageService.retrieveJSON(table);
                if (tableData && tableData[key]) {
                    var returnData = tableData[key];
                    if (returnData) {
                        deferred.resolve(returnData);
                    } else {
                        deferred.reject(error("NODATA", [table, key]));
                    }
                } else {
                    deferred.reject(error("NODATA", [table, key]));
                } 
            }
            return deferred.promise;
        },

        delete: function(table, key) {
            var deferred = $q.defer();
            if (isSQLlite()) {

            } else {
                try {
                    var tableData = irfStorageService.retrieveJSON(table);
                    if (tableData && tableData[key]) {
                        delete tableData[key];
                        irfStorageService.storeJSON(table, tableData);
                    }
                    deferred.resolve(true);
                } catch(e) {
                    deferred.reject(error("NODATA", [table, key]));
                }
            }
            return deferred.promise;
        },

        /**
         * Insert data into SQL lite table or localStorage based on availability
         * @param {string} table table name to be used.
         * @param {object} key key columns. eg: {id:12, centre_code:123}
         * @param {function} callback function to be called once the operation is completed.
         * @return {array|object} data data to be stored.
        */
        selectAll: function(table) {
            var deferred = $q.defer();
            if (isSQLlite()) {

            } else {
                var tableData = irfStorageService.retrieveJSON(table);
                if (tableData) {
                    deferred.resolve(tableData);
                } else {
                    deferred.reject(error("NODATA", [table, '']));
                } 
            }
            return deferred.promise;
        }
    }
}])
