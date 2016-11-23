irf.models.factory('Psychometric', ['$resource', '$httpParamSerializer', '$http', function($resource,$httpParamSerializer,$http){
    var endpoint = irf.PSYCHOMETRIC_BASE_URL + '/api/psychometric';

    var res = $resource(endpoint, null, {
        getTest:{
            method:'GET',
            url:endpoint + '/test'
        },
        postTest:{
            method:'POST',
            url:endpoint + '/test'
        },
        getAllConfig: {
            method: 'GET',
            url: endpoint + '/maintenance/config/all',
            isArray: true
        },
        getLanguages: {
            method: 'GET',
            url: endpoint + '/maintenance/language/all',
            isArray: true
        }
    });

    res.getTestHttp = function(params) {
        return {
            "$promise": $http({
                "method": "GET",
                "url": endpoint + '/test',
                "params": params
            })
        };
    };
    return res;
}]);
