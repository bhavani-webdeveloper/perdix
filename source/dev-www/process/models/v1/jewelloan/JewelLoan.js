irf.models.factory('JewelLoan', 
	["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
	function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

		var endpoint = BASE_URL + '/api/jewelPouch';
		var resource = $resource(endpoint, null, {
			search: searchResource({
				method: 'GET',
				url: endpoint + '/find'
			}),
			bulkJewelStatusUpdate:{
				method: 'PUT',
				isArray:true,
				url: endpoint + '/bulkUpdate'
			}
		});
		return resource;
	}
]);

