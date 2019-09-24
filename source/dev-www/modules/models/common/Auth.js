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

irf.models.factory('Auth', function($resource,$httpParamSerializer,$http,BASE_URL,AuthTokenHelper,Utils){
	var endpoint = BASE_URL;
	var loginUrl="/oauth/token?cacheBuster=" + Date.now();
	var macaddress=null;
	var resource = $resource(endpoint, {}, {
		'login':{
			url: endpoint + loginUrl,
			method: 'POST',
			headers: {
				'Accept':'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			transformRequest: function (data) {
				return $httpParamSerializer(data);
			}
		},
		'logout': {
			method: 'POST',
			url: endpoint + '/api/logout?cacheBuster=' + Date.now()
		},
		'changeBranch': {
			method: "GET",
			url: endpoint + "/api/changedBranch"
		}
	});

	resource.getToken = function(credentials){
		credentials.grant_type = 'password';
		credentials.scope = 'read write';
		credentials.client_secret = 'mySecretOAuthSecret';
		credentials.client_id='application';
		credentials.skip_relogin = 'yes';
		var macaddress=credentials.macaddress;
		var imeiNumber=credentials.imeinumber;
			
		$http.defaults.headers.common['X-MAC-ADDRESS'] = macaddress;
		return resource.login({ "imeiNumber": imeiNumber }, credentials, function (response) {
			$http.defaults.headers.common['X-MAC-ADDRESS'] = undefined;
			AuthTokenHelper.setAuthData(response);
		});
		
		
	};

	return resource;
});
