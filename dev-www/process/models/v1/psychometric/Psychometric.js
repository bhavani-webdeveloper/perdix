irf.models.factory('Psychometric', ['$resource', '$httpParamSerializer', function($resource,$httpParamSerializer){
    var endpoint = irf.PSYCHOMETRIC_BASE_URL + '/api/psychometric';

    return $resource(endpoint, null, {
        getTest:{
            method:'GET',
            url:endpoint + '/test'
        },
        getAllConfig: {
            method: 'GET',
            url: endpoint + '/maintenance/config/all',
            isArray: true
        }
    });
}]);
