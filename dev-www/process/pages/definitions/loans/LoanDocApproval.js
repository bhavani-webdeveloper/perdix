irf.pageCollection.factory(irf.page("LoanDocApproval"),
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

 
    return {
        "id": "LoanDocApproval",
        "type": "schema-form",
        "name": "LoanDocApproval",
        "title": "Loan Document Approval",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            model.accountNumber=4783893457;
            model.custName="VimalKumar";
            model.appDate="06-07-2016";
            
            var docsTitles = [
                "Legal schedules",
                "Loan Application",
                "Other Supporting Documents",
                "Legal Aggrements",
                "PHS",
                "Loan Saction Document",
                "ACH/PDC"

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
                    "title":"Loan Details",
                    "items":[
                                    {
                                        "title":"Account Number",
                                        "key":"accountNumber",
                                        "type":"number",
                                        "readonly":true
                                    },
                                    {
                                        "title":"Customer Name",
                                        "key":"custName",
                                        "type":"String",
                                        "readonly":true
                                    },
                                    {
                                        "title":"Application Date",
                                        "key":"appDate",
                                        "type":"String",
                                        "readonly":true
                                    },
                                    {
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[

                                                    {
                                                        "title":"Download Document",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        "key":"loanDocs[].title",
                                                        "type":"button",
                                                        "readonly":false

                                                    },
                                                
                                                   
                                                    {
                                                        "type":"actionbox",
                                                        "items":[
                                                                    {
                                                                        "type":"button",
                                                                        "title":"Approve",
                                                                        "htmlClass":"form-inline",
                                                                        "icon":"fa fa-check",
                                                                        "onClick":"actions.approve(model,form)"
                                                                    },
                                                                    {
                                                                        "type":"button",
                                                                        "title":"Reject",
                                                                        "htmlClass":"form-inline",
                                                                        "icon":"fa fa-times",
                                                                        "onClick":"actions.reject(model,form)"
                                                                    }
                                                                ]
                                                    },

                                                    {
                                                        "title": "Rejection Reason",
                                                        "type": "select",
                                                        "titleMap":{
                                                                    "1":"Customer Signature Missing",
                                                                    "2":"Schedule Not Upload",
                                                                    "3":"Others"
                                                                    }
                                                    },

                                                    {
                                                        "title":"Remarks",
                                                        "readonly":false

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
