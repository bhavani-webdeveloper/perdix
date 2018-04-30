import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class VendorNameLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
    };
    outputMap: Object = {
    };
    searchHelper: formHelper,
    search: Function = function(inputModel, form, model, context) {
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let $q = AngularResourceService.getInstance().getNGService("$q");
        var out = [];
        if (!model.customer.supplierDetails){
            return out;
        }
        for (var i=0; i<model.customer.supplierDetails.length; i++){
            out.push({
                name: model.customer.supplierDetails[i].supplierName,
                value: model.customer.supplierDetails[i].supplierName
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
        if (_.isUndefined(model.customer.rawMaterialExpenses[context.arrayIndex])) {
            model.customer.rawMaterialExpenses[context.arrayIndex] = {};
        }

        model.customer.rawMaterialExpenses[context.arrayIndex].vendorName = valueObj.value;
    },
    getListDisplayItem: Function= function(item, index) {
        return [
            item.name
        ];
    }
    autolov: boolean = true;
    lovonly: boolean = true;
}
