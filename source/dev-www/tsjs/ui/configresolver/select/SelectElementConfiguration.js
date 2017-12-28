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
define(["require", "exports", "../UIElementConfiguration"], function (require, exports, UIElementConfiguration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by shahalpk on 29/12/17.
     */
    var SelectElementConfiguration = /** @class */ (function (_super) {
        __extends(SelectElementConfiguration, _super);
        function SelectElementConfiguration() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.elementType = 'select';
            return _this;
        }
        return SelectElementConfiguration;
    }(UIElementConfiguration_1.UIElementConfiguration));
    exports.SelectElementConfiguration = SelectElementConfiguration;
});
