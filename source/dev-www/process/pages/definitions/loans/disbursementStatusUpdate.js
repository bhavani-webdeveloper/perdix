irf.pageCollection.factory(irf.page("disbursementStatusUpdate"),
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

    var branch = SessionStore.getBranch();

    return {
        "id": "disbursementStatusUpdate",
        "type": "schema-form",
        "name": "disbursementStatusUpdate",
        "title": "Disbursement Status Update",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Disbursement Status Update");
            model.accno=2536253426;
            model.custName="Sachin";
        },
        offline: true,
        
        form: [
                {
                "type":"box",
                
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
                                    name:"Disbursed",
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
