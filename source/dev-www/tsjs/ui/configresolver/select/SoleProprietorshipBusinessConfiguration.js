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
define(["require", "exports", "./SelectElementConfiguration", "../../../domain/model/customer/EnrolmentProcess", "perdix/infra/api/AngularResourceService"], function (require, exports, SelectElementConfiguration_1, EnrolmentProcess_1, AngularResourceService) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SoleProprietorshipBusinessConfiguration = /** @class */ (function (_super) {
        __extends(SoleProprietorshipBusinessConfiguration, _super);
        function SoleProprietorshipBusinessConfiguration() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onChange = function (value, form, model) {
                var PageHelper = AngularResourceService.getInstance().getNGService("PageHelper");
                var Queries = AngularResourceService.getInstance().getNGService("Queries");
                if (!_.isNumber(model.loanProcess.applicantEnrolmentProcess.customer.id)) {
                    PageHelper.showProgress("change-enterprise-type", "Applicant enrolment should be completed!", 5000);
                    model.customer.enterprise.enterpriseType = null;
                    return;
                }
                if (value == 'Sole Proprietorship' && !_.isNumber(model.customer.id)) {
                    PageHelper.showLoader("Loading...");
                    Queries.getEnterpriseCustomerId(model.loanProcess.applicantEnrolmentProcess.customer.id)
                        .then(function (response) {
                        if (!response || !response.customer_id) {
                            return false;
                        }
                        if (response.customer_id == model.customer.id) {
                            return false;
                        }
                        return EnrolmentProcess_1.EnrolmentProcess.fromCustomerID(response.customer_id).toPromise();
                    })
                        .then(function (enrolmentProcess) {
                        if (!enrolmentProcess) {
                            var applicantCustomer = model.loanProcess.applicantEnrolmentProcess.customer;
                            /* IF no enrolment present, reset to applicant */
                            model.customer.firstName = applicantCustomer.firstName;
                            model.customer.villageName = applicantCustomer.villageName;
                            model.customer.pincode = applicantCustomer.pincode;
                            model.customer.area = applicantCustomer.area;
                            model.customer.locality = applicantCustomer.locality;
                            model.customer.villageName = applicantCustomer.villageName;
                            model.customer.district = applicantCustomer.district;
                            model.customer.state = applicantCustomer.state;
                            return;
                        }
                        if (model.customer.id) {
                            model.loanProcess.removeRelatedEnrolmentProcess(model.customer.id, 'Customer');
                        }
                        model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
                        /* Setting for the current page */
                        model.enrolmentProcess = enrolmentProcess;
                        model.customer = enrolmentProcess.customer;
                        /* Setting enterprise customer relation on the enterprise customer */
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    })
                        .finally(function () {
                        PageHelper.hideLoader();
                    });
                }
            };
            return _this;
        }
        return SoleProprietorshipBusinessConfiguration;
    }(SelectElementConfiguration_1.SelectElementConfiguration));
    exports.SoleProprietorshipBusinessConfiguration = SoleProprietorshipBusinessConfiguration;
});
