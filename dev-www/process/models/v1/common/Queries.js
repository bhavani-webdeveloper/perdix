irf.models.factory('Queries',[
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
		return resource.query({identifier:id, limit:limit || 0, offset:offset || 0, parameters:params}).$promise;
	};

	/*
		userpages.list=select p.uri, p.title, p.short_title shortTitle, p.icon_class iconClass, p.direct_access directAccess, p.offline, p.state, p.page_name pageName, p.page_id pageId, p.addl_params addlParams, rpa.page_config pageConfig from pages p, role_page_access rpa where p.id = rpa.page_id and rpa.role_id in (select role_id from user_roles where user_id = :user_id)
	*/

	resource.getPagesDefinition = function(userId) {
		var deferred = $q.defer();
		resource.getResult('userpages.list', {user_id:userId}).then(function(records){
			if (records && records.results) {
				var def = {};
				_.each(records.results, function(v, k){
					var d = {
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

	resource.searchPincodes = function(pincode, district, state) {
		var deferred = $q.defer();
		var request = {"pincode":pincode || '', "district":district || '', "state":state || '',};
		resource.getResult("pincode.list", request, 10).then(function(records){
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
	};

	return resource;
}]);
