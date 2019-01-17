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
        //let Queries = AngularResourceService.getInstance().getNGService("Queries");
        let Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");
        let PageHelper = AngularResourceService.getInstance().getNGService("PageHelper");
        Enrollment.get({id:valueObj.id}).$promise.then(function(response){
            var resp = response;
            if(model.pageConfig.DefaultBeneficiaryParty == 'CUSTOMER' && response.customerBankAccounts.length > 0){
           // model.payment.accountNumber = response.customerBankAccounts["0"].accountNumber;
                model.payment.loanId = response.customerBankAccounts["0"].id;
                model.payment.beneficiaryName = (response.firstName)?response.firstName : ''+ (response.middleName)?response.middleName : ''+ (response.middleName)?response.lastName : '';
                model.payment.beneficiaryMobileNumber = null;
                model.payment.beneficiaryEmailI = null;
                model.payment.beneficiaryAccountNumber = response.customerBankAccounts["0"].accountNumber;
                model.payment.beneficiaryIfsc = response.customerBankAccounts["0"].ifscCode;
                model.payment.beneficiaryBankName = response.customerBankAccounts["0"].customerBankName;
                model.payment.beneficiaryBankBranch = response.customerBankAccounts["0"].customerBankBranchName;
                model.payment.beneficiaryAccountName = response.customerBankAccounts["0"].customerNameAsInBank
            }
            else if(model.pageConfig.DefaultBeneficiaryParty == 'CUSTOMER' && response.customerBankAccounts.length == 0){
                model.payment['flag'] = true;
                model.payment.loanId = null;
                model.payment.beneficiaryName = null;
                model.payment.beneficiaryMobileNumber = null;
                model.payment.beneficiaryEmailI = null;
                model.payment.beneficiaryAccountNumber = null;
                model.payment.beneficiaryIfsc = null;
                model.payment.beneficiaryBankName = null;
                model.payment.beneficiaryBankBranch = null;
                model.payment.beneficiaryAccountName = null;
                PageHelper.showErrors({'data':{
                    'error':'Bank Details are missing'
                }})
                return;
            }
        },function(error){
            console.log(error);
        });
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


