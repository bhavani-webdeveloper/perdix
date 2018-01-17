import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class BankIFSCLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
        "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
        "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
    };

    search: Function = function(inputModel, form) {
       
        let CustomerBankBranch = AngularResourceService.getInstance().getNGService("CustomerBankBranch");
     
        let promise = CustomerBankBranch.search({
            'bankName': inputModel.bankName,
            'ifscCode': inputModel.ifscCode,
            'branchName': inputModel.branchName
        }).$promise;
        return promise;
        

    };
    getListDisplayItem: Function =  function(data, index) {
        return [
            data.ifscCode,
            data.branchName,
            data.bankName
        ];
    };

    onSelect: Function = function(valueObj, model, context){
  

    };

    initialize: Function = function(model, form, parentModel, context) {
       

    };

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

    lovonly: boolean = true;
    autolov: boolean = false;
}


