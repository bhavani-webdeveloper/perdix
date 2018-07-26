import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class LoanAccountsLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "account_number": "payment.accountNumber",
        "loan_amount": "payment.loanAmount",
        "customer_id": "payment.customerId",
        "customer_bank_account_number": "payment.beneficiaryAccountNumber",
        "customer_bank_ifsc_code": "payment.beneficiaryIfsc",
        "customer_bank": "payment.beneficiaryBankName",
        "customer_branch": "payment.beneficiaryBankBranch",
        "collection_customer_name_as_in_bank": "payment.beneficiaryAccountName",
        "id": "payment.loanId"
    };

    search: Function = function(inputModel, form) {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        return Queries.getAccountDetails([inputModel.accountNumber]);
    };

    getListDisplayItem: Function =  function(data, index) {
        console.log(data);
        return [
            'Customer Name : ' + data.first_name,
            'URN : ' + data.urn_no,
            'Account Number : ' + data.account_number,
            'Loan Amount : ' + data.loan_amount
        ];
    };

    onSelect: Function = function(valueObj, model, context) {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");

        // if payment purpose is loan disbursement
        if(model.payment.paymentPurpose == 'Loan Disbursement') {
            model.payment.amount = model.payment.loanAmount;
        }

        if(model.payment.loanId) {
            var customerData = Queries.getLoanCustomerDetails(model.payment.loanId).then(function(res) {
                model.payment.beneficiaryName = res.applicant.first_name;
                model.payment.beneficiaryMobileNumber = res.applicant.mobile_phone;
            });
        }
    };

    inputMap: Object = {
        "accountNumber": {
            "key": "loanAccount.accountNumber"
        }
    };

    lovonly: boolean = true;
    autolov: boolean = false;
}


