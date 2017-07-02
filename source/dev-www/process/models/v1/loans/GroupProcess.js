irf.models.factory('GroupProcess', function($resource, $httpParamSerializer, BASE_URL, searchResource) {
    var endpoint = BASE_URL + '/api/groupprocess';
    return $resource(endpoint, null, {
        search:searchResource({
            method:'GET',
            url:endpoint+'/search'
        }),
        getGroup:{
            method:'GET',
            url:endpoint+"/:groupId"
        },
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