import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class PaymentCustomerIDLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "id": "payment.customerId",
        "urnNo": "customer.urnNo"
    };

    search: Function = function(inputModel, form) {
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");
        let promise = Enrollment.search({
            'firstName': inputModel.firstName,
            'urnNo': inputModel.urnNo,
            'branchName': SessionStore.getBranch(),
        }).$promise;
        return promise;

    };
    getListDisplayItem: Function =  function(data, index) {
        return [
            [data.firstName, data.fatherFirstName].join(' | '),
            data.id,
            data.urnNo
        ];
    };

    onSelect: Function = function(valueObj, model, context){
        model.payment.accountNumber = null;
        model.payment.loanId = null;
        model.payment.beneficiaryName = null;
        model.payment.beneficiaryMobileNumber = null;
        model.payment.beneficiaryEmailI = null;
        model.payment.amount = null;
        model.payment.beneficiaryAccountNumber = null;
        model.payment.beneficiaryIfsc = null;
        model.payment.beneficiaryBankName = null;
        model.payment.beneficiaryBankBranch = null;
        model.payment.beneficiaryAccountName = null;
    };

    initialize: Function = function(model, form, parentModel, context) {
    };

    inputMap: Object = {
        "firstName": {
            "key": "customer.firstName",
            "title": "CUSTOMER_NAME"
        },
        "urnNo": {
            "key": "customer.urnNo",
            "title": "URN_NO",
            "type": "string"
        }
    };

    lovonly: boolean = true;
    autolov: boolean = false;
}


