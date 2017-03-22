var irfActionManager = angular.module("IRFActionManager", ["IRFCommons", "IRFEntityManager"]);

var irfActionProvider = {};

irfActionManager.config(function($provide){
	irfActionProvider = $provide;
});

irfActionManager.service("actionManager", function($log, $q, $http, $injector, irfConfig, entityManager){
	var self = this;

	self.loadCustomAction = function(processType) {
		var deferred = $q.defer();

		var actionsUrl = irfConfig.getActionsUrl(processType);

		if (actionsUrl) {
			var script = document.querySelector("script[src*='"+actionsUrl+"']");
			if (!script) {
				var oHead = document.getElementsByTagName('head')[0];
				var oScript = document.createElement('script');
				oScript.type = 'text/javascript';
				oScript.async = false;
				oScript.defer = false;
				oScript.onload = function(){
					return deferred.resolve("SUCCESS");
				};
				oHead.appendChild(oScript);
				oScript.onreadystatechange = function() {
					if (this.readyState == 'complete') {
						return deferred.resolve("SUCCESS");
					}
				};
				oScript.src = actionsUrl;
			} else {
				deferred.resolve("SUCCESS");
			}
		} else {
			deferred.reject("Custom Definition Url is null");
		}
		return deferred.promise;
	};

	self.getFactory = function(factoryName) {
		return $injector.get(factoryName);
	};

});