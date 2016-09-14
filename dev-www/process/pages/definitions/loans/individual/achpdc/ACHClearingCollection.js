irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHClearingCollection"),
["$log", "SessionStore","Enrollment",'Utils','ACH', 'AuthTokenHelper',
function($log, SessionStore, Enrollment, Utils,ACH,AuthTokenHelper) {
/*
ACHClearingCollection.js does the following
1. To download the demand due list with date criteria
2. To upload the status of the demands as received from Bank
*/
    return {
        "type": "schema-form",
        "title": "ACH Collections",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            model.authToken = AuthTokenHelper.getAuthData().access_token;
            model.userLogin = SessionStore.getLoginname();
        },
        
        form: [{
            "type":"box",
            "title":"ACH Submission and Status Update",
            "items":[{
                    "type":"fieldset",
                    "title":"Submit to Bank",
                    "items":[{
                            "key":"achCollections.demandDate",
                            "title": "INSTALLMENT_DATE",
                            "type":"date"
                        },
                        {
                            "title":"Download",
                            "htmlClass":"btn-block",
                            "icon":"fa fa-download",
                            "type":"button",
                            "notitle":true,
                            "readonly":false,
                            "onClick": function(model, formCtrl, form, $event){
                                            
                                            //window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_demands&date="+achCollections.demandDate);
                                            window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_demands");
                                                
                                        }
                            //"onClick": "actions.downloadForm(model, formCtrl, form, $event)"
                        }]
                    },
                    {
                    "type":"fieldset",
                    "title":"Upload Status",
                    "items":[{
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
                    }]

                }],
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
