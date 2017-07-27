irf.pages.controller("PageLandingCtrl",
["$log", "$scope", "SessionStore", "PagesDefinition", "irfSimpleModal", "$sce",
function($log, $scope, SessionStore, PagesDefinition, irfSimpleModal, $sce){
	$log.info("Page.Landing loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	$scope.allPages = null;
	var showFavorites = function(favoriteItems) {
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

	var favoriteItems = SessionStore.getItem("UserFavorites_" + SessionStore.getLoginname());
	if (!favoriteItems || !favoriteItems.length) {
		favoriteItems = [];
		SessionStore.setItem("UserFavorites_" + SessionStore.getLoginname(), favoriteItems);
	}
	PagesDefinition.getUserAllowedPages().then(function(resp){
		$scope.allPages = _.cloneDeep(resp);
		var allowedFavorites = [];
		for (i in favoriteItems) {
			if ($scope.allPages[favoriteItems[i]]) {
				allowedFavorites.push(favoriteItems[i]);
			}
		}
		favoriteItems = allowedFavorites;
		showFavorites(favoriteItems);
	});

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
		_.forOwn($scope.allPages, function(v, k) {
			v.favorited = false;
			pagesArray.push(v);
		});
		for (i in favoriteItems) {
			$scope.allPages[favoriteItems[i]].favorited = 'favorite';
		}
		var favPickerModal = irfSimpleModal("Pick favorites", favoritesPopupHtml, {
			"pages": pagesArray,
			"pageNameHtml": function(pageName) {
				return $sce.trustAsHtml(irf.pageNameHtml(pageName));
			}
		});
		favPickerModal.closed.then(function() {
			favoriteItems = [];
			for (i in pagesArray) {
				if (pagesArray[i].favorited) {
					favoriteItems.push(pagesArray[i].uri);
				}
			}
			SessionStore.setItem("UserFavorites_" + SessionStore.getLoginname(), favoriteItems);
			showFavorites(favoriteItems);
		});
		favPickerModal.rendered.then(function() {
			$('#_favoriteSearchText').focus();
		});
	};
}]);