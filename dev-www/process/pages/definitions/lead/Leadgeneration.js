irf.pageCollection.factory(irf.page("lead.Leadgeneration"),
["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries",
function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, Queries){

    return {
        "type": "schema-form",
        "title": "LEAD_GENERATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            
        },
        offline: true,
      
        },
        form: [{
            "type": "box",
            "title": "",
            "items": [
                {
                    key: "currentDate",
                    type: "select"
                },
                {
                    key:"HubName",
                    type:"select",
                    filter: {
                        "parentCode": "model.branchId"
                    },
                    parentEnumCode:"branch",
                    screenFilter: true
                },
                {
                    key: "SpokeName",
                    title:"CUSTOMER_ID",
                    titleExpr:"('CUSTOMER_ID'|translate)+' (Artoo)'",
                    condition: "model.customer.oldCustomerId",
                    readonly: true
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
                        "Applicant.MobileNumber",
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
                        "Business.Pincode"
                        "Business.State"
                        "Business.District"
                        "Business.Location"
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
                            type:"select"
                        },
                        
                        "LoanPurpose",
                        "LoanAmountRequested",
                        {
                            key:"LoanRequiredBy"
                            type:"select"
                        },
                        {
                            key:"DateOfScreening"
                            type:"date"
                        },
                        {
                            key:"FollowDate"
                            type:"date"
                        },
                        {
                            key:"ReasonforRejection"
                            type:"select"
                        },
                        "AdditionalRemarks",
   
    
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



        {
    "$schema":"http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        
                 "currentDate":{
                      "type": "string",
                      "title": "CURRENT_DATE"
                 },
                 "HubName":{
                      "type": "string",
                      "title": "HUB_NAME"

                 },
                 "SpokeName":{
                      "type": "string",
                      "title": "AMOUNT"
                 },

                 "Applicant":
                 {
                  "type":"object",
                  "title":"APPLICANT",
                  "properties": {

                    "Name":{
                      "type": "string",
                      "title": "NAME"
                 },
                 "MobileNumber1":{
                      "type": "Number",
                      "title": "MOBILE_NUMBER1"
                 },
                 "AlternateMobileNumber":{
                      "type": "string",
                      "title": "ALTERNATE_MOBILE_NUMBER"
                 },
               }
             },

             "Business":
             {
              "type":"object",
              "title":"Business",
              "properties":{
                "BusinessName":{
                      "type": "string",
                      "title": "BUSINESS_NAME"
                 },
                 "BusinessType":{
                      "type": "Number",
                      "title": "BUSINESS_TYPE"
                 },
                 "BusinessActivity":{
                      "type": "string",
                      "title": "BUSINESS_ACTIVITY"
                 },

                 "BusinessAddressLine1":{
                      "type": "string",
                      "title": "BUSINESS_ADDRESS_LINE1"
                 },
                 "AddressLine2":{
                      "type": "Number",
                      "title": "ADDRESS_LINE2"
                 },
                 "PinCode":{
                      "type": "Number",
                      "title": "PIN_CODE"
                 },
                 "State":{
                      "type": "string",
                      "title": "STATE"
                 },
                 "District":{
                      "type": "Number",
                      "title": "DISTRICT"
                 },
                 "Location":{
                      "type": "string",
                      "title": "LOCATION"
                 },
                 "Area":{
                      "type": "string",
                      "title": "AREA"
                 },
                

              }
             },

             "InterestedInLoan":{
                      "type": "boolean",
                      "title": "INTERESTED_IN_LOAN"
                 },
                 "LoanPurpose":{
                      "type": "Number",
                      "title": "LOAN_PURPOSE"
                 },
                 "LoanAmountRequested":{
                      "type": "string",
                      "title": "LOAN_AMOUNT_REQUESTED"
                 },
                 "LoanRequiredBy":{
                      "type": "string",
                      "title": "LOAN_REQUIRED_BY"
                 },
                 "DateOfScreening":{
                      "type": "Number",
                      "title": "DATE_OF_SCREENING"
                 },
                 "FollowUpdate":{
                      "type": "string",
                      "title": "FOLLOWUP_DATE"
                 },




           }
         }
     };
 }
 ]);


                    


                 






       