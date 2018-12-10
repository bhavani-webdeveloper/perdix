import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class PincodeLOVInsuranceConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
        "pincode":{
             key:"insurancePolicyDetailsDTO.pincode"
        },
        "district": {
            key: "insurancePolicyDetailsDTO.district"
        },
        "state": {
            key: "insurancePolicyDetailsDTO.state"
        }
    };
    outputMap: Object = {
        
        "pincode": "insurancePolicyDetailsDTO.pincode",
        "district": "insurancePolicyDetailsDTO.district",
        "state": "insurancePolicyDetailsDTO.state"
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
           
            item.pincode,
            item.district + ', ' + item.state
        ];
    };
    onSelect: Function = function(result, model, context) {
        model.insurancePolicyDetailsDTO.pincode = result.pincode;
     
        model.insurancePolicyDetailsDTO.state = result.state;
        model.insurancePolicyDetailsDTO.district = result.district;
        NGHelper.refreshUI();
    };
    fieldType: string = "number";
    autolov: boolean = true;
    lovonly: boolean = false;
}
