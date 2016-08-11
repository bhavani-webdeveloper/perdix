irf.pageCollection.factory(irf.page("disbursementBankDetails"),
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

    var branch = SessionStore.getBranch();

    return {
        "id": "disbursementBankDetails",
        "type": "schema-form",
        "name": "disbursementBankDetails",
        "title": "Disbursement Bank Information",
        "subTitle": " ",
        initialize: function (model, form, formCtrl) {
            $log.info("Disbursement Bank Details");
            model.accno=2536253426;
            model.custName="Sachin";
        },
        offline: true,
        
        form: [
                {
                "type":"box",
                "title":"",
                items:[
                       
                        {
                            type:"text",
                            key:"custName",
                            title:"Customer Name",
                            readonly:true
                        },
                        {
                            type:"text",
                            key:"accno",
                            title:"Account Number",
                            readonly:true
                        },
                        {
                            type:"select",
                            key:"bankName",
                            title:"Bank Name",
                            titleMap:[
                                {
                                    name:"ICICI",
                                    Value:"1"
                                }
                            ]

                        },
                        {
                            type:"text",
                            key:"branchName",
                            title:"Branch Name"
                        },
                        {
                            type:"text",
                            key:"custAccNo",
                            title:"Bank Account Number"
                        },
                        {
                            type:"select",
                            key:"status",
                            title:"Status",
                            titleMap:[
                                {
                                    name:"Sent to bank",
                                    Value:"1"
                                }
                            ]
                        }

                    ]

                },
                {
                    type:"actionbox",
                    items:[
                            {
                                type:"submit",
                                title:"Submit"
                            }
                        ]
                }

        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            }
        }
    };
}]);
