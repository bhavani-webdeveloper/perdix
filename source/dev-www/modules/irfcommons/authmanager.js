/**
 * AuthService have the following duties
 *
 * 1) Store and Retrieve user information
 * 2) User information should be stored in the Session
 * 3) Make sure the session is still valid.
 * 4)
 */

irf.commons.factory('authService',
['Auth', 'Account', '$q', '$log', 'SessionStore', 'irfStorageService', 'AuthTokenHelper', 'BankMaster', 'SysQueries',
function(Auth, Account, $q, $log, SessionStore, irfStorageService, AuthTokenHelper, BankMaster, SysQueries) {
	var userData = null;

	var login = function(username, password) {
		var promise = Auth.getToken({
			"username": username,
			"password": password
		}).$promise;

		return promise;
	};

	var autoLogin = function(username, authToken) {
		AuthTokenHelper.setAuthData({
			"access_token": authToken,
			"token_type": "bearer",
			"scope": "read write",
			"auto_login_username": username
		});
		return $q.resolve();
	};

	var setUserData = function(_userData) {
		if (_userData && _userData.login) {
			userData = _userData;
			$log.error(_userData);
			SessionStore.setSession(userData);
			return true;
		}
		return false;
	};

	var removeUserData = function() {
		userData = null;
		SessionStore.clear();
	};

	var getUser = function() {
		var deferred = $q.defer();
		Account.get({'service': 'account'}, function(accountResponse) {
			var loginError = null;
			Account.getCentresForUser(accountResponse.branchId, accountResponse.login).then(function(resp) {
				accountResponse.centres = resp;
				return BankMaster.getCBSDate();
			}, function(err){
				loginError = { 'statusText': 'Centre not available for the user branch' };
				$log.error(err);
			}).then(function(cbsDate) {
				accountResponse.cbsDate = cbsDate;
				return Account.getUserRole({'userId':accountResponse.login}).$promise;
			}, function(err) {
				loginError = { 'statusText': 'Failed to load CBS Date' };
				$log.error(err);
			}).then(function(role) {
				accountResponse.role = role;
				return SysQueries.getGlobalSettings();
			}, function(err) {
				loginError = { 'statusText': 'Failed to load User Role' };
				$log.error(err);
			}).then(function(globalSettings) {
				accountResponse.global = globalSettings;
			}, function(err) {
				loginError = { 'statusText': 'Failed to load Global Settings' };
				$log.error(err);
			}).finally(function() {
				if (loginError) {
					deferred.reject(loginError);
					return;
				}
				setUserData(accountResponse);
				irfStorageService.storeJSON('UserData', accountResponse);
				deferred.resolve(accountResponse);
			});
		}, function() {deferred.reject({ 'statusText': 'Perdix server is down. Pl contact administrator' })});
		return deferred.promise;
	};

	var loadUserBranches = function() {
		var deferred = $q.defer();
		var username = SessionStore.getLoginname();
		SysQueries.getUserBranches(username).then(function(response){
			var branches = response.body;
			var out = [];
			for (var i=0; i<branches.length; i++){
				out.push({
					branchId: branches[i].branch_id,
					branchCode: branches[i].branch_code,
					branchName: branches[i].branch_name,
					bankId : branches[i].bank_id
				})
			}
			SessionStore.setItem('UserAllowedBranches', out);
			deferred.resolve();
		}, function(httpResponse) {
			$log.error("Error trying to load allowed branches of user.")
			deferred.resolve();
		});
		return deferred.promise;
	};

	var postLogin = function(refresh) {
		var deferred = $q.defer();
		removeUserData();
		getUser().then(function(result) {
			var m = irfStorageService.getMasterJSON("UserProfile");
			var km = _.keys(m);
			if (km.length !== 1 || km[0] !== username) {
				// clear UserProfile
				irfStorageService.removeMasterJSON("UserProfile");
			}
			setUserData(result);

			var p = [
				irfStorageService.cacheAllMaster(true, refresh),
				loadUserBranches()
			];
			$q.all(p).then(function(msg) {
				SessionStore.session.offline = false;
				deferred.resolve();
				themeswitch.changeTheme(themeswitch.getThemeColor(), true);
			}, deferred.reject);
		}, deferred.reject);
		return deferred.promise;
	};

	return {
		login: login,
		autoLogin: autoLogin,
		getUser: getUser,
		getUserData: function() { return userData; },
		removeUserData: removeUserData,
		postLogin: postLogin,
		loginAndGetUser: function(username, password){
			var deferred = $q.defer();
			login(username, password).then(function() {postLogin(true)}, deferred.reject);
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
				if (config.headers['$no_auth']) {
					delete config.headers['$no_auth'];
				}
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
