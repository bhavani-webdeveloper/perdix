irf.models.factory('ChartOfAccount',
	["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
	function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

		var endpoint = BASE_URL + '/api/maintenance';
		var resource = $resource(endpoint, null, {
			get: {
				method: "GET",
				url: endpoint + '/findAccountCode/:id'
			},
			update: {
				method: "PUT",
				url: endpoint + '/updateAccountCode'
			},
			post: {
				method: "POST",
				url: endpoint + '/createAccountCode'
			},
			search: searchResource({
				method: "GET",
				url: endpoint + '/listAccountCode'
			}),
            list: {
               method: "GET",
               url: endpoint + '/listAccountCode',
               isArray: true
            },
            getSchema:{
                method:'GET',
                url:'process/schemas/chartOfAccounts/chartOfAccount.json'
            },
		});

		return resource;
	}
]);
