// define([], function() {
// 	return {
// 		pageUID: "Worklist",
// 		pageType: "Engine",
// 		dependencies: ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper"],
// 		$pageFn: function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
// 			var endpoint = BASE_URL + '/api/customer';
// 			var resource = $resource(endpoint, null, {
// 				findWorklists:searchResource ({
// 					method: 'GET',
// 					url: endpoint + '/findWorkLists'
// 				}),
// 				get: {
// 					method: 'GET',
// 					url: endpoint + '/getWorkList/:id'
// 				},
// 				update: {
// 					method: "PUT",
// 					url: endpoint + '/workList'
// 				}
// 			});
			
// 			return resource;			
// 		}
// 	}
// })


irf.models.factory('Worklist', 
	["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
	function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

		var endpoint = BASE_URL + '/api/customer';
		var resource = $resource(endpoint, null, {
			findWorklists:searchResource ({
				method: 'GET',
				url: endpoint + '/findWorkLists'
			}),
			get: {
				method: 'GET',
				url: endpoint + '/getWorkList/:id'
			},
			update: {
				method: "PUT",
				url: endpoint + '/workList'
			},
			getProfile: {
				method: 'GET',
				url: BASE_URL + '/api/editProfile'
			},
			updateProfile: {
				method: "PUT",
				url: BASE_URL + '/api/editProfile'
			}
		});
		
		return resource;
	}
]);