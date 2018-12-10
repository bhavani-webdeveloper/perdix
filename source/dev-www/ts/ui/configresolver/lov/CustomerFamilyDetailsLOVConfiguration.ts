import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
export class CustomerFamilyDetailsLOVConfiguration extends LOVElementConfiguration {
    inputMap: Object = {
       
    };
    outputMap: Object = {
        
        "gender": "insurancePolicyDetailsDTO.gender",
        "familyMemberFirstName": "insurancePolicyDetailsDTO.benificieryName",
        "realtionShip": "insurancePolicyDetailsDTO.benificieryRelationship",
        "dateOfBirth": "insurancePolicyDetailsDTO.dateOfBirth",
        "enrollmentId": "insurancePolicyDetailsDTO.benificieryFamilyMemberId"
    };
    initialize: Function = function(inputModel) {
        let $log = AngularResourceService.getInstance().getNGService("$log");
        $log.warn('in pincode initialize');
        $log.info(inputModel);
    };
    search: Function = function(inputModel, form, model) {
        let $q = AngularResourceService.getInstance().getNGService("$q");
        let Queries = AngularResourceService.getInstance().getNGService("Queries");
        
        return Queries.getCustomerFamilyRelations(
            model.insurancePolicyDetailsDTO.customerId
   
        );
    };

    getListDisplayItem: Function = function(item, index) {
        return [
           
            item.realtionShip,
            item.familyMemberFirstName
        ];
    };
    onSelect: Function = function(result, model, context) {
        model.insurancePolicyDetailsDTO.benificieryName = result.familyMemberFirstName;     
        model.insurancePolicyDetailsDTO.benificieryRelationship = result.realtionShip;
        model.insurancePolicyDetailsDTO.gender = result.gender;
        model.insurancePolicyDetailsDTO.dateOfBirth = result.dateOfBirth;
        model.insurancePolicyDetailsDTO.benificieryFamilyMemberId = result.enrollmentId;
        if(result.dateOfBirth){
            var diff_ms = Date.now() - new Date(result.dateOfBirth).getTime();
            var age_dt = new Date(diff_ms);  
            var age =  Math.abs(age_dt.getUTCFullYear() - 1970);
            model.insurancePolicyDetailsDTO.age = age;
        }
        NGHelper.refreshUI();
    };
    fieldType: string = "string";
    autolov: boolean = true;
    lovonly: boolean = false;

}
