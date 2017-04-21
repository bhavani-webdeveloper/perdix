irf.pages.controller("PageAdhocCtrl", ["$scope", "$stateParams", function($scope, $stateParams) {
	$scope.pageNameHtml = $stateParams.pageName.split('.').join('<br/>');
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
		controller: ["$controller", "$scope", "$stateParams", function($controller, $scope, $stateParams) {
			try {
				$scope.$parent.error = null;
				return $controller(irf.controller($stateParams.pageName), {$scope: $scope});
			} catch (e) {
				$scope.$parent.error = $stateParams.pageName;
			}
		}]
	};
}]);