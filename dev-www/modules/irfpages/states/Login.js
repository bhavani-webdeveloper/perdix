irf.pages.controller('LoginCtrl',
['$scope', 'authService', '$log', '$state', 'irfStorageService', 'SessionStore', 'Utils', 'irfTranslateLoader', '$q',
function($scope, authService, $log, $state, irfStorageService, SessionStore, Utils, irfTranslateLoader, $q){

	var onlineLogin = function(username, password, refresh) {
		authService.loginAndGetUser(username,password).then(function(arg){ // Success callback
			$scope.showLoading = true;

			var p = [
				irfStorageService.cacheAllMaster(true, refresh),
				irfTranslateLoader({forceServer: refresh})
			]
			$q.all(p).then(function(msg){
				$log.info(msg);
                SessionStore.session.offline = false;
                themeswitch.changeTheme(themeswitch.getThemeColor(), true);
				$state.go(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
				if (refresh) {
					window.location.hash = '#/' + irf.HOME_PAGE.url;
					window.location.reload();
				}
			},function(e){ // Error callback
				$log.error(e);
				$scope.showLoading = false;
			}).finally(function(){
				// $scope.showLoading = false;
			});
		}, function(arg){ // Error callback
			$scope.showLoading = false;
			$log.error(arg);
			if (arg.data && arg.data.error_description) {
				$scope.errorMessage = arg.data.error_description;
			} else {
				$scope.errorMessage = arg.statusText || (arg.status + " Unknown Error");
			}
		});
	};

	this.onlineLogin = function(username, password){
		$log.info("Inside onlineLogin");
		if (!username || !password) {
			$scope.errorMessage = 'LOGIN_USERNAME_PASSWORD_REQ';
			return false;
		}
		$scope.errorMessage = null;
		if (userData && userData.login && username.toLowerCase() !== userData.login.toLowerCase()) {
			// different user
			Utils.confirm('User is different. This will clear all data saved by previous user ('+
				userData.login+'). Do you want to proceed?', 'User Data Clear Alert')
				.then(function(){
					// clear al offline records.
					$scope.showLoading = 'cc';
					$log.debug('localStorage.clear()');
					localStorage.clear();
					SessionStore.clear();

					setTimeout(function() {onlineLogin(username, password, true);});
				});
		} else {
			$scope.showLoading = 'cc';
			onlineLogin(username, password);
		}
	};

	this.offlineLogin = function(pin){
		$log.info("Inside offlineLogin");
		if (!pin) {
			$scope.errorMessage = 'LOGIN_PIN_REQ';
			return false;
		}
		$scope.errorMessage = null;
		if (pin === $scope.offlinePin) {
			authService.setUserData(userData);
			SessionStore.session.offline = true;
			themeswitch.changeTheme('deepteal');
			$log.debug("Offline login success");
			$state.go(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
		} else {
			$scope.errorMessage = "LOGIN_INVALID_PIN";
			return false;
		}
		
		return true;
	};

	$scope.isOnline = true;
	$scope.onlyOnline = true;

	var userData = irfStorageService.retrieveJSON('UserData');
	if (userData && userData.login) {
		var m = irfStorageService.getMasterJSON(irf.form("UserProfile"));
		var km = _.keys(m);
		if (km.length === 1 && km[0] === userData.login) {
			if (m[km[0]] && m[km[0]].settings) {
				if (m[km[0]].settings.loginMode) {
					var model = m[km[0]];
					$scope.offlineUserName = model.profile.firstName || model.profile.login;
					$scope.offlinePin = model.settings.offlinePin;
					if ($scope.offlinePin) {
						$scope.onlyOnline = false;
						$scope.isOnline = model.settings.loginMode === 'online';
					}
					SessionStore.profile = model.profile;
					SessionStore.settings = model.settings;
					$log.debug("Offline login available");
				}
			}
		}
	}

}])
