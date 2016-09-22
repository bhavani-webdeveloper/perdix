irf.pageCollection.factory(irf.page("lead.LeadGeneration_Reassign"), ["$log", "$state","$stateParams" ,"Enrollment", "lead", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",


function($log, $state,$stateParams, Enrollment, lead, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Lead Assign",
            "subTitle": "Lead",
            initialize: function(model, form, formCtrl) {

                model.lead = model.lead || {};
                model.branchId = SessionStore.getBranchId() + '';

                model.lead.currentDate = model.lead.currentDate || Utils.getCurrentDate();
                model.lead.ActionTakenBy = model.lead.ActionTakenBy || SessionStore.getLoginname();

                model = Utils.removeNulls(model, true);
                model.lead.BranchName = SessionStore.getBranch();

                $log.info("create new lead generation page ");

            },

             modelPromise: function(pageId, _model) 
             {
                
                return $q.resolve({
                    lead: {
                        Name:"Ram",
                        id:1,
                        Applicant:
                        {MobileNumber1:9888888888},
                        
                        gender:"Male"


                    }
                });
             },

             offline: true,
             getOfflineDisplayItem: function(item, index)
            {
             return 
               [
                

                
                
               ]
            },




            

            form: 
            [
                  {
                    "type": "box",
                    readonly: true,

                    "title": "",
                    "items":
                   [
                        {
                            key: "lead.currentDate",
                            title: "CurrentDate",
                            type: "date",
                            readonly: true
                        },

                        {
                            key: "lead.BranchName",
                            title: "Branch Name",
                            readonly: true

                        },

                        {
                         key:"lead.Name",
                        title:"Lead Name"

                         },


                        {
                        key: "lead.id",
                        
                        title:"Lead Id",
                        readonly: true
                        },

                        

                        {key:"lead.Applicant.MobileNumber1",
                         title:"Mobile Number"
                        }

                          

                       
                    ]
                    },



                  

                                           {
                        type: "box",
                        
                        title: "Assign Lead",

                        items:
                         [


                         {
                                key: "lead.LoanOfficer",
                                type: "lov",
                                title: "LoanOfficer",
                                inputMap:
                                 {



                                    "HubName": {
                                        "key": "lead.branch_s",
                                        "title":"Branch Name"
                                        
                                    },
                                    "SpokeName": {
                                        "key": "lead.centre_s",
                                        "title":"Center"
                                        
                                    },

                                   
                                },
                                outputMap: {
                                    
                                    "LoanOfficer": "lead.LoanOfficer"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                               /*
                                    if (!inputModel.branchName)
                                        inputModel.branchName = SessionStore.getBranch();
                                    var promise = Enrollment.search({
                                        'branchName': inputModel.branchName,
                                        'firstName': inputModel.firstName,
                                        'centreCode': inputModel.centreCode,
                                        'customerType': 'Individual'
                                    }).$promise;

                                    */
                                    return $q.resolve({
                                   headers: {
                                             "x-total-count": 4
                                            },
                                    body: [{

                                          "LoanOfficer": "Stalin",
                                          
                                           },
                                           {
                                          "LoanOfficer": "Ravi",
                                          
                                           },
                                           {
                                          "LoanOfficer": "Raj",
                                          
                                           },
                                           {
                                           "LoanOfficer": "Ram",                                          
                                           },

                                           ]
                                           });


                                    
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        data.LoanOfficer,
                                    ];
                                }
                            },

                    

                       




                        ]
                        },










                    
                    








                    {
                    "type": "actionbox",

                    "items": 
                    [
                 
                    {
                            "type": "submit",
                            "title": "Assign"
                    },

                    ]
            },

            ],

            schema: 
            function() 
            {
                return lead.getLeadSchema().$promise;
            },

            actions: 
            {

               

                 submit: function(model, form, formName) 
                {
                     $log.info("Inside submit()");
                     irfProgressMessage.pop('Lead-ASSIGN','Lead is successfully assigned to LoanOfficer', 3000);
                     $log.warn(model);
                   


                }


            }

        };
 }
 ]);
