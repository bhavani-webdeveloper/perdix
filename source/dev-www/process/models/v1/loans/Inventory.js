irf.models.factory('Inventory', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

        var endpoint = BASE_URL + '/api/inventoryTracking';
        var resource = $resource(endpoint, null, {
            getSchema: {
                method: 'GET',
                url: 'process/schemas/documentTracking.json'
            },

            captureInventory: {
                method: 'POST',
                isArray: true,
                url: endpoint + '/createBranchWiseConsumable'
            },

            trackInventory: {
                method: 'POST',
                url: endpoint + '/create'
            },

            updateInventory: {
                method: 'PUT',
                url: endpoint + '/update'
            },

            get: {
                method: 'GET',
                url: endpoint + '/getConsumableInventoryTracker'
            },

            searchInventory: searchResource({
                method: 'GET',
                url: endpoint + '/fetchConsumableBranchInventory'
            }),

            searchInventoryTracking: searchResource({
                method: 'GET',
                url: endpoint + '/getConsumableInventoryTrackerList'
            }),

        });

        return resource;
    }
]);