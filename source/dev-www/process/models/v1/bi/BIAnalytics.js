irf.models.factory('BIAnalytics',
["$resource", "$log", "SessionStore", "$httpParamSerializer", "irfStorageService", "$q", "PageHelper",
function($resource, $log, SessionStore, $httpParamSerializer, irfStorageService, $q, PageHelper) {
	var endpoint = irf.ANALYTICS_API_URL + '/api/v2';
	var ret = $resource(endpoint, null, {
		getLoginToken: {
			"method": "POST",
			"url": endpoint + "/login",
			"headers": {
				"Content-Type": "application/json",
				"Authorization": "Basic YW1pdC5zaGFoQGlmbXIuY28uaW46eHl6QDEyMw==", // stalin.solomon@ifmr.co.in:stalinvizard
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
			}
		}
	});
	return ret;
}]);