import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");

import * as _ from 'lodash';
export class VehicleValuatorLOVConfiguration extends LOVElementConfiguration {
    search: Function = function(inputModel, form, model, context) {
        var $q = AngularResourceService.getInstance().getNGService("$q");
        var SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        var formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        var Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");
        var $filter = AngularResourceService.getInstance().getNGService("$filter");
        var User = AngularResourceService.getInstance().getNGService("User");
        return User.query({roleId:SessionStore.getGlobalSetting("vehicleValuatorRoleId"),
            userName:inputModel.userName}).$promise;
    };

    getListDisplayItem: Function =  function(item, index) {
        return [
            item.userName
        ];
    };

    onSelect: Function = function(valueObj, model, context){
        model.loanAccount.valuator = valueObj.userName;
        model.loanProcess.valuator = valueObj.login;
    };
    outputMap: Object = {
        "userName": "loanAccount.user_name"
    };
    inputMap: Object = {
         "userName": {
                "key": "loanAccount.user_name",
                "title":"USER_NAME",
                type:"string"
            }
    };

    lovonly: boolean = true;
    autolov: boolean = false;
}