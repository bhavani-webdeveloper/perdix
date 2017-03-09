irf.pages.controller("PageEngineCtrl",
["$log", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "formHelper", "$timeout",
function($log, $scope, $state, $stateParams, $injector, $q, entityManager, formHelper, $timeout) {
	var self = this;

	$scope.boxHeads = [];

	$scope.openHead = function(head, $event) {
		$event.preventDefault();
		$scope.showHeads = false;
		$(head.box).show().find('.box-header').css('cursor', 'pointer').one('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).css('cursor', 'initial').find('h3 > .goback-icon').remove();
			$timeout(showHeads);
		}).find('h3').prepend('<i class="goback-icon fa fa-arrow-left color-theme">&nbsp;</i>');
		forceShowHeads = true;
	};

	var forceShowHeads = true;
	var showHeads = function() {
		var w = window.innerWidth;
		if (w <= 768) {
			if (forceShowHeads || !$scope.showHeads) {
				$scope.boxHeads = [];

				$log.info('selecting: form[name="'+$scope.formName+'"] .box-col');
				$('form[name="'+$scope.formName+'"] .box-col').each(function(i) {
					$(this).hide().find('.box-header > h3 > .goback-icon').remove();
					$scope.boxHeads.push({
						title: $(this).find('.box > .box-header > h3').html(),
						error: $(this).find('.box').is('.box-danger'),
						box: this
					});
				});
				$scope.showHeads = true;
				forceShowHeads = false;
			}
		} else {
			if (forceShowHeads || $scope.showHeads) {
				$('form[name="'+$scope.formName+'"] .box-col').show().find('.box-header > h3 > .goback-icon').remove();
				$scope.showHeads = false;
				forceShowHeads = false;
			}
		}
	};

	var renderLayout = function() {
		$timeout(showHeads);
	};

	$scope.$on('box-init', function() {
		forceShowHeads = true;
		$timeout(showHeads);
	});

	$scope.$on('box-destroy', function() {
		forceShowHeads = true;
		$timeout(showHeads);
	});

	/* =================================================================================== */
	$log.info("Page.Engine.html loaded");
	/* =================================================================================== */

	$scope.pageName = $stateParams.pageName;
	$scope.formName = irf.form($scope.pageName);
	$scope.pageNameHtml = $stateParams.pageName.split('.').join('<br/>');
	$scope.pageId = $stateParams.pageId;
	$scope.error = false;
	try {
		$scope.page = $injector.get(irf.page($scope.pageName));
	} catch (e) {
		$log.error(e);
		$scope.error = true;
		//$state.go('Page.EngineError', {pageName:$scope.pageName});
	}

	if ($scope.page) {
		if($scope.page.type == 'schema-form') {
			$scope.model = entityManager.getModel($scope.pageName);
			if (angular.isFunction($scope.page.schema)) {
				var promise = $scope.page.schema();
				promise.then(function(data){
					$scope.schema = data;
				});
			} else {
				$scope.schema = $scope.page.schema;
			}
			// formFn support discontinued
			$scope.formHelper = formHelper;

			$scope.$on('irf-sf-init', function(event){
				$scope.formCtrl = event.targetScope[$scope.formName];
			});
			$scope.$on('sf-render-finished', function(event){
				$log.warn("on sf-render-finished on page, rendering layout");
				//setTimeout(renderLayout);
				renderLayout();
				$(window).resize(renderLayout);
			});
		} else if ($scope.page.type == 'search-list') {
			$scope.model = entityManager.getModel($scope.pageName);
			$scope.page.definition.formName = $scope.formName;
			if ($scope.page.offline === true) {
				$scope.page.definition.offline = true;
				var acts = $scope.page.definition.actions = $scope.page.definition.actions || {};
				acts.preSave = function(model, formCtrl, formName) {
					var deferred = $q.defer();
					$log.warn('on pageengine preSave');
					var offlinePromise = $scope.page.getOfflinePromise(model);
					if (offlinePromise && _.isFunction(offlinePromise.then)) {
						offlinePromise.then(function(out){
							$log.warn('offline results:');
							$log.warn(out.body.length);
							/* Build results */
							var items = $scope.page.definition.listOptions.getItems(out.body, out.headers);
							model._result = model._result || {};
							model._result.items = items;

							deferred.resolve();
						}).catch(function(){
							deferred.reject();
						});
					} else {
						deferred.reject();
					}
					return deferred.promise;
				};
			}
		}
		if ($scope.page.uri)
			$scope.breadcrumb = $scope.page.uri.split("/");
		$log.info("Current Page Loaded: " + $scope.pageName);

		if ($scope.pageId && angular.isFunction($scope.page.modelPromise)) {
			var promise = $scope.page.modelPromise($scope.pageId, $scope.model);
			if (promise && angular.isFunction(promise.then)) {
				promise.then(function(model) {
					$scope.model = model;
					$log.info(model);
				});
			} else {
				$log.error("page.modelPromise didn't return promise as promised");
			}
		}
	}
	$scope.callAction = function(actionId) {
		if (self.actionsFactory && self.actionsFactory.StageActions && 
					self.actionsFactory.StageActions[stage.stageName] && 
						self.actionsFactory.StageActions[stage.stageName][actionId]) {
			var _fn = self.actionsFactory.StageActions[stage.stageName][actionId];
			if (_fn)
				_fn($scope.modelHolder);
		}
	};

	var updateAppTitle = function(menuTitle) {
		document.title = menuTitle + " | " + document.mainTitle;
	};

	$scope.loadOfflinePage = function(event) {
		event.preventDefault();
		$state.go('Page.EngineOffline', {pageName: $scope.pageName});
		updateAppTitle("Offline | " + $scope.page.title);
	};

}]);
