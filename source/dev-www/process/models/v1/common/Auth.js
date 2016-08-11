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
			return SessionStore.getItem(irf.SESSION_AUTH_KEY); //authData;
		},
		clearAuthData:function(){
			authData={};
			SessionStore.removeItem(irf.SESSION_AUTH_KEY);
		}
	};
}]);

irf.models.factory('Auth', function($resource,$httpParamSerializer,$http,BASE_URL,AuthTokenHelper){
	var endpoint = BASE_URL + '/oauth/token?cacheBuster=' + Date.now();
	var resource = $resource(endpoint, {}, {
		'login':{
			method: 'POST',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			transformRequest: function (data) {
				return $httpParamSerializer(data);
			}
		}
	});

	resource.getToken = function(credentials){
		credentials.grant_type = 'password';
		credentials.scope = 'read write';
		credentials.client_secret = 'mySecretOAuthSecret';
		credentials.client_id='application';

		return resource.login(credentials,function(response){
			//$http.defaults.headers.common['Authorization']= 'Bearer '+response.access_token;
			AuthTokenHelper.setAuthData(response);
		});
	};

	return resource;
});
