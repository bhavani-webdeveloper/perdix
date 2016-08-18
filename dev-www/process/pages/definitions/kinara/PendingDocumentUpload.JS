irf.pageCollection.factory(irf.page("PendingDocumentUpload"),
["$log", "Enrollment", "SessionStore", "$state", function($log, Enrollment, SessionStore, $state){

    

    return {
        "id": "PendingDocumentUpload",
        "type": "schema-form",
        "name": "PendingDocumentUpload",
        "title": "Document Execution | Ravi S | Key Metals Pvt. Ltd.",
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
            model.loanDocs[4].status = "Rejected";
            model.loanDocs[4].rejectReason = "Overwriting on Cheque";
        },
        
        form: [

                {
                    "type":"box",
                    "title":"Pick Documents to Generate & Upload",
                    "htmlClass": "text-danger",
                    "items":[
                        {
                            "titleExpr":"model.loanDocs[arrayIndex].title + (model.loanDocs[arrayIndex].status?(' - ' + (model.loanDocs[arrayIndex].status|translate)):'')",
                            "type":"array",
                            "key":"loanDocs",
                            "add":null,
                            "remove":null,
                            "items":[
                                {
                                    "title":"Download",
                                    "htmlClass":"btn-block",
                                    "icon":"fa fa-download",
                                    "type":"button",
                                    "readonly":false

                                },
                                {
                                    title:"Upload",
                                    key:"loanDocs[].fileid",
                                    type:"file",
                                    fileType:"*/*",
                                    category: "Loan",
                                    subCategory: "DOC1"
                                },
                                {
                                    title:"Reject Reason",
                                    key:"loanDocs[].rejectReason",
                                    condition:"model.loanDocs[arrayIndex].rejectReason",
                                    readonly:true
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
                $log.info("Redirecting");
                $state.go('Page.Engine', {pageName: 'PendingDocumentVerification', pageId: ''});
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
