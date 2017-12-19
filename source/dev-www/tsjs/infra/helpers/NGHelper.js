/**
 * Created by shahalpk on 20/12/17.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NGHelper = /** @class */ (function () {
        function NGHelper() {
        }
        NGHelper.refreshUI = function () {
            /* Calls $apply() method on the rootScope */
            var elem = angular.element(document.querySelector('[ng-controller]'));
            elem.scope().$root.$apply();
        };
        return NGHelper;
    }());
    exports.NGHelper = NGHelper;
});
