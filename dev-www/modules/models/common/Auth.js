var irf = irf || {};
/* CONSTANTS */
irf.SESSION_AUTH_KEY = 'AuthData';
irf.SESSION_USER_KEY = 'User';
irf.REDIRECT_STATE = 'Login';

irf.models.factory('AuthTokenHelper', ['SessionStore', '$log', function(SessionStore, $log){
	var authData = {};
	return {
		setAuthData: function(data){
			authData = data;
			SessionStore.setItem(irf.SESSION_AUTH_KEY, data);
			$log.info("Setting AuthData into Session");
		},
		getAuthData: function(){
			if (!authData || !authData.access_token) {
				authData = SessionStore.getItem(irf.SESSION_AUTH_KEY); //authData;
			}
			return authData;
		},
		clearAuthData:function(){
			authData={};
			SessionStore.removeItem(irf.SESSION_AUTH_KEY);
		}
	};
}]);

irf.models.factory('Auth', function($resource,$httpParamSerializer,$http,BASE_URL,AuthTokenHelper){
	var endpoint = BASE_URL;
	var resource = $resource(endpoint, {}, {
		'login':{
			url: endpoint + "/oauth/token?cacheBuster=" + Date.now(),
			method: 'POST',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			transformRequest: function (data) {
				return $httpParamSerializer(data);
			}
		},
		'logout': {
			method: 'POST',
			url: endpoint + '/api/logout?cacheBuster=' + Date.now()
		}
	});

	resource.getToken = function(credentials){
		credentials.grant_type = 'password';
		credentials.scope = 'read write';
		credentials.client_secret = 'mySecretOAuthSecret';
		credentials.client_id='application';
		credentials.skip_relogin = 'yes';

		return resource.login(credentials,function(response){
			//$http.defaults.headers.common['Authorization']= 'Bearer '+response.access_token;
			AuthTokenHelper.setAuthData(response);
		});
	};

	return resource;
});
