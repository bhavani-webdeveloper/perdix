irf.pageCollection.factory(irf.page("lead.Leadgeneration"),
["$log",  "Enrollment",  "SessionStore", "PageHelper","formHelper","Queries","lead",
function($log, lead, Enrollment,  SessionStore,PageHelper,formHelper,Queries){

     var branch = SessionStore.getBranch();


    return {
        "type": "schema-form",
        "title": "LEAD_GENERATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {


            $log.info("create new lead generation page ");
            
        },

        
      
    
        form: [{
            "type": "box",
            "title": "",
            "items": [
            {
                key:"currentDate",
                type:"date"
            },
                
                {
                    key:"HubName",
                    type:"select",
                    
                
                },

                {
                    key: "SpokeName",
                    title:"SPOKE_NAME",
                    
                },

                ]
            },
    
            
        
        {
            "type": "box",
            "title": "ENTITY_PROFILE",
            "items": [
                
                {
                    type: "fieldset",
                    title: "APPLICANT_DETAILS",
                    items: [

                        "Applicant.Name",
                        "Applicant.MobileNumber1",
                        "Applicant.AlternateMobileNumber"
                                
                    ]
                },
                {
                    type: "fieldset",
                    title: "BUSINESS_DETAILS",
                    
                    items: [
                        "Business.BusinessName",
                        "Business.BusinessType",
                        "Business.BusinessActivity",
                        "Business.BusinessAddressLine1",
                        "Business.AddressLine2",

                        {

                        key: "Business.Pincode",
                        title:"PIN_CODE",
                        type: "lov",
                        fieldType: "number",
                        autolov: true,
                        inputMap: {
                            "pincode": "Business.Pincode",
                            "district": {
                                key: "Business.District"
                            },
                            "state": {
                                key: "Business.State"
                            }
                        },
                        outputMap: {
                        
                            "pincode": "Business.pincode",
                            "district": "Business.District",
                            "state": "Business.State"
                        },

                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.pincode,
                                item.district + ', ' + item.state
                            ];
                        }
                    },
                        
                        "Business.State",
                        "Business.District",
                        "Business.Location",
                        "Business.Area"

                        ]

                    
                            
                  
                }
            ]
        },
        {
            type:"box",
            title:"LOAN_DETAILS",
            
                    items:[
                        {
                            key:"InterestedInLoan",
                            type:"select",
                            titleMap:{
                                "Yes":"Yes",
                                "No":"No"
                            }
                        },

                        {
                            key:"LoanPurpose",
                            type:"select",
                            titleMap:{
                                "AssetPurchase":"AssetPurchase",
                                "WorkingCapital":"WorkingCapital",
                                "BusinessDevelopment":"BusinessDevelopment",
                                "LineOfCredit":"LineOfCredit",
                                

                            }
                        },
                        
                    
                        {
                            key:"LoanamountRequested",
                            title:"Loan_Amount_Requested"

                        },

                        {
                            key:"LoanRequiredBy",
                            type:"select",
                            titleMap:{
                                "In this week":"In this week",
                                "In this month":"In this month",
                                "Next 2 -3 months":"Next 2 -3 months",
                                "Next 4-6 months":"Next 4-6 months",
                                

                            }

                        },
                        {
                            key:"DateOfScreening",
                            type:"date"
                        },
                        {
                            key:"FollowUpdate",
                            type:"date"
                        },
                        {
                            key:"ReasonforRejection",
                            type:"select",
                            title:"REASON_FOR_REJECTION"
                        },
                        {
                           key: "AdditionalRemarks",
                           title:"ADDITIONAL_REMARKS"

                        }
                        
   
    
                    ]
                },
                
                  
            
        
            {
                "type": "actionbox",
                
                "items": [{
                    "type": "save",
                    "title": "SAVE"
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            },
            
        ],


        schema: function() {
                return lead.getSchema().$promise;
            },



        
    

         actions: {
                submit: function(model, form, formName){
                }
            }

          

     };
 }
 ]);


                    


                 






       