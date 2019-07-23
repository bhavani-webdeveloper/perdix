import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class IndividualCustomerIDLOVConfiguration extends LOVElementConfiguration {
    outputMap: Object = {
        "urnNo": "customer.urnNo",
        "firstName":"customer.firstName"
    };

    search: Function = function(inputModel, form) {
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");
        let branches = formHelper.enum('branch_id').data;
        let branchName;

        var centreId;
        if (inputModel.globalSettings.allowCrossCentreBooking == 'Y'){
            centreId = inputModel.centreId1;
        } else {
            centreId = inputModel.centreId2;
        }
        for (let i=0; i<branches.length;i++){
            if(branches[i].code==inputModel.customerBranchId)
                branchName = branches[i].name;
        }
        let promise = Enrollment.search({
            'branchName': branchName ||SessionStore.getBranch(),
            'firstName': inputModel.firstName,
            'centreId':centreId,
            'customerType':"individual",
            'urnNo': inputModel.urnNo
        }).$promise;
        return promise;

    };
    getListDisplayItem: Function =  function(data, index) {
        return [
            [data.firstName, data.fatherFirstName].join(' | '),
            data.id,
            data.urnNo
        ];
    };

    onSelect: Function = function(valueObj, model, context){
        let PageHelper = AngularResourceService.getInstance().getNGService("PageHelper");
        let BundleManager = AngularResourceService.getInstance().getNGService("BundleManager");
        let Enrollment = AngularResourceService.getInstance().getNGService("Enrollment");
        let Utils = AngularResourceService.getInstance().getNGService("Utils");
        PageHelper.showProgress('customer-load', 'Loading customer...');
        if(typeof valueObj.urnNo != "undefined"){
            if(valueObj.urnNo == null || valueObj.urnNo == ""){
                PageHelper.showProgress('customer-load','Select a customer with URN Number...')
                model.customer.firstName = null;
                return false;
            }
            if(typeof valueObj.id != "undefined"){
                var temp = model.loanProcess.loanAccount.loanCustomerRelations;
                for(let i =0;i<temp.length;i++){
                    if(temp[i].customerId == valueObj.id){
                        PageHelper.showProgress('customer-load','Applicant,Co-applicant and Guarantor should be different customers');
                        model.customer.firstName = null;
                        model.customer.urnNo = null;
                        return false;
                    }
                        
                }
            }
        }
        var enrolmentDetails = {
            'customerId': model.customer.id,
            'customerClass': model._bundlePageObj.pageClass,
            'firstName': model.customer.firstName
        };

        if (_.hasIn(model, 'customer.id')){
            BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails);
            BundleManager.pushEvent('refresh-all-tabs', model._bundlePageObj, {customer: model.customer});
        }
        EnrolmentProcess.fromCustomerID(valueObj.id)
            .finally(function(){
                PageHelper.showProgress('customer-load', 'Done.', 5000);
                NGHelper.refreshUI();
            })
            .subscribe(function(enrolmentProcess){
                /* Updating the loan process */
                model.loanProcess.removeRelatedEnrolmentProcess(model.enrolmentProcess, model.loanCustomerRelationType);
                model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);

                /* Setting on the current page */
                model.enrolmentProcess = enrolmentProcess;
                model.customer = enrolmentProcess.customer;

                if (model.customer.enterprise){
                    model.customer.enterprise.enterpriseType = model.customer.enterprise.enterpriseType || "Enterprise";
                }

                BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer});
            })


    };

    initialize: Function = function(model, form, parentModel, context) {
        model.customerBranchId = parentModel.customer.customerBranchId;
        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
        model.globalSettings = {};
        model.globalSettings.allowCrossCentreBooking = SessionStore.getGlobalSetting("loan.allowCrossCentreBooking") || 'N';
    };

    inputMap: Object = {
        "firstName": {
            "key": "customer.firstName",
            "title": "CUSTOMER_NAME"
        },
        "urnNo": {
            "key": "customer.urnNo",
            "title": "URN_NO",
            "type": "string"
        },
        "customerBranchId": {
            "key": "customer.customerBranchId",
            "type": "select",
            "screenFilter": true,
            "readonly": true
        },
        "centreId1": {
            "key": "customer.centreId",
            "condition": "model.globalSettings.allowCrossCentreBooking == 'Y'",
            "type": "select",
            "enumCode": "centre",
            "parentEnumCode": "branch",
            "parentValueExpr": "model.customerBranchId"
        },
        "centreId2": {
            "key": "customer.centreId",
            "condition": "model.globalSettings.allowCrossCentreBooking == 'N'",
            "type": "select",
            "enumCode": "usercentre"
        }
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


