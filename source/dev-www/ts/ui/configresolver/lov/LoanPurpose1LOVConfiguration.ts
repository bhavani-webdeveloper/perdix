

import {LoanProcess} from "../../../domain/model/loan/LoanProcess";
class LoanPurpose1LOVConfiguration extends LOVElementConfiguration{
    outputMap: Object = {};
    searchHelper: any ;
    search: Function = function(inputModel, form, model, context){
        LoanProcess
    };
    getListDisplayItem: Function;
    onSelect: Function;
    lovOnly: string;
    resolverName: string;

}
