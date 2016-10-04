irf.models.factory('document',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/document';
    return $resource(endpoint, null, {
        getSchema: {
            method: 'GET',
            url: 'process/schemas/DocumentTracking.json'
        },
       
    });
});
