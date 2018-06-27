import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class AgentSendBacktoStageLOVConfiguration extends LOVElementConfiguration {
	outputMap: Object = {

    };
	search: Function = function(inputModel, form, model, context) {
		let $q = AngularResourceService.getInstance().getNGService("$q");
		let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let stage1 = model.agentProcess.agent.currentStage;
        let targetstage = formHelper.enum('agent_targetstage').data;
        let out = [];
        for (let i = 0; i < targetstage.length; i++) {
            let t = targetstage[i];
            if (t.field1 == stage1) {
                out.push({
                    name: t.name,
                    value:t.code
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
        model.review.targetStage1 = valueObj.name;
        model.agentProcess.stage = valueObj.value;        
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