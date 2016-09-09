irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCCollections"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){
/*
PDCCollections.js does the following
1. To download the demand due list with date criteria
2. To upload the status of the demands as received from Bank
*/
    return {
        "id": "PDCCollections",
        "type": "schema-form",z
        "name": "PDCCollections",
        "title": "PDC Collections",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {

        },
        
        form: [{
            "type":"box",
            "title":"PDC Submission and Status Update",
            "items":[{
                    "type":"fieldset",
                    "title":"Submit to Bank",
                    "items":[{
                            "key":"pdcCollections.demandDate",
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
                                            model.mandate.link= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id=1";
                                            window.open(model.mandate.link);
                                                            
                                        }
                            //"onClick": "actions.downloadForm(model, formCtrl, form, $event)"
                        }]
                    },
                    {
                    "type":"fieldset",
                    "title":"Upload Status",
                    "items":[{
                            "key": "pdcCollections.pdcMandateReverseFileId",
                            "notitle":true,
                            "category":"PDC",
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
