import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class KGFSSendBacktoStageLOVConfiguration extends LOVElementConfiguration {
	outputMap: Object = {

    };
	search: Function = function(inputModel, form, model, context) {
		let $q = AngularResourceService.getInstance().getNGService("$q");
		let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let stage1 = model.loanProcess.loanAccount.currentStage;
        let productCategory = model.loanProcess.loanAccount.productCategory;
        if(model.loanAccount.currentStage=='Rejected')
        let stage1= model.review.preStage;
            if(model.loanAccount.currentStage =='Rejected')
            let targetstage = formHelper.enum('targetstagemelreject').data;
            else if((productCategory == 'Consumer' || productCategory == 'Personal') && model.loanAccount.currentStage!='Rejected')
            let targetstage = formHelper.enum('targetstagemelpersonal').data;
            else if(productCategory == 'JEWEL' && model.loanAccount.currentStage !='Rejected')
            let targetstage = formHelper.enum('targetstagemeljewel').data;
            else
            let targetstage = formHelper.enum('targetstagemel').data;

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
        model.review.targetStage = valueObj.name;
        model.loanProcess.stage = valueObj.value;        
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