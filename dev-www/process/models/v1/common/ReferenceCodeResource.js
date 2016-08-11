irf.models.factory('ReferenceCodeResource',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/_refs/referencecodes';
    return $resource(endpoint, null, {
        fetchClassifiers:{
            method:'GET',
            url:endpoint+"/classifiers",
            isArray:"true"
        },
        fetchRefCode:{
            method:"GET",
            url:endpoint+"/all/codes/:classifiers"
        },
        findAll: {
            method: "GET",
            url: BASE_URL + "/api/allreferencecodes",
            isArray:"true"
        }
    });
});
