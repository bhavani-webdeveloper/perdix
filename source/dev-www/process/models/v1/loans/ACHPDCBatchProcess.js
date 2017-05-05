irf.models.factory('ACHPDCBatchProcess', 
["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "$q", "PageHelper",
function($resource, $httpParamSerializer, BASE_URL, searchResource, $q, PageHelper) {

	var endpoint = BASE_URL + '/api/batch';

	var resource = $resource(endpoint, null, {

		fetchDemandListFromEncore: {
			method: 'GET',
			url: endpoint + '/fetchDemandListFromEncore',
			isArray: true
		},
		fetchDemandBatchList : searchResource({
			method: 'GET',
			url: endpoint + '/fetchDemandBatchList'
		}),
		fetchDemandDetails: {
			method: 'GET',
			url: endpoint + '/fetchDemandDetails',
			isArray: true
		},
		submitDemandForRepayment: {
			method: 'POST',
			url: endpoint + '/submitDemandForRepayment'
		},
		fetchDemandStatus: {
			method: 'GET',
			url: endpoint + '/fetchDemandStatus'
		},
		fetchRepaymentBatchList : searchResource({
			method: 'GET',
			url: endpoint + '/fetchRepaymentBatchList'
		}),
		fetchLoanrepaybatchlist: searchResource({
			method: 'GET',
			url: endpoint + '/loanrepaybatchlist'
		}),
		submitDemandForLoanRepay: {
			method: 'POST',
			url: endpoint + '/loanrepay'
		},
		deleteAchPdcBatchRecords: {
			method: 'DELETE',
			url: endpoint + '/deleteAchPdcBatchRecords'
		},
		submitDemandForRepaymentUpload: {
			method: 'POST',
			url: endpoint + '/submitDemandForRepaymentUpload'
		},

	});

	resource.getBatchMonitoringTasks = function(options){

        var deferred = $q.defer();

        var response;

		if(options.batchType === 'demand'){

			response = resource.fetchDemandBatchList(options);
		} else{
			response = resource.fetchRepaymentBatchList(options);
		}

		response.$promise.then(
			function(resp){
                var result = {
                    headers: {
                        "x-total-count": resp.body.length
                    },
                    body: resp.body
                };
                deferred.resolve(result);
            }, 
            function(errResp){
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }
        );

		return deferred.promise;
	}

	return resource;
}
]);