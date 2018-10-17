import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class JournalIFSCAccountNoConfiguration extends LOVElementConfiguration {
    outputMap: Object = {

    };
    inputMap: Object = {
         "relatedAccountNo": {
            "key": "journal.journalEntryDto.relatedAccountNo",
            "title": "ACCOUNT_NO"
        }
    };
    search: Function = function(inputModel, form, model, context) {
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        let promise = Queries.getloanAccountsByLikeAccountNumber(inputModel.relatedAccountNo);
        return promise;
    };

    getListDisplayItem: Function = function(item, index) {
        return [
            item.account_number
        ];
    };
    onSelect: Function = function(valueObj, model, context) {
        model.journal.journalEntryDto.relatedAccountNo = valueObj.account_number;
    };
    autolov: boolean = true;
    lovonly: boolean = true;
}
