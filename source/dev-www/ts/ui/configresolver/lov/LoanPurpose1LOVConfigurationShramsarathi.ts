import {LoanProcess} from "../../../domain/model/loan/LoanProcess";
import LoanRepository = require("../../../domain/model/loan/LoanRepository");

import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {ILoanRepository} from "../../../domain/model/loan/ILoanRepository";
import RepositoryFactory = require("../../../domain/shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../domain/shared/RepositoryIdentifiers";
import {IQueryRepository} from "../../../domain/shared/query/IQueryRepository";
import AngularResourceService = require("../../../infra/api/AngularResourceService");


export class LoanPurpose1LOVConfigurationShramsarathi extends LOVElementConfiguration{


    outputMap: Object = {
        "purpose1": "customer.liabilities[arrayIndex].liabilityLoanPurpose"
    };
    search: Function = function(inputModel, form, model, context){
        let queryRepo:IQueryRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Queries);
        return queryRepo.getAllLoanPurpose1().toPromise();
    };
    getListDisplayItem: Function =  function(item, index) {
        return [
            item.purpose1
        ];
    };
    onSelect: Function = function(valueObj, model, context) {

        var SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");

        // model.customer.liabilities[context.arrayIndex].liabilityLoanPurpose= '';
     
        if (SessionStore.getGlobalSetting('siteCode') == 'witfin') {
            if(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle'){
                model.loanAccount.vehicleLoanDetails.vehicleType = 'New';
            }else if (model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle'){
                model.loanAccount.vehicleLoanDetails.vehicleType = 'Used';
            }
        }
        
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


