irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCSubmission"),
["$log", "PDC", "PageHelper", "SessionStore","$state", "Enrollment", 'formHelper', "$stateParams", 
function($log, PDC, PageHelper, SessionStore,$state,Enrollment,formHelper,$stateParams){
/*
The PDCSubmission.js is to download the PDC Demandlist for the given date and to update the status of them. 
*/
    return {
        "type": "schema-form",
        "title": "PDC_SUBMISSION",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            model.pdcDemand = model.pdcDemand || {};

            model.pdcDemand.demandList = [{
                accountId: "10010101",
                amount1: "100",
                customerName: "aaa",
                check: false
            },
            {
                accountId: "10010102",
                amount1: "100",
                customerName: "bbb",
                check: true
            }];
        },

        form:[
            {
                "type": "box",
                "notitle": true,
                "items": [
                    {
                        "type":"fieldset",
                        "title":"PDC_DEMANDS",
                        "items":[
                            {
                                "key": "pdcDemand.search.demandDate",
                                "title": "DEMAND_DATE",
                                "type": "date"

                            },
                            {
                                "key": "pdcDemand.search.branchId",
                                "title": "BRANCH_CODE",
                                "type": "select",
                                "enumCode": "branch_id",
                            },
                            {
                                "title":"SEARCH",
                                "type":"button",
                                "onClick": function(model, formCtrl, form, $event){
                                    PageHelper.showLoader();
                                    PDC.getDemandList(model.pdcDemand.search).$promise.then(function(response) {
                                        PageHelper.showProgress("page-init", "Done.", 2000);
                                       // model.pdcDemand.demandList = response;
                                    }, function(errorResponse) {
                                        PageHelper.showErrors(errorResponse);
                                    }).finally(function(){
                                        PageHelper.hideLoader();
                                    });
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "notitle": true,
                "items": [
                    {
                        "type":"fieldset",
                        "title":"PDC_DEMANDS",
                        "items":[
                            {   
                                "key": "pdcDemand.checkbox",
                                "type": "checkbox",
                                "title": "SELECT_ALL",
                                "schema":{
                                        "default": false
                                    },
                                    //
                                "onChange": function(modelValue, form, model){
                                    
                                    if (modelValue)
                                    {
                                    
                                    for ( i = 0; i < model.pdcDemand.demandList.length; i++)
                                        model.pdcDemand.demandList[i].check = true;  
                                    
                                    }
                                    else
                                    {
                                    
                                    for ( i = 0; i < model.pdcDemand.demandList.length; i++)
                                        model.pdcDemand.demandList[i].check = false;

                                    }
                                                            
                                }    

                            },
                            {
                                "type":"array",
                                "key":"pdcDemand.demandList",
                                "add": null,
                                "startEmpty": true,
                                "remove":null,
                                "title":"CHEQUE_DETAILS",
                                "titleExpr": "(model.pdcDemand.demandList[arrayIndex].check?'⚫ ':'⚪ ') + model.pdcDemand.demandList[arrayIndex].accountId + ' - ' + model.pdcDemand.demandList[arrayIndex].customerName",
                                "items":[
                                    {
                                        "key": "pdcDemand.demandList[].accountId",
                                        "title": "ACCOUNT_NUMBER",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdcDemand.demandList[].amount1",
                                        "title": "LOAN_AMOUNT",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdcDemand.demandList[].customerName",
                                        "title": "CUSTOMER_NAME",
                                        "readonly": true
                                    },
                                    {
                                        "key": "pdcDemand.demandList[].check",
                                        "title": "MARK_AS_PAID",
                                        "type": "checkbox",
                                        "schema":{
                                            "default": false
                                        }
                                    },

                                ]                                                                           
                            }
                        ]                        
                    },
                    {
                        "type": "actionbox",
                        "items": [
                            {
                                "type": "submit",
                                "title": "SUBMIT"
                            }
                        ]
                    }
                ]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                PageHelper.showLoader();
                PDC.bulkRepay(model.pdcDemand.demandList, function(response) {
                    PageHelper.hideLoader();
                    PageHelper.showProgress("page-init", "Done.", 2000);
                    model.flag = true;
                }, function(errorResponse) {
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
            }
        }
    };
}]);
