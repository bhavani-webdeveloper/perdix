irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHSubmission"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "ACHSubmission",
        "type": "schema-form",
        "name": "ACHSubmission",
        "title": "ACH SUBMISSION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            model.mandate = model.mandate || {};
            model.mandate.id = 1;
        },
        form:[{
                "type":"box",
                "title":"ACH Submission and Status Update",
                "htmlClass": "text-danger",
                "items":[{
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
                            },
                            {
                            "type":"fieldset",
                            "title":"Upload Status",
                            "items":[{
                                    "key": "image1",
                                    "type": "file",
                                    "category":"ACH",
                                    "subCategory":"DOC1",
                                    "title": "Upload ACH Status"
                                },
                                {
                                    "title":"Upload",
                                    "htmlClass":"btn-block",
                                    "icon":"fa fa-upload",
                                    "type":"button",
                                    "notitle":true,
                                    "type": "file",
                                    "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    "readonly":false
                                }]
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
            },
            proceed: function(model, formCtrl, form, $event) {
            },
            downloadForm: function(model, formCtrl, form, $event){
                model.mandate.link= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id="+model.mandate.id;
                window.open(model.mandate.link);
                                
            }
        }
    };
}]);
