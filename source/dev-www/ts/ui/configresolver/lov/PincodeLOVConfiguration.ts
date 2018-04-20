import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class PincodeLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
        "pincode": {
            "key": "customer.pincode",
            "title": "pinCode",
            "type": "number"
        },
        "district": {
            key: "customer.district"
        },
        "state": {
            key: "customer.state"
        }
    };
    outputMap: Object = {
        "division": "customer.locality",
        "region": "customer.villageName",
        "pincode": "customer.pincode",
        "district": "customer.district",
        "state": "customer.state",
    };
    initialize: Function = function(inputModel) {
        let $log = AngularResourceService.getInstance().getNGService("$log");
        $log.warn('in pincode initialize');
        $log.info(inputModel);
    };
    search: Function = function(inputModel, form, model) {
        let $q = AngularResourceService.getInstance().getNGService("$q");
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        if (!inputModel.pincode) {
            return $q.reject();
        }
        return Queries.searchPincodes(
            inputModel.pincode,
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
