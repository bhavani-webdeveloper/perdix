import {RadioElementConfiguration} from "./RadioElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");

import * as _ from 'lodash';
export class IndividualWhatsappMobileLOVConfiguration extends RadioElementConfiguration {
   
    onChange: Function = function (modelValue, form, model, formCtrl, event) {
        switch (modelValue) {
            case "1":
                model.customer.whatsAppMobileNo = model.customer.mobilePhone;
                break;
            case "2":
                model.customer.whatsAppMobileNo = model.customer.landLineNo;
                break;
            case "3":
                model.customer.whatsAppMobileNo = "";
                break;
        }
    }
   
}


