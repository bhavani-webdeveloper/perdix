var irf = irf || {};
var irfModels = irf.models = angular.module('IRFModels', ['ngResource', 'ngJSONPath', 'irf.SessionManager']);

irf.models
	.constant('searchResource', function(opts){
		var obj = {
			transformResponse: function(response, headersGetter){
				var headers = headersGetter();
				var response = {
					body: JSON.parse(response),
					headers: headers
				}
				return response;
			}
		}
		return angular.extend(obj, opts);
	})
;
