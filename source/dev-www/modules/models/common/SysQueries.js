irf.models.factory('SysQueries',[
"$resource", "$httpParamSerializer", "BASE_URL", "$q", "$log",
function($resource,$httpParamSerializer,BASE_URL, $q, $log){

	var endpoint = BASE_URL + '/api';

	var resource =  $resource(endpoint, null, {
		query:{
			method:'POST',
			url:endpoint+'/query'
		}
	});

	resource.getResult = function(id, params, limit, offset) {
		return resource.query({queryName:id}, {identifier:id, limit:limit || 0, offset:offset || 0, parameters:params}).$promise;
	};

	resource.getGlobalSettings = function() {
		var deferred = $q.defer();
		resource.getResult('globalSettings.list', {}).then(function(res) {
			if (res && res.results && res.results.length) {
				var globalSettings = _.reduce(res.results, function(map, v) { map[v.name] = v.value; return map; }, {})
				deferred.resolve(globalSettings);
			} else {
				deferred.reject(res);
			}
		}, deferred.reject);
		return deferred.promise;
	}

	resource.getUserBranches = function(userId) {
		var deferred = $q.defer();
		resource.getResult("userBranches.list", {"user_id": userId}).then(function(records){
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

	return resource;
}]);