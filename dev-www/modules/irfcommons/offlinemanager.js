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

irf.commons.factory('OfflineManager', ["$log", "irfStorageService", "Utils", function($log, irfStorageService, Utils){

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
        }
    }
}])
