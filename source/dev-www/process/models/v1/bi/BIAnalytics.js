irf.models.factory('BIAnalytics',
["$resource", "$log", "SessionStore", "$httpParamSerializer", "irfStorageService", "$q", "PageHelper", "Account",
function($resource, $log, SessionStore, $httpParamSerializer, irfStorageService, $q, PageHelper, Account) {
	var endpoint = irf.ANALYTICS_API_URL + '/api/v2';
	var ret = $resource(endpoint, null, {
		getLoginToken: {
			"method": "POST",
			"url": endpoint + "/login",
			"headers": {
				"Content-Type": "application/json",
				"Authorization": "Basic YW1pdC5zaGFoQGlmbXIuY28uaW46eHl6QDEyMw==", // stalin.solomon@ifmr.co.in:stalinvizard
				"Authorization": function(config) {
						var token = config.data.analyticsToken;
						// delete config.data.analyticsToken;
						return "Basic " + token;
					},
				"$no_auth": true
			},
			transformResponse: function(data, headersGetter) {
				return {
					data: data,
					headers: headersGetter()
				};
			}
		},
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
		}
	});

	ret.getAnalyticsLoginToken = function() {
		var deferred = $q.defer()
		Account.getAnalyticsToken().$promise.then(function(data) {
			ret.getLoginToken(data).$promise.then(function(resp) {
				deferred.resolve(resp);
			}, function(err){
				deferred.reject(err);
			});
		}, function(error){
			deferred.reject(error);
		})

		return deferred.promise;
	}
	return ret;
}]);