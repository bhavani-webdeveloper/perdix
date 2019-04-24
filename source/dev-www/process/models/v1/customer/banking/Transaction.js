irf.models.factory('Transaction', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
var endpoint = BASE_URL + '/api';

var ret = $resource(endpoint, null, {
        getRemittance :searchResource({
            method:'GET',
            url : endpoint + '/fetchRemittance'
        }),
        saveRemittance:{
        method:'POST',
        url : endpoint + '/remittance'
        },
        saveSBTransaction:{
            method:'POST',
            url : endpoint + '/sbTransaction'
        },
        getCashBalance: searchResource({
            method: 'GET',
            url: endpoint + '/eod/eodCashBalance'
        }),
        saveCashManagement:{
            method: 'POST',
            url: endpoint + '/saveCashManagement'
        }

    });
    return ret;
});