import {LOVElementConfiguration} from "./LOVElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
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
        for (let i=0; i<branches.length;i++){
            if(branches[i].code==inputModel.customerBranchId)
                branchName = branches[i].name;
        }
        let promise = Enrollment.search({
            'branchName': branchName ||SessionStore.getBranch(),
            'firstName': inputModel.firstName,
            'centreId':inputModel.centreId,
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

        var enrolmentDetails = {
            'customerId': model.customer.id,
            'customerClass': model._bundlePageObj.pageClass,
            'firstName': model.customer.firstName
        };

        if (_.hasIn(model, 'customer.id')){
            BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
        }

        Enrollment.getCustomerById({id: valueObj.id})
            .$promise
            .then(function(res){
                PageHelper.showProgress("customer-load", "Done..", 5000);
                model.customer = Utils.removeNulls(res, true);
                model.customer.identityProof = "Pan Card";
                model.customer.addressProof= "Aadhar Card";
                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
            }, function(httpRes){
                PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
            })
        NGHelper.refreshUI();
    };

    initialize: Function = function(model, form, parentModel, context) {
        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
        let $filter = AngularResourceService.getInstance().getNGService("$filter");
        model.customerBranchId = parentModel.customer.customerBranchId;
        model.centreId = parentModel.customer.centreId;
        let centreCode = formHelper.enum('centre').data;

        let centreName = $filter('filter')(centreCode, {value: parentModel.customer.centreId}, true);
        if(centreName && centreName.length > 0) {
            model.centreName = centreName[0].name;
        }

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
        "centreName": {
            "key": "customer.place",
            "title":"CENTRE_NAME",
            "type": "string",
            "readonly": true,

        },
        "centreId":{
            "key": "customer.centreId",
            "type": "lov",
            "autolov": true,
            "lovonly": true,
            "bindMap": {},
            "search": function(inputModel, form, model, context) {
                let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
                let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
                let $q = AngularResourceService.getInstance().getNGService("$q");
                let centres = SessionStore.getCentres();
                // $log.info("hi");
                // $log.info(centres);

                let centreCode = formHelper.enum('centre').data;
                let out = [];
                if (centres && centres.length) {
                    for (var i = 0; i < centreCode.length; i++) {
                        for (var j = 0; j < centres.length; j++) {
                            if (centreCode[i].value == centres[j].id) {

                                out.push({
                                    name: centreCode[i].name,
                                    id:centreCode[i].value
                                })
                            }
                        }
                    }
                }
                return $q.resolve({
                    headers: {
                        "x-total-count": out.length
                    },
                    body: out
                });
            },
            "onSelect": function(valueObj, model, context) {
                model.centreId = valueObj.id;
                model.centreName = valueObj.name;
            },
            "getListDisplayItem": function(item, index) {
                return [
                    item.name
                ];
            }
        }
    };

    lovonly: boolean = true;
    autolov: boolean = true;
}


