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

	resource.getPagesDefinition = function(userId, skip_relogin) {
		var deferred = $q.defer();
		resource.query({identifier:'userpages.list', limit: 0, offset: 0, parameters:{user_id:userId}, skip_relogin: skip_relogin || false}).$promise.then(function(records){
			if (records && records.results) {
				var def = {};
				_.each(records.results, function(v, k){
					var d = {
						"uri": v.uri,
						"offline": v.offline,
						"directAccess": v.directAccess,
						"title": v.title,
						"shortTitle": v.shortTitle,
						"iconClass": v.iconClass,
						"state": v.state,
						"stateParams": {
							"pageName": v.pageName,
							"pageId": v.pageId
						},
						"config": v.pageConfig
					};
					if (v.addlParams) {
						try {
							var ap = JSON.parse(v.addlParams);
							angular.extend(d.stateParams, ap);
						} catch (e) {}
					}
					if (v.pageConfig) {
						try {
							var pc = JSON.parse(v.pageConfig);
							d.config = pc;
						} catch (e) {}
					}
					def[v.uri] = d;
				});
				deferred.resolve(def);
			}
		}, deferred.reject);
		return deferred.promise;
	};

	resource.getUserBranches = function(userId){
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