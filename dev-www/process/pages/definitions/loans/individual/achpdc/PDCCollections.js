irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCCollections"),
["$log", "Enrollment", "SessionStore",'Utils', 'PDC', 'AuthTokenHelper',
 function($log, Enrollment, SessionStore,Utils,PDC,AuthTokenHelper){
/*
PDCCollections.js does the following
1. To download the demand due list with date criteria
2. To upload the status of the demands as received from Bank
*/
    return {
        "type": "schema-form",
        "title": "PDC_COLLECTIONS",
        "subTitle": Utils.getCurrentDate(),

        initialize: function (model, form, formCtrl) {
            model.authToken = AuthTokenHelper.getAuthData().access_token;
            model.userLogin = SessionStore.getLoginname();
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
                                                //window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=pdc_demands&date="+pdcCollections.demandDate);
                                                window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=pdc_demands");
                                            }
                                //"onClick": "actions.downloadForm(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "title":"UPLOAD_STATUS",
                        "items":[
                            {
                                "key": "ach.pdcReverseFeedListFileId",
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
            }
        ],

        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        
        actions: {
            submit: function(model, form, formName){
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);
