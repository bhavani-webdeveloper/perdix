irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHRegistration"),
["$log", "ACHPDC", "SessionStore","$state", "$stateParams", function($log, ACHPDC, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "ach",
        "type": "schema-form",
        "name": "ach_pdc",
        "title": "ACH REGISTRATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("ACH selection Page got initialized");
             model.ach = {};
         //   model.customer.urnNo="1234567890";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "ACH REGISTRATION",
            // sample label code
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                 "items": [{
                                "key": "ach.accountHolderName",
                                "title": "ACCOUNT_HOLDER_NAME"
                            },
                            {
                                "key": "ach.accountType",
                                "title": "ACCOUNT_TYPE"
                            },
                            {
                                "key": "ach.amount",
                                "title": "AMOUNT",
                                "type": "Number"
                              
                            },
                            {
                                "key": "ach.consumerReferenceNumber",
                                "title": "CONSUMER_REFERENCE_NUMBER"
                            },
                            {
                                "key": "ach.customerAdditionalInformation",
                                "title": "CUSTOMER_ADDITIONAL_INFORMATION"
                            },
                            {
                                "key": "ach.debitAmtOF",
                                "title": "DEBIT_AMOUNT_OF"
                            },
                            {
                                "key": "ach.emailId",
                                "title": "E-mail_Id"
                            },
                            {
                                "key": "ach.endDate",
                                "title": "END_DATE",
                                "type": "date"
                            },
                            {
                                "key": "ach.frequency",
                                "title": "frequency"
                            },
                            {
                                "key": "ach.ifscCode",
                                "title": "IFSC_Code"
                            },
                            {
                                "key": "ach.initialRejectReason",
                                "title": "INITIAL_REJECT_REASON"
                            },
                            {
                                "key": "ach.legalAccountNumber",
                                "title": "LEGAL_ACCOUNT_NUMBER"
                            },
                            {
                                "key": "ach.loanAccountNumber",
                                "title": "LOAN_ACCOUNT_NUMBER"
                            },
                            {
                                "key": "ach.mandateDate",
                                "title": "MANDATE_DATE"
                            },
                            {
                                "key": "ach.micrCode",
                                "title": "MICRO_CODE"
                            },
                            {
                                "key": "ach.mobilNumber",
                                "title": "MOBIL_NUMBER"
                            },
                            {
                                "key": "ach.nameOfTheDestinationBankWithBranch",
                                "title": "NAME_OF_THE_DESTINATION_BANK_WITH_BRANCH"
                            },
                            {
                                "key": "ach.nameOfUtilityBillerBankCompany",
                                "title": "NAME_OF_UTILITY_BILLER_BANK_COMPANY"
                            },
                            {
                                "key": "ach.processedOnWithUmrn",
                                "title": "PROCESSED_ON_WITH_UMRN"
                            },
                            {
                                "key": "ach.rejectionCode",
                                "title": "REJECTION_CODE"
                            },
                            {
                                "key": "ach.rejectionReason",
                                "title": "REJECTION_REASON"
                            },
                            {
                                "key": "ach.schemPlanReferenceNo",
                                "title": "SCHEME_PLAN_REFERENCE_NUMBER"
                            },
                            {
                                "key": "ach.sponsorBankCode",
                                "title": "SPONSOR_BANK_CODE"
                            },
                            {
                                "key": "ach.startDate",
                                "title": "START_DATA",
                                "type":"date"
                            },
                            {
                                "key": "ach.telephoneNo",
                                "title": "TELEPHONE_NUMBER"
                            },
                            {
                                "key": "ach.umnrNo",
                                "title": "UMNR_NUMBER"
                            },
                            {
                                "key": "ach.uptoMaximumAmt",
                                "title": "UPTO_MAXIMUM_AMOUNT",
                                "type": "Number"
                            },
                            {
                                "key": "ach.utilityCode",
                                "title": "UTILITY_CODE"
                            }]
                       
                },
             
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Save Details",
                              }]
                }],
                    schema: {
                type: "object",
                properties: {
                    "ach": {
                        type: "object",
                        required: [
                            "accountHolderName",
                            "accountType","amount",
                            "consumerReferenceNumber","customerAdditionalInformation",
                            "debitAmtOF","emailId","endDate","frequency",
                            "ifscCode","initialRejectReason","legalAccountNumber",
                            "loanAccountNumber","mandateDate","micrCode",
                            "mobilNumber","nameOfTheDestinationBankWithBranch",
                            "nameOfUtilityBillerBankCompany","processedOnWithUmrn",
                            "rejectionCode","rejectionReason","schemPlanReferenceNo",
                            "sponsorBankCode","startDate","telephoneNo","umnrNo",
                            "uptoMaximumAmt","utilityCode"
                        ],
                        properties: {
                             "accountHolderName":{
                                  type: "string",
                                  "title": "ACCOUNT_HOLDER_NAME"
                             },
                             "accountType":{
                                  type: "string",
                                  "title": "ACCOUNT_TYPE"

                             },
                             "amount":{
                                  type: "Number",
                                  "title": "AMOUNT"
                             },
                             "consumerReferenceNumber":{
                                  type: "string",
                                  "title": "CONSUMER_REFERENCE_NUMBER"
                             },
                             "customerAdditionalInformation":{
                                  type: "string",
                                  "title": "DEBIT_AMOUNT_OF"
                             },
                             "debitAmtOF":{
                                  type: "string",
                                  "title": "DEBIT_AMOUNT_OF"
                             },
                             "emailId":{
                                  type: "string",
                                   "title": "E-mail_Id"                                
                             },
                             "endDate":{
                                  type: "date",
                                  "title": "END_DATE"
                             },
                             "frequency":{
                                  type: "string",
                                  "title": "frequency"
                             },
                             "ifscCode":{
                                  type: "string",
                                  "title": "IFSC_Code"
                             },
                            "initialRejectReason":{
                                  type: "string",
                                  "title": "INITIAL_REJECT_REASON"
                            },
                            "legalAccountNumber":{
                                  type: "string",
                                  "title": "LEGAL_ACCOUNT_NUMBER"
                            },
                            "loanAccountNumber":{
                                  type: "string",
                                  "title": "LOAN_ACCOUNT_NUMBER"
                            },
                             "mandateDate":{
                                  type: "string",
                                   "title": "MANDATE_DATE"
                             },
                             "micrCode":{
                                  type: "string",
                                  "title": "MICRO_CODE"
                             },
                             "mobilNumber":{
                                  type: "string",
                                  "title": "MOBIL_NUMBER"
                             },
                             "nameOfTheDestinationBankWithBranch":{
                                  type: "string",
                                  "title": "NAME_OF_THE_DESTINATION_BANK_WITH_BRANCH"
                             },
                             "nameOfUtilityBillerBankCompany":{
                                  type: "string",
                                  "title": "NAME_OF_UTILITY_BILLER_BANK_COMPANY"
                             },
                             "processedOnWithUmrn":{
                                  type: "string",
                                  "title": "PROCESSED_ON_WITH_UMRN"
                             },
                             "rejectionCode":{
                                  type: "string",
                                  "title": "REJECTION_CODE"
                             },
                             "rejectionReason":{
                                  type: "string",
                                  "title": "REJECTION_REASON"
                             },
                             "schemPlanReferenceNo":{
                                  type: "string",
                                  "title": "SCHEME_PLAN_REFERENCE_NUMBER"
                             },
                             "sponsorBankCode":{
                                  type: "string",
                                  "title": "SPONSOR_BANK_CODE"
                             },
                             "startDate":{
                                  type: "date",
                                  "title": "START_DATA"
                             },
                             "telephoneNo":{
                                  type: "string",
                                  "title": "TELEPHONE_NUMBER"
                             },
                             "umnrNo":{
                                  type: "string",
                                  "title": "UMNR_NUMBER"
                             },
                             "uptoMaximumAmt":{
                                  type: "Number",
                                  "title": "UPTO_MAXIMUM_AMOUNT"
                             },
                             "utilityCode":{
                                  type: "string",
                                  "title": "UTILITY_CODE"
                             }
                                
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName){

            $log.info("Inside submit()");
                    PageHelper.showLoader();

                    ACHPDC.create(model.ach, function(response){
                        PageHelper.hideLoader();

                    }, function(errorResponse){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(errorResponse);
                    });

                        // $state.go("Page.Engine", {
                        //     pageName: 'IndividualLoanBookingConfirmation',
                        //     pageId: model.customer.id
                        // });
                }
            }
    };
}]);