irf.pageCollection.factory(irf.page("audit.Issues"), ["$log","$stateParams", "$q","$state","SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",


    function($log,$stateParams,$q, $state, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Issues",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                this.form = [];
                model.audit = model.audit|| {};
                $log.info("Issues page ");
                var form = _.cloneDeep(this.formSource);
                form[0].readonly = $stateParams.pageId !== 'edit';
                if (!form[0].readonly) {
                    model.audit = {};
                }
                this.form = form;
            },

            modelPromise: function(pageId, _model) {
                return $q.resolve({
                    audit: {   
                    Branch:"akra",
                    CustomerName:"Ravi",
                    URN:"123654",
                    Product:"Loan",
                    AccountNumber:126589,
                    LoanApplicationDate:"3/8/16",
                    LoanAmount:"1,23,456",
                    Status:"Audited",
                    }
                });
            },

            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },
            form: [],
            formSource: [ {
                    type: "box",
                    title: "Sample",
                    items: [ {
                        key: "audit.Branch",
                        title: "Branch"
                    }, {
                        key: "audit.CustomerName",
                        title: "CustomerName"
                    }, {
                        key: "audit.URN",
                        title: "URN"
                    }, {
                        key: "audit.Product",
                        title: "Product"
                    }, {
                        "key": "audit.AccountNumber",
                        "title": "AccountNumber"
                     }, {
                        "key": "audit.LoanApplicationDate",
                        title: "LoanApplicationdate",
                        type: "date"
                    }, 
                    {
                        "key": "audit.LoanAmount",
                        title: "LoanAmount"
                    },
                     {
                        "key": "audit.Status",
                        title: "Status"
                    }
                     ]
                },

                {
                    type: "box",
                    title: "Issues",
                    items: [{
                         type: "help",
                         "title":"1",
                         helpvalue: "1.Does the CSR verify original identity proof and address proof during verification?"  
                    },
                    {
                        "key":"",
                        "title":"Answer",
                        "type":"select",
                         titleMap: {
                                        "Y": "Yes",
                                        "N": "No",
                                        "NA":"NA"
                                    }
                    },
                    {
                         type: "help",
                         "title":"2",
                         helpvalue: "2.Does the CSR ask the client to show loan repayment book(s)  of other companies?"  
                    },
                    {
                        "key":"",
                        "title":"Answer",
                        "type":"select",
                         titleMap: {
                                        "Y": "Yes",
                                        "N": "No",
                                        "NA":"NA"
                                    }
                    },
                    {
                         type: "help",
                         helpvalue: "3.Are the spelling of the name, mentioned in BIS, and unique ID of the customer matching with CB report?"  
                    },
                    {
                        "key":"",
                        "title":"No of Deviation",
                        
                    },
                    {
                        "key":"",
                        "title":"No of Customer (min 30)",
                        
                    }
                    ]
                },

                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }, ]
                },
            ],

            schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "customerMinAge" : 18,
            "customerMaxAge" : 60,
            "isMinimumFingerPrintRequired" : 1,
            "properties": {
            "audit": {
            "type": "object",
            "required":[  

             ],
            "properties": {
                "Bank": {
                    "type": "string"
                },
                "Branch":{
                    "type":"string"
                },
                "CustomerName":{
                    "type":"string"
                },
                 "URN":{
                    "type":"string"
                },
                 "Product":{
                    "type":"string"
                },
                 "AccountNumber":{
                    "type":"number"
                },
                 "LoanApplicationDate":{
                    "type":"string"
                },
                 "LoanAmount":{
                    "type":"string"
                },
                 "ApplicationStatus":{
                    "type":"string"
                },
                 "Status":{
                    "type":"string"
                },
            }
        }
    }
},

            actions: {
                preSave: function(model, form, formName) {
                    $log.info("Inside save()");
                    var deferred = $q.defer();
                    if (model.lead.Name) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('LeadGeneration-save', 'Applicant Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },

                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    irfProgressMessage.pop('LeadGeneration-save', 'Lead is successfully created', 3000);
                    $log.warn(model);
                }
            }
        };
    }
]);