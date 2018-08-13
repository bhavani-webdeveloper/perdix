import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class PaymentBankAccountsLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "bank_name": "payment.debitAccountName",
        "account_number": "payment.debitAccountNumber"
    };

    search: Function = function(inputModel, form) {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        return Queries.getBankAccounts();
    };

    getListDisplayItem: Function =  function(data, index) {
        return [
            data.bank_name,
            data.branch_name,
            data.account_number
        ];
    };

    onSelect: Function = function(valueObj, model, context) {

    };

    inputMap: Object = {
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


