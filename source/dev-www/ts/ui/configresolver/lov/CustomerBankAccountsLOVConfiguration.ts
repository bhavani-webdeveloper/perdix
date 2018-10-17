import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class CustomerBankAccountsLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "first_name": "payment.beneficiaryName",
        "customer_name_as_in_bank": "payment.beneficiaryAccountName",
        "email": "payment.beneficiaryEmailId",
        "mobile_phone": "payment.beneficiaryMobileNumber",
        "account_number": "payment.beneficiaryAccountNumber",
        "ifsc_code": "payment.beneficiaryIfsc",
        "customer_bank_name": "payment.beneficiaryBankName",
        "customer_bank_branch_name": "payment.beneficiaryBankBranch",
        "customer_id": "payment.customerId"
    };

    search: Function = function(inputModel, form) {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        return Queries.getCustomersBankAccounts({customer_urns:inputModel.urn});
    };

    getListDisplayItem: Function =  function(data, index) {
        return [
            'Account Number : ' + data.account_number,
            'Branch : ' + data.customer_bank_branch_name,
            'Bank : ' + data.customer_bank_name,
            'IFSC Code : ' + data.ifsc_code
        ];
    };

    onSelect: Function = function(valueObj, model, context) {
        //console.log
    };

    inputMap: Object = {
        "urn": {
            "key": "customer.urnNo"
        }
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


