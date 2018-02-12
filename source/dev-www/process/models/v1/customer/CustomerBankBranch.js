irf.models.factory('CustomerBankBranch', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
    var endpoint = BASE_URL + '/api';

    var ret = $resource(endpoint, null, {
        search: searchResource({
            method: 'GET',
            url: endpoint + '/customerbankbranch'
        })
    });

    return ret;
});