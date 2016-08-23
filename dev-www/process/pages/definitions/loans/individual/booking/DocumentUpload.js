irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentUpload"),
["$log", "Enrollment", "SessionStore", "$state", function($log, Enrollment, SessionStore, $state){

    return {
        "type": "schema-form",
        "title": "DOCUMENT_EXECUTION",
        "subTitle": " ",
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
            /*
            // Test reject remarks
            model.loanDocs[4].status = "Rejected";
            model.loanDocs[4].rejectReason = "Overwriting on Cheque";
            */
        },
        
        form: [

                {
                    "type":"box",
                    "colClass": "col-sm-12",
                    "title":"DOCUMENT_EXECUTION",
                    "htmlClass": "text-danger",
                    "items":[
                        {
                            "type":"array",
                            "notitle": true,
                            "view": "fixed",
                            "key":"loanDocs",
                            "add":null,
                            "remove":null,
                            "items":[
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "loanDocs[].title",
                                            "notitle":true,
                                            "title": " ",
                                            "readonly": true
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-4",
                                        "items": [{
                                            "title":"STATUS",
                                            "titleExpr": "model.loanDocs[arrayIndex].status",
                                            "key": "loanDocs[].rejectReason",
                                            "readonly": true
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "items": [{
                                            "title":"DOWNLOAD",
                                            "htmlClass":"btn-block",
                                            "icon":"fa fa-download",
                                            "type":"button",
                                            "readonly":false
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            title:"Upload",
                                            key:"loanDocs[].fileid",
                                            type:"file",
                                            fileType:"*/*",
                                            category: "Loan",
                                            subCategory: "DOC1",
                                            "notitle": true
                                        }]
                                    }]
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
                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: ''});
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
