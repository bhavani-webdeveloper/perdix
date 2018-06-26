import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class LoanAccountsLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "account_number": "payment.accountNumber",
        "loan_amount": "payment.amount"
    };

    search: Function = function(inputModel, form) {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        return Queries.getAccountDetails([inputModel.accountNumber]);
    };

    getListDisplayItem: Function =  function(data, index) {
        return [
            'Customer Name : ' + data.first_name,
            'URN : ' + data.urn_no,
            'Account Number : ' + data.account_number,
            'Loan Amount : ' + data.loan_amount
        ];
    };

    onSelect: Function = function(valueObj, model, context) {

    };

    inputMap: Object = {
        "accountNumber": {
            "key": "loanAccount.accountNumber"
        }
    };

    lovonly: boolean = true;
    autolov: boolean = false;
}


