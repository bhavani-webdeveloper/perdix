irf.models.factory('GroupProcess', function($resource, $httpParamSerializer, BASE_URL, searchResource) {
    var endpoint = BASE_URL + '/api/groupprocess';
    return $resource(endpoint, null, {
        save: {
            method: 'POST',
            url: endpoint
        },
        updateGroup: {
            method: 'PUT',
            url: endpoint
        },
        DSCCheck: {
            method: 'POST',
            url: endpoint + '/grouploandsc',
            isArray:true
        },
    });
});