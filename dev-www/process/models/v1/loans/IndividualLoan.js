irf.models.factory('IndividualLoan',function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + "/api/individualLoan";

    return $resource(endpoint, null, {
        'save': {
            method: 'POST'
        }
    })
})
