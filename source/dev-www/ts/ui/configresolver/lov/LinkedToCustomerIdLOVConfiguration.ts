import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class LinkedToCustomeridLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
        "firstName": {
            "key": "customer.firstName",
            "title": "CUSTOMER_NAME"
        },
        "branchName": {
            "key": "customer.kgfsName",
            "type": "select"
        },
        "centreId": {
            "key": "customer.centreId",
            "type": "select",
            title:"CENTRE_NAME"
        }
    };

    outputMap: Object = {
        "id": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerId",
        "firstName": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerName"
    };

    search: Function = function(inputModel, form, model) {
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");
        if (!inputModel.branchName)
            inputModel.branchName = SessionStore.getBranch();
        var promise = Enrollment.search({
            'branchName': inputModel.branchName,
            'firstName': inputModel.firstName,
            'centreId': inputModel.centreId,
            'customerType': 'Individual'
        }).$promise;
        return promise;
    };

    getListDisplayItem: Function = function(data, index) {
        return [
            [data.firstName].join(' '),
            data.id
        ];
    };

    onSelect: Function = function(valueObj, model, context){

    };

    autolov: boolean = true;
    lovonly: boolean = true;
}
