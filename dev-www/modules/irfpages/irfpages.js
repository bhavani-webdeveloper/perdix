var irf = irf || {};

irf.page = function(path) {
	return "Pages__" + path.replace(/\./g, '$');
};

var pageCollection = irf.pageCollection = angular.module("IRFPageCollection", ["ui.router", "IRFCommons"]);

var pages = irf.pages = angular.module("IRFPages", ["irf.elements", "IRFPageCollection"], function ($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|geo):/);
});

irf.pages.factory("config", function(){
	return {
		something: function(){
			return "sumthn";
		}
	};
});

irf.pages.constant('ALLOWED_STATES', ['Login']);

irf.pages.run(
["$rootScope", "$log", "$timeout", "$q", "$state", "authService", "$location", "ALLOWED_STATES",
"irfStorageService", "entityManager", "SessionStore", "irfElementsConfig", "irfOfflineFileRegistry",
"PageHelper", "$translate",
function($rootScope, $log, $timeout, $q, $state, authService, $location, ALLOWED_STATES,
	irfStorageService, entityManager, SessionStore, irfElementsConfig, irfOfflineFileRegistry,
	PageHelper, $translate){

	var setProfilePreferences = function(userData) {
		$log.info('set ProfilePreferences');
		SessionStore.setSession(userData);
		irfStorageService.storeJSON('UserData', userData);
		var m = irfStorageService.getJSON("UserProfile", userData.login);
		if (m && m.settings) {
			$log.info('set ProfilePreferences -> found saved settings');
			SessionStore.profile = m.profile;
			SessionStore.settings = m.settings;
			$log.saveLog = SessionStore.settings.consoleLog;
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
			$log.info("UserData is present in Session.")
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
		name: "Page",
		url: "/Page",
		templateUrl: "modules/irfpages/templates/Page.html",
		controller: "PageCtrl"
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
		name: "Page.EngineError",
		url: "/EngineError/:pageName",
		templateUrl: "modules/irfpages/templates/pages/Page.EngineError.html",
		controller: "PageEngineErrorCtrl"
	},{
		name: "Page.EngineOffline",
		url: "/Offline/:pageName",
		templateUrl: "modules/irfpages/templates/pages/Page.EngineOffline.html",
		controller: "PageEngineOfflineCtrl"
	}];

	angular.forEach(statesDefinition, function(value, key){
		$stateProvider.state(value);
	});
	$urlRouterProvider.otherwise("/Login");
}]);

irf.HOME_PAGE = {
	"to": "Login",
	"params": {},
	"options": {}
};
