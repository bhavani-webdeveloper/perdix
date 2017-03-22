irf.models.factory('BankMaster',
['$resource', '$httpParamSerializer', 'BASE_URL', 'searchResource', '$q', 'Queries',
	function($resource, $httpParamSerializer, BASE_URL, searchResource, $q, Queries) {
    var endpoint = BASE_URL + '/api';

    var ret = $resource(endpoint, null, {
        getBankDate: {
				method: 'GET',
				url: endpoint + '/bankMasters/fetchDates'
			}
    });

    ret.getCBSBanks = function(){
    	var deferred = $q.defer();
    	var request = {};
    	Queries.getResult("cbsBanks.list", request)
    		.then(function(records){
    			if (records && records.results) {
    				var result = {
    					headers: {
    						"x-total-count": records.results.length
    					},
    					body: records.results
    				};
    				deferred.resolve(result);
    			}
    		}, deferred.reject);

    	return deferred.promise;
    }

    ret.getCBSDate = function() {
		var deferred = $q.defer();
		ret.getCBSBanks().then(function(results){
			var results = results.body;
			if (results && results.length > 0){
				var result = results[0];
				deferred.resolve(result.current_working_date);

			} else {
				deferred.reject("Date not available");
			}
		}, function(){
			deferred.reject("Unknown Error");
		});
		return deferred.promise;
    };

    return ret;
}]);