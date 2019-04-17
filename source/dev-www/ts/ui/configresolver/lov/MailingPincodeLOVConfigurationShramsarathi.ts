import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class MailingPincodeLOVConfigurationShramsarathi extends LOVElementConfiguration {
    inputMap: Object = {
        "mailingPincode": "customer.mailingPincode",
        "mailingRegion": {
            key: "customer.mailingRegion",
            title: "VILLAGE" 
        },
        "mailingDivision":{
            key: "customer.mailingLocality",
            title: "PANCHAYAT/CITY"
        },
        "mailingtaluk":{
            key: "customer.mailingtaluk",
            title: "SUB-DISTRICT"
        },
        "mailingDistrict": {
            key: "customer.mailingDistrict"
        },
        "mailingState": {
            key: "customer.mailingState"
        },  
    };
    outputMap: Object = {
        "mailingDivision": "customer.mailingLocality",
        "mailingPincode": "customer.mailingPincode",
        "mailingDistrict": "customer.mailingDistrict",
        "mailingState": "customer.mailingState",
        "mailingRegion": "customer.mailingRegion",
    };
    initialize: Function = function(inputModel) {
        let $log = AngularResourceService.getInstance().getNGService("$log");
        $log.warn('in pincode initialize');
        $log.info(inputModel);
    };
    search: Function = function(inputModel, form, model) {
        let $q = AngularResourceService.getInstance().getNGService("$q");
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        // if (!inputModel.mailingPincode) {
        //     return $q.reject();
        // }
        return Queries.searchPincodes(
            inputModel.mailingPincode,
            inputModel.mailingDistrict,
            inputModel.mailingState,
            inputModel.mailingDivision,
            inputModel.mailingRegion,
            inputModel.mailingtaluk
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
        model.customer.mailingPincode = (new Number(result.pincode)).toString();
        model.customer.mailingLocality = result.division;
        model.customer.mailingState = result.state;
        model.customer.mailingDistrict = result.district;
        model.customer.mailingRegion = result.region;
        model.customer.mailingtaluk = result.taluk;
        NGHelper.refreshUI();
    };
    autolov: boolean = true;
    lovonly: boolean = false;
}
