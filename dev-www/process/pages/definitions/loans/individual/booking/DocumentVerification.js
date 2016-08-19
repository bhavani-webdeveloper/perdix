irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentVerification"),
["$log", "Enrollment", "SessionStore", "$state", function($log, Enrollment, SessionStore, $state){

    return {
        "type": "schema-form",
        "title": "DOCUMENT_VERIFICATION",
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
            model.loanDocs[4].status = "Rejected";
            model.loanDocs[4].rejectReason = "Overwriting on Cheque";
        },
        
        form: [

                {
                    "type":"box",
                    "colClass": "col-sm-12",
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
                                        "htmlClass": "col-sm-2",
                                        "items": [{
                                            "title":"REJECTION_REASON",
                                            "notitle": true,
                                            "type": "select",
                                            "key": "loanDocs[].rejectReason"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title":"REMARKS",
                                            "key": "loanDocs[].rejectReason"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title":"ACTION",
                                            "notitle": true,
                                            "htmlClass":"btn-block",
                                            "type":"radios",
                                            "readonly":false,
                                            "titleMap": {
                                                    "1": "Approve",
                                                    "2": "Reject"
                                                },
                                            "key": "loanDocs[].docStatus"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-1",
                                        "items": [{
                                            "title":"View",
                                            "htmlClass":"btn-block",
                                            "icon":"fa fa-download",
                                            "type":"button",
                                            "readonly":false
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
