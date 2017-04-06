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

irf.pages.factory("irfNavigator", ["$log", "$q", "$http", "$state", function($log, $q, $http, $state) {
	var callstack = [];
	return {
		go: function(goParam, backParam) {
			callstack.push(backParam);
			$state.go(goParam.state, {
				pageName: goParam.pageName,
				pageId: goParam.pageId,
				pageData: goParam.pageData
			});
		},
		isBack: function() {
			return !!callstack.length;
		},
		goBack: function() {
			if (!callstack.length) {
				// Failsafe case, if callstack is empty by some rare case
				$state.go(irf.HOME_PAGE.to, irf.HOME_PAGE.params, irf.HOME_PAGE.options);
				return;
			}
			var goParam = callstack.pop();
			$state.go(goParam.state, {
				pageName: goParam.pageName,
				pageId: goParam.pageId,
				pageData: goParam.pageData
			});
		},
		$callstack: function() {
			return callstack;
		},
		$goTo: function(index) {
			if (index < 0 || index >= callstack.length)
				return;
			var goParam = callstack[index];
			$state.go(goParam.state, {
				pageName: goParam.pageName,
				pageId: goParam.pageId,
				pageData: goParam.pageData
			});
			callstack.length = index;
		}
	};
}]);

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
