irf.pages.controller("PageLandingCtrl",
["$log", "$scope", "SessionStore", "PagesDefinition", "irfSimpleModal", "$sce",
function($log, $scope, SessionStore, PagesDefinition, irfSimpleModal, $sce){
	$log.info("Page.Landing loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	$scope.allPages = null;
	var showFavorites = function() {
		var favoriteItems = [];
		_.forOwn($scope.allPages, function(v, k) {
			if (v.favorited) {
				favoriteItems.push(k);
			}
		});
		if (!favoriteItems.length) {
			favoriteItems.push("Page/Engine/CustomerSearch");
		}
		PagesDefinition.getUserAllowedDefinition({
			"title": "FAVORITES",
			"items": favoriteItems
		}).then(function(resp){
			$scope.dashboardDefinition = resp;
		});
	};

	$scope.allPages = SessionStore.getItem("UserFavorites_" + SessionStore.getLoginname());
	if (!$scope.allPages) {
		PagesDefinition.getUserAllowedPages().then(function(resp){
			$scope.allPages = _.cloneDeep(resp);
			SessionStore.setItem("UserFavorites_" + SessionStore.getLoginname(), $scope.allPages);
			delete $scope.allPages.$promise;
			delete $scope.allPages.$resolved;
			showFavorites();
		});
	} else {
		showFavorites();
	}

	var favoritesPopupHtml = '\
		<input id="_favoriteSearchText" ng-model="searchText" class="form-control" placeholder="Search (Type \'favorite\' to shortlist favorites)">\
		<div ng-show="searchText" style="position: absolute; top: 17px; right: 0px; margin-right: 15px;">\
			<button ng-click="searchText=\'\'" class="btn btn-box-tool btn-xs" style="padding-left:5px;padding-right:7px;outline:none" tabindex="-1"><i class="fa fa-times"></i></button>\
		</div>\
		<div ng-repeat="page in model.pages | filter:searchText">\
			<div ng-if="page.directAccess" class="checkbox form-control" ng-class="{\'bg-tint-theme\':page.favorited}">\
				<label class="checkbox-inline checkbox-theme" style="width:100%">\
					<input type="checkbox" ng-model="page.favorited" ng-true-value="\'favorite\'">\
					<span class="control-indicator"></span>\
					<span><i class="{{page.iconClass}}">&nbsp;</i>{{page.title|translate}}<span class="pull-right" ng-bind-html="model.pageNameHtml(page.stateParams.pageName.match(\'(^.+)[.]\')[1]||page.stateParams.pageName||page.state)"></span></span>\
				</label>\
			</div>\
		</div>';
	$scope.editFavorites = function() {
		var pagesArray = [];
		_.forOwn($scope.allPages, function(v, k) { pagesArray.push(v) });
		var favPickerModal = irfSimpleModal("Pick favorites", favoritesPopupHtml, {
			"pages": pagesArray,
			"pageNameHtml": function(pageName) {
				return $sce.trustAsHtml(irf.pageNameHtml(pageName));
			}
		});
		favPickerModal.closed.then(function() {
			SessionStore.setItem("UserFavorites_" + SessionStore.getLoginname(), $scope.allPages);
			showFavorites();
		});
		favPickerModal.rendered.then(function() {
			$('#_favoriteSearchText').focus();
		});
	};
}]);
irf.pageCollection.run(["irfStorageService", "$q", "PagesDefinition", "SessionStore",
function(irfStorageService, $q, PagesDefinition, SessionStore) {
	irfStorageService.onMasterUpdate(function() {
		var deferred = $q.defer();
		PagesDefinition.getUserAllowedPages().then(function(resp){
			var allPages = SessionStore.getItem("UserFavorites_" + SessionStore.getLoginname());
			var newPages = _.cloneDeep(resp);
			var favoriteItems = [];
			_.forOwn(allPages, function(v, k) {
				if (v.favorited && newPages[k]) {
					newPages[k].favorited = "favorite";
				}
			});
			SessionStore.setItem("UserFavorites_" + SessionStore.getLoginname(), newPages);
			delete newPages.$promise;
			delete newPages.$resolved;
			deferred.resolve();
		}, deferred.reject);
		return deferred.promise;
	});
}]);