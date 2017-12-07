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
define(["require", "exports", "./LOVElementConfiguration", "../../../domain/shared/RepositoryFactory", "../../../domain/shared/RepositoryIdentifiers"], function (require, exports, LOVElementConfiguration_1, RepositoryFactory, RepositoryIdentifiers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoanPurpose2LOVConfiguration = /** @class */ (function (_super) {
        __extends(LoanPurpose2LOVConfiguration, _super);
        function LoanPurpose2LOVConfiguration() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.outputMap = {
                "purpose2": "loanAccount.loanPurpose2"
            };
            _this.search = function (inputModel, form, model, context) {
                var queryRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers_1.RepositoryIdentifiers.Queries);
                return queryRepo.getAllLoanPurpose2(model.loanAccount.loanPurpose1).toPromise();
            };
            _this.getListDisplayItem = function (item, index) {
                return [
                    item.purpose2
                ];
            };
            _this.onSelect = function (valueObj, model, context) {
            };
            _this.lovonly = true;
            _this.autolov = true;
            return _this;
        }
        return LoanPurpose2LOVConfiguration;
    }(LOVElementConfiguration_1.LOVElementConfiguration));
    exports.LoanPurpose2LOVConfiguration = LoanPurpose2LOVConfiguration;
});
