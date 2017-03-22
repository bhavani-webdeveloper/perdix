irf.models.factory('LUC', 
	["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
	function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

		var endpoint = BASE_URL + '/api/loanMonitoring';
		var resource = $resource(endpoint, null, {
			getSchema: {
				method: 'GET',
				url: 'process/schemas/luc.json'
			},
			update: {
				method: 'PUT',
				url: endpoint
			},
			search: searchResource({
				method: 'GET',
				url: endpoint + '/findLoanMonitoringList'
			}),
			get: {
				method: 'GET',
				url: endpoint + '/:id'
			},

		});

		return resource;
	}
]);