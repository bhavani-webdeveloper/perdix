define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "witfin.customer.tvr",
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

            var getFormDef = function(questions) {
                var data = [];
                var count = 1;
                _.forEach(questions, function(val) {
                    data.push({'type':'string', 'title':'QUESTION','key':'loanAccount.questionnaire.'+val.party_type+'['+count+'].question', 'readonly':true});
                    if(val.input_type == 'select') {
                        data.push({'type': val.input_type, 'title':'ANSWER','key':'loanAccount.questionnaire.'+val.party_type+'['+count+'].answer', 'titleMap':val.select});
                    } else {
                        data.push({'type': val.input_type, 'title':'ANSWER','key':'loanAccount.questionnaire.'+val.party_type+'['+count+'].answer'});
                    }
                    count++;
                });
                return data;
            }

            return {
                "type": "schema-form",
                "title": "TELEVERIFICATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.loanAccount = model.loanProcess.loanAccount;
                    model.customer = model.loanProcess.loanCustomerEnrolmentProcess.customer;
                    model.applicant = model.loanProcess.applicantEnrolmentProcess.customer;
                    model.coapplicant = model.loanProcess.coApplicantsEnrolmentProcesses[0].customer;
                    model.guarantor = model.loanProcess.guarantorsEnrolmentProcesses[0].customer;
                    model.loanAccount.questionnaireDetails = {};
                    model.loanAccount.questionnaireDetails.applicant = [];
                    model.loanAccount.questionnaireDetails.business = [];
                    model.loanAccount.questionnaireDetails.coapplicant = [];
                    model.loanAccount.questionnaireDetails.guarantor = [];
                    var self = this;
                    Queries.questionnaireDetails('TELECALLING', 'Loan', 'Televerification').then(
                        function(res) {
                            model.loanAccount.questionnaireDetails.applicant = _.filter(res, function(obj) {
                                return obj.party_type == 'applicant';     
                            });
                            model.loanAccount.questionnaireDetails.business = _.filter(res, function(obj) {
                                return obj.party_type == 'business';
                            });
                            model.loanAccount.questionnaireDetails.coapplicant = _.filter(res, function(obj) {
                                return obj.party_type == 'coapplicant';
                            });
                            model.loanAccount.questionnaireDetails.guarantor = _.filter(res, function(obj) {
                                return obj.party_type == 'guarantor';
                            });

                            model.loanAccount.questionnaire = {}; 
                            model.loanAccount.questionnaire.applicant = []; 
                            var count = 1;
                            _.forEach(model.loanAccount.questionnaireDetails.applicant, function(val) {
                                model.loanAccount.questionnaire.applicant[count] = {'question':val.question};
                                count++;
                            });

                            model.loanAccount.questionnaire.business = []; 
                            var count = 1;
                            _.forEach(model.loanAccount.questionnaireDetails.business, function(val) {
                                model.loanAccount.questionnaire.business[count] = {'question':val.question};
                                count++;
                            });

                            model.loanAccount.questionnaire.coapplicant = []; 
                            var count = 1;
                            _.forEach(model.loanAccount.questionnaireDetails.coapplicant, function(val) {
                                model.loanAccount.questionnaire.coapplicant[count] = {'question':val.question};
                                count++;
                            });

                            model.loanAccount.questionnaire.guarantor = []; 
                            var count = 1;
                            _.forEach(model.loanAccount.questionnaireDetails.guarantor, function(val) {
                                model.loanAccount.questionnaire.guarantor[count] = {'question':val.question};
                                count++;
                            });

                            var formRequest = {
                                "overrides": overridesFields(model),
                                "includes": getIncludes(model),
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions": {
                                    },
                                    "additions": [
                                        {
                                            "type": "box",
                                            "title": "APPLICANT",
                                            "items": [
                                                {
                                                    "type": "fieldset",
                                                    "title": "PERSONAL_INFORMATION",
                                                    "items": [
                                                        {
                                                            "key": "applicant.customerBranchId",
                                                            "title": "BRANCH_NAME",
                                                            "type": "select",
                                                            "enumCode": "branch_id",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.centreId",
                                                            "type": "lov",
                                                            "title": "CENTRE",
                                                            "filter": {
                                                                "parentCode": "branch_id"
                                                            },
                                                            "parentEnumCode": "branch_id",
                                                            "parentValueExpr": "model.applicant.customerBranchId",
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
                                                            "key": "applicant.urnNo",
                                                            "title": "URN_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.firstName",
                                                            "title": "FULL_NAME",
                                                            "type": "string",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.dateOfBirth",
                                                            "title": "DATE_OF_BIRTH",
                                                            "type": "date",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.gender",
                                                            "type": "radios",
                                                            "title": "GENDER",
                                                            "enumCode": "gender",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.fatherFirstName",
                                                            "title": "FATHER_FULL_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.photoImageId",
                                                            "type": "file",
                                                            "title": "CUSTOMER_PHOTO",
                                                            "category": "CustomerEnrollment",
                                                            "subCategory": "PHOTO",
                                                            "fileType": "image/*",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.customerCategory",
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
                                                            "key": "applicant.identityProofNo",
                                                            "title": "IDENTITY_PROOFNO",
                                                            "type": "barcode",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.identityProofImageId",
                                                            "type": "file",
                                                            "fileType": "application/pdf",
                                                            "using": "scanner",
                                                            "title": "IDENTITY_PROOF_DOCUMENT",
                                                            "category": "CustomerEnrollment",
                                                            "subCategory": "IDENTITYPROOF",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.addressProofNo",
                                                            "type": "qrcode",
                                                            "title": "ADDRESS_PROOF_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.addressProofImageId",
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
                                                            "key": "applicant.mobilePhone",
                                                            "type": "text",
                                                            "title": "MOBILE_PHONE",
                                                            "inputmode": "number",
                                                            "numberType": "tel",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.doorNo",
                                                            "title": "DOOR_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.pincode",
                                                            "title": "PIN_CODE",
                                                            "type": "lov",
                                                            "fieldType": "number",
                                                            "autolov": true,
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.locality",
                                                            "title": "LOCALITY",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.villageName",
                                                            "title": "VILLAGE_NAME",
                                                            "enumCode":"village",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.district",                                                            
                                                            "title": "DISTRICT",
                                                            "enumCode":"district",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.state",
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
                                                    "key": "applicant.customerBankAccounts",
                                                    "items": [
                                                        {
                                                            "key": "applicant.customerBankAccounts[].ifscCode",
                                                            "resolver": "BankIFSCLOVConfiguration",
                                                            "type": "lov",
                                                            "lovonly": true,
                                                            "title": "IFSC_CODE",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.customerBankAccounts[].customerBankName",
                                                            "title": "BANK_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.customerBankAccounts[].customerBankBranchName",
                                                            "title": "BANK_BRANCH_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.customerBankAccounts[].customerNameAsInBank",
                                                            "title": "CUSTOMER_NAME_IN_BANK",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "applicant.customerBankAccounts[].accountNumber",
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
                                                        },
                                                        {
                                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5",
                                                            "title" : "FLAT_RATE",
                                                            "type": "string",
                                                            "readonly" : true
                                                        },
                                                        {
                                                            "key": "loanAccount.expectedInterestRate",
                                                            "type": "number",
                                                            "title": "NOMINAL_RATE",
                                                            "readonly": true
                                                        }
                                                    ]                                                    
                                                },
                                                {
                                                    "type": "fieldset",
                                                    "title": "POST_REVIEW",
                                                    "items": getFormDef(model.loanAccount.questionnaireDetails.applicant)
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "title": "Business",
                                            "items": [
                                                {
                                                    "type": "fieldset",
                                                    "title": "ENTITY_INFORMATION",
                                                    "items": [
                                                        {
                                                            "key": "customer.id",
                                                            "type": "number",
                                                            "title": "ENTITY_ID",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.enterprise.businessConstitution",
                                                            "title": "CONSTITUTION",
                                                            "type": "select",
                                                            "enumCode": "constitution",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.mobilePhone",
                                                            "type": "text",
                                                            "inputmode": "number",
                                                            "numberType": "tel",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.doorNo",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.pincode",
                                                            "title": "PIN_CODE",
                                                            "type": "lov",
                                                            "fieldType": "number",
                                                            "autolov": true,
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.locality",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.villageName",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.district",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "customer.state",
                                                            "readonly": true
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "fieldset",
                                                    "title": "POST_REVIEW",
                                                    "items": getFormDef(model.loanAccount.questionnaireDetails.business)
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "title": "CO-APPLICANT",
                                            "items": [
                                                {
                                                    "type": "fieldset",
                                                    "title": "PERSONAL_INFORMATION",
                                                    "items": [
                                                        {
                                                            "key": "coapplicant.customerBranchId",
                                                            "title": "BRANCH_NAME",
                                                            "type": "select",
                                                            "enumCode": "branch_id",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.centreId",
                                                            "type": "lov",
                                                            "title": "CENTRE",
                                                            "filter": {
                                                                "parentCode": "branch_id"
                                                            },
                                                            "parentEnumCode": "branch_id",
                                                            "parentValueExpr": "model.coapplicant.customerBranchId",
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
                                                            "key": "coapplicant.urnNo",
                                                            "title": "URN_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.firstName",
                                                            "title": "FULL_NAME",
                                                            "type": "string",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.dateOfBirth",
                                                            "title": "DATE_OF_BIRTH",
                                                            "type": "date",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.gender",
                                                            "type": "radios",
                                                            "title": "GENDER",
                                                            "enumCode": "gender",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.fatherFirstName",
                                                            "title": "FATHER_FULL_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.photoImageId",
                                                            "type": "file",
                                                            "title": "CUSTOMER_PHOTO",
                                                            "category": "CustomerEnrollment",
                                                            "subCategory": "PHOTO",
                                                            "fileType": "image/*",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.customerCategory",
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
                                                            "key": "coapplicant.identityProofNo",
                                                            "title": "IDENTITY_PROOFNO",
                                                            "type": "barcode",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.identityProofImageId",
                                                            "type": "file",
                                                            "fileType": "application/pdf",
                                                            "using": "scanner",
                                                            "title": "IDENTITY_PROOF_DOCUMENT",
                                                            "category": "CustomerEnrollment",
                                                            "subCategory": "IDENTITYPROOF",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.addressProofNo",
                                                            "type": "qrcode",
                                                            "title": "ADDRESS_PROOF_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.addressProofImageId",
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
                                                            "key": "coapplicant.mobilePhone",
                                                            "type": "text",
                                                            "title": "MOBILE_PHONE",
                                                            "inputmode": "number",
                                                            "numberType": "tel",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.doorNo",
                                                            "title": "DOOR_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.pincode",
                                                            "title": "PIN_CODE",
                                                            "type": "lov",
                                                            "fieldType": "number",
                                                            "autolov": true,
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.locality",
                                                            "title": "LOCALITY",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.villageName",
                                                            "title": "VILLAGE_NAME",
                                                            "enumCode":"village",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.district",                                                            
                                                            "title": "DISTRICT",
                                                            "enumCode":"district",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.state",
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
                                                    "key": "coapplicant.customerBankAccounts",
                                                    "items": [
                                                        {
                                                            "key": "coapplicant.customerBankAccounts[].ifscCode",
                                                            "resolver": "BankIFSCLOVConfiguration",
                                                            "type": "lov",
                                                            "lovonly": true,
                                                            "title": "IFSC_CODE",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.customerBankAccounts[].customerBankName",
                                                            "title": "BANK_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.customerBankAccounts[].customerBankBranchName",
                                                            "title": "BANK_BRANCH_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.customerBankAccounts[].customerNameAsInBank",
                                                            "title": "CUSTOMER_NAME_IN_BANK",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "coapplicant.customerBankAccounts[].accountNumber",
                                                            "title": "ACCOUNT_NUMBER",
                                                            "readonly": true
                                                        }
                                                    ]                                                    
                                                },
                                                {
                                                    "type": "fieldset",
                                                    "title": "POST_REVIEW",
                                                    "items": getFormDef(model.loanAccount.questionnaireDetails.coapplicant)
                                                }
                                            ]
                                        },
                                        {
                                            "type": "box",
                                            "title": "GUARANTOR",
                                            "items": [
                                                {
                                                    "type": "fieldset",
                                                    "title": "PERSONAL_INFORMATION",
                                                    "items": [
                                                        {
                                                            "key": "guarantor.customerBranchId",
                                                            "title": "BRANCH_NAME",
                                                            "type": "select",
                                                            "enumCode": "branch_id",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.centreId",
                                                            "type": "lov",
                                                            "title": "CENTRE",
                                                            "filter": {
                                                                "parentCode": "branch_id"
                                                            },
                                                            "parentEnumCode": "branch_id",
                                                            "parentValueExpr": "model.guarantor.customerBranchId",
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
                                                            "key": "guarantor.urnNo",
                                                            "title": "URN_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.firstName",
                                                            "title": "FULL_NAME",
                                                            "type": "string",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.dateOfBirth",
                                                            "title": "DATE_OF_BIRTH",
                                                            "type": "date",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.gender",
                                                            "type": "radios",
                                                            "title": "GENDER",
                                                            "enumCode": "gender",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.fatherFirstName",
                                                            "title": "FATHER_FULL_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.photoImageId",
                                                            "type": "file",
                                                            "title": "CUSTOMER_PHOTO",
                                                            "category": "CustomerEnrollment",
                                                            "subCategory": "PHOTO",
                                                            "fileType": "image/*",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.customerCategory",
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
                                                            "key": "guarantor.identityProofNo",
                                                            "title": "IDENTITY_PROOFNO",
                                                            "type": "barcode",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.identityProofImageId",
                                                            "type": "file",
                                                            "fileType": "application/pdf",
                                                            "using": "scanner",
                                                            "title": "IDENTITY_PROOF_DOCUMENT",
                                                            "category": "CustomerEnrollment",
                                                            "subCategory": "IDENTITYPROOF",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.addressProofNo",
                                                            "type": "qrcode",
                                                            "title": "ADDRESS_PROOF_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.addressProofImageId",
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
                                                            "key": "guarantor.mobilePhone",
                                                            "type": "text",
                                                            "title": "MOBILE_PHONE",
                                                            "inputmode": "number",
                                                            "numberType": "tel",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.doorNo",
                                                            "title": "DOOR_NO",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.pincode",
                                                            "title": "PIN_CODE",
                                                            "type": "lov",
                                                            "fieldType": "number",
                                                            "autolov": true,
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.locality",
                                                            "title": "LOCALITY",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.villageName",
                                                            "title": "VILLAGE_NAME",
                                                            "enumCode":"village",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.district",                                                            
                                                            "title": "DISTRICT",
                                                            "enumCode":"district",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.state",
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
                                                    "key": "guarantor.customerBankAccounts",
                                                    "items": [
                                                        {
                                                            "key": "guarantor.customerBankAccounts[].ifscCode",
                                                            "resolver": "BankIFSCLOVConfiguration",
                                                            "type": "lov",
                                                            "lovonly": true,
                                                            "title": "IFSC_CODE",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.customerBankAccounts[].customerBankName",
                                                            "title": "BANK_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.customerBankAccounts[].customerBankBranchName",
                                                            "title": "BANK_BRANCH_NAME",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.customerBankAccounts[].customerNameAsInBank",
                                                            "title": "CUSTOMER_NAME_IN_BANK",
                                                            "readonly": true
                                                        },
                                                        {
                                                            "key": "guarantor.customerBankAccounts[].accountNumber",
                                                            "title": "ACCOUNT_NUMBER",
                                                            "readonly": true
                                                        }
                                                    ]                                                    
                                                },
                                                {
                                                    "type": "fieldset",
                                                    "title": "POST_REVIEW",
                                                    "items": getFormDef(model.loanAccount.questionnaireDetails.guarantor)
                                                }
                                            ]
                                        },
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

                            UIRepository.getEnrolmentProcessUIRepository().$promise
                            .then(function(repo){
                                return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                            })
                            .then(function(form){
                                self.form = form;
                            });
                        },
                        function(err) {
                            console.log(err);
                        }
                    )

                    
                },
                eventListeners: {
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
                        model.loanAccount.telecallingDetails.push({"customerId":model.applicant.id, "partyType":"applicant","telecallingQuestionnaireList":model.loanAccount.questionnaire.applicant});
                        model.loanAccount.telecallingDetails.push({"customerId":model.customer.id, "partyType":"business","telecallingQuestionnaireList":model.loanAccount.questionnaire.business});
                        model.loanAccount.telecallingDetails.push({"customerId":model.coapplicant.id, "partyType":"coapplicant","telecallingQuestionnaireList":model.loanAccount.questionnaire.coapplicant});
                        model.loanAccount.telecallingDetails.push({"customerId":model.guarantor.id, "partyType":"guarantor","telecallingQuestionnaireList":model.loanAccount.questionnaire.guarantor});
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
