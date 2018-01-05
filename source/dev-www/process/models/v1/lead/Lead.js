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
			assignLead: {
				method: 'POST',
				url: endpoint + '/assignCentre'
			},
			updateLead: {
				method: 'PUT',
				url: endpoint
			},
			search: searchResource({
				method: 'GET',
				url: endpoint
			}),
			get: {
				method: 'GET',
				url: endpoint + '/:id'
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

		resource.getConfigFile = function() {
			return {
				"lead.currentStage": {
					"Inprocess": {
						"overrides": {
							"leadProfile": {
								"readonly": true
							}
						},
                        "excludes": [
                            "previousInteractions"
                        ]
					},
					"BulkUpload": {
						"excludes": [
						"productDetails"
						]
					},
				},
				"siteCode": {
					"sambandh": {
						"excludes": [
						"previousInteractions"
						]
					}
				}


			}
		}
		return resource;
	}


	]);
