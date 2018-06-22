    irf.models.factory('Payment', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
    	var endpoint = BASE_URL + '/api/payments';
    	var resource = $resource(endpoint, null, {
    		get: {
                method: 'GET',
                url: endpoint+"/:id"
            },
            create: {
                method: 'POST',
                url: endpoint
            },
            update: {
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
            },
            getSchema:{
                method:'GET',
                url:'process/schemas/:name'
            },
		});
        return resource;
    }
	]);