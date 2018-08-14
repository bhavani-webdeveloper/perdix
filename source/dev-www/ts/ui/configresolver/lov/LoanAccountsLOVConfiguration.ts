import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class LoanAccountsLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "accountNumber": "payment.accountNumber",
        "loanId": "payment.loanId",
        "customerName": "payment.beneficiaryName",
        "mobile_phone": "payment.beneficiaryMobileNumber",
        "mail": "payment.beneficiaryEmailId"
    };

    search: Function = function(inputModel, form, model) {
        /*let Queries = AngularResourceService.getInstance().getNGService("Queries");
        return Queries.getAccountDetails([inputModel.accountNumber]);
*/
        let IndividualLoan = AngularResourceService.getInstance().getNGService("IndividualLoan");
        return IndividualLoan.search({urn: model.customer.urnNo}).$promise;
    };

    getListDisplayItem: Function =  function(data, index) {
        return [
            'Account Number : ' + data.accountNumber,
            'Loan Amount : ' + data.loanAmount
        ];
    };

    onSelect: Function = function(valueObj, model, context) {
        let LoanAccount = AngularResourceService.getInstance().getNGService("LoanAccount");
        let IndividualLoan = AngularResourceService.getInstance().getNGService("IndividualLoan");
        let Queries = AngularResourceService.getInstance().getNGService("Queries");

        if(model.payment.loanId) {
            
            // Get particular loan disbursement details
            IndividualLoan.get({id: model.payment.loanId}).$promise.then(function(res){
                // if payment purpose is loan disbursement
                if(model.payment.paymentPurpose == 'Loan Disbursement') {
                    model.payment.amount = res.loanAmount;
                }
                if(res.disbursementSchedules.length > 0) {                    
                    model.payment.beneficiaryAccountNumber = res.disbursementSchedules[0].customerAccountNumber;
                    model.payment.beneficiaryIfsc = res.disbursementSchedules[0].ifscCode;
                    model.payment.beneficiaryBankName = res.disbursementSchedules[0].customerBankName;
                    model.payment.beneficiaryBankBranch = res.disbursementSchedules[0].customerBankBranchName;
                    model.payment.beneficiaryAccountName = (res.disbursementSchedules[0].customerNameInBank!=null && res.disbursementSchedules[0].customerNameInBank!='') ? res.disbursementSchedules[0].customerNameInBank : model.payment.beneficiaryName;
                } else {
                    model.payment.beneficiaryAccountNumber = null;
                    model.payment.beneficiaryIfsc = null;
                    model.payment.beneficiaryBankName = null;
                    model.payment.beneficiaryBankBranch = null;
                    model.payment.beneficiaryAccountName = null;
                }
            });

            // Get security EMI deails of the loan
            if(model.payment.paymentPurpose == 'Security EMI Refunds') {
                model.payment.amount = null;
                LoanAccount.get({accountId: model.payment.accountNumber}).$promise.then(function (data) {
                    model.payment.amount = data.securityDeposit;
                });
            }
        }
    };

    inputMap: Object = {
    };

    lovonly: boolean = true;
    autolov: boolean = false;
}


