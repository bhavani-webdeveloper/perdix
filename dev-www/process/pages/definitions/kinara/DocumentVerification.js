irf.pageCollection.factory(irf.page("DocumentVerification"),
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

    

    return {
        "id": "DocumentVerification",
        "type": "schema-form",
        "name": "DocumentVerification",
        "title": "Document Verification | Ravi S | Key Metals Pvt. Ltd.",
        "subTitle": " Loan ID:8725678 | Hubli branch | Rs. 20,00,00",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "Loan Application",
                "Legal Agreements ",
                "Legal Schedule",
                "Loan sanction documents",
                "PDC/ACH",
                "PHS",
                "Supporting documents"

            ];

            for(var i=0;i<docsTitles.length;i++){


                model.loanDocs[i]= {
                    "title":docsTitles[i]
                }

            }
        },
        
        form: [
                {
                    "type":"box",
                    "title":"Documents",
                    "items":[
                                    {
                                        "key": "loan_type",
                                        "title": "Loan Type"
                                    },
                                    {
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[
                                                    {
                                                        "type": "section",
                                                        "htmlClass": "row",
                                                        "items":[{
                                                            "type": "section",
                                                            "htmlClass": "col-xs-4",
                                                            "items": [{
                                                                        "title":"View",
                                                                        "htmlClass":"btn-block",
                                                                        "icon":"fa fa-download",
                                                                        "type":"button",
                                                                        "readonly":false
                                                                    }]},
                                                                    {
                                                            "type": "section",
                                                            "htmlClass": "col-xs-8",
                                                            "items": [{
                                                                        "title": "",
                                                                        "type": "radios",
                                                                        "titleMap": {
                                                                                    "1": "Approve",
                                                                                    "2": "Reject"
                                                                                }
                                                                        
                                                                    }]}]},

                                                    {
                                                        "title": "Rejection Reason",
                                                        "type": "select"

                                                    },

                                                    {
                                                        "title": "Rejection Remarks",
                                                        
                                                    }


                                                   ]
                                    }
                            ]

                },
                {
                "type": "actionbox",
                "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
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
