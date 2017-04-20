var irf = irf || {};

irf.HOME_PAGE = {
	"url": "Page/Landing",
	"to": "Page.Landing",
	"params": {

	},
	"options": {

	}
};

irf.page = function(path) {
	return "Pages__" + path.replace(/\./g, '$');
};

irf.form = function(path) {
	return "Form__" + path.replace(/\./g, '_');
};

irf.controller = function(path) {
	return "Controller__" + path.replace(/\./g, '$');
};

irf.templateUrl = function(path) {
	return "process/pages/templates/" + path.replace(/\./g, '/') + ".html";
};

var pageCollection = irf.pageCollection = angular.module("IRFPageCollection", ["ui.router", "IRFCommons"]);

irf.pageCollection.config(["$provide", function($provide){
	irf.pageCollection.loadPage = function(name, dependencies, getFn){
		var componentArgs = _.clone(dependencies);
		componentArgs.push(getFn);
		// irf.pageCollection.factory(irf.page(pageDefObj.pageUID), componentArgs);
		$provide.factory(irf.page(name), componentArgs);
	}
}])

var pages = irf.pages = angular.module("IRFPages", ["irf.elements", "IRFPageCollection","ngAnimate", "ngSanitize","ui.bootstrap"], function ($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo):/);
});

irf.pages.provider("irfNavigator", function() {
	var callstack = [];
	var $this = this;
	$this.current = null;
	$this.$state = null;
	$this.getDefinition = null;

	$this.move = function(goParam, backParam) {
		if (!goParam) {
			return;
		}
		if (!goParam.$definition) {
			goParam.$definition = $this.getDefinition(goParam.state, goParam.pageName);
		}
		if (backParam) {
			if (!backParam.$definition) {
				backParam.$definition = $this.getDefinition(backParam.state, backParam.pageName);
			}
			callstack.push(backParam);
		} else if ($this.current) {
			callstack.push($this.current);
		}
		$this.current = goParam;
	};

	$this.factory = {
		go: function(goParam, backParam, reset) {
			if (reset) {
				callstack.length = 0;
				$this.current = null;
			}
			$this.move(goParam, backParam);
			$this.navigatorMode = "go";
			$this.$state.go(goParam.state, {
				"pageName": goParam.pageName,
				"pageId": goParam.pageId,
				"pageData": goParam.pageData
			});
		},
		isBack: function() {
			return !!callstack.length;
		},
		goBack: function() {
			if (callstack.length < 1) {
				$this.factory.goHome();
				return;
			}
			var backParam = callstack.pop();
			$this.current = backParam;
			$this.navigatorMode = "goBack";
			$this.$state.go(backParam.state, {
				"pageName": backParam.pageName,
				"pageId": backParam.pageId,
				"pageData": backParam.pageData
			});
		},
		goHome: function() {
			callstack.length = 0;
			$this.current = null;
			$this.navigatorMode = "goHome";
			irf.goHome($this.$state);
		},
		$callstack: function() {
			return callstack;
		},
		$this: $this,
		$current: function() {
			return $this.current;
		},
		$goBackTo: function(index) {
			if (index < 0 || index >= callstack.length) {
				$this.factory.goHome();
				return;
			}
			var backParam = callstack[index];
			$this.navigatorMode = "goBackTo";
			$this.$state.go(backParam.state, {
				"pageName": backParam.pageName,
				"pageId": backParam.pageId,
				"pageData": backParam.pageData
			});
		}
	};

	this.$get = ["$log", "$q", "$http", "$state", "PagesDefinition", "$rootScope",
	function($log, $q, $http, $state, PagesDefinition, $rootScope) {
		$this.$state = $state;
		$this.getDefinition = function(stateName, pageName) {
			var definition = PagesDefinition.getPageDefinition(PagesDefinition.convertToUri(stateName, pageName));
			if (!definition) {
				definition = {};
			}
			if (!definition.title) {
				if (definition.pageName) {
					definition.title = definition.pageName.replace(/^.*\./, '');
				} else if (pageName) {
					definition.title = pageName.replace(/^.*\./, '');
				} else {
					definition.title = stateName.replace(/^.*\./, '').replace(/([A-Z]|\d+)/g, " $1");
				}
			}
			if (!definition.iconClass) {
				definition.iconClass = "fa fa-file-o";
			}
			return definition;
		};

		$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams, options) {
			var uri = PagesDefinition.convertToUri(toState.name, toParams && toParams.pageName);
			// goBackTo OR browser back
			for (var i = callstack.length - 1; i >= 0; i--) {
				if (uri == PagesDefinition.convertToUri(callstack[i].state, callstack[i].pageName)) {
					$log.debug(uri+' available');
					$this.current = callstack[i];
					callstack.length = i;
					$this.navigatorMode = false;
					return;
				}
			}
			if ($this.navigatorMode && $this.navigatorMode != "goHome") {
				$this.navigatorMode = false;
			} else {
				$this.move({
					"state": toState.name,
					"pageName": toParams && toParams.pageName,
					"pageId": toParams && toParams.pageId,
					"pageData": toParams && toParams.pageData
				});
			}
		});
/*
		$rootScope.$on("$viewContentLoading", function() {
			if (!$this.current) {
				$this.current
			}
		});
*/
		return $this.factory;
	}];
});

irf.pages.constant('ALLOWED_STATES', ['Login', 'Reset']);

irf.pages.run(
["$rootScope", "$log", "$timeout", "$q", "$state", "authService", "$location", "ALLOWED_STATES",
"irfStorageService", "entityManager", "SessionStore", "irfElementsConfig", "irfOfflineFileRegistry",
"PageHelper", "$translate", "$injector", "irfLazyLoader",
function($rootScope, $log, $timeout, $q, $state, authService, $location, ALLOWED_STATES,
	irfStorageService, entityManager, SessionStore, irfElementsConfig, irfOfflineFileRegistry,
	PageHelper, $translate, $injector, irfLazyLoader){

	var setProfilePreferences = function(userData) {
		$log.info('set ProfilePreferences');
		SessionStore.setSession(userData);
		SessionStore.setCurrentBranch({
                			branchCode: SessionStore.getBranchCode(),
                			branchId : SessionStore.getBranchId(),
                			branchName: SessionStore.getBranch()
                			});
		irfStorageService.storeJSON('UserData', userData);
		var m = irfStorageService.getMasterJSON(irf.form("UserProfile"));
		var km = _.keys(m);
		if (km.length === 1 && km[0] === userData.login) {
			m = m[km[0]];
			$log.info('set ProfilePreferences -> found saved settings');
			SessionStore.profile = m.profile;
			SessionStore.settings = m.settings;
			$log.saveLog = SessionStore.settings.consoleLog;
			$log.debug(m.settings.dateFormat);
			irfElementsConfig.setDateDisplayFormat(m.settings.dateFormat);
		} else {
			$log.saveLog = false;
			SessionStore.profile = {};
			SessionStore.settings = {};
		}
		SessionStore.setLanguage(SessionStore.getLanguage());
		$translate.use(SessionStore.getLanguage());
	}

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
		$log.info('|--------Changing State START--------|');

        /* Clearing page errors */
        PageHelper.clearErrors();

        /* Gracefully clearing progress messages */
        PageHelper.gracefulClearProgress();

        /* Hiding Loader */
        PageHelper.hideLoader();

        if (toState.name === 'Page.Engine' || toState.name === 'Page.Bundle'){
        	/* Checking Existence of the page */
	        var pageAvailable = $injector.has(irf.page(toParams.pageName));
	        $log.info("Destination page (" + toParams.pageName + ") is already loaded? " + pageAvailable);

	        /* If Page is not available. Load it using the RequireJS */
	        if (false == pageAvailable){
	        	event.preventDefault();
	        	return irfLazyLoader.loadPage(toState, toParams, options);
	        }	
        }

		if (fromState.name === 'Page.Engine' && fromParams && fromParams.pageName) {
			var model = entityManager.getModel(fromParams.pageNam);
			if (model.persist) {
				$log.debug('Previous page persisted:' + fromParams.pageName);
			} else {
				entityManager.setModel(fromParams.pageName, null);
				$log.info('Previous page cleaned:' + fromParams.pageName);
			}
			irfOfflineFileRegistry.clear();
			$log.info("offline file registry cleared");
		}
		$log.info("Destination State is ::" + toState.name);
		$log.info("Destination page is ::" + ((!toParams)|| toParams.pageName));

		if (!authService.isUserDataResolved()) {
			$log.debug('> userdata not resolved');
			if (_.indexOf(ALLOWED_STATES, toState.name) == -1) {
				/* Check Auth info */
				if (SessionStore.session && SessionStore.session.offline) {
					$log.debug("> Offline page loaing");
					var userData = irfStorageService.retrieveJSON('UserData');
					authService.setUserData();
					setProfilePreferences(userData);
					//$state.go(toState, toParams);
					//return;
				} else {
					$log.debug("> Online page loaing");
					event.preventDefault();
					authService.getUser().then(function(result){ /* Success Callback */
						$log.info("User account information loaded.");

						setProfilePreferences(result);
						irfStorageService.cacheAllMaster(false);
						$state.transitionTo(toState, toParams);
						return;
					}, function(response){ /* Error callback */
						$log.info("Unable to load user information. Redirecting to Login...");
						$state.transitionTo(authService.getRedirectState());
						return;
					});
				}
			}
		} else {
			$log.info("UserData is already in Session");
			setProfilePreferences(authService.getUserData());
		}
		irfStorageService.cacheAllMaster(false);
		$log.info('|--------Changing State END--------|');
	});
	$rootScope.$on('$stateChangeSuccess', function(){
		$log.debug('$stateChangeSuccess');
		if (!irf.loggerCleanerRunning && SessionStore.settings
			&& SessionStore.settings.consoleLogAutoClear
			&& SessionStore.settings.consoleLogAutoClearDuration
			&& SessionStore.settings.consoleLogAutoClearDuration > 0) {
			irf.loggerCleanerRunning = setInterval(function(){
				var lastTimeToClean = $log.lastLogTime.subtract(SessionStore.settings.consoleLogAutoClearDuration, 'minutes');
				var cleanHead = '<span class="time">' + lastTimeToClean.format('MMM-DD:HH:mm:');
				$log.allLogs = $log.allLogs.substring($log.allLogs.lastIndexOf(cleanHead));
			}, SessionStore.settings.consoleLogAutoClearDuration * 59000);
			$log.debug('irf.loggerCleanerRunning:'+irf.loggerCleanerRunning);
		}

		PageHelper.scrollToTop();
	});
}]);

irf.loggerCleanerRunning = false;

irf.pages.config([
	"$stateProvider", "$urlRouterProvider",
	function($stateProvider, $urlRouterProvider) {
	var statesDefinition = [{
		name: "Login",
		url: "/Login",
		templateUrl: "modules/irfpages/templates/Login.html",
		controller: 'LoginCtrl',
		controllerAs: 'c'
	},{
		name: "Reset",
		url: "/Reset",
		templateUrl: "modules/irfpages/templates/Reset.html",
		controller: 'ResetCtrl',
		controllerAs: 'c'
	},{
		name: "Page",
		url: "/Page",
		templateUrl: "modules/irfpages/templates/Page.html",
		controller: "PageCtrl",
		params: {
			options: {
				skipPageAccessCheck: false,
				skipPageLazyLoad: false
			}
		}
	},{
		name: "Page.Engine",
		url: "/Engine/:pageName/:pageId",
		params: {
			pageName: {value: null},
			pageId: {value: null, squash: true},
			pageData: null
		},
		templateUrl: "modules/irfpages/templates/pages/Page.Engine.html",
		controller: "PageEngineCtrl"
	},{
		name: "Page.Bundle",
		url: "/Bundle/:pageName/:pageId",
		params: {
			pageName: {value: null},
			pageId: {value: null, squash: true},
			pageData: null
		},
		templateUrl: "modules/irfpages/templates/pages/Page.Bundle.html",
		controller: "PageBundleCtrl"
	},{
		name: "Page.Adhoc",
		url: "/Adhoc/:pageName/:pageId",
		params: {
			pageName: {value: null},
			pageId: {value: null, squash: true},
			pageData: null
		},
		templateUrl: "modules/irfpages/templates/pages/Page.Adhoc.html",
		controller: "PageAdhocCtrl"
	},{
		name: "Page.EngineError",
		url: "/EngineError/:pageName",
		templateUrl: "modules/irfpages/templates/pages/Page.EngineError.html",
		controller: "PageEngineErrorCtrl"
	},{
		name: "Page.EngineOffline",
		url: "/Offline/:pageName",
		templateUrl: "modules/irfpages/templates/pages/Page.EngineOffline.html",
		controller: "PageEngineOfflineCtrl"
	},{
		name: "Page.BundleOffline",
		url: "/BundleOffline/:pageName",
		templateUrl: "modules/irfpages/templates/pages/Page.BundleOffline.html",
		controller: "PageBundleOfflineCtrl"
	},{
		name: "Page.Timeline",
		url: "/Timeline/:pageName/:pageId",
		params: {
			pageId: {value: null, squash: true}
		},
		templateUrl: "modules/irfpages/templates/pages/Page.Timeline.html",
		controller: "PageTimelineCtrl"
	}];

	angular.forEach(statesDefinition, function(value, key){
		$stateProvider.state(value);
	});

	$urlRouterProvider.otherwise(function($injector) {
		$injector.get('$state').go(irf.HOME_PAGE.to, irf.HOME_PAGE.params);
	});
}]);
