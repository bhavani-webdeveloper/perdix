define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "shramsarathi.dashboard.loans.individual.screening.televerification",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {
            
            var configFile = function () {
        return {

                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                }
            }
            var getIncludes = function (model) {
                return [
                ];

            }

    var formRequest = function(model) {
                return {
                    "overrides": overridesFields(model),
                    "includes": getIncludes(model),
                    "excludes": [],
                    "options": {
                        "repositoryAdditions": {
                        },
                        "additions": [
                            {
                                "type": "section",
                                "htmlClass": "col-sm-12",
                                "items": [
                                    {
                                        "type": "section",
                                        "htmlClass": "row",
                                        "items": [
                                            {
                                                "type": "box",
                                                "title": "APPLICANT_INFORMATION",
                                                "colClass": "col-xs-6 col-md-6",
                                                "items": [                                                                
                                                    {
                                                        "type": "fieldset",
                                                        "title": "PERSONAL_INFORMATION",
                                                        "items": [
                                                            {
                                                                "key": "applicant.customer.customerBranchId",
                                                                "title": "BRANCH_NAME",
                                                                "type": "select",
                                                                "enumCode": "branch_id",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.centreId",
                                                                "type": "lov",
                                                                "title": "CENTRE",
                                                                "filter": {
                                                                    "parentCode": "branch_id"
                                                                },
                                                                "parentEnumCode": "branch_id",
                                                                "parentValueExpr": "model.applicant.customer.customerBranchId",
                                                                "readonly": true
                                                            },                                                        
                                                            {
                                                                "key": "customer.centreId",
                                                                "type": "select",
                                                                "enumCode": "centre",
                                                                "title": "CENTRE_NAME",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.urnNo",
                                                                "title": "URN_NO",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.firstName",
                                                                "title": "FULL_NAME",
                                                                "type": "string",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.dateOfBirth",
                                                                "title": "DATE_OF_BIRTH",
                                                                "type": "date",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.gender",
                                                                "type": "radios",
                                                                "title": "GENDER",
                                                                "enumCode": "gender",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.fatherFirstName",
                                                                "title": "FATHER_FULL_NAME",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.photoImageId",
                                                                "type": "file",
                                                                "title": "CUSTOMER_PHOTO",
                                                                "category": "CustomerEnrollment",
                                                                "subCategory": "PHOTO",
                                                                "fileType": "image/*",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.customerCategory",
                                                                "title": "CUSTOMER_CATEGORY",
                                                                "type": "select",
                                                                "enumCode": "lead_category",
                                                                "readonly":true
                                                            }
                                                        ]                                                    
                                                    },
                                                    {
                                                        "type": "fieldset",
                                                        "title": "KYC",
                                                        "items": [
                                                            {
                                                                "key": "applicant.customer.identityProofNo",
                                                                "title": "IDENTITY_PROOFNO",
                                                                "type": "barcode",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.identityProofImageId",
                                                                "type": "file",
                                                                "fileType": "application/pdf",
                                                                "using": "scanner",
                                                                "title": "IDENTITY_PROOF_DOCUMENT",
                                                                "category": "CustomerEnrollment",
                                                                "subCategory": "IDENTITYPROOF",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.addressProofNo",
                                                                "type": "qrcode",
                                                                "title": "ADDRESS_PROOF_NO",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.addressProofImageId",
                                                                "type": "file",
                                                                "fileType": "application/pdf",
                                                                "using": "scanner",
                                                                "title": "ADDRESS_PROOF_IMAGE_ID",
                                                                "category": "CustomerEnrollment",
                                                                "subCategory": "ADDRESSPROOF",
                                                                "readonly": true
                                                            }
                                                        ]                                                    
                                                    },
                                                    {
                                                        "type": "fieldset",
                                                        "title": "CONTACT_INFORMATION",
                                                        "items": [
                                                            {
                                                                "key": "applicant.customer.mobilePhone",
                                                                "type": "text",
                                                                "title": "MOBILE_PHONE",
                                                                "inputmode": "number",
                                                                "numberType": "tel",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.doorNo",
                                                                "title": "DOOR_NO",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.pincode",
                                                                "title": "PIN_CODE",
                                                                "type": "lov",
                                                                "fieldType": "number",
                                                                "autolov": true,
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.locality",
                                                                "title": "LOCALITY",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.villageName",
                                                                "title": "VILLAGE_NAME",
                                                                "enumCode":"village",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.district",                                                            
                                                                "title": "DISTRICT",
                                                                "enumCode":"district",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.state",
                                                                "title": "STATE",
                                                                "readonly": true
                                                            }
                                                        ]                                                    
                                                    },
                                                    {
                                                        "type": "array",
                                                        "title": "BANK_ACCOUNTS",
                                                        "view": "fixed",
                                                        "add": null,
                                                        "remove": null,
                                                        "key": "applicant.customer.customerBankAccounts",
                                                        "items": [
                                                            {
                                                                "key": "applicant.customer.customerBankAccounts[].ifscCode",
                                                                "resolver": "BankIFSCLOVConfiguration",
                                                                "type": "lov",
                                                                "lovonly": true,
                                                                "title": "IFSC_CODE",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.customerBankAccounts[].customerBankName",
                                                                "title": "BANK_NAME",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.customerBankAccounts[].customerBankBranchName",
                                                                "title": "BANK_BRANCH_NAME",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.customerBankAccounts[].customerNameAsInBank",
                                                                "title": "CUSTOMER_NAME_IN_BANK",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "applicant.customer.customerBankAccounts[].accountNumber",
                                                                "title": "ACCOUNT_NUMBER",
                                                                "readonly": true
                                                            }
                                                        ]                                                    
                                                    },
                                                    {
                                                        "type": "fieldset",
                                                        "title": "LOAN_DETAILS",
                                                        "items": [
                                                            {
                                                                "key": "loanAccount.loanPurpose1",
                                                                "type": "lov",
                                                                "resolver": "LoanPurpose1LOVConfiguration",
                                                                "autolov": true,
                                                                "title": "LOAN_PURPOSE_LEVEL_1",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "loanAccount.loanAmountRequested",
                                                                "type": "amount",
                                                                "title": "REQUESTED_LOAN_AMOUNT",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "loanAccount.frequencyRequested",
                                                                "type": "select",
                                                                "title": "FREQUENCY_REQUESTED",
                                                                "enumCode": "frequency",
                                                                "readonly": true
                                                            },
                                                            {
                                                                "key": "loanAccount.tenureRequested",
                                                                "type": "number",
                                                                "title": "TENURE_REQUESETED",
                                                                "readonly": true
                                                             }
                                                             //,
                                                            // {
                                                            //     "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5",
                                                            //     "title" : "FLAT_RATE",
                                                            //     "type": "string",
                                                            //     "readonly" : true
                                                            // },
                                                            // {
                                                            //     "key": "loanAccount.expectedInterestRate",
                                                            //     "type": "number",
                                                            //     "title": "NOMINAL_RATE",
                                                            //     "readonly": true
                                                            // }
                                                        ]                                                    
                                                    },{
                                                        "type": "fieldset",
                                                        "title": "Remarks",
                                                        "items":[
                                                            {
                                                                "title":"REMARKS",
                                                                "type":"text"
                                                            },
                                                            {
                                                                "title":"FEEDBACK",
                                                                "type":"textarea"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "box",
                                                "colClass": "col-xs-6 col-md-6",
                                                "title": "APPLICANT_TELE_VERIFICATION",
                                                "items": [
                                                    {
                                                        "type": "fieldset",
                                                        "title": "CALLING_ATTEMPTS",
                                                        "items": [
                                                            {
                                                                "key": "applicant.telecallingResponse",
                                                                "type": "select",
                                                                "title": "TELECALLING_RESPONSE",
                                                                "enumCode": "telecalling_response"
                                                            },
                                                            {
                                                                "key": "applicant.noOfCallAttempts",
                                                                "type": "number",
                                                                "title": "NO_OF_CALLATTEMPTS"
                                                            },
                                                            {
                                                                "key": "applicant.followupCallRequired",
                                                                "type": "date",
                                                                "title": "FOLLOWUP_ON"
                                                            },
                                                            {
                                                                "key": "applicant.telecallingRemarks",
                                                                "type": "textarea",
                                                                "title": "TELECALLING_REMARKS"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "type": "fieldset",
                                                        "title": "QUESTIONS",
                                                        "items": [
                                                            {
                                                                "key": "applicant.telecallingQuestionnaireList",
                                                                "type": "array",
                                                                "add": null,
                                                                "remove": null,
                                                                "view": "fixed",
                                                                "items":  [
                                                                    {
                                                                        "key": "applicant.telecallingQuestionnaireList[].question",
                                                                        "type": "textarea",
                                                                        "title": "QUESTION",
                                                                        "readonly": true
                                                                    },
                                                                    {
                                                                        "key": "applicant.telecallingQuestionnaireList[].answer",                                                                            
                                                                        "type": "string",  
                                                                        "title": "ANSWER",
                                                                        "condition":"model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='string'"
                                                                    },
                                                                    {
                                                                        "key": "applicant.telecallingQuestionnaireList[].answer",                                                                            
                                                                        "type": "textarea",  
                                                                        "title": "ANSWER",
                                                                        "condition":"model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='textarea'"
                                                                    },
                                                                    {
                                                                        "key": "applicant.telecallingQuestionnaireList[].answer",                                                                            
                                                                        "type": "number",  
                                                                        "title": "ANSWER",
                                                                        "condition":"model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='number'"
                                                                    },
                                                                    {
                                                                        "key": "applicant.telecallingQuestionnaireList[].answer",                                                                            
                                                                        "title": "ANSWER",
                                                                        "condition":"model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='select'",
                                                                        "type": "lov",
                                                                        "autolov": true,
                                                                        "lovonly": true,
                                                                        "bindMap": {},
                                                                        "searchHelper": formHelper,
                                                                        "search": function(inputModel, form, model, context) {
                                                                            var list = {};
                                                                            list = model.applicant.telecallingQuestionnaireList[context.arrayIndex].select;

                                                                            var out = [];
                                                                            _.forEach(list, function(val) {
                                                                                out.push({"name":val});
                                                                            });

                                                                            return $q.resolve({
                                                                                headers: {
                                                                                    "x-total-count": out.length
                                                                                },
                                                                                body: out
                                                                            });
                                                                        },
                                                                        onSelect: function(valueObj, model, context) {
                                                                            model.applicant.telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                                                        },
                                                                        getListDisplayItem: function(item, index) {
                                                                            return [
                                                                                item.name
                                                                            ];
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            // {
                            //     "type": "section",
                            //     "htmlClass": "col-sm-12",
                            //     "items": [
                            //        {
                            //             "type": "section",
                            //             "htmlClass": "row",
                            //             "items": [
                            //                 {
                            //                     "type": "box",
                            //                     "title": "BUSINESS_INFORMATION",
                            //                     "colClass": "col-xs-6 col-md-6",
                            //                     "items": [

                            //                        {
                            //                             "key": "loanCustomer.customer.id",
                            //                             "type": "number",
                            //                             "title": "ENTITY_ID",
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.enterprise.businessConstitution",
                            //                             "title": "CONSTITUTION",
                            //                             "type": "select",
                            //                             "enumCode": "constitution",
                            //                             "schema": {
                            //                                 "required": false
                            //                             },
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.mobilePhone",
                            //                             "type": "text",
                            //                             "title": "MOBILE_PHONE",
                            //                             "inputmode": "number",
                            //                             "numberType": "tel",
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.doorNo",
                            //                             "title": "DOOR_NO",
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.pincode",
                            //                             "title": "PIN_CODE",
                            //                             "type": "lov",
                            //                             "fieldType": "number",
                            //                             "autolov": true,
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.locality",
                            //                             "title": "LOCALITY",
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.villageName",
                            //                             "title": "VILLAGE_NAME",
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.district",
                            //                             "title": "DISTRICT",
                            //                             "readonly": true
                            //                         },
                            //                         {
                            //                             "key": "loanCustomer.customer.state",
                            //                             "title": "STATE",
                            //                             "readonly": true
                            //                         }
                            //                     ]
                            //                 },
                            //                 {
                            //                     "type": "box",
                            //                     "colClass": "col-xs-6 col-md-6",
                            //                     "title": "TELE_VERIFICATION",
                            //                     "items": [
                            //                         {
                            //                             "type": "fieldset",
                            //                             "title": "CALLING_ATTEMPTS",
                            //                             "items": [
                            //                                 {
                            //                                     "key": "loanCustomer.telecallingResponse",
                            //                                     "type": "select",
                            //                                     "title": "TELECALLING_RESPONSE",
                            //                                     "enumCode": "telecalling_response"
                            //                                 },
                            //                                 {
                            //                                     "key": "loanCustomer.noOfCallAttempts",
                            //                                     "type": "number",
                            //                                     "title": "NO_OF_CALLATTEMPTS"
                            //                                 },
                            //                                 {
                            //                                     "key": "loanCustomer.followupCallRequired",
                            //                                     "type": "date",
                            //                                     "title": "FOLLOWUP_ON"
                            //                                 },
                            //                                 {
                            //                                     "key": "loanCustomer.telecallingRemarks",
                            //                                     "type": "textarea",
                            //                                     "title": "TELECALLING_REMARKS"
                            //                                 }
                            //                             ]
                            //                         }
                            //                         //,
                            //                         // {
                            //                         //     "type": "fieldset",
                            //                         //     "title": "QUESTIONS",
                            //                         //     "items": [
                            //                         //         {
                            //                         //             "key": "loanCustomer.telecallingQuestionnaireList",
                            //                         //             "type": "array",
                            //                         //             "add": null,
                            //                         //             "remove": null,
                            //                         //             "view": "fixed",
                            //                         //             "items":  [
                            //                         //                 {
                            //                         //                     "key": "loanCustomer.telecallingQuestionnaireList[].question",
                            //                         //                     "type": "textarea",
                            //                         //                     "title": "QUESTION",
                            //                         //                     "readonly": true
                            //                         //                 },
                            //                         //                 {
                            //                         //                     "key": "loanCustomer.telecallingQuestionnaireList[].answer",                                                                            
                            //                         //                     "type": "string",  
                            //                         //                     "title": "ANSWER",
                            //                         //                     "condition":"model.loanCustomer.telecallingQuestionnaireList[arrayIndex].input_type=='string'"
                            //                         //                 },
                            //                         //                 {
                            //                         //                     "key": "loanCustomer.telecallingQuestionnaireList[].answer",                                                                            
                            //                         //                     "type": "textarea",  
                            //                         //                     "title": "ANSWER",
                            //                         //                     "condition":"model.loanCustomer.telecallingQuestionnaireList[arrayIndex].input_type=='textarea'"
                            //                         //                 },
                            //                         //                 {
                            //                         //                     "key": "loanCustomer.telecallingQuestionnaireList[].answer",                                                                            
                            //                         //                     "type": "number",  
                            //                         //                     "title": "ANSWER",
                            //                         //                     "condition":"model.loanCustomer.telecallingQuestionnaireList[arrayIndex].input_type=='number'"
                            //                         //                 },
                            //                         //                 {
                            //                         //                     "key": "loanCustomer.telecallingQuestionnaireList[].answer", 
                            //                         //                     "title": "ANSWER",
                            //                         //                     "condition":"model.loanCustomer.telecallingQuestionnaireList[arrayIndex].input_type=='select'",
                            //                         //                     "type": "lov",
                            //                         //                     "autolov": true,
                            //                         //                     "lovonly": true,
                            //                         //                     "bindMap": {},
                            //                         //                     "searchHelper": formHelper,
                            //                         //                     "search": function(inputModel, form, model, context) {
                            //                         //                         var list = {};
                            //                         //                         list = model.loanCustomer.telecallingQuestionnaireList[context.arrayIndex].select;

                            //                         //                         var out = [];
                            //                         //                         _.forEach(list, function(val) {
                            //                         //                             out.push({"name":val});
                            //                         //                         });

                            //                         //                         return $q.resolve({
                            //                         //                             headers: {
                            //                         //                                 "x-total-count": out.length
                            //                         //                             },
                            //                         //                             body: out
                            //                         //                         });
                            //                         //                     },
                            //                         //                     onSelect: function(valueObj, model, context) {
                            //                         //                         model.loanCustomer.telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;;
                            //                         //                     },
                            //                         //                     getListDisplayItem: function(item, index) {
                            //                         //                         return [
                            //                         //                             item.name
                            //                         //                         ];
                            //                         //                     }
                            //                         //                 }
                            //                         //             ]
                            //                         //         }
                            //                         //     ]
                            //                         // }
                            //                     ]
                            //                 }
                            //             ]
                            //         }
                            //     ]
                            // },
                            // {
                            //     "type": "section",
                            //     "htmlClass": "col-sm-12",
                            //     "items": [
                            //        {
                            //             "type": "section",
                            //             "htmlClass": "row",
                            //             "items": [
                            //                 {
                            //                     "type": "box",
                            //                     "colClass": "col-xs-6 col-md-6",
                            //                     "title": "VEHICLE",
                            //                     "items": [
                            //                         {
                            //                             "type": "fieldset",
                            //                             "title": "Vehicle Details",
                            //                             "items": [
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.vehicleType",
                            //                                     "type": "text",
                            //                                     "title": "Vehicle type",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.usedFor",
                            //                                     "type": "text",
                            //                                     "title": "Nature of Use",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.endUse",
                            //                                     "type": "text",
                            //                                     "title": "End use of the vehicle",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.segment",
                            //                                     "type": "text",
                            //                                     "title": "Segment",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.vehicleModel",
                            //                                     "type": "text",
                            //                                     "title": "Model",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.yearOfManufacture",
                            //                                     "type": "date",
                            //                                     "title": "Manufacture Year",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.registrationNumber",
                            //                                     "type": "text",
                            //                                     "title": "Registration no",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.price",
                            //                                     "type": "number",
                            //                                     "title": "Purchase price",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.insuredDeclaredValue",
                            //                                     "type": "number",
                            //                                     "title": "IDV",
                            //                                     "readonly": true
                            //                                 }
                            //                             ]
                            //                         },
                            //                         {
                            //                             "type": "fieldset",
                            //                             "title": "Vehicle Viability",
                            //                             "items": [
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.fcfToEmi",
                            //                                     "type": "number",
                            //                                     "title": "FCF:EMI",
                            //                                     "readonly": true
                            //                                 }
                            //                             ]
                            //                         },
                            //                         {
                            //                             "type": "fieldset",
                            //                             "title": "Vehicle Valuation",
                            //                             "items": [
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.currentMarketValue",
                            //                                     "type": "number",
                            //                                     "title": "Market value as on date of inspection",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.distressValue",
                            //                                     "type": "number",
                            //                                     "title": "Distress value",
                            //                                     "readonly": true
                            //                                 },
                            //                                 {
                            //                                     "key": "loanAccount.vehicleLoanDetails.futureLife",
                            //                                     "type": "number",
                            //                                     "title": "Expected future life of vehicle",
                            //                                     "readonly": true
                            //                                 }
                            //                             ]
                            //                         }
                            //                     ]
                            //                 }
                            //             ]
                            //         }
                            //     ]
                            // },
                            {
                                "type": "actionbox",
                                "items": [
                                    {
                                        "type": "button",
                                        "title": "SAVE",
                                        "onClick": "actions.save(model, formCtrl, form, $event)"
                                    }
                                ]
                            }
                        ]
                    }
                };
            }

            return {
                "type": "schema-form",
                "title": "TELEVERIFICATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                  
                    model.loanCustomer = {};
                    model.applicant = {};
                    model.coApplicants = [];
                    model.guarantors = [];

                    model.coapplicant = {};
                    model.guarantor = {};
                    model.telecalling = [];
                    model.loanAccount = model.loanProcess.loanAccount;
                    // Setting necessary parties to child arrays.
                    model.applicant.customer = model.loanProcess.applicantEnrolmentProcess.customer;
                    model.loanCustomer.customer = model.loanProcess.loanCustomerEnrolmentProcess.customer;

                    _.forEach(model.loanProcess.coApplicantsEnrolmentProcesses, function(i){
                        model.coApplicants.push({"customer":i.customer});
                    })

                    _.forEach(model.loanProcess.guarantorsEnrolmentProcesses, function(i){
                        model.guarantors.push({"customer":i.customer});
                    })

                    // applicant telecalling details
                    model.telecalling.applicant = _.filter(model.loanAccount.telecallingDetails, {"partyType": "applicant"});
                    // coapplicant telecalling details
                    model.telecalling.coApplicant = _.filter(model.loanAccount.telecallingDetails, {"partyType": "coApplicant"});
                    // guarantor telecalling details
                    model.telecalling.guarantor = _.filter(model.loanAccount.telecallingDetails, {"partyType": "guarantor"});
                    // business telecalling details
                    model.telecalling.loanCustomer = _.filter(model.loanAccount.telecallingDetails, {"partyType": "loanCustomer"});

                    var self = this;
                    Queries.questionnaireDetails('TELECALLING', 'Tele', 'televerification').then(
                        function(res) { 
                            model.applicant.telecallingQuestionnaireList = _.filter(res, function(obj) {
                                return obj.party_type == 'applicant';     
                            });
                            model.loanCustomer.telecallingQuestionnaireList = _.filter(res, function(obj) {
                                return obj.party_type == 'loanCustomer';
                            });
                            model.coapplicantQuestions = _.filter(res, function(obj) {
                                return obj.party_type == 'coApplicant';
                            });
                            model.guarantorQuestions = _.filter(res, function(obj) {
                                return obj.party_type == 'guarantor';
                            });

                            _.forEach(model.coApplicants, function(val, key) {
                                model.coApplicants[key].telecallingQuestionnaireList = model.coapplicantQuestions;
                                if(model.telecalling.coApplicant.length>0) {
                                    var findKey = _.findLastIndex(model.telecalling.coApplicant, ["customerId", val.customer.id]);
                                    if(findKey!=-1) {
                                        model.coApplicants[key].telecallingResponse = model.telecalling.coApplicant[findKey].telecallingResponse;
                                        model.coApplicants[key].noOfCallAttempts = model.telecalling.coApplicant[findKey].noOfCallAttempts;
                                        model.coApplicants[key].followupCallRequired = model.telecalling.coApplicant[findKey].followupCallRequired;
                                        model.coApplicants[key].telecallingRemarks = model.telecalling.coApplicant[findKey].telecallingRemarks;
                                        _.forEach(model.coapplicantQuestions, function(qval, qkey) {
                                            var callingDetails = _.find(model.telecalling.coApplicant[findKey].telecallingQuestionnaireList, {"question": qval.question});
                                            if(!_.isNull(callingDetails)) {
                                               model.coApplicants[key].telecallingQuestionnaireList[qkey].answer = callingDetails.answer;
                                            }
                                        });
                                    }
                                }
                            });

                            _.forEach(model.guarantors, function(val, key) {
                                model.guarantors[key].telecallingQuestionnaireList = model.guarantorQuestions;
                                if(model.telecalling.guarantor.length>0) {
                                    var findKey = _.findLastIndex(model.telecalling.guarantor, ["customerId", val.customer.id]);
                                    if(findKey!=-1) {
                                        model.guarantors[key].telecallingResponse = model.telecalling.guarantor[findKey].telecallingResponse;
                                        model.guarantors[key].noOfCallAttempts = model.telecalling.guarantor[findKey].noOfCallAttempts;
                                        model.guarantors[key].followupCallRequired = model.telecalling.guarantor[findKey].followupCallRequired;
                                        model.guarantors[key].telecallingRemarks = model.telecalling.guarantor[findKey].telecallingRemarks;
                                        _.forEach(model.guarantorQuestions, function(qval, qkey) {
                                            var callingDetails = _.find(model.telecalling.guarantor[findKey].telecallingQuestionnaireList, {"question": qval.question});
                                            if(!_.isNull(callingDetails)) {
                                               model.guarantors[key].telecallingQuestionnaireList[qkey].answer = callingDetails.answer;
                                            }
                                        });
                                    }
                                }
                            });

                            if(model.telecalling.applicant.length>0) {
                                var findKey = model.telecalling.applicant.length-1;
                                model.applicant.telecallingResponse = model.telecalling.applicant[findKey].telecallingResponse;
                                model.applicant.noOfCallAttempts = model.telecalling.applicant[findKey].noOfCallAttempts;
                                model.applicant.followupCallRequired = model.telecalling.applicant[findKey].followupCallRequired;
                                model.applicant.telecallingRemarks = model.telecalling.applicant[findKey].telecallingRemarks;
                                _.forEach(model.applicant.telecallingQuestionnaireList, function(val, key) {
                                    var callingDetails = _.find(model.telecalling.applicant[findKey].telecallingQuestionnaireList, {"question": val.question});
                                    if(!_.isNull(callingDetails)) {
                                       model.applicant.telecallingQuestionnaireList[key].answer = callingDetails.answer;
                                    }
                                });
                            }


                            if(model.telecalling.loanCustomer.length>0) {                            
                                var findKey = model.telecalling.loanCustomer.length-1;
                                model.loanCustomer.telecallingResponse = model.telecalling.loanCustomer[findKey].telecallingResponse;
                                model.loanCustomer.noOfCallAttempts = model.telecalling.loanCustomer[findKey].noOfCallAttempts;
                                model.loanCustomer.followupCallRequired = model.telecalling.loanCustomer[findKey].followupCallRequired;
                                model.loanCustomer.telecallingRemarks = model.telecalling.loanCustomer[findKey].telecallingRemarks;
                                _.forEach(model.loanCustomer.telecallingQuestionnaireList, function(val, key) {
                                    var callingDetails = _.find(model.telecalling.loanCustomer[findKey].telecallingQuestionnaireList, {"question": val.question});
                                    if(!_.isNull(callingDetails)) {
                                       model.loanCustomer.telecallingQuestionnaireList[key].answer = callingDetails.answer;
                                    }
                                });
                            }

                           /* UIRepository.getEnrolmentProcessUIRepository().$promise
                            .then(function(repo){
                                return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model)
                            })
                            .then(function(form){
                                self.form = form;
                            });*/
                        },
                        function(err) {
                            console.log(err);
                        }
                    )
                   /* model.loanProcess = bundleModel.loanProcess;
                    if(_.hasIn(model.loanProcess, 'loanAccount')) {
                        model.loanAccount = model.loanProcess.loanAccount;
                    }*/
                    var self = this;
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                    .then(function(repo){
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model);
                    })
                    .then(function(form){
                        self.form = form;
                    });

                    
                },
                eventListeners: {
                },
                offlineInitialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.loanProcess = bundleModel.loanProcess;
                    if(_.hasIn(model.loanProcess, 'loanAccount')) {
                        model.loanAccount = model.loanProcess.loanAccount;
                    }
                    // var self = this;
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                    .then(function(repo){
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model)
                    })
                    .then(function(form){
                        self.form = form;
                    });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.urnNo,
                        Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        item.customer.villageName
                    ]
                },
                form: [],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {                    
                    save: function(model, formCtrl, form, $event) {
                        model.applicant.customerId = model.applicant.customer.id;
                        model.applicant.partyType = "applicant";
                        model.applicant.customerCalledAt = new Date();
                        model.loanAccount.telecallingDetails.push(model.applicant);

                        model.loanCustomer.customerId = model.loanCustomer.customer.id;
                        model.loanCustomer.partyType = "loanCustomer";
                        model.loanCustomer.customerCalledAt = new Date();
                        model.loanAccount.telecallingDetails.push(model.loanCustomer);
                            
                        //  _.forEach(model.coApplicants, function(val) {
                        //     val.customerId = val.customer.id;
                        //     val.partyType = "coApplicant";
                        //     val.customerCalledAt = new Date();
                        //     model.loanAccount.telecallingDetails.push(val);
                        // });

                        // _.forEach(model.guarantors, function(val) {                            
                        //     val.customerId = val.customer.id;
                        //     val.partyType = "guarantor";
                        //     val.customerCalledAt = new Date();
                        //     model.loanAccount.telecallingDetails.push(val);
                        // });
                        
                        /* Loan SAVE */
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                            }, function(err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    }
                }
            };
        }
    }
})