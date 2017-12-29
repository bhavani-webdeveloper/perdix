import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class IndividualCustomerIDLOVConfiguration extends LOVElementConfiguration{


    outputMap: Object = null;
    search: Function = function(inputModel, form, model, context){
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");

    };
    getListDisplayItem: Function =  function(item, index) {

    };
    onSelect: Function = function(valueObj, model, context) {

        NGHelper.refreshUI();
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


