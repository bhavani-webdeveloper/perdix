/*
About PDCClearingCollection.js
------------------------------
1. To download the demand list with date criteria
2. To upload the demand list and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the Domand List based on date criteria and to call "PDC.getDemandList" service
onChange : To select/unselect all demands listed in array.
customHandle : To upload PDC files(Excel).

Services
--------
PDC.getDemandList : To get all the demands for the entered date. And all the branch ID's are 
                    parsed so as to get all the demands for the corresponding date.
PDC.pdcDemandListUpload : To upload the selected file.
PDC.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCCollections"),
["$log", "Enrollment", "SessionStore",'Utils', 'PDC', 'AuthTokenHelper', 'PageHelper',
 function($log, Enrollment, SessionStore,Utils,PDC,AuthTokenHelper,PageHelper){

    return {
        "type": "schema-form",
        "title": "PDC_COLLECTIONS",
        "subTitle": Utils.getCurrentDate(),

        initialize: function (model, form, formCtrl) {
            model.authToken = AuthTokenHelper.getAuthData().access_token;
            model.userLogin = SessionStore.getLoginname();
            model.pdcCollections = model.pdcCollections || {};
            model.flag = false;
            model.pdcDemand = model.pdcDemand || {};
            model.pdcDemand.demandList = model.pdcDemand.demandList ||[];
        },
        
        form: [
            {
                "type":"box",
                "title":"PDC_SUBMISSION_AND_STATUS_UPDATE",
                "items":[
                    {
                        "type":"fieldset",
                        "title":"SUBMIT_TO_BANK",
                        "items":[
                            {
                                "key":"pdcCollections.demandDate",
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
                                    //window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=pdc_demands&date="+model.pdcCollections.demandDate);
                                    window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=pdc_demands");
                                    PageHelper.clearErrors();
                                    PageHelper.showLoader();
                                    PDC.getDemandList(
                                        {
                                            demandDate: model.pdcCollections.demandDate,
                                            branchId: [1,2,3,4,6,7,8,9,11]
                                        }
                                    ).$promise.then(function(res) {
                                        PageHelper.hideLoader();
                                        model.pdcSearch = res;

                                        if (model.pdcSearch.body.length > 0){
                                            model.flag = true;
                                        } else {
                                            model.flag = false;
                                        }

                                        for (var i = 0; i < model.pdcSearch.body.length; i++) {
                                            model.pdcSearch.body[i].repaymentType = "ACH";
                                            model.pdcSearch.body[i].amount = parseInt(model.pdcSearch.body[i].amount1);
                                            model.achDemand.demandList.push(model.pdcSearch.body[i]);
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
                    },
                    {
                        "type":"fieldset",
                        "title":"UPLOAD_STATUS",
                        "items":[
                            {
                                "key": "pdc.pdcReverseFeedListFileId",
                                "notitle":true,
                                "category":"ACH",
                                "subCategory":"cat2",
                                "type": "file",
                                "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                customHandle: function(file, progress, modelValue, form, model) {
                                    PDC.pdcReverseFeedListUpload(file, progress);
                                }
                            }
                            // ,
                            // {
                            //     "type": "button",
                            //     "icon": "fa fa-user-plus",
                            //     "title": "UPLOAD",
                            //     "onClick": "actions.proceed(model, formCtrl, form, $event)"
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
                        "title":"UPDATE_PDC_DEMANDS",
                        "items":[
                            {   
                                "key": "pdcDemand.checkbox",
                                "condition": "model.flag",
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
                                "condition": "model.flag",
                                "add": null,
                                "startEmpty": true,
                                "remove":null,
                                "title":"CHEQUE_DETAILS",
                                "titleExpr": "(model.pdcDemand.demandList[arrayIndex].check?'⚫ ':'⚪ ') + model.pdcDemand.demandList[arrayIndex].accountId + ' - ' + model.pdcDemand.demandList[arrayIndex].amount1",
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
                PageHelper.clearErrors();
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
