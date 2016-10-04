irf.models.factory('document',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/lead';
    return $resource(endpoint, null, {
        getSchema: {
            method: 'GET',
            url: 'process/schemas/documentTracking.json'
        },
       
    });
});
