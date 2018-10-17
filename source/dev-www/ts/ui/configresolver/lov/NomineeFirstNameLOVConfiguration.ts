import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class NomineeFirstNameLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "nomineeFirstName": "loanAccount.nominees[arrayIndex].nomineeFirstName",
        "nomineeGender":"loanAccount.nominees[arrayIndex].nomineeGender",
        "nomineeDOB":"loanAccount.nominees[arrayIndex].nomineeDOB",
        "nomineeRelationship": "loanAccount.nominees[arrayIndex].nomineeRelationship"
    };
    search: Function = function(inputModel, form, model, context) {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        let promise = Queries.getFamilyRelations(model.loanAccount.id);
        return promise;
    };
    getListDisplayItem: Function = function(data, index) {
        return [
            data.nomineeFirstName,
            data.nomineeGender,
            data.nomineeDOB
        ];
    };
    onSelect: Function = function(result, model, context) {
        NGHelper.refreshUI();
    };
    autolov: boolean = true;
    lovonly: boolean = true;
}
