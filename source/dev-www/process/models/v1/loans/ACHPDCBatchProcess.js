irf.models.factory('ACHPDCBatchProcess', 
["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

	var endpoint = BASE_URL + '/api/batch';

	var resource = $resource(endpoint, null, {

		fetchDemandListFromEncore: {
			method: 'GET',
			url: endpoint + '/fetchDemandListFromEncore'
		},
		fetchDemandBatchList : searchResource({
			method: 'GET',
			url: endpoint + '/fetchDemandBatchList'
		}),
		fetchDemandDetails: {
			method: 'GET',
			url: endpoint + '/fetchDemandDetails'
		},
		submitDemandForRepayment: {
			method: 'POST',
			url: endpoint + '/submitDemandForRepayment'
		},
		fetchDemandStatus: {
			method: 'GET',
			url: endpoint + '/fetchDemandStatus'
		},
		fetchLoanrepaybatchlist: searchResource({
			method: 'GET',
			url: endpoint + '/loanrepaybatchlist'
		}),
		fetchDemandStatus: {
			method: 'POST',
			url: endpoint + '/fetchDemandStatus'
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
        var params = {
        				'demandDateFrom' : options.demandDate, 
        				'demandDateTo' : options.demandDate
        			};
        var response;

		if(options.batchType === 'demand'){

			response = resource.fetchDemandBatchList(params);
		} else{
			response = resource.fetchLoanrepaybatchlist(params);
		}

		response.$promise.then(
			function(resp){
                PageHelper.showProgress("page-init", "Done.", 2000);
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