irf.pages.controller("PageEngineCtrl",
["$log", "$scope", "$state", "$stateParams", "$injector", "$q", "entityManager", "formHelper", "$timeout",
function($log, $scope, $state, $stateParams, $injector, $q, entityManager, formHelper, $timeout) {
	var self = this;

	var allCards = true;
	var showAllCards = function() {
		var h = window.innerHeight;
		$('.content-wrapper').css({'height':h+'px', 'overflow':'auto'});

		/*** close any opened cards ***/
		var opened = $('.page-row>.page-form .box-col.opened');
		// opened.css('top', opened.attr('boxtop'));
		// opened.css({'position':'absolute', 'top':opened.attr('boxtop')});
		opened.find('.box-body').collapse("hide");
		opened.find('.box-header').css('height', '60px');
		opened.addClass('closed').removeClass('opened');

		/*** arrange closed cards ***/
		var closed = $('.page-row>.page-form .box-col.closed');
		var closedTop = 0;
		closed.each(function(){
			var t = $(this);
			t.css({'position': 'absolute', 'top': closedTop + 'px', 'z-index':''});
			closedTop += 60;
			t.removeClass('minimized');
		});
		// closed.show();
		var bcs = $('#bottom-card-selector');
		bcs.find('span.title').html('');
		bcs.hide();

		closedTop += 20;
		var actioncols = $('.page-row>.page-form .action-box-col');
		actioncols.each(function(){
			$(this).css({'position':'absolute', 'top': closedTop + 'px', 'margin-bottom':'30px'});
			closedTop += 60;
		});
		// $('.page-row>.page-form .action-box-col').css({'position': 'absolute', 'top': (closedTop+20) + 'px'});
		allCards = closed.length * 60 + actioncols.length * 80 + 50;
	};

	var openOneCard = function(box) {
		$('.content-wrapper').css({'height':'', 'overflow':''});

		box.css({'position':'static', 'top':'0'});
		box.find('.box-header').css('height', 'auto');
		box.find('.box-body').collapse("show");
		box.addClass('opened').removeClass('closed');
		var closed = $('.page-row>.page-form .box-col.closed');
		var closedTitles = [];
		if (closed.length) {
			var bottom = -33, cl = closed.length;
			var bottomdy = 10/(cl-1?cl-1:cl);
			closed.each(function(){
				var t = $(this);
				t.css({'position': 'fixed', 'top':'', 'bottom':bottom+'px', 'z-index':'50'});
				t.addClass('minimized');
				// closedTitles.push(t.find('h3.box-title').text());
				bottom -= bottomdy;
			});
			closedTitles = closedTitles.join(', ');
			var bcs = $('#bottom-card-selector');
			bcs.find('span.title').html(closedTitles);
			bcs.show();
		}
		// closed.hide();

		$('.page-row>.page-form .action-box-col').css('position', 'static');
		allCards = false;
	};

	var showBoxLayout = function() {
		var boxcols = $('.page-row>.page-form .box-col');
		console.log('>> on showBoxLayout:' + boxcols.length);
		if (!boxcols || boxcols.length < 2) {
			console.log('>> returning');
			allCards = false;
			return false;
		}
		var actionboxcols = $('.page-row>.page-form .action-box-col');
		// boxcols.find('.btn-box-tool').attr('data-widget', '').hide();
		boxcols.addClass('closed');
		boxcols.find('.box-body').collapse("hide");
		boxcols.find('.box-header').css('height', '60px').removeAttr('data-toggle');
		/*var top = 0;
		boxcols.each(function(item){
			$(this).css({'position':'absolute', 'top': top + 'px'});
			// $(this).attr('boxtop', top + 'px');
			top += 60;
		});
		top += 20;
		actionboxcols.each(function(item){
			$(this).css({'position':'absolute', 'top': top + 'px', 'margin-bottom':'30px'});
			top += 60;
		});*/

		showAllCards();

		$('section.content').css('min-height', (top+20)+'px');

		if (!$('#bottom-card-selector').length) {
			$('<div id="bottom-card-selector"><span class="title"></span></div>').appendTo('.page-row>.page-form');
		}

		boxcols.find('.box-header').off('click').on('click', function(event){
			event.preventDefault();
			event.stopPropagation();
			var tt = $(this);
			var pp = tt.parent().parent();
			if (pp.is('.closed:not(.minimized)')) {
				openOneCard(pp);
			} else if (pp.is('.opened')) {
				showAllCards();
			}
		});
		$('#bottom-card-selector').off('click').on('click', showAllCards);
		return true;
	};

	var removeBoxLayout = function() {
		console.log('on removeBoxLayout');
		var boxcols = $('.page-row>.page-form .box-col');
		var actionboxcols = $('.page-row>.page-form .action-box-col');
		boxcols.removeClass('opened closed minimized').css({'position':'static', 'top':'', 'bottom':'', 'z-index':''});
		boxcols.find('.box-body:not(.in)').collapse("show");
		boxcols.find('.box-header').attr('data-toggle', 'collapse').css('height', 'auto').off('click');
		boxcols.show();

		actionboxcols.css({'position':'static', 'top':'0', 'margin-bottom':'0'});

		$('#bottom-card-selector').remove();
		$('section.content').css('min-height', '250px');

		$timeout(function(){$scope.collapsedView = false;});
	};

	var isBoxLayout = false;
	var isBoxLayoutShown = false;
	var renderBoxLayout = function() {
		var w = window.innerWidth;
		if (w <= 768) {
			if (allCards) {
				var h = window.innerHeight;
				$('.content-wrapper').css({'height':h+'px', 'overflow':'auto'});
			}
			if (!isBoxLayout) {
				isBoxLayoutShown = showBoxLayout();
				if (!isBoxLayoutShown) {
					allCards = false;
					$('.content-wrapper').css({'height':'', 'overflow':''});
				}
				isBoxLayout = true;
			}
		} else {
			$('.content-wrapper').css({'height':'', 'overflow':''});
			if (isBoxLayout) {
				removeBoxLayout();
				isBoxLayout = false;
			}
		}
		$timeout(function(){$scope.showCollapsedViewButton = !isBoxLayout;});
	};

	$scope.showCollapsedViewButton = true;
	$scope.collapsedView = false;

	var renderLayout = function() {
		renderBoxLayout();
		$(window).resize(renderBoxLayout);
		var rerender = function(){
			/*if (isBoxLayout && isBoxLayoutShown) {
				showAllCards();
			}*/
			removeBoxLayout();
			isBoxLayout = false;
			renderBoxLayout();
		};
		$scope.$on('box-init', rerender);
		$scope.$on('box-destroy', function(){
			setTimeout(function() {
				rerender();
			});
		});
	};

	$scope.$watch('collapsedView', function(n, o){
		if (n) {
			$('.page-row>.page-form .box-col').find('.box-body').collapse("hide");
		} else {
			$('.page-row>.page-form .box-col .box-body').collapse("show");
		}
	});

	$scope.expandCollapseView = function() {
		if (!$scope.showCollapsedViewButton)
			return;
		$scope.collapsedView = !$scope.collapsedView;
	};

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
					$scope.page.schema = data;

					if (angular.isFunction($scope.page.form)) {
						var promise = $scope.page.form();
						promise.then(function(data){
							$scope.page.form = data;
							$timeout(function() {
								$scope.page.initialize($scope.model, $scope.page.form, $scope.formCtrl);
							});
						});
					}
				});
			}
			$scope.formHelper = formHelper;

			$scope.$on('irf-sf-init', function(event){
				$scope.formCtrl = event.targetScope[$scope.formName];
			});
			$scope.$on('sf-render-finished', function(event){
				$log.warn("on sf-render-finished on page, rendering layout");
				setTimeout(renderLayout);
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
