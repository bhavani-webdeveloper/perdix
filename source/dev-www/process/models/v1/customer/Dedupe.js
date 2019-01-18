irf.models.factory('Dedupe', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
    var endpoint = BASE_URL + '/api';

    var ret = $resource(endpoint, null, {
        create: {
				method: 'POST',
				url: endpoint + '/dedupe/postDedupeRequest'
			},
		getSchema: {
			method: 'GET',
			url: 'process/schemas/dedupe.json'
		},
		getCustomerId: {
			method: 'GET',
			url: endpoint + '/dedupe/getDedupeRequests',
			isArray : true
		}	
    });

    return ret;
});