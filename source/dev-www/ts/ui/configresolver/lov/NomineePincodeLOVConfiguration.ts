import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class NomineePincodeLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
        "pincode": {
            "key": "loanAccount.nominees[].nomineePincode",
            "title": "pinCode",
            "type": "string"
        },
        "district": {
            "key": "loanAccount.nominees[].nomineeDistrict"
        },
        "state": {
            "key": "loanAccount.nominees[].nomineeState"
        }
    };
    outputMap: Object = {
        "division": "loanAccount.nominees[arrayIndex].nomineeLocality",
        "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
        "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
        "state": "loanAccount.nominees[arrayIndex].nomineeState"
    };
    initialize: Function = function(inputModel, form, model, context) {
        inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].nomineePincode;
    };
    search: Function = function(inputModel, form, model, context) {
        let $q = AngularResourceService.getInstance().getNGService("$q");
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        if (!inputModel.pincode) {
            return $q.reject();
        }
        return Queries.searchPincodes(
            inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].nomineePincode,
            inputModel.district,
            inputModel.state
        );
    };

    getListDisplayItem: Function = function(item, index) {
        return [
            item.division + ', ' + item.region,
            item.pincode,
            item.district + ', ' + item.state
        ];
    };
    onSelect: Function = function(result, model, context) {
        NGHelper.refreshUI();
    };
    autolov: boolean = true;
    lovonly: boolean = false;
}
