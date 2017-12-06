var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../UIElementConfiguration", "../../../domain/shared/Utils"], function (require, exports, UIElementConfiguration_1, Utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LOVElementConfiguration = /** @class */ (function (_super) {
        __extends(LOVElementConfiguration, _super);
        function LOVElementConfiguration() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.elementType = 'lov';
            _this.searchHelper = Utils.getFormHelper();
            return _this;
        }
        return LOVElementConfiguration;
    }(UIElementConfiguration_1.UIElementConfiguration));
    exports.LOVElementConfiguration = LOVElementConfiguration;
});
