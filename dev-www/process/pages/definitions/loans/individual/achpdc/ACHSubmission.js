irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHSubmission"),
["$log", "ACH", "PageHelper", "SessionStore","$state", "Enrollment", 'formHelper', "$stateParams", 
function($log, ACH, PageHelper, SessionStore,$state,Enrollment,formHelper,$stateParams){
/*
The ACHSubmission.js is to download the ACH  Demandlist for the given date and to update the status of them.
*/
    return {
        "type": "schema-form",
        "title": "ACH_SUBMISSION",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            model.achDemand = model.achDemand || {};

            model.achDemand.demandList = [{
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
                        "title":"SEARCH_ACH_DEMANDS",
                        "items":[
                            {
                                "key": "achDemand.search.demandDate",
                                "title": "DEMAND_DATE",
                                "type": "date"

                            },
                            {
                                "key": "achDemand.search.branchId",
                                "title": "BRANCH_CODE",
                                "type": "select",
                                "enumCode": "branch_id",
                            },
                            {
                                "title":"SEARCH",
                                "type":"button",
                                "onClick": function(model, formCtrl, form, $event){
                                    PageHelper.showLoader();
                                    ACH.getDemandList(model.achDemand.search).$promise.then(function(response) {
                                        PageHelper.showProgress("page-init", "Done.", 2000);
                                       // model.achDemand.demandList = response;
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
                        "title":"UPDATE_ACH_DEMANDS",
                        "items":[
                            {   
                                "key": "achDemand.checkbox",
                                "type": "checkbox",
                                "title": "SELECT_ALL",
                                "schema":{
                                        "default": false
                                    },
                                    //
                                "onChange": function(modelValue, form, model){

                                    if (modelValue)
                                    {
                                        for ( i = 0; i < model.achDemand.demandList.length; i++)
                                            model.achDemand.demandList[i].check = true;  
                                    }
                                    else
                                    {
                                        for ( i = 0; i < model.achDemand.demandList.length; i++)
                                            model.achDemand.demandList[i].check = false;
                                    }
                                                            
                                }    

                            },
                            {
                                "type":"array",
                                "key":"achDemand.demandList",
                                "add": null,
                                "startEmpty": true,
                                "remove":null,
                                "title":"CHEQUE_DETAILS",
                                "titleExpr": "(model.achDemand.demandList[arrayIndex].check?'⚫ ':'⚪ ') + model.achDemand.demandList[arrayIndex].accountId + ' - ' + model.achDemand.demandList[arrayIndex].customerName",
                                "items":[
                                    {
                                        "key": "achDemand.demandList[].accountId",
                                        "title": "ACCOUNT_NUMBER",
                                        "readonly": true
                                    },
                                    {
                                        "key": "achDemand.demandList[].amount1",
                                        "title": "LOAN_AMOUNT",
                                        "readonly": true
                                    },
                                    {
                                        "key": "achDemand.demandList[].customerName",
                                        "title": "CUSTOMER_NAME",
                                        "readonly": true
                                    },
                                    {
                                        "key": "achDemand.demandList[].check",
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
                ACH.bulkRepay(model.achDemand.demandList, function(response) {
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
