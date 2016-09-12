irf.pages.controller("CustomerHistoryCtrl",
["$log", "$scope", "$stateParams", "$q", "formHelper", "SessionStore", "Enrollment", 
"entityManager", "Utils",
function($log, $scope, $stateParams, $q, formHelper, SessionStore, Enrollment, 
	entityManager, Utils){
	$log.info("Page.Landing.html loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.userid = SessionStore.getLoginname();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	$scope.formHelper = formHelper;

	var initialize = function(customerHistory) {
		$log.info(customerHistory);
		$scope.model = customerHistory;
		// $scope.model.customer.fullName = Utils.getFullName($scope.model.customer.firstName, $scope.model.customer.middleName, $scope.model.customer.lastName);
		// $scope.title = ($scope.model.customer.urnNo ? ($scope.model.customer.urnNo + ": ") : "") + $scope.model.customer.fullName;

		$scope._versions = [];
		$scope._history = {};
		for (var i = $scope.model.customerSnapshot.length - 1; i >= 0; i--) {
			var snapshot = $scope.model.customerSnapshot[i];
			var key = snapshot.version + ' - ' + snapshot.userId;
			$scope._history[key] = snapshot;
			$scope._versions.push(key);
		};
	};

	Enrollment.getWithHistory({id:$scope.customerId}).$promise.then(function(response){
		initialize(response);
	}, function(errorResponse){

	});

}]);