irf.pageCollection.factory(irf.page("lead.LeadGeneration"), ["$log", "$state", "Enrollment", "lead", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",


function($log, $state, Enrollment, lead, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Lead Generation",
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
                    "title": "Lead Profile",
                    "items": 
                    [


                     {
                            key: "lead.BranchName",
                            title: "Branch Name",
                            readonly: true

                        },

                        {
                            key: "lead.Sender",
                            title: "Center",
                            "enumCode": "centre",
                            type: "select",
                           

                        },

                        {
                        key: "lead.id",
                        condition: "model.lead.id",
                        title:"Lead Id",
                        readonly: true
                        },

                        {
                        key: "lead.urnNo",
                        condition: "model.lead.urnNo",
                        title:"URN NO",
                        readonly: true
                       },

                           {
                            type: "fieldset",
                            title: "Lead Details",
                            items:
                             [


                                    {
                                    key:"lead.Name",
                                    title:"Lead Name"

                                    },
                                   
                                   {
                                    key: "lead.Applicant.Entitytype",
                                    type: "select",
                                    title:"EntityType",
                                    titleMap: 
                                    {
                                        "Individual": "Individual",
                                        "Enterprise": "Enterprise"
                                    }

                                    },
                                    

                                    {
                            type: "fieldset",
                            title: "Enterprise Details",
                            condition: "model.lead.Applicant.Entitytype === 'Enterprise'",

                            items: 
                            [
                                {
                                    key: "lead.Business.BusinessName",
                                    title:"Business Name"

                                },
                                {
                                    key: "lead.Business.BusinessType",
                                    title:"Business Type"

                                },
                                {
                                    key: "lead.Business.BusinessActivity",
                                    title:"Business Activity"

                                },
                                {
                                    key: "lead.Business.CompanyOperatingSince",
                                    type: "date"
                                },

                                
                                {
                                    key: "lead.Business.ownership",
                                    title: "Ownership",
                                    type: "select",
                                    enumCode: "ownership"
                                },

                                {
                                     key: "lead.Business.companyRegistered",
                                     type: "radios",
                                     titleMap: {
                                                "YES": "Yes",
                                                 "NO": "No"
                                                },
                                     title: "Is Registered"
                                }

                            ]

                            },

                            {
                            type: "fieldset",
                            title: "Individual Details",
                            condition: "model.lead.Applicant.Entitytype === 'Individual'",

                            items: 
                            [
                            {
                                key:"lead.gender",
                                title:"Gender",
                                type:"radios"
                            },
                            {
                               key:"lead.age",
                               title: "Age",
                               type:"number",
                               "onChange": function(modelValue, form, model) {
                               if (model.lead.age > 0)
                                {
                               if (model.lead.dateOfBirth) 
                               {
                                model.lead.dateOfBirth = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                } 
                                else
                                {
                                model.lead.dateOfBirth = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                }
                                }
                                }
                            },

                            {
                                key:"lead.dateOfBirth",
                                title:"DateOfBirth",
                                type:"date",
                                "onChange": function(modelValue, form, model)
                                {
                                if (model.lead.dateOfBirth)
                                {
                                model.lead.age = moment().diff(moment(model.lead.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                                }
                            },
                
            
                            {
                               key:"lead.maritalStatus",
                               title:"Marital Status",
                               type:"select"
                            },

                            {
                            key:"lead.educationStatus",
                            type:"select",
                            title: "Education Status"
                            },

                            {
                            key:"lead.incomes",
                            type:"array",
                            startEmpty: true,
                            items:
                            [
                                {
                                    key: "lead.incomes[].incomeSource",
                                    type:"select",
                                     titleMap: 
                            {
                                "Occupation1": "Occupation1",
                                "Occupation2": "Occupation2",
                                
                            }

                                },
                                "lead.incomes[].incomeEarned",
                                {
                                    key: "lead.incomes[].frequency",
                                    type: "select"
                                }

                            ]

                            }
                    ]
                },

                        {
                            type:"fieldset",
                            title: "Contact Details",
                            condition: "model.lead.Applicant.Entitytype === 'Individual'||model.lead.Applicant.Entitytype === 'Enterprise'",

                            items: 
                            [

                            {key:"lead.Applicant.MobileNumber1",
                            title:"Mobile Number1"},
                        {key:"lead.Applicant.AlternateMobileNumber",title:"Alternate Mobile Number"},
                        {key:"lead.Business.BusinessAddressLine1",title:"Address Line1"},
                       { key:"lead.Business.AddressLine2",title:"Address Line2"},
                        "lead.Business.District",
                                {

                                    key: "lead.Business.PinCode",
                                    title:"PinCode",
                                    type: "lov",
                                    fieldType: "number",
                                    autolov: true,
                                    inputMap: 
                                    {
                                        "pincode": "lead.Business.PinCode",
                                        "district": 
                                        {
                                            key: "lead.Business.District"
                                        },
                                        "state":
                                         {
                                            key: "lead.Business.State"
                                         }
                                    },
                                    outputMap: 
                                    {

                                        "pincode": "lead.Business.PinCode",
                                        "district": "lead.Business.District",
                                        "state": "lead.Business.State"
                                    },

                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model)
                                    {
                                        return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                                    },
                                    getListDisplayItem: function(item, index)
                                     {
                                        return [
                                        item.pincode,
                                        item.district + ', ' + item.state
                                               ];
                                     }
                                },

                        "lead.Business.State",


                        {
                        "key": "lead.latitude",
                        "title": "Location",
                         "type": "geotag",
                         "latitude": "latitude",
                        "longitude": "longitude",
                        },

                        "lead.Business.Area"




                            ]



                        },
                        
                    ]
                    },

                           
                   ]
                   },


                   {
                    type: "box",
                    title: "Product Details",

                    items: 
                    [
                        {
                            key: "lead.ProductCategory",
                            title:"Product Category",
                            type: "select",
                            titleMap: 
                            {
                                "Asset": "Asset",
                                "Liability": "Liability",
                                "others": "others"
                            }

                        },

                        {
                            key: "lead.productsubcategory",
                            title:"Product Subcategory",
                            type: "select",
                            titleMap: {
                                "Loan": "Loan",
                                "SA1": "SA1",
                                "SA2": "SA2",
                                "SL1": "SL1",
                                "SL2": "SL2",
                                "SL3": "SL3",
                                "SO1": "SO1",
                                "SO2": "SO2",
                                "SO3": "SO3",

                                       }
                       },

                        {
                            key: "lead.InterestedInProduct",
                            title:"Interested In Product",
                            type: "select",
                            titleMap: 
                            {
                                "Yes": "Yes",
                                "No": "No"
                            }
                        },

                        {
                            key: "lead.ProductRequiredBy",
                            type: "select",
                            title:"Product Required By",
                            condition: "model.lead.InterestedInProduct==='Yes'",
                            titleMap:
                             {
                                "In this week": "In this week",
                                "In this month": "In this month",
                                "Next 2 -3 months": "Next 2 -3 months",
                                "Next 4-6 months": "Next 4-6 months",

                            }

                        },
                        {
                            key: "lead.DateOfScreening",
                            title:"Date of Screening",
                            condition: "(model.lead.InterestedInProduct==='Yes' && model.lead.ProductRequiredBy ==='In this week')",
                            type: "date"
                        },
                        {
                            key: "lead.FollowUpdate",
                            title:"FollowUp date",

                            condition: "(model.lead.InterestedInProduct==='Yes' && model.lead.ProductRequiredBy === 'In this month'||model.lead.ProductRequiredBy ==='Next 2 -3 months'|| model.lead.ProductRequiredBy === 'Next 4-6 months')",
                            type: "date"
                        },

                        {
                            key: "lead.LoanPurpose",
                            title:"Loan_Purpose",
                            condition: "model.lead.InterestedInProduct==='Yes'",
                            type: "select",
                            titleMap:
                             {
                                "AssetPurchase": "AssetPurchase",
                                "WorkingCapital": "WorkingCapital",
                                "BusinessDevelopment": "BusinessDevelopment",
                                "LineOfCredit": "LineOfCredit",

                            }
                        },


                        {
                            key: "lead.LoanamountRequested",
                            title:"Loan Amount Requested",
                            condition: "model.lead.InterestedInProduct==='Yes'",
                            title: "Loan_Amount_Requested"

                        },




                        {
                            type: "fieldset",
                            title: "Product Rejection Reason",
                            condition: "model.lead.InterestedInProduct==='No'",

                            items:
                             [
                                {
                                    key: "lead.Reason",
                                    title:"Reason For Rejection",
                                    type: "select",
                                    titleMap: {
                                             "Reason1": "Reason1",
                                             "Reason2": "Reason2"
                                              }

                                 },

                                {
                                    key: "lead.AdditionalRemarks",

                                    title: "Additional Remarks"

                                },
                            ]

                        },


                        {
                            type: "fieldset",
                            condition:"model.lead.InterestedInProduct==='Yes'",
                            title: "Product Eligibility",

                            items: 
                            [
                            {
                                key:"lead.EligibleForProduct",
                                title:"Eligible For Product ?",
                                type:"radios",
                                titleMap: {
                                             "Yes": "Yes",
                                             "No": "No"
                                          }

                            },

                            {
                                    key: "lead.ReasonForRejection",
                                    condition:"model.lead.EligibleForProduct ==='No'",
                                    type:"select",
                                    title:"Reason for Rejection",
                                    titleMap:
                                     {
                                               "Reason1": "Reason1",
                                               "Reason2": "Reason2"
                                     }
                            },

                            ]

                        },


                         {
                            type: "fieldset",
                            title: "Lead Status",

                            items: 
                            [
                            {
                                key:"lead.Status",
                                title:"Lead Status",
                                type:"select",
                                titleMap:
                                     {
                                               "Customer": "Customer",
                                               "FollowUp": "FollowUp",
                                               "Hold": "Hold",
                                               "Reject": "Reject"
                                     }


                                

                            }
                                

                           ]

                        } 

                        ]
                        },





                        {
                        type: "box",
                        title: "Customer Interactions",

                        items:
                         [

                        {
                            key: "lead.currentDate",
                            title:"Date of Interaction",
                            type: "date",
                            readonly:true

                        },

                        {
                            key: "lead.ActionTakenBy",
                            title:"Action Taken By",
                            
                        },

                        {
                            key: "lead.TypeOfInteraction",
                            title:"Type Of Interaction",
                            type: "select",
                            titleMap: 
                            {
                                "Call": "Call",
                                "Visit": "Visit",
                            }

                        },

                        {
                            key: "lead.CustomerResponse",
                            title:"Customer Response"
                        },

                        {
                            key: "lead.AdditionalRemark",

                            title:"Additional Remark"
                        },

                        {
                            "key": "lead.latitude",

                            "title": "Location of Interaction",
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            "condition":"model.lead.TypeOfInteraction === 'Visit'"
                        },

                        {
                            "key": "lead.photo",
                            title:"Customer Photo",
                            "type": "file",
                            "fileType": "image/*",
                            "condition":"model.lead.TypeOfInteraction === 'Visit'"

                        },




                        ]
                        },



                        {
                        type: "box",
                        title: "Previous Interactions",
                        condition: "model.lead.id",
                        items:
                         [

                           {
                            key:"lead.Interaction",
                            title:"Interaction History",

                            type:"array",
                            remove: null,
                            add:null,
                            /* startEmpty: true, */
                            items:
                            [

                        {
                            key: "lead.Interaction[].DateOfInteraction",
                            title:"Date of Interaction",
                            type: "date",
                            readonly:true

                        },

                        {
                            key: "lead.Interaction[].ActionTakenBy",
                            
                            title:"Action Taken By",
                            readonly:true
                        },

                        {
                            key:"lead.Interaction[].Status",
                            title:"Lead Status",
                            readonly:true


                        },

                        {
                            key: "lead.Interaction[].TypeOfInteraction",
                            title:"Type of Interaction",
                            type: "select",
                            titleMap: 
                            {
                                "Call": "Call",
                                "Visit": "Visit",

                            },
                            readonly:true

                        },

                        {
                            key: "lead.Interaction[].CustomerResponse",
                            title:"Customer Response",
                            readonly:true
                        },

                        {
                            key: "lead.Interaction[].AdditionalRemark",
                            title:"Additional Remarks",
                            readonly:true

                        },

                        {
                            "key": "lead.Interaction[].latitude",
                            "title": "Location of Interaction",
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            "condition":"model.lead.TypeOfInteraction === 'Visit'",
                            readonly:true
                            
                        },

                        {
                            "key": "lead.Interaction[].photo",
                            "title":"Customer Photo",
                            "type": "file",
                            "fileType": "image/*",
                            "condition":"model.lead.TypeOfInteraction === 'Visit'",
                             readonly:true

                        },

                        ]
                        }
                        ]
                    },








                    {
                    "type": "actionbox",

                    "items": 
                    [
                    
                    {
                            "type": "submit",
                            "title": "Submit"
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

                preSave: function(model, form, formName)
                {
                   $log.info("Inside save()");
                   var deferred = $q.defer();
                   if (model.lead.Name)
                    { 
                   
                        deferred.resolve();
                        
                        
                    }


                   else
                   {
                    irfProgressMessage.pop('LeadGeneration-save', 'Applicant Name is required', 3000);
                    deferred.reject();
                   }
                   return deferred.promise;
                },


                 submit: function(model, form, formName) 
                {
                     $log.info("Inside submit()");
                     irfProgressMessage.pop('LeadGeneration-save', 'Lead is successfully created', 3000);
                     $log.warn(model);
                   


                }


            }

        };
 }
 ]);