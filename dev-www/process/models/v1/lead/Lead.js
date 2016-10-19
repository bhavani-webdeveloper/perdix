irf.models.factory('lead',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/lead';
    return $resource(endpoint, null, {
        getLeadSchema: {
            method: 'GET',
            url: 'process/schemas/Leadgeneration.json'
        },
       
    });
});
