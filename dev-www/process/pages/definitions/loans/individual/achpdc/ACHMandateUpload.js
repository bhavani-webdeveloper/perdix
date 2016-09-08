irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHMandateUpload"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ACH_REGISTRATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("ACH Mandate Upload Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
                "type": "box",
                "title": "ACH_MANDATE_UPLOAD" ,
                "colClass":"col-sm-6",
                "items": [{
                            "type":"fieldset",
                            "title":"Submit to Bank",
                            "items":[{
                                    "key":"demandDate",
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
                                                    model.mandate.link= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id="+model.mandate.id;
                                                    window.open(model.mandate.link);
                                                                    
                                                }
                                    //"onClick": "actions.downloadForm(model, formCtrl, form, $event)"
                                }]
                            },{
                            "title": "DOWNLOAD",
                            "key":"ach.achMandateDownload",
                            "htmlClass": "btn-block",
                            "icon": "fa fa-download",
                            "type": "button",
                            "readonly": false,
                            "onClick": function(model, formCtrl, form, event){
                                
                                //model.mandate.link= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id=1";
                                //model.mandate= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id="+model.mandateId;
                                window.open("http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id="+model.mandateId);
                                // console.log(model);
                                // console.log(formCtrl);
                                // console.log(form);
                                // console.log(event);
                            }
                        },
                        {
                            "key": "ach.achMandateReverseFileId",
                            "notitle":true,
                            "category":"ACH",
                            "subCategory":"cat2",
                            "type": "file",
                            "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        },
                        {
                            "type": "button",
                            "icon": "fa fa-user-plus",
                            "title": "UPLOAD",
                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
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
            },
            proceed: function(model, formCtrl, form, $event) {
            }
        }
    };
}]);