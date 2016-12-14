/**
 * AuthService have the following duties
 *
 * 1) Store and Retrieve user information
 * 2) User information should be stored in the Session
 * 3) Make sure the session is still valid.
 * 4)
 */

irf.commons.factory('authService',
['Auth', 'Account', '$q', '$log', 'SessionStore', 'irfStorageService', 'AuthTokenHelper',
function(Auth, Account, $q, $log, SessionStore, irfStorageService, AuthTokenHelper) {
	var userData = null;

	var login = function(username, password) {
		var promise = Auth.getToken({
			"username": username,
			"password": password
		}).$promise;

		return promise;
	};

	var setUserData = function(_userData) {
		if (_userData && _userData.login) {
			userData = _userData;
			$log.error(_userData);
			return true;
		}
		return false;
	};

	var removeUserData = function() {
		userData = null;
		SessionStore.setSession({});
	};

	var getUser = function() {
		var deferred = $q.defer();
		Account.get({'service': 'account'}, function(accountResponse){
			Account.getCentresForUser(accountResponse.branchId, accountResponse.login).then(function(resp) {
				accountResponse.centres = resp;
			}).finally(function() {
				setUserData(accountResponse);
				irfStorageService.storeJSON('UserData', accountResponse);
				deferred.resolve(accountResponse);
			});
		}, function(response){
			deferred.reject({
				'status': response.status,
				'statusText': response.statusText,
				'data': response.data
			});
		});
		return deferred.promise;
	};

	return {
		login: login,
		getUser: getUser,
		getUserData: function() {
			return userData;
		},
		loginAndGetUser: function(username, password){
			var deferred = $q.defer();
			login(username, password).then(function(arg){
				removeUserData();
				getUser().then(function(result){
					var m = irfStorageService.getMasterJSON("UserProfile");
					var km = _.keys(m);
					if (km.length !== 1 || km[0] !== username) {
						// clear UserProfile
						irfStorageService.removeMasterJSON("UserProfile");
					}
					setUserData(result);
					deferred.resolve(result);
				},function(response){
					deferred.reject(response);
				});
			},function(errorArg){
				deferred.reject(errorArg);
			});
			return deferred.promise;
		},
		isUserDataResolved: function(){
			if (userData && userData.login) {
				return true;
			}
			return false;
		},
		getRedirectState: function(){
			return irf.REDIRECT_STATE;
		},
		setUserData: setUserData,
		logout: function() {
			var deferred = $q.defer();
			Auth.logout().$promise.then(
				function(res){
					removeUserData();
					AuthTokenHelper.clearAuthData();
					deferred.resolve("SUCCESS");
				}, function(httpRes){
					deferred.reject(httpRes);
				}
			)
			return deferred.promise;
		}
	}
}]);

irf.commons.config(["$httpProvider", function($httpProvider){
	$httpProvider.interceptors.push(function($q, AuthTokenHelper, AuthPopup, $rootScope) {
		return {
			'request': function(config) {
				var authToken = AuthTokenHelper.getAuthData();
				authToken = authToken ? authToken.access_token : authToken;
				if (!config.headers || !config.headers['$no_auth'])
					config.headers['Authorization']= 'Bearer '+ authToken;
				return config;
			},
			'responseError': function(rejection) {
				console.log("rejection status: " + rejection.status);
				if (rejection.status === 401 && !(rejection.config && rejection.config.data && rejection.config.data.skip_relogin=='yes')) {
					var deferred = $q.defer();
					AuthPopup.pushToRelogin(deferred, rejection);
					return deferred.promise;
				} else if (rejection.status === 408 || rejection.status <= 0) {
					// CONNECTION_TIMEDOUT
					$rootScope.$broadcast('server-connection-error', rejection.status);
				}
				// $log.error(rejection);
				return $q.reject(rejection);
			}
		};
	});
}]);

irf.commons.run(['AuthTokenHelper', 'SessionStore', '$log', function(AuthTokenHelper, Session, $log){
	$log.info("Inside run() of IRFModels");
	$log.info("-------------------------");
	$log.info("Loading Auth Information from Session...");
	var authData = Session.getItem(irf.SESSION_AUTH_KEY)
	if (authData!=null){
		AuthTokenHelper.setAuthData(authData);
		$log.info("Auth information found in the Session. Updated to Auth Resource")
	} else {
		$log.info("No Auth info in Session");
	}
}]);

irf.commons.factory('AuthPopup', ['AuthTokenHelper', '$log', function(AuthTokenHelper, $log){
	var self = this;

	self.pipe = [];

	return {
		promisePipe: self.pipe,
		pushToRelogin: function(deferred, rejection) {
			$log.info("inside popup");
			// 1. show popup
			// 2. complete login
			// 3. rejection.config to request
			// 4. send response back
			if (_.endsWith(rejection.config.url, 'api/account')) { // TODO need to work on different way to check this
				deferred.reject(rejection);
			} else {
				self.pipe.push({deferred:deferred, rejection: rejection});
			}

		}
	};
}]);
