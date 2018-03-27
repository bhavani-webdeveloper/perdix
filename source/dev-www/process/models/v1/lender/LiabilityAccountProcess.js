irf.models.factory('LiabilityAccountProcess', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/liabilityAccount';
        var resource = $resource(endpoint, null, {
            getLeadSchema: {
                method: 'GET',
                url: 'process/schemas/Leadgeneration.json'
            },
            get: {
                method: 'GET',
                url: endpoint+"/:id"
            },
            save: {
                method: 'POST',
                url: endpoint
            },
            proceed: {
                method: 'PUT',
                url: endpoint
            },
            search: searchResource({
                method: 'GET',
                url: endpoint
            })
        });
        return resource;
    }
]);