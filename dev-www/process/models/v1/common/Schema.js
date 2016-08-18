irf.models.factory('SchemaResource',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/_refs/referencecodes';
    return $resource(endpoint, null, {
        getGlobalSchema:{
            method:'GET',
            url:'process/schemas/GlobalSchema.json'
        },
    });
});
