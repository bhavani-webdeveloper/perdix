import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class BusinessSubsectorLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {

    };
    search: Function = function(inputModel, form, model, context) {
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let $q = AngularResourceService.getInstance().getNGService("$q");

        let businessSubsectors = formHelper.enum('businessSubSector').data;
        let businessSectors = formHelper.enum('businessSector').data;

        let selectedBusinessSector  = null;

        for (let i=0;i<businessSectors.length;i++){
            if (businessSectors[i].value == model.customer.enterprise.businessSector && businessSectors[i].parentCode == model.customer.enterprise.businessType){
                selectedBusinessSector = businessSectors[i];
                break;
            }
        }

        let out = [];
        for (let i=0;i<businessSubsectors.length; i++){
            if (businessSubsectors[i].parentCode == selectedBusinessSector.code){
                out.push({
                    name: businessSubsectors[i].name,
                    value: businessSubsectors[i].value
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

    onSelect: Function = function(valueObj, model, context){
        model.customer.enterprise.businessSubsector = valueObj.value;
        NGHelper.refreshUI();
    };

    getListDisplayItem: Function = function(item, index) {
        return [
            item.name
        ];
    };
    lovonly: boolean = true;
    autolov: boolean = true;
}
