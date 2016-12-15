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

    return {
        /**
         * Add a new item under an id.
         *
         * @param {string} collectionId  Usually the page id.
         * @param {object} item  The item to be saved in offline storage.
         */
        storeItem: function(collectionId, item){
            var collection = irfStorageService.retrieveJSON("Offline__" + collectionId);
            if (collection == null){
                collection = {};
            }
            var offlineKey = randomStringForCollection(collectionId);
            collection[offlineKey] = item;
            irfStorageService.storeJSON("Offline__" + collectionId, collection);
            return offlineKey;
        },
        updateItem: function(collectionId, offlineKey, item){
            var collection = irfStorageService.retrieveJSON("Offline__" + collectionId);
            if (collection == null){
                return null;
            }

            if (_.hasIn(collection, offlineKey)){
                collection[offlineKey] = item;
            }

            irfStorageService.storeJSON("Offline__" + collectionId, collection);
            return offlineKey;
        },
        /**
         * Retrieve a list of items stored in offline.
         *
         * @param {string} collectionId Usually the pageId.
         */
        retrieveItems: function(collectionId){
            return irfStorageService.retrieveJSON("Offline__" + collectionId);
        },
        /**
         * Remove an item from the offline storage.
         *
         * @param {string} id  Id of the item.
         */
        removeItem: function(collectionId, id){
            var collection = irfStorageService.retrieveJSON("Offline__" + collectionId);
            if (collection == null){
                collection = {};
            }
            delete collection[id];
        }
    }
}])
