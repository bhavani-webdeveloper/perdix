irf.pageCollection.factory(irf.page("lead.Leadgeneration"),
["$log",  "Enrollment",  "SessionStore", "PageHelper","formHelper","Queries",
function($log,  Enrollment,  SessionStore,PageHelper,formHelper,Queries){

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
                            type:"select"
                        },
                        
                        "LoanPurpose",
                        "LoanamountRequested",
                        {
                            key:"LoanRequiredBy",
                            type:"date"
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



        
    schema:{

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
                      "type": "number",
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
                      "type": "number",
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
                      "type": "number",
                      "title": "ADDRESS_LINE2"
                 },
                 "PinCode":{
                      
                      "title": "PIN_CODE"
                 },
                 "State":{
                      "type": "string",
                      "title": "STATE"
                 },
                 "District":{
                      "type": "number",
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
                      "type": "string",
                      "title": "LOAN_PURPOSE"
                 },
                 "LoanamountRequested":{
                      "type": "number",
                      "title": "LOAN_AMOUNT_REQUESTED"
                 },
                 "LoanRequiredBy":{
                      "type": "string",
                      "title": "LOAN_REQUIRED_BY"
                 },
                 "DateOfScreening":{
                      "type": "number",
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


                    


                 






       