irf.models.factory('Psychometric', 
    ['$resource', '$httpParamSerializer', '$http', 'searchResource',
    function($resource, $httpParamSerializer, $http,searchResource) {
    var endpoint = irf.PSYCHOMETRIC_BASE_URL + '/api/psychometric';

    var res = $resource(endpoint, null, {
        getTest: {
            method: 'GET',
            url: endpoint + '/test'
        },
        postTest: {
            method: 'POST',
            url: endpoint + '/test'
        },
        getAllConfig: {
            method: 'GET',
            url: endpoint + '/maintenance/config/all',
            isArray: true
        },
        getLanguages: searchResource({
            method: 'GET',
            url: endpoint + '/maintenance/language/all'
        }),
        getCategoryAll: searchResource({
            method: 'GET',
            url: endpoint + '/maintenance/category/all'
        }),
        findCategories:searchResource({
            method: 'GET',
            url: endpoint + '/maintenance/category/find'
        }),
        postSingleQuestion: {
            method: 'POST',
            url: endpoint + '/question/single'
        },
        findSingleQuestion: searchResource({
            method: 'GET',
            url: endpoint + '/question/single/find'
        })
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