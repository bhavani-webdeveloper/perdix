/// <amd-module name="perdix/infra/api/AngularResourceService"/>
define("perdix/infra/api/AngularResourceService", ["require", "exports"], function (require, exports) {
    "use strict";
    var AngularResourceService = /** @class */ (function () {
        function AngularResourceService() {
            this.$injector = null;
            if (AngularResourceService._instance) {
                throw new Error("Error: Instantiation failed: Use AngularResourceService.getInstance() instead of new.");
            }
            AngularResourceService._instance = this;
        }
        AngularResourceService.getInstance = function () {
            return AngularResourceService._instance;
        };
        AngularResourceService.prototype.setInjector = function (service) {
            console.log("INJECTOR set for TS modules");
            this.$injector = service;
        };
        AngularResourceService.prototype.getNGService = function (serviceName) {
            var injector = this.$injector;
            if (injector == null) {
                var elem = angular.element(document.querySelector('[ng-controller]'));
                injector = elem.injector();
            }
            return injector.get(serviceName);
        };
        AngularResourceService._instance = new AngularResourceService();
        return AngularResourceService;
    }());
    console.log("Loaded ARS");
    return AngularResourceService;
});
