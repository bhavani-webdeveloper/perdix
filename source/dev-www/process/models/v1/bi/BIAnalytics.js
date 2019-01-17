irf.models.factory('BIAnalytics',
["$resource", "$log", "SessionStore", "$httpParamSerializer", "irfStorageService", "$q", "PageHelper", "Account",
function($resource, $log, SessionStore, $httpParamSerializer, irfStorageService, $q, PageHelper, Account) {
	var endpoint = irf.ANALYTICS_API_URL + '/api/v2';
	var ret = $resource(endpoint, null, {
		setCookie: {
			"method": "POST",
			"url": endpoint + "/set-cookie",
			"headers": {
				"Content-Type": "application/json",
					"Authorization": function(config) {
						var token = config.data.authToken;
						delete config.data.authToken;
						return "Bearer " + token;
					},
				"$no_auth": true
			},
			"withCredentials": true
		},
		currentUser: {
			"method": "GET",
			"url": endpoint + "/users/current-user",
			"headers": {
				"Content-Type": "application/json",
					"Authorization": function(config) {
						var token = config.params.authToken;
						delete config.params.authToken;
						return "Bearer " + token;
					},
				"$no_auth": true
			},
			//"withCredentials": true
		},
		applications: {
			"method": "GET",
			"url": endpoint + "/teams/:teamId/current-user/applications",
			"headers": {
				"Content-Type": "application/json",
					"Authorization": function(config) {
						var token = config.params.authToken;
						delete config.params.authToken;
						return "Bearer " + token;
					},
				"$no_auth": true
			},
		}
	});
	ret.doAnalyticsLogin = function(authToken) {
		var deferred = $q.defer();
		var authToken;
		Account.getAnalyticsToken().$promise.then(function(data) {
			authToken = data.analyticsToken.substring(12)
			return ret.setCookie({
				"authToken": authToken
			}).$promise;
		}).then(function(resp) {
			$log.info(resp);
			ret.currentUser({
				"authToken": authToken
			}).$promise.then(function(data) {
				var team = '';
				if(data && data.user && data.user.teams && data.user.teams.length > 0 ) {
					for (var i in data.user.teams) {
						if (data.user.teams[i].active) {
							team = data.user.teams[i].name;
							ret.applications({"authToken": authToken, "teamId": data.user.teams[i]._id}).$promise.then(
								function(resp) {
									if(resp.viewerApplications) {
										for (var j in resp.viewerApplications) {
											if (resp.viewerApplications[j].active) {
												deferred.resolve({"team": team, "application": resp.viewerApplications[j].name })
												return;
											}
										}
										deferred.reject({data: {error: "Analytics Login Failed. There are no active applications assigned to the user."}});
									} else {
										deferred.reject({data: {error: "Analytics Login Failed. There are no applications assigned to the user."}});	
									}
								}, function(err) {
									deferred.reject({data: {error: JSON.stringify(err)}});
								}
							);
							return;
						}
					}
					deferred.reject({data: {error: "Analytics Login Failed. There are no active teams assigned to the user."}});
				} else {
					deferred.reject({data: {error: "Analytics Login Failed. There are no teams assigned to the user."}});
				}
			}, function(err) {
				deferred.reject({data: {error: JSON.stringify(err)}});
			});
		}, function(err) {
			deferred.reject({data: {error: JSON.stringify(err)}});
		});
		return deferred.promise;	
	}
	return ret;
}]);