import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class IREPRejectReasonLOVConfiguration extends LOVElementConfiguration {
	outputMap: object = {

	};

	search: Function = function(inputModel, form, model, context) {
		let $q = AngularResourceService.getInstance().getNGService("$q");
		let formHelper = AngularResourceService.getInstance().getNGService("formHelper");

        let rejectReason = formHelper.enum('irep_application_reject_reason').data;
        let out = [];
        for (let i = 0; i < rejectReason.length; i++) {
            let t = rejectReason[i];
            if (t.field1 == model.loanProcess.loanAccount.currentStage) {
                out.push({
                    name: t.name,
                })
            }
        }
        return $q.resolve({
            headers: {
                "x-total-count": out.length
            },
            body: out
        });
    };

    onSelect: Function = function(valueObj, model, context) {
        model.loanAccount.rejectReason = valueObj.name;        
        NGHelper.refreshUI();
    };

    getListDisplayItem: Function = function(item, index) {
        return [
            item.name
        ];
    };

   	autolov: boolean = true;
    lovonly: boolean = true;
}