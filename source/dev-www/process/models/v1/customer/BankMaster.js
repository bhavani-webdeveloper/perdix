irf.models.factory('BankMaster', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
    var endpoint = BASE_URL + '/api';

    var ret = $resource(endpoint, null, {
        get: {
				method: 'GET',
				url: endpoint + '/bankMasters/fetchDates'
			}
    });

    return ret;
});