irf.models.factory('Queries',function($resource,$httpParamSerializer,BASE_URL, $q){
	var endpoint = BASE_URL + '/api';

	var resource =  $resource(endpoint, null, {
		query:{
			method:'POST',
			url:endpoint+'/query'
		}
	});

	resource.getResult = function(id, params, limit, offset) {
		var deferred = $q.defer();
		resource.query({identifier:id, limit:limit || 0, offset:offset || 0, parameters:params}).$promise.then(deferred.resolve, deferred.reject);
		return deferred.promise;
	};

	resource.getPagesDefinition = function(userId) {
		var deferred = $q.defer();
		resource.getResult('userpages.list', {user_id:userId}).then(function(records){
			if (records && records.results) {
				var def = {};
				_.each(records.results, function(v, k){
					def[v.uri] = {
						"offline": v.offline,
						"directAccess": v.directAccess,
						"title": v.title,
						"shortTitle": v.shortTitle,
						"iconClass": v.iconClass,
						"state": v.state,
						"stateParams": {
							"pageName": v.pageName,
							"pageId": v.pageId
						}
					};
					if (v.addlParams) {
						try {
							var ap = JSON.parse(v.addlParams);
							angular.extend(def[v.uri].stateParams, ap);
						} catch (e) {}
					}
				});
				deferred.resolve(def);
			}
		}, deferred.reject);
		return deferred.promise;
	};

	return resource;
});
