import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class CentreLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
    };
    outputMap: Object = {
    };
    search: Function = function(inputModel, form, model, context) {
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let $q = AngularResourceService.getInstance().getNGService("$q");
        let centres = SessionStore.getCentres();
        let centreCode = formHelper.enum('centre').data;
        let out = [];
        if (centres && centres.length) {
            for (var i = 0; i < centreCode.length; i++) {
                for (var j = 0; j < centres.length; j++) {
                    if (centreCode[i].value == centres[j].id) {

                        out.push({
                            name: centreCode[i].name,
                            id: centreCode[i].value
                        })
                    }
                }
            }
        }
        return $q.resolve({
            headers: {
                "x-total-count": out.length
            },
            body: out
        });
    };
    getListDisplayItem: Function = function(item, index) {
        return [
            item.name
        ];
    };
    onSelect: Function = function(valueObj, model, context) {
        model.customer.centreId = valueObj.id;
        model.customer.centreName = valueObj.name;
        NGHelper.refreshUI();
    };
    autolov: boolean = true;
    lovonly: boolean = true;
}
