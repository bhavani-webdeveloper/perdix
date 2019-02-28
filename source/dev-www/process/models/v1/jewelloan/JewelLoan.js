irf.models.factory('JewelLoan', 
	["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
	function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

		var endpoint = BASE_URL + '/api/jewelPouch';
		var resource = $resource(endpoint, null, {

			search: searchResource({
				method: 'GET',
				url: 'process/models/v1/jewelloan/jewelList.json'//  endpoint + '/jewelList'
			}),
			bulkJewelStatusUpdate:{
				method: 'POST',
				url: endpoint + '/bulkUpdate'
			}, 
			findJewelPouch : {
				method:'GET',
				url:'process/models/v1/jewelloan/jewelList.json',
				isArray:true
			}
		});
		 
		return resource;
	}
]);

