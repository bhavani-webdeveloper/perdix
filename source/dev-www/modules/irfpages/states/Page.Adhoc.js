irf.pages.controller("PageAdhocCtrl", ["$scope", "$stateParams","PagesDefinition","SessionStore", function($scope, $stateParams,PagesDefinition,SessionStore) {
	$scope.pageNameHtml = irf.pageNameHtml($stateParams.pageName);
	$scope.error = false;
	if (!PagesDefinition.isStateAllowed(SessionStore.getPageUri() == undefined? window.location.hash.substring(2): SessionStore.getPageUri())) { 
		$scope.error = true;
		$scope.errorMessage = "Page is not allowed";
	}
}]);
irf.pages.directive("irfPageAdhoc", ["$stateParams", "$templateRequest", "$compile", function($stateParams, $templateRequest, $compile) {
	return {
		link: function (scope, element, attrs) {
			var templateUrl = scope.$templateUrl || irf.templateUrl($stateParams.pageName);
			$templateRequest(templateUrl).then(function(html) {
				element.html(html);
				$compile(element.contents())(scope);
			});
		},
		controller: ["$controller", "$scope", "$stateParams", "$log", function($controller, $scope, $stateParams, $log) {
			try {
				$scope.$parent.error = null;
				return $controller(irf.controller($stateParams.pageName), {$scope: $scope});
			} catch (e) {
				$log.error(e);
				$scope.$parent.error = $stateParams.pageName;
			}
		}]
	};
}]);