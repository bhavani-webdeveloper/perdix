    irf.models.factory('Payment', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
    	var endpoint = BASE_URL + '/api/payments';
    	var resource = $resource(endpoint, null, {
    		 get: {
                method: 'GET',
                url: endpoint+"/:id"
            },
            save: {
                method: 'POST',
                url: endpoint
            },
            proceed: {
                method: 'PUT',
                url: endpoint
            },
            search: searchResource({
                method: 'GET',
                url: endpoint
            }),
            createBatch: {
            	method: 'PUT',
            	url: endpoint + '/dispatchment'
            }
		});
    }
	]);