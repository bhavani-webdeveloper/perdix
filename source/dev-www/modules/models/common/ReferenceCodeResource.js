irf.models.factory('ReferenceCodeResource',function($resource,$httpParamSerializer,BASE_URL,searchResource){
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
        },
        getSchema: {
            method: 'GET',
            url: 'process/schemas/reference_code.json'
        },
        referenceCodesSubmit: {
            method: 'POST',
            url: BASE_URL + "/api/referencecodes"
        },
        search: searchResource( {
            method: "GET",
            url: BASE_URL + "/api/referencecodes" +"/"
        }),
         referenceCodesEdit: {
            method: 'PUT',
            url: BASE_URL + "/api/referencecodes"
        },
        referenceCodesDelete: {
            method: 'DELETE',
            url: BASE_URL + "/api/referencecodes/:id"
        }
    });
});
