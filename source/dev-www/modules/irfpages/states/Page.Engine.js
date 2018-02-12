irf.pages.controller("PageEngineCtrl",
["$log", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "formHelper", "$timeout", "PageHelper", "elementsUtils",
function($log, $scope, $state, $stateParams, $injector, $q, entityManager, formHelper, $timeout, PageHelper, elementsUtils) {
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
			if ($scope.showHeads) {
				$('form[name="'+$scope.formName+'"] .box-col').show().find('.box-header > h3 > .goback-icon').remove();
				$scope.showHeads = false;
			}
		}
	};

	var renderLayout = function() {
		$timeout(showHeads);
	};

	var initializeCardLayout = function() {
		renderLayout();
		$(window).resize(renderLayout);

		$scope.$on('box-init', function() {
			if ($scope.showHeads) {
				forceShowHeads = true;
				$timeout(showHeads);
			}
		});

		$scope.$on('box-destroy', function() {
			if ($scope.showHeads) {
				forceShowHeads = true;
				$timeout(showHeads);
			}
		});

	};

	/* =================================================================================== */
	$log.info("Page.Engine.html loaded");
	/* =================================================================================== */

	function setupPage () {
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
					//initializeCardLayout(); // Feature disabled
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
	}

	$scope.pageName = $stateParams.pageName;
	$scope.formName = irf.form($scope.pageName);
	$scope.pageNameHtml = irf.pageNameHtml($stateParams.pageName);
	$scope.pageId = $stateParams.pageId;
	$scope.error = false;
	try {
		$scope.page = $injector.get(irf.page($scope.pageName));
		setupPage();
	} catch (e) {
		if (e.message.startsWith("[$injector:unpr] Unknown provider: "+irf.page($scope.pageName)+"Provider")) {
			$log.error("Loading Dynamic page...");
		} else {
			$log.error(e);
		}
		try {
			var pageDefPath = "pages/" + $scope.pageName.replace(/\./g, "/");
			PageHelper.showLoader();
			require([pageDefPath], function(pageDefObj){
        		/* Page is loaded, now bind it to pages */
        		$log.info("[REQUIRE] Done loading page(" + $scope.pageName + ")");
        		irf.pageCollection.loadPage(pageDefObj.pageUID, pageDefObj.dependencies, pageDefObj.$pageFn);

				try {
					$scope.page = $injector.get(irf.page($scope.pageName));
					setupPage();
					PageHelper.hideLoader();
				} catch (e) {
					$log.error(e);
					$scope.error = true;
				}
			}, function(err){
        		$log.info("[REQUIRE] Error loading page(" + $scope.pageName + ")");
        		$log.error(err);
        	})
		} catch(e) {
			$log.error(e);
			$scope.error = true;
		}
		//$state.go('Page.EngineError', {pageName:$scope.pageName});
	}

	$scope.initialize = function(model, form, formCtrl) {
		if (model.$$STORAGE_KEY$$) {
			if (angular.isFunction($scope.page.offlineInitialize)) {
				$scope.page.offlineInitialize(model, form, formCtrl);
			}
		} else {
			$scope.page.initialize(model, form, formCtrl);
		}
	};

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

	$scope.saveOffline = function() {
		var deferred = $q.defer();
		$scope.model = $scope.model || {};
		$scope.model.$$STORAGE_KEY$$ = $scope.pageId || elementsUtils.generateUUID();
		formHelper.newOffline.saveOffline($scope.pageName, {
			pageName: $scope.pageName,
			pageId: $scope.pageId,
			// pageData: $stateParams.pageData, // data may have infinite loop to fail stream, do we really need this?
			model: $scope.model,
			$$STORAGE_KEY$$: $scope.model.$$STORAGE_KEY$$
		});
		deferred.resolve();
		return deferred.promise;
	};

}]);
