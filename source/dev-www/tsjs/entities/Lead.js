define(["require", "exports"], function (require, exports) {
    "use strict";
    var Lead = /** @class */ (function () {
        function Lead(myField) {
            this.singleField = myField;
        }
        Lead.prototype.validateLength = function (min, max) {
            return this.singleField + max;
        };
        return Lead;
    }());
    return Lead;
});
