irf.pages.controller('LoginCtrl',
['$scope', 'authService', '$log', '$state', '$stateParams', 'irfStorageService', 'SessionStore', 'Utils', 'irfNavigator',
function($scope, authService, $log, $state, $stateParams, irfStorageService, SessionStore, Utils, irfNavigator){

	var failedLogin = function(arg) {
		$log.error(arg);
		if (arg.data && arg.data.error_description) {
			$scope.errorMessage = arg.data.error_description;
		} else if (!$scope.serverConnectionError) {
			$scope.errorMessage = arg.statusText || (arg.status + " Unknown Error");
		}
		if ($scope.errorMessage.trim() === 'User credentials have expired') {
			$state.go("Reset", {"type": "reset"});
		}
		$scope.showLoading = false;
		$scope.hideLogin = false;
		$scope.serverConnectionError = false;
	};

	var successLogin = function(refresh) {
		$scope.showLoading = true;
		if (Utils.isCordova) {
			window.MacAddress.getMacAddress(
				function(macAddress) {
					macaddress=macAddress;
					//console.log("mac address :"+macAddress);
					window.plugins.imeiplugin.getImei(function (imei) {
					//	console.log("IMEI :" + imei);
						imeinumber=imei;
						authService.login(username,password,macaddress,imeinumber).then(function() { successLogin(refresh) }, failedLogin);
					},function(error){
						console.log("imie error");
					});
					},function(fail) {alert(fail);
					}
				);
			}
		authService.postLogin(refresh).then(function() {
			irfNavigator.goHome();
			if (refresh) {
				window.location.hash = '#/' + irf.HOME_PAGE.url;
				window.location.reload();
			}
			$scope.serverConnectionError = false;
		}, failedLogin);
	};

	var doLogin = function(username, password, refresh) {
		$scope.showLoading = 'cc';
		$log.info("doLogin()")
		var macaddress=null;
		var imeinumber=null;
		if (Utils.isCordova) {
			window.MacAddress.getMacAddress(
				function(macAddress) {
					//console.log("mac address : "+macAddress);
					macaddress=macAddress;
					window.plugins.imeiplugin.getImei(function (imei) {
						//console.log("IMEI :" + imei);
						imeinumber=imei;
						authService.login(username,password,macaddress,imeinumber).then(function() { successLogin(refresh) }, failedLogin);
					},function(error){
						console.log("imie error");
					});
					
				},function(fail) {alert(fail);
					}
				);
		}
		else{
			authService.login(username,password).then(function() { successLogin(refresh) }, failedLogin);
		}
		
	};

	$scope.$on('server-connection-error', function(event, arg) {
		$scope.serverConnectionError = true;
		if(!SessionStore.session.offline){
			if (arg === 408) {
				$scope.errorMessage = 'Connection timed out';
			} else {
				$scope.errorMessage = 'Server Unreachable';
			}
		}
		
	});

	var self = this;

	self.reset = function() {
		if (!$scope.autoLogin)
			self.username = null;
		self.password = null;
		self.pin = null;
	}

	self.onlineLogin = function(username, password, autoLogin){
		$log.info("Inside onlineLogin");
		if (!username || !(password || autoLogin)) {
			$scope.errorMessage = 'LOGIN_USERNAME_PASSWORD_REQ';
			return false;
		}
		$scope.errorMessage = null;
		if (userData && userData.login && username.toLowerCase() !== userData.login.toLowerCase()) {
			if (autoLogin) {
				$log.info('auto login - clearing all offline records');
				irfStorageService.clear().finally(function() {
					successLogin(true);
				});
			} else {
				Utils.confirm('User is different. This will clear all data saved by previous user ('+
					userData.login+'). Do you want to proceed?', 'User Data Clear Alert').then(function() {
					$log.info('clearing all offline records');
					irfStorageService.clear().finally(function() {
						doLogin(username, password, true);
					});
				});
			}
		} else {
			var appLoaded = SessionStore.getItem('appLoaded');
			SessionStore.setItem('appLoaded', {'loaded':true});
			if (autoLogin) {
				successLogin(!appLoaded);
			} else {
				doLogin(username, password, !appLoaded);
			}
		}
	};

	self.offlineLogin = function(pin){
		$log.info("Inside offlineLogin");
		if (!pin) {
			$scope.errorMessage = 'LOGIN_PIN_REQ';
			return false;
		}
		$scope.errorMessage = null;
		if (pin === $scope.offlinePin) {
			authService.setUserData(userData);
			SessionStore.session.offline = true;
			themeswitch.changeTheme('offline');
			$log.info("Offline login success");
			irfNavigator.goHome();
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
					$log.info("Offline login available");
				}
			}
		}
		self.username = userData.login;
	}

	// Auto Login
	if ($stateParams.username && $stateParams.authToken) {
		authService.autoLogin($stateParams.username, $stateParams.authToken).then(function() {
			$state.go("Login", {"username": null, "authToken": null, "autoLoginUsername": $stateParams.username});
		}, function() {
			failedLogin({"statusText": "Auto login failed"});
		});
	}
	if ($stateParams.autoLoginUsername) {
		self.username = $stateParams.autoLoginUsername;
		$scope.autoLogin = true;
		$scope.hideLogin = true;
		$scope.showLoading = true;
		self.onlineLogin(self.username, null, true);
	}

}])
