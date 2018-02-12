irf.pages.controller('ResetCtrl',
['$scope', '$log', '$state', 'irfStorageService', 'SessionStore', '$q', '$stateParams', 'Account', 'irfProgressMessage',
function($scope, $log, $state, irfStorageService, SessionStore, $q, $stateParams, Account, irfProgressMessage) {
	var self = this;
	$scope.type = $stateParams.type;
	self.resetPassword = function() {
		$scope.errorMessage = null;
		$scope.showLoading = 'cc';
		if (self.username && self.oldPassword && self.newPassword && self.newPassword2) {
			if (self.newPassword === self.newPassword2) {
				Account.changeExpiredPassword({
					"username": self.username,
					"oldPassword": self.oldPassword,
					"newPassword": self.newPassword,
					"$no_token": true
				}).$promise.then(function(){
					irfProgressMessage.pop('reset-login', 'Password successfully reset', 5000);
					$state.go('Login');
				}, function(err) {
					$log.error(err);
					if (err.data && err.data.error) {
						$scope.errorMessage = err.data.error;
					} else if (err.data && _.isObject(err.data.errors)) {
						var errors = [];
						_.forOwn(err.data.errors, function (keyErrors, key) {
							var keyErrorsLength = keyErrors.length;
							for (var i = 0; i < keyErrorsLength; i++) {
								var error = "<strong>" + key + "</strong>: " + keyErrors[i];
								errors.push(error);
							}
						});
						$scope.errorMessage = errors.join('<br/>');
					} else {
						$scope.errorMessage = err.statusText || (err.status + " Unknown Error");
					}
				}).finally(function() {
					$scope.showLoading = false;
				});
			} else {
				$scope.errorMessage = "New & re-enter passwords do not match";
				$scope.showLoading = false;
			}
		} else {
			$scope.errorMessage = "All fields are mandatory";
			$scope.showLoading = false;
		}
		return false;
	};
}])
