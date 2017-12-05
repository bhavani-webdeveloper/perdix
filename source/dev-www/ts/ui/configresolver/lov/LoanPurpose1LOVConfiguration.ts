import {LoanProcess} from "../../../domain/model/loan/LoanProcess";
import LoanRepository = require("../../../domain/model/loan/LoanRepository");

import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {ILoanRepository} from "../../../domain/model/loan/ILoanRepository";
import RepositoryFactory = require("../../../domain/shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../domain/shared/RepositoryIdentifiers";
import {IQueryRepository} from "../../../domain/shared/query/IQueryRepository";
import Utils = require("../../../domain/shared/Utils");

export class LoanPurpose1LOVConfiguration extends LOVElementConfiguration{


    outputMap: Object = {
        "purpose1": "loanAccount.loanPurpose1"
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
        model.loanAccount.loanPurpose2 = '';
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


