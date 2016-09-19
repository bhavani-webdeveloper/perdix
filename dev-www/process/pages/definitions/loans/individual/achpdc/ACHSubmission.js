/*
ACHSubmission.js
----------------
To download the demand list with date criteria and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To call "ACH.getDemandList" service
onChange : To select/unselect all demands listed in array.

Services
--------
ACH.getDemandList : To get all the demands for the entered date. And all the branch ID's are 
                    parsed so as to get all the demands for the corresponding date.
ACH.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHSubmission"),
["$log", "ACH", "PageHelper", "SessionStore","$state", "Enrollment", 'formHelper', "$stateParams", 
function($log, ACH, PageHelper, SessionStore,$state,Enrollment,formHelper,$stateParams){

    return {
        "type": "schema-form",
        "title": "ACH_SUBMISSION",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            model.achDemand = model.achDemand || {};
            model.achDemand.demandList = model.achDemand.demandList ||[];
            // model.achDemand.demandList = [{
            //     accountId: "10010101",
            //     amount1: "100",
            //     customerName: "aaa",
            //     check: false
            // },
            // {
            //     accountId: "10010102",
            //     amount1: "100",
            //     customerName: "bbb",
            //     check: true
            // }];
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
                                    PageHelper.clearErrors();
                                    PageHelper.showLoader();
                                    ACH.getDemandList(model.achDemand.search).$promise.then(function(res) {
                                        PageHelper.hideLoader();
                                        model.achSearch = res;

                                        for (var i = 0; i < model.achSearch.body.length; i++) {
                                            model.achSearch.body[i].repaymentType = "ACH";
                                            model.achSearch.body[i].amount = parseInt(model.achSearch.body[i].amount1);
                                            model.achDemand.demandList.push(model.achSearch.body[i]);
                                        }
                                        
                                        },
                                        function(httpRes) {
                                            PageHelper.hideLoader();
                                            PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                            PageHelper.showErrors(httpRes);
                                            $log.info("ACH Search Response : " + httpRes);
                                        }
                                    );
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
                                "titleExpr": "(model.achDemand.demandList[arrayIndex].check?'⚫ ':'⚪ ') + model.achDemand.demandList[arrayIndex].accountId + ' - ' + model.achDemand.demandList[arrayIndex].amount1",
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
                PageHelper.clearErrors();
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
