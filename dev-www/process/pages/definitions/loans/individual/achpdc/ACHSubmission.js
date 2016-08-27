irf.pageCollection.factory(irf.page("ACHSubmission"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "ACHSubmission",
        "type": "schema-form",
        "name": "ACHSubmission",
        "title": "ACH SUBMISSION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
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
                                    "readonly":false
                                }]
                            },
                            {
                            "type":"fieldset",
                            "title":"Upload Status",
                            "items":[{
                                    "key": "image1",
                                    "type": "file",
                                    "category":"cat1",
                                    "subCategory":"cat2",
                                    "title": "Upload ACH Status"
                                },
                                {
                                    "title":"Upload",
                                    "htmlClass":"btn-block",
                                    "icon":"fa fa-upload",
                                    "type":"button",
                                    "notitle":true,
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
            }
        }
    };
}]);
