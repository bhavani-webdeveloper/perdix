irf.pageCollection.factory("InventoryHelper", ["$log", "$q", "Inventory", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
    function($log, $q, Inventory, PageHelper, irfProgressMessage, Utils, SessionStore) {

        var saveData = function(reqData) {
            var deferred = $q.defer();
            $log.info("Attempting Save");
            $log.info(reqData);
            PageHelper.clearErrors();
            PageHelper.showLoader();

            PageHelper.showProgress('inventory', 'Working...');
            reqData['action'] = 'SAVE';
            var action = reqData.inventoryTrackerDto.id ? 'updateInventory' : 'trackInventory';
            Inventory[action](reqData, function(res, headers) {
                PageHelper.showProgress('inventory', 'Data Saved', 2000);
                $log.info(res);
                PageHelper.hideLoader();
                deferred.resolve(res);
            }, function(res) {
                PageHelper.hideLoader();
                PageHelper.showProgress('inventory', 'Oops. Some error.', 2000);
                PageHelper.showErrors(res);
                deferred.reject(res);
            });
            return deferred.promise;
        };

        var proceedData = function(res) {
            var deferred = $q.defer();
            $log.info("Attempting Proceed");
            $log.info(res);
            if (res.inventoryTrackerDto.id === undefined || res.inventoryTrackerDto.id === null) {
                $log.info("lead id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                PageHelper.showProgress('inventory', 'Working...');
                res.action = "PROCEED";
                Inventory.updateInventory(res, function(res, headers) {
                    PageHelper.hideLoader();
                    PageHelper.showProgress('inventory', 'Done. inventory updated with ID: ' + res.inventoryTrackerDto.id + ' and Batch Number:' + res.inventoryTrackerDto.batchNumber, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    PageHelper.showProgress('inventory', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        var InventoryProceedData = function(res) {
            var deferred = $q.defer();
            $log.info("Attempting Proceed");
            $log.info(res);
            if (res.inventoryTrackerDto.id === undefined || res.inventoryTrackerDto.id === null) {
                $log.info("lead id null, cannot proceed");
                deferred.reject(null);
            } else {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                PageHelper.showProgress('inventory', 'Working...');
                
                /*if (res.inventoryTrackerDto.udf1 == 'No') {
                    res.action = "SAVE";
                } else {
                    res.action = "PROCEED";
                }
*/
                Inventory.updateInventory(res, function(res, headers) {
                    PageHelper.hideLoader();
                    PageHelper.showProgress('inventory', 'Done. inventory updated with ID: ' + res.inventoryTrackerDto.id + ' and Batch Number:' + res.inventoryTrackerDto.batchNumber, 5000);
                    deferred.resolve(res);
                }, function(res, headers) {
                    PageHelper.hideLoader();
                    PageHelper.showProgress('inventory', 'Oops. Some error.', 2000);
                    PageHelper.showErrors(res);
                    deferred.reject(res);
                });
            }
            return deferred.promise;
        };

        return {
            saveData: saveData,
            proceedData: proceedData,
            InventoryProceedData: InventoryProceedData,
        };
    }
]);