irf.pages.controller('LoginCtrl',
['$scope', 'authService', '$log', '$state', 'irfStorageService', 'SessionStore', 'Utils', '$q', 'SysQueries', 'irfNavigator',
function($scope, authService, $log, $state, irfStorageService, SessionStore, Utils, $q, SysQueries, irfNavigator){

	var loadUserBranches = function(username){
		var deferred = $q.defer();
		SysQueries.getUserBranches(username)
			.then(function(response){
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
				SessionStore.setItem('AllAllowedBranches', out);
				deferred.resolve();
			}, function(httpResponse){
				$log.error("Error trying to load allowed branches of user.")
				deferred.resolve();
			})
		return deferred.promise;
	}

	var onlineLogin = function(username, password, refresh) {
		authService.loginAndGetUser(username,password).then(function(arg){ // Success callback
			$scope.showLoading = true;

			var p = [
				irfStorageService.cacheAllMaster(true, refresh),
				loadUserBranches(username)
			]
			$q.all(p).then(function(msg){
				$log.info(msg);
                SessionStore.session.offline = false;
                themeswitch.changeTheme(themeswitch.getThemeColor(), true);
				irfNavigator.goHome();
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
			$scope.serverConnectionError = false;
		}, function(arg){ // Error callback
			$scope.showLoading = false;
			$log.error(arg);
			if (arg.data && arg.data.error_description) {
				$scope.errorMessage = arg.data.error_description;
			} else if (!$scope.serverConnectionError) {
				$scope.errorMessage = arg.statusText || (arg.status + " Unknown Error");
			}
			if ($scope.errorMessage.trim() === 'User credentials have expired') {
				$state.go("Reset", {"type": "reset"});
			}
			$scope.serverConnectionError = false;
		});
	};

	$scope.$on('server-connection-error', function(event, arg) {
		$scope.serverConnectionError = true;
		if (arg === 408) {
			$scope.errorMessage = 'Connection timed out';
		} else {
			$scope.errorMessage = 'Server Unreachable';
		}
	});

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
			var AppLoaded = SessionStore.getItem('AppLoaded');
			SessionStore.setItem('AppLoaded', {'loaded':true});
			$scope.showLoading = 'cc';
			onlineLogin(username, password, !AppLoaded);
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
					$log.debug("Offline login available");
				}
			}
		}
	}

}])
