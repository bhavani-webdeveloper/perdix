/*
About ACHClearingCollection.js
------------------------------
1. To download the demand list with date criteria
2. To upload the demand list and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the Domand List based on date criteria and to call "ACH.getDemandList" service
onChange : To select/unselect all demands listed in array.
customHandle : To upload ACH files(Excel).

Services
--------
ACH.getDemandList : To get all the demands for the entered date. And all the branch ID's are 
                    parsed so as to get all the demands for the corresponding date.
ACH.achDemandListUpload : To upload the selected file.
ACH.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHClearingCollection"),
["$log", "SessionStore","Enrollment",'Utils','ACH', 'AuthTokenHelper', 'PageHelper',
function($log, SessionStore, Enrollment, Utils,ACH,AuthTokenHelper,PageHelper) {

    return {
        "type": "schema-form",
        "title": "ACH_COLLECTIONS",
        "subTitle": Utils.getCurrentDate(),

        initialize: function (model, form, formCtrl) {
            model.authToken = AuthTokenHelper.getAuthData().access_token;
            model.userLogin = SessionStore.getLoginname();
            model.achCollections = model.achCollections || {};
            model.flag = false;
            model.achDemand = model.achDemand || {};
            model.achDemand.demandList = model.achDemand.demandList ||[];
        },
        
        form: [
            {
                "type":"box",
                "title":"ACH_SUBMISSION_AND_STATUS_UPDATE",
                "items":[
                    {
                        "type":"fieldset",
                        "title":"SUBMIT_TO_BANK",
                        "items":[
                            {
                                "key":"achCollections.demandDate",
                                "title": "INSTALLMENT_DATE",
                                "type":"date"
                            },
                            {
                                "title":"DOWNLOAD",
                                "htmlClass":"btn-block",
                                "icon":"fa fa-download",
                                "type":"button",
                                "notitle":true,
                                "readonly":false,
                                "onClick": function(model, formCtrl, form, $event){
                                    //window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_demands&date="+model.achCollections.demandDate);
                                    window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_demands");    
                                    PageHelper.showLoader();
                                    ACH.getDemandList(
                                        {
                                            demandDate: model.achCollections.demandDate,
                                            branchId: [1,2,3,4,6,7,8,9,11]
                                        }
                                    ).$promise.then(function(res) {
                                        PageHelper.hideLoader();
                                        model.achSearch = res;
                                       
                                        if (model.achSearch.body.length > 0){
                                            model.flag = true;
                                        } else {
                                            model.flag = false;
                                        }
                                       
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
                    },
                    {
                        "type":"fieldset",
                        "title":"UPLOAD_STATUS",
                        "items":[
                            {
                                    "key": "ach.achDemandListFileId",
                                    "notitle":true,
                                    "type": "file",
                                    "category":"ACH",
                                    "subCategory":"cat2",
                                    "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    customHandle: function(file, progress, modelValue, form, model) {
                                        ACH.achDemandListUpload(file, progress);
                                    }
                            }
                            // ,
                            // {
                            // "type": "button",
                            // "icon": "fa fa-user-plus",
                            // "title": "UPLOAD",
                            // "onClick": "actions.proceed(model, formCtrl, form, $event)"
                            // }
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
                                "condition": "model.flag",
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
                                "condition": "model.flag",
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
                        "condition": "model.flag",
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
                    model.achDemand.demandList = [];
                    model.flag = true;
                }, function(errorResponse) {
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
            }
        }
    };
}]);
