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
		}
	});
	return ret;
}]);