/*
PDCSubmission.js
----------------
To download the demand list with date criteria and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To call "PDC.getDemandList" service
onChange : To select/unselect all demands listed in array.

Services
--------
PDC.getDemandList : To get all the demands for the entered date. And all the branch ID's are 
                    parsed so as to get all the demands for the corresponding date.
PDC.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCSubmission"),
["$log", "PDC", "PageHelper", "SessionStore","$state", "Enrollment", 'formHelper', "$stateParams", 
function($log, PDC, PageHelper, SessionStore,$state,Enrollment,formHelper,$stateParams){

    return {
        "type": "schema-form",
        "title": "PDC_SUBMISSION",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            model.pdcDemand = model.pdcDemand || {};
            model.pdcDemand.demandList = model.pdcDemand.demandList ||[];
            // model.pdcDemand.demandList = [{
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
                        "title":"SEARCH_PDC_DEMANDS",
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
                                    PDC.getDemandList(model.pdcDemand.search).$promise.then(function(res) {
                                        PageHelper.hideLoader();
                                        model.pdcSearch = res;

                                        for (var i = 0; i < model.pdcSearch.body.length; i++) {
                                                model.pdcDemand.demandList.push(model.pdcSearch.body[i]);
                                        }
                                        
                                        },
                                        function(httpRes) {
                                            PageHelper.hideLoader();
                                            PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                            PageHelper.showErrors(httpRes);
                                            $log.info("PDC Search Response : " + httpRes);
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
                        "title":"PDC_DEMANDS",
                        "items":[
                            {   
                                "key": "pdcDemand.checkbox",
                                "type": "checkbox",
                                "title": "SELECT_ALL",
                                "schema":{
                                        "default": false
                                    },
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
