import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class PaymentBankIFSCLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "bankName": "payment.beneficiaryBankBranch",
        "branchName": "payment.beneficiaryBankName",
        "ifscCode": "payment.beneficiaryIfsc"
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
            "key": "payment.beneficiaryIfsc"
        },
        "branchName": {
            "key": "payment.beneficiaryBankName"
        },
        "bankName": {
            "key": "payment.beneficiaryBankBranch"
        }
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


