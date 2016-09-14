irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHMandateDownload"),
["$log", "Enrollment", "ACH", "SessionStore","$state", "$stateParams", "AuthTokenHelper",
function($log, Enrollment, ACH, SessionStore,$state,$stateParams, AuthTokenHelper){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ACH_MANDATE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("ACH Mandate Download Page got initialized");
            model.authToken = AuthTokenHelper.getAuthData().access_token;
            model.userLogin = SessionStore.getLoginname();
             // model.achMandate = model.ach||{};
             // //model.mandate = model.mandate || {};
             // if (model._achMandate.accountId) {
             //    model.mandateId = model._achMandate.accountId;
             //    model.achMandate = model._achMandate;
             // }
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
                "type": "box",
                "title": "ACH_MANDATE_DOWNLOAD" ,
                "colClass":"col-sm-6",
                "items": [{
                            "type":"fieldset",
                            "title":"DOWNLOAD_STATUS",
                            "items":[{
                            "title": "DOWNLOAD",
                            "key":"ach.achMandateDownload",
                            "htmlClass": "btn-block",
                            "icon": "fa fa-download",
                            "type": "button",
                            "readonly": false,
                            "onClick": function(model, formCtrl, form, event){
                                
                                    //model.mandate.link= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id=1";
                                    //model.mandate= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id="+model.mandateId;

                                    //$log.info(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_registration_mandate");
                                    //console.log(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_registration_mandate");
                                    window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_registration_mandate");
                                    // console.log(formCtrl);
                                    // console.log(form);
                                    // console.log(event);
                                }
                            }]
                        },
                        {
                            "type":"fieldset",
                            "title":"UPLOAD_STATUS",
                            "items":[{
                                "key": "ach.achMandateReverseFileId",
                                "notitle":true,
                                "category":"ACH",
                                "subCategory":"cat2",
                                "type": "file",
                                "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                customHandle: function(file, progress, modelValue, form, model) {
                                    ACH.achMandateUpload(file, progress);
                                }
                            }
                            //,
                            // {
                            //     "type": "button",
                            //     "icon": "fa fa-user-plus",
                            //     "title": "UPLOAD",
                            //     "onClick": "actions.proceed(model, formCtrl, form, $event)"
                            // }
                            ]
                }]
            }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.achpdc.ACHMandateUpload',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);