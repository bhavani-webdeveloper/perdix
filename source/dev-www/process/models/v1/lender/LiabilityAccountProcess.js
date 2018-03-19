irf.models.factory('LiabilityAccountProcess', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/liabilityAccount';
        var resource = $resource(endpoint, null, {
            getLeadSchema: {
                method: 'GET',
                url: 'process/schemas/Leadgeneration.json'
            },
            save: {
                method: 'POST',
                url: endpoint
            },
        });
        return resource;
    }
]);