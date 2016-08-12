irf.pageCollection.factory(irf.page("PendingDocumentVerification"),
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

    

    return {
        "id": "PendingDocumentVerification",
        "type": "schema-form",
        "name": "PendingDocumentVerification",
        "title": "Pending Document Verification | Ravi S | Key Metals Pvt. Ltd.",
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
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[

                                                    {
                                                        "title":"View",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        "type":"button",
                                                        "readonly":false

                                                    },
                                                
                                                    {
                                                        "title":"Approve",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-thumbs-o-up",
                                                        "type":"button",
                                                        "readonly":false

                                                    },
                                                   
                                                    {
                                                        "title":"Reject",
                                                        // "condition": "model.document[arrayIndex].",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-thumbs-o-down",
                                                        "type":"button",
                                                        "readonly":false

                                                    },

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
