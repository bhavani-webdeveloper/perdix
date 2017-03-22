irf.models.factory('ReferenceCode', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/_refs';

        var res = $resource(endpoint, null, {
            allClassifier: searchResource({
                method: 'GET',
                url: endpoint + '/referencecodes/classifiers'
            }),
            allCodes: searchResource({
                method: 'GET',
                url: BASE_URL + '/api/referencecodes'   
            }),
            
        });

        return res;
    }
]);