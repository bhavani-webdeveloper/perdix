import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class BuyerNameLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
    };
    outputMap: Object = {
    };
    search: Function = function(inputModel, form, model, context) {        
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let $q = AngularResourceService.getInstance().getNGService("$q");
        var out = [];
        if (!model.customer.buyerDetails){
            return out;
        }
        for (var i=0; i<model.customer.buyerDetails.length; i++){
                out.push({
                name: model.customer.buyerDetails[i].buyerName,
                value: model.customer.buyerDetails[i].buyerName
            })
        }
        return $q.resolve({
            headers: {
                "x-total-count": out.length
            },
            body: out
        });
    },
    onSelect: Function= function(valueObj, model, context){
        if (_.isUndefined(model.customer.incomeThroughSales[context.arrayIndex])) {
                model.customer.incomeThroughSales[context.arrayIndex] = {};
        }
        model.customer.incomeThroughSales[context.arrayIndex].buyerName = valueObj.value;
    },
    getListDisplayItem: Function= function(item, index) {
        return [
            item.name
        ];
    }
    autolov: boolean = true;
    lovonly: boolean = true;
}
