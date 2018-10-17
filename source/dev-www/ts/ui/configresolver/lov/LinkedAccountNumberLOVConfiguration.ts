import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class LinkedAccountNumberLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {

    };
    search: Function = function(inputModel, form, model, context) {
        let LoanProcess = AngularResourceService.getInstance().getNGService("LoanProcess");
        let promise = LoanProcess.viewLoanaccount(
        {
            urn: model.loanProcess.loanCustomerEnrolmentProcess.customer.urnNo
        }).$promise;
        return promise;
    };

    getListDisplayItem: Function = function(item, index) {
        return [
            item.accountId,
            item.glSubHead,
            item.amount,
            item.npa,
        ];
    };
    onSelect: Function = function(valueObj, model, context) {
        model.loanAccount.npa = valueObj.npa;
        model.loanAccount.linkedAccountNumber = valueObj.accountId;
        NGHelper.refreshUI();
    };
    autolov: boolean = true;
    lovonly: boolean = true;
}
