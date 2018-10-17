import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class IFSCCodeLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
        "ifscCode": {
            "key": "customer.customerBankAccounts[].ifscCode"
        },
        "bankName": {
            "key": "customer.customerBankAccounts[].customerBankName"
        },
        "branchName": {
            "key": "customer.customerBankAccounts[].customerBankBranchName"
        }
    };
    outputMap: Object = {
        "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
        "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
        "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
    };
    search: Function = function(inputModel, form) {
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let CustomerBankBranch = AngularResourceService.getInstance().getNGService("CustomerBankBranch");
        var promise = CustomerBankBranch.search({
            'bankName': inputModel.bankName,
            'ifscCode': inputModel.ifscCode,
            'branchName': inputModel.branchName
        }).$promise;
        return promise;
    };
    getListDisplayItem: Function = function(data, index) {
        return [
            data.ifscCode,
            data.branchName,
            data.bankName
        ]
    };
    onSelect: Function = function(valueObj, model, context) {
        NGHelper.refreshUI();
    };
    autolov: boolean = true;
    lovonly: boolean = true;
}
