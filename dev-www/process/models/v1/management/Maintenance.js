irf.models.factory('Maintenance', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/maintenances';

        var res = $resource(endpoint, null, {
            updateSpoke: {
                method: 'PUT',
                url: endpoint + '/centreMerger'
            },

        });
        return res;
    }
]);