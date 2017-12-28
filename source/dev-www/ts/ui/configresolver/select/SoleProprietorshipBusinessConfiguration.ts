import {SelectElementConfiguration} from "./SelectElementConfiguration";
import {EnrolmentProcess} from "../../../domain/model/customer/EnrolmentProcess";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {Customer} from "../../../domain/model/customer/Customer";

export class SoleProprietorshipBusinessConfiguration extends SelectElementConfiguration {

    onChange:Function = function(value, form, model) {
        let PageHelper = AngularResourceService.getInstance().getNGService("PageHelper");
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        if (!_.isNumber(model.loanProcess.applicantEnrolmentProcess.customer.id)){
            PageHelper.showProgress("change-enterprise-type", "Applicant enrolment should be completed!", 5000);
            model.customer.enterprise.enterpriseType = null;
            return;
        }
        if (value == 'Sole Proprietorship') {


            PageHelper.showLoader("Loading...");
            Queries.getEnterpriseCustomerId(model.loanProcess.applicantEnrolmentProcess.customer.id)
                .then(function (response) {
                    if (!response || !response.customer_id) {
                        return false;
                    }

                    if (response.customer_id == model.customer.id) {
                        return false;
                    }

                    return EnrolmentProcess.fromCustomerID(response.customer_id).toPromise();
                })
                .then(function (enrolmentProcess) {
                    if (!enrolmentProcess) {
                        let applicantCustomer:Customer = model.loanProcess.applicantEnrolmentProcess.customer;
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
                })
        }
    }

}
