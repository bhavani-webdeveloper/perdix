define({
    pageUID: "loans.individual.screening.detail.EnterpriseFinancialView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q","irfProgressMessage","$stateParams","$state",
    "PageHelper", "Utils","PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe","$resource","$httpParamSerializer","BASE_URL","searchResource"],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,irfProgressMessage,$stateParams,$state,
     PageHelper, Utils,PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe,$resource,$httpParamSerializer,BASE_URL, searchResource){
        return {
            "type": "schema-form",
            "title": "ENTERPRISE_FINANCIAL_VIEW",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {

            },
        form:[
            {
                "type":"box",
                "overrideType": "default-view",
                "readonly":true,
                "title":"Invoice vs Cash",
                "colClass":"col-sm-12",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                              /*Table view for transpose view*/
                            },
                            {
                                /*Chart view*/
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "overrideType": "default-view",
                "readonly":true,
                "title":"Bank Vs NonBank",
                "colClass":"col-sm-12",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                              /*Table view for transpose view*/
                            },
                            {
                                /*Table view for transpose view*/
                            },
                            {
                                /*Chart View*/
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "overrideType": "default-view",
                "title":"Buyer Summary",
                "colClass":"col-sm-12",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                                "type":"grid",
                                "orientation":"horizontal",
                                "items":[
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[

                                    {
                            
                                        "type": "tableview",
                                        "key": "",
                                        "title": "",
                                        "selectable": false,
                                        "editable": false,
                                            "tableConfig": {
                                            "searching": false,
                                            "paginate": false,
                                            "pageLength": 10,
                                            },
                                        getColumns: function() {
                                            return [
                                                {
                                                    "title": "Buyer",
                                                    "data": ""
                                                },
                                                {
                                                    "title": "Amount",
                                                    "data": ""
                                                },
                                                {
                                                    "title": "Percentage of total",
                                                    "data": ""
                                                }
                                            ];
                                        },
                                        getActions: function() {
                                            return [];
                                        }
                                    }

                                        ]

                                    },{
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                        /*chart view*/
                                    }
                                        ]
                                    }
                                ]
                            },
                            {
                                /*Table view for transpose view*/
                            },
                            {
                                /*Chart view*/
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "overrideType": "default-view",
                "colClass": "col-sm-12",
                "title":"BANK_ACCOUNT_DETAILS",
                "items":[
                    {
                        "type":"grid",
                        "orientation":"vertical",
                        "items":[
                            {
                                "type":"grid",
                                "orientation":"horizontal",
                                "items":[
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"avg_deposit",
                                                "title":"Average Monthly Deposit"
                                            },
                                            {
                                                "key":"avg_withdrawls",
                                                "title":"Average Monthly Withdrawls"
                                            },
                                            {
                                                "key":"",
                                                "title":"Average Monthly Balance on requested EMI Date"
                                            }
                                        ]
                                    },
                                    {
                                        "type":"grid",
                                        "orientation":"vertical",
                                        "items":[
                                            {
                                                "key":"tot_accounts",
                                                "title":"Total no of Account"
                                            },
                                            {
                                                "key":"tot_checque_bounce",
                                                "title":"Total no of Cheque Bounce"
                                            },
                                            {
                                                "key":"tot_EMI_bounce",
                                                "title":"Total no EMI Bounce"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                            
                                "type": "tableview",
                                "key": "customer.customerBankAccounts",
                                "title": "",
                                "selectable": false,
                                "editable": false,
                                "tableConfig": {
                                    "searching": false,
                                    "paginate": false,
                                    "pageLength": 10,
                                },
                                getColumns: function() {
                                    return [
                                        {
                                            "title": "Bank Name",
                                            "data": "customerBankName"
                                        },
                                        {
                                            "title": "IFSC Code",
                                            "data": "ifscCode"
                                        },
                                        {
                                            "title": "Account Name",
                                            "data": "customerNameAsInBank"
                                        },
                                        {
                                            "title": "Account Number",
                                            "data": "accountNumber"
                                        },
                                        {
                                            "title": "Account Type",
                                            "data": "accountType"
                                        },
                                        {
                                            "title": "Limit",
                                            "data": "limit"
                                        }/*,{
                                                        "title":"Bank Statement"
                                                    "type": "file",
                                                    "fileType": "application/pdf"
                                }*/];
                                },
                                getActions: function() {
                                            return [];
                                }
                            },
                            {
                                /*table view */
                            },
                            {
                                /*chart view*/
                            }
                        ]
                    }
                ]
            }            
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;     
        },
        actions: {}
    }
}
})