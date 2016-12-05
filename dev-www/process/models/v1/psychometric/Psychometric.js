irf.models.factory('Psychometric', 
    ['$resource', '$httpParamSerializer', '$http', 'searchResource', "Queries", "$q",
    function($resource, $httpParamSerializer, $http,searchResource, Queries, $q) {
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
        updateAllConfig: {
            method: 'PUT',
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
        findQuestions: searchResource({
            method: 'GET',
            url: endpoint + '/question/find'
        }),
        getSingleQuestion: {
            method: 'GET',
            url: endpoint + '/question/single/:id'
        },
        getPairedQuestions: {
            method: 'GET',
            url: endpoint + '/question/paired/:id',
            isArray: true
        },
        postPairedQuestions: {
            method: 'POST',
            url: endpoint + '/question/paired',
            isArray: true
        },
        getLinkedQuestion: {
            method: 'GET',
            url: endpoint + '/question/linked/:id'
        },
        postLinkedQuestion: {
            method: 'POST',
            url: endpoint + '/question/linked'
        }
    });

    res.searchLoanForPsychometric = function(params) {
        var deferred = $q.defer();
        var parameters = {
            pincode: params.pincode || '',
            first_name: params.first_name || '',
            area: params.area || '',
            village_name: params.village_name || ''
        };
        Queries.getResult("searchLoanForPsychometric", parameters, params.per_page, params.page).then(function(resp){
            if (resp && resp.results && resp.results.length) {
                deferred.resolve({
                    headers: {
                        "x-total-count": resp.totalCount
                    },
                    body: resp.results
                });
            } else {
                deferred.resolve({
                    headers: {
                        "x-total-count": 0
                    },
                    body: []
                });
            }
        }, deferred.reject);
        return deferred.promise;
    };

    return res;
}]);