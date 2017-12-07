import {LoanProcess} from "../../../domain/model/loan/LoanProcess";
import LoanRepository = require("../../../domain/model/loan/LoanRepository");

import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {ILoanRepository} from "../../../domain/model/loan/ILoanRepository";
import RepositoryFactory = require("../../../domain/shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../domain/shared/RepositoryIdentifiers";
import {IQueryRepository} from "../../../domain/shared/query/IQueryRepository";
import Utils = require("../../../domain/shared/Utils");

export class LoanPurpose2LOVConfiguration extends LOVElementConfiguration{


    outputMap: Object = {
        "purpose2": "loanAccount.loanPurpose2"
    };
    search: Function = function(inputModel, form, model, context){
        let queryRepo:IQueryRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Queries);
        return queryRepo.getAllLoanPurpose2(model.loanAccount.loanPurpose1).toPromise();
    };
    getListDisplayItem: Function =  function(item, index) {
        return [
            item.purpose2
        ];
    };
    onSelect: Function = function(valueObj, model, context) {

    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


