irf.models.factory('BranchKeyResource',
    function ($resource, $httpParamSerializer, BASE_URL, searchResource) {

        var endpoint = BASE_URL + '/api';

        return $resource(endpoint, null, {
            KeySearch: searchResource({
                method: 'GET',
                url: endpoint + '/allot-reallot'
            }),
            transferKeyCreation: {
                method: 'POST',
                url: endpoint+'/key-transfer'
            },
            allotKeyCreation: {
                method: 'POST',
                url: endpoint + '/allot-reallot'
            }
        });
    });