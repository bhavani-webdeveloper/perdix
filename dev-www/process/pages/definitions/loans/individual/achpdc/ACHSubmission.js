irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHSubmission"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){
/*
The ACHSubmission.js is to download the ACH Mandates that are created on the current date. Onc created, the Mandate details
are updated into the excel. This screen helps in viewing all the ACH Mandates registered on the current date.
This excel document can be downloaded here.
*/
    return {
        "type": "schema-form",
        "title": "ACH_SUBMISSION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            model.mandate = model.mandate || {};
            model.mandate.id = 1;
        },
        form:[{
                "type":"box",
                "title":"Download ACH Mandate pending for submission",
                "htmlClass": "text-danger",
                "items":[{
                        "type":"fieldset",
                        "title":"Download ACH Mandate Registrations",
                        "items":[{
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
