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

		
	resource.validateDate = function(req) {
		if (req.loanMonitoringDetails && req.loanMonitoringDetails.lucRescheduledDate) {
			var today = moment(new Date()).format("YYYY-MM-DD");
			if (req.loanMonitoringDetails.lucRescheduledDate <= today) {
				$log.info("bad night");
				PageHelper.showProgress('validate-error', 'Rescheduled Date: Rescheduled Date must be a Future Date', 5000);
				return false;
			}
		}
		return true;
	}

	resource.orderLUCDocuments = function(model) {

		var lucDocuments = model.loanMonitoringDetails.loanMonitoringDocuments || [];

		for (var i = 0; i < lucDocuments.length; i++) {

			lucDocuments[i]["documentSl"] = (i + 1);
		}
		return model;
	}

		return resource;
	}
]);