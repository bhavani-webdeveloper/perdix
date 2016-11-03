irf.models.factory('Lead', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
	function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

		var endpoint = BASE_URL + '/api/leads';
		var resource = $resource(endpoint, null, {
			getLeadSchema: {
				method: 'GET',
				url: 'process/schemas/Leadgeneration.json'
			},
			save: {
				method: 'POST',
				url: endpoint
			},
			updateLead: {
				method: 'PUT',
				url: endpoint
			},
		});


		resource.leadBulkUpload = function(file, progress) {
			var deferred = $q.defer();
			Upload.upload({
				url: BASE_URL + "/api/leads/upload",
				data: {
					file: file
				}
			}).then(function(resp) {
				// TODO handle success
				PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
				deferred.resolve(resp);
			}, function(errResp) {
				// TODO handle error
				PageHelper.showErrors(errResp);
				deferred.reject(errResp);
			}, progress);
			return deferred.promise;
		};

		return resource;
	}
]);