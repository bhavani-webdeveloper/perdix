define(["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NGHelper = /** @class */ (function () {
        function NGHelper() {
        }
        NGHelper.refreshUI = function () {
            /* Calls $apply() method on the rootScope */
            var elem = angular.element(document.querySelector('[ng-controller]'));
            _.defer(function () {
                elem.scope().$root.$apply();
            });
        };
        return NGHelper;
    }());
    exports.NGHelper = NGHelper;
});
