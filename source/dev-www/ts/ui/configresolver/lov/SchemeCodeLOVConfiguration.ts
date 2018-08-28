import {LoanProcess} from "../../../domain/model/loan/LoanProcess";
import LoanRepository = require("../../../domain/model/loan/LoanRepository");
import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {ILoanRepository} from "../../../domain/model/loan/ILoanRepository";
import RepositoryFactory = require("../../../domain/shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../domain/shared/RepositoryIdentifiers";
import {IQueryRepository} from "../../../domain/shared/query/IQueryRepository";
import {NGHelper} from "../../../infra/helpers/NGHelper";

export class SchemeCodeLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
    };
    outputMap: Object = {
    };
    search: Function = function(inputModel, form, model, context) {
        let queryRepo:IQueryRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Queries);
        let branchId=  model.loanAccount.branchId || model.loanProcess.applicantEnrolmentProcess.customer.customerBranchId;
        return queryRepo.getVehicleSchemeCodes(branchId,model.loanAccount.loanCentre.centreId).toPromise();
    };
    onSelect: Function= function(valueObj, model, context){
        model.loanAccount.schemeCode= valueObj.scheme_code;
        if(model.loanAccount.vehicleLoanDetails){
            model.loanAccount.vehicleLoanDetails.vehicleModel=valueObj.model;
        }
        model.loanAccount.loanAmountRequested=valueObj.default_loan_amount;
        model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5=valueObj.default_interest_rate.toString();
    };
    getListDisplayItem: Function= function(item, index) {
        return [
            item.scheme_code,
            item.model
        ];
    }
    autolov: boolean = true;
    lovonly: boolean = true;
}
