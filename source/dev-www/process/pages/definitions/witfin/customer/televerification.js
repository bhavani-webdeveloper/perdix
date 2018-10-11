define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "witfin.customer.televerification",
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

            var generateQuestionairreFormForParty = function(key) {
                return {
                    "type": "box",
                    "colClass": "col-xs-6 col-md-6",
                    "title": "TELE_VERIFICATION",
                    "items": [
                        {
                            "key": key + ".questions",
                            "type": "array",
                            "add": null,
                            "remove": null,
                            "view": "fixed",
                            "items":  [
                                {
                                    "key": key + ".questions[].question",
                                    "type": "string",
                                    "title": "QUESTION",
                                    "readonly": true
                                },
                                {
                                    "key": key + ".questions[].answer",                                                                            
                                    "type": "string",  
                                    "title": "ANSWER",
                                    "condition":"model." + key + ".questions[arrayIndex].input_type=='string'"
                                },
                                {
                                    "key": key + ".questions[].answer",                                                                            
                                    "type": "textarea",  
                                    "title": "ANSWER",
                                    "condition":"model." + key + ".questions[arrayIndex].input_type=='textarea'"
                                },
                                {
                                    "key": key + ".questions[].answer",                                                                            
                                    "type": "number",  
                                    "title": "ANSWER",
                                    "condition":"model." + key + ".questions[arrayIndex].input_type=='number'"
                                },
                                {
                                    "key": key + ".questions[].answer",                                                                            
                                    "type": "select",  
                                    "title": "ANSWER",
                                    "condition":"model." + key + ".questions[arrayIndex].input_type=='select'"
                                }
                            ]
                        }
                    ]
                }
            }

            var coApplicantsFormDef = function(coapplicants) {
                var coAppData = []
                _.forEach(coapplicants, function(val, key) {
                    var data = [];
                    data.push({
                                "type": "box",
                                "title": "COAPPLICANT-"+(key+1)+"_INFORMATION",
                                "colClass": "col-xs-6 col-md-6",
                                "items": [                                                                
                                    {
                                        "type": "fieldset",
                                        "title": "PERSONAL_INFORMATION",
                                        "items": [
                                            {
                                                "key": "coApplicants["+key+"].customer.customerBranchId",
                                                "title": "BRANCH_NAME",
                                                "type": "select",
                                                "enumCode": "branch_id",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.centreId",
                                                "type": "lov",
                                                "title": "CENTRE",
                                                "filter": {
                                                    "parentCode": "branch_id"
                                                },
                                                "parentEnumCode": "branch_id",
                                                "parentValueExpr": "model.coApplicants["+key+"].customer.customerBranchId",
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
                                                "key": "coApplicants["+key+"].customer.urnNo",
                                                "title": "URN_NO",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.firstName",
                                                "title": "FULL_NAME",
                                                "type": "string",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.dateOfBirth",
                                                "title": "DATE_OF_BIRTH",
                                                "type": "date",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.gender",
                                                "type": "radios",
                                                "title": "GENDER",
                                                "enumCode": "gender",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.fatherFirstName",
                                                "title": "FATHER_FULL_NAME",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.photoImageId",
                                                "type": "file",
                                                "title": "CUSTOMER_PHOTO",
                                                "category": "CustomerEnrollment",
                                                "subCategory": "PHOTO",
                                                "fileType": "image/*",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.customerCategory",
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
                                                "key": "coApplicants["+key+"].customer.identityProofNo",
                                                "title": "IDENTITY_PROOFNO",
                                                "type": "barcode",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.identityProofImageId",
                                                "type": "file",
                                                "fileType": "application/pdf",
                                                "using": "scanner",
                                                "title": "IDENTITY_PROOF_DOCUMENT",
                                                "category": "CustomerEnrollment",
                                                "subCategory": "IDENTITYPROOF",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.addressProofNo",
                                                "type": "qrcode",
                                                "title": "ADDRESS_PROOF_NO",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.addressProofImageId",
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
                                                "key": "coApplicants["+key+"].customer.mobilePhone",
                                                "type": "text",
                                                "title": "MOBILE_PHONE",
                                                "inputmode": "number",
                                                "numberType": "tel",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.doorNo",
                                                "title": "DOOR_NO",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.pincode",
                                                "title": "PIN_CODE",
                                                "type": "lov",
                                                "fieldType": "number",
                                                "autolov": true,
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.locality",
                                                "title": "LOCALITY",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.villageName",
                                                "title": "VILLAGE_NAME",
                                                "enumCode":"village",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.district",                                                            
                                                "title": "DISTRICT",
                                                "enumCode":"district",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.state",
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
                                        "key": "coApplicants["+key+"].customer.customerBankAccounts",
                                        "items": [
                                            {
                                                "key": "coApplicants["+key+"].customer.customerBankAccounts[].ifscCode",
                                                "resolver": "BankIFSCLOVConfiguration",
                                                "type": "lov",
                                                "lovonly": true,
                                                "title": "IFSC_CODE",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.customerBankAccounts[].customerBankName",
                                                "title": "BANK_NAME",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.customerBankAccounts[].customerBankBranchName",
                                                "title": "BANK_BRANCH_NAME",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.customerBankAccounts[].customerNameAsInBank",
                                                "title": "CUSTOMER_NAME_IN_BANK",
                                                "readonly": true
                                            },
                                            {
                                                "key": "coApplicants["+key+"].customer.customerBankAccounts[].accountNumber",
                                                "title": "ACCOUNT_NUMBER",
                                                "readonly": true
                                            }
                                        ]                                                    
                                    }
                                ]
                            });
                    data.push(generateQuestionairreFormForParty("coApplicants["+key + "]"));
                    coAppData.push({"type": "section","htmlClass": "row","items": data});
                })
                return coAppData;
            }

            var guarantorsFormDef = function(guarantors) {
                var guarantorData = [];
                _.forEach(guarantors, function(val, key) {
                    var data = [];
                    data.push({
                                "type": "box",
                                "title": "GUARANTOR-"+(key+1)+"_INFORMATION",
                                "colClass": "col-xs-6 col-md-6",
                                "items": [                                                                
                                    {
                                        "type": "fieldset",
                                        "title": "PERSONAL_INFORMATION",
                                        "items": [
                                            {
                                                "key": "guarantors["+key+"].customer.customerBranchId",
                                                "title": "BRANCH_NAME",
                                                "type": "select",
                                                "enumCode": "branch_id",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.centreId",
                                                "type": "lov",
                                                "title": "CENTRE",
                                                "filter": {
                                                    "parentCode": "branch_id"
                                                },
                                                "parentEnumCode": "branch_id",
                                                "parentValueExpr": "model.guarantors["+key+"].customer.customerBranchId",
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
                                                "key": "guarantors["+key+"].customer.urnNo",
                                                "title": "URN_NO",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.firstName",
                                                "title": "FULL_NAME",
                                                "type": "string",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.dateOfBirth",
                                                "title": "DATE_OF_BIRTH",
                                                "type": "date",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.gender",
                                                "type": "radios",
                                                "title": "GENDER",
                                                "enumCode": "gender",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.fatherFirstName",
                                                "title": "FATHER_FULL_NAME",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.photoImageId",
                                                "type": "file",
                                                "title": "CUSTOMER_PHOTO",
                                                "category": "CustomerEnrollment",
                                                "subCategory": "PHOTO",
                                                "fileType": "image/*",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.customerCategory",
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
                                                "key": "guarantors["+key+"].customer.identityProofNo",
                                                "title": "IDENTITY_PROOFNO",
                                                "type": "barcode",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.identityProofImageId",
                                                "type": "file",
                                                "fileType": "application/pdf",
                                                "using": "scanner",
                                                "title": "IDENTITY_PROOF_DOCUMENT",
                                                "category": "CustomerEnrollment",
                                                "subCategory": "IDENTITYPROOF",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.addressProofNo",
                                                "type": "qrcode",
                                                "title": "ADDRESS_PROOF_NO",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.addressProofImageId",
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
                                                "key": "guarantors["+key+"].customer.mobilePhone",
                                                "type": "text",
                                                "title": "MOBILE_PHONE",
                                                "inputmode": "number",
                                                "numberType": "tel",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.doorNo",
                                                "title": "DOOR_NO",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.pincode",
                                                "title": "PIN_CODE",
                                                "type": "lov",
                                                "fieldType": "number",
                                                "autolov": true,
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.locality",
                                                "title": "LOCALITY",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.villageName",
                                                "title": "VILLAGE_NAME",
                                                "enumCode":"village",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.district",                                                            
                                                "title": "DISTRICT",
                                                "enumCode":"district",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.state",
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
                                        "key": "guarantors["+key+"].customer.customerBankAccounts",
                                        "items": [
                                            {
                                                "key": "guarantors["+key+"].customer.customerBankAccounts[].ifscCode",
                                                "resolver": "BankIFSCLOVConfiguration",
                                                "type": "lov",
                                                "lovonly": true,
                                                "title": "IFSC_CODE",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.customerBankAccounts[].customerBankName",
                                                "title": "BANK_NAME",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.customerBankAccounts[].customerBankBranchName",
                                                "title": "BANK_BRANCH_NAME",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.customerBankAccounts[].customerNameAsInBank",
                                                "title": "CUSTOMER_NAME_IN_BANK",
                                                "readonly": true
                                            },
                                            {
                                                "key": "guarantors["+key+"].customer.customerBankAccounts[].accountNumber",
                                                "title": "ACCOUNT_NUMBER",
                                                "readonly": true
                                            }
                                        ]                                                    
                                    }
                                ]
                            });
                    data.push(generateQuestionairreFormForParty("guarantors["+ key + "]"));
                    guarantorData.push({"type": "section","htmlClass": "row","items": data});
                });
                return guarantorData;
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
                    Queries.questionnaireDetails('TELECALLING', 'Loan', 'Televerification').then(
                        function(res) { 
                            model.applicant.questions = _.filter(res, function(obj) {
                                return obj.party_type == 'applicant';     
                            });
                            model.loanCustomer.questions = _.filter(res, function(obj) {
                                return obj.party_type == 'loanCustomer';
                            });
                            model.coapplicantQuestions = _.filter(res, function(obj) {
                                return obj.party_type == 'coApplicant';
                            });
                            model.guarantorQuestions = _.filter(res, function(obj) {
                                return obj.party_type == 'guarantor';
                            });

                            _.forEach(model.coApplicants, function(val, key) {
                                model.coApplicants[key].questions = model.coapplicantQuestions;
                                if(model.telecalling.coApplicant.length>0) {
                                    var findKey = _.findLastIndex(model.telecalling.coApplicant, ["customerId", val.customer.id]);
                                    if(findKey!=-1) {
                                        _.forEach(model.coapplicantQuestions, function(qval, qkey) {
                                            var callingDetails = _.find(model.telecalling.coApplicant[findKey].telecallingQuestionnaireList, {"question": qval.question});
                                            if(!_.isNull(callingDetails)) {
                                               model.coApplicants[key].questions[qkey].answer = callingDetails.answer;
                                            }
                                        });
                                    }
                                }
                            });

                            _.forEach(model.guarantors, function(val, key) {
                                model.guarantors[key].questions = model.guarantorQuestions;
                                if(model.telecalling.guarantor.length>0) {
                                    var findKey = _.findLastIndex(model.telecalling.guarantor, ["customerId", val.customer.id]);
                                    if(findKey!=-1) {
                                        _.forEach(model.guarantorQuestions, function(qval, qkey) {
                                            var callingDetails = _.find(model.telecalling.guarantor[findKey].telecallingQuestionnaireList, {"question": qval.question});
                                            if(!_.isNull(callingDetails)) {
                                               model.guarantors[key].questions[qkey].answer = callingDetails.answer;
                                            }
                                        });
                                    }
                                }
                            });

                            if(model.telecalling.applicant.length>0) {
                                var findKey = model.telecalling.applicant.length-1;
                                _.forEach(model.applicant.questions, function(val, key) {
                                    var callingDetails = _.find(model.telecalling.applicant[findKey].telecallingQuestionnaireList, {"question": val.question});
                                    if(!_.isNull(callingDetails)) {
                                       model.applicant.questions[key].answer = callingDetails.answer;
                                    }
                                });
                            }


                            if(model.telecalling.loanCustomer.length>0) {                                
                                var findKey = model.telecalling.loanCustomer.length-1;
                                _.forEach(model.loanCustomer.questions, function(val, key) {
                                    var callingDetails = _.find(model.telecalling.loanCustomer[findKey].telecallingQuestionnaireList, {"question": val.question});
                                    if(!_.isNull(callingDetails)) {
                                       model.loanCustomer.questions[key].answer = callingDetails.answer;
                                    }
                                });
                            }

                            /*_.forEach(model.coapplicant.questions, function(val, key) {
                                var callingDetails = _.find(model.loanAccount.coapplicantTelecallingDetails[0].telecallingQuestionnaireList, {"question": val.question});
                                if(!_.isNull(callingDetails)) {
                                   model.coapplicant.questions[key].answer = callingDetails.answer;
                                }
                            });

                            _.forEach(model.guarantor.questions, function(val, key) {
                                var callingDetails = _.find(model.loanAccount.guarantorTelecallingDetails[0].telecallingQuestionnaireList, {"question": val.question});
                                if(!_.isNull(callingDetails)) {
                                   model.guarantor.questions[key].answer = callingDetails.answer;
                                }
                            });*/

                            var formRequest = {
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
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "box",
                                                            "colClass": "col-xs-6 col-md-6",
                                                            "title": "APPLICANT_TELE_VERIFICATION",
                                                            "items": [
                                                                {
                                                                    "key": "applicant.questions",
                                                                    "type": "array",
                                                                    "add": null,
                                                                    "remove": null,
                                                                    "view": "fixed",
                                                                    "items":  [
                                                                        {
                                                                            "key": "applicant.questions[].question",
                                                                            "type": "string",
                                                                            "title": "QUESTION",
                                                                            "readonly": true
                                                                        },
                                                                        {
                                                                            "key": "applicant.questions[].answer",                                                                            
                                                                            "type": "string",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.applicant.questions[arrayIndex].input_type=='string'"
                                                                        },
                                                                        {
                                                                            "key": "applicant.questions[].answer",                                                                            
                                                                            "type": "textarea",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.applicant.questions[arrayIndex].input_type=='textarea'"
                                                                        },
                                                                        {
                                                                            "key": "applicant.questions[].answer",                                                                            
                                                                            "type": "number",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.applicant.questions[arrayIndex].input_type=='number'"
                                                                        },
                                                                        {
                                                                            "key": "applicant.questions[].answer",                                                                            
                                                                            "type": "select",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.applicant.questions[arrayIndex].input_type=='select'"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-12",
                                            "items": coApplicantsFormDef(model.coApplicants)
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-12",
                                            "items": guarantorsFormDef(model.guarantors)
                                        },
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
                                                            "title": "BUSINESS_INFORMATION",
                                                            "colClass": "col-xs-6 col-md-6",
                                                            "items": [

                                                               {
                                                                    "key": "loanCustomer.customer.id",
                                                                    "type": "number",
                                                                    "title": "ENTITY_ID",
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.enterprise.businessConstitution",
                                                                    "title": "CONSTITUTION",
                                                                    "type": "select",
                                                                    "enumCode": "constitution",
                                                                    "schema": {
                                                                        "required": false
                                                                    },
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.mobilePhone",
                                                                    "type": "text",
                                                                    "title": "MOBILE_PHONE",
                                                                    "inputmode": "number",
                                                                    "numberType": "tel",
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.doorNo",
                                                                    "title": "DOOR_NO",
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.pincode",
                                                                    "title": "PIN_CODE",
                                                                    "type": "lov",
                                                                    "fieldType": "number",
                                                                    "autolov": true,
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.locality",
                                                                    "title": "LOCALITY",
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.villageName",
                                                                    "title": "VILLAGE_NAME",
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.district",
                                                                    "title": "DISTRICT",
                                                                    "readonly": true
                                                                },
                                                                {
                                                                    "key": "loanCustomer.customer.state",
                                                                    "title": "STATE",
                                                                    "readonly": true
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type": "box",
                                                            "colClass": "col-xs-6 col-md-6",
                                                            "title": "TELE_VERIFICATION",
                                                            "items": [
                                                                {
                                                                    "key": "loanCustomer.questions",
                                                                    "type": "array",
                                                                    "add": null,
                                                                    "remove": null,
                                                                    "view": "fixed",
                                                                    "items":  [
                                                                        {
                                                                            "key": "loanCustomer.questions[].question",
                                                                            "type": "string",
                                                                            "title": "QUESTION",
                                                                            "readonly": true
                                                                        },
                                                                        {
                                                                            "key": "loanCustomer.questions[].answer",                                                                            
                                                                            "type": "string",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.loanCustomer.questions[arrayIndex].input_type=='string'"
                                                                        },
                                                                        {
                                                                            "key": "loanCustomer.questions[].answer",                                                                            
                                                                            "type": "textarea",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.loanCustomer.questions[arrayIndex].input_type=='textarea'"
                                                                        },
                                                                        {
                                                                            "key": "loanCustomer.questions[].answer",                                                                            
                                                                            "type": "number",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.loanCustomer.questions[arrayIndex].input_type=='number'"
                                                                        },
                                                                        {
                                                                            "key": "loanCustomer.questions[].answer",                                                                            
                                                                            "type": "select",  
                                                                            "title": "ANSWER",
                                                                            "condition":"model.loanCustomer.questions[arrayIndex].input_type=='select'"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
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
                        model.loanAccount.telecallingDetails.push({"customerId":model.applicant.customer.id, "partyType":"applicant","telecallingQuestionnaireList":model.applicant.questions});
                        model.loanAccount.telecallingDetails.push({"customerId":model.loanCustomer.customer.id, "partyType":"loanCustomer","telecallingQuestionnaireList":model.loanCustomer.questions});
                            
                         _.forEach(model.coApplicants, function(val) {
                            model.loanAccount.telecallingDetails.push({"customerId":val.customer.id, "partyType":"coApplicant","telecallingQuestionnaireList":val.questions});
                        });

                        _.forEach(model.guarantors, function(val) {
                            model.loanAccount.telecallingDetails.push({"customerId":val.customer.id, "partyType":"guarantor","telecallingQuestionnaireList":val.questions});
                        });

                        /*// applicant telecalling details
                        var applicantKey = _.findIndex(model.loanAccount.telecallingDetails, function(o) {
                            return o.customerId==model.applicant.customer.id && o.partyType == 'applicant';
                        });
                        if(applicantKey == -1) {
                            model.loanAccount.telecallingDetails.push({"customerId":model.applicant.customer.id, "partyType":"applicant","telecallingQuestionnaireList":model.applicant.questions});
                        } else {
                            model.loanAccount.telecallingDetails[applicantKey].telecallingQuestionnaireList = model.applicant.questions;
                        }

                        // loan customer telecalling details                        
                        var loanCustomerKey = _.findIndex(model.loanAccount.telecallingDetails, function(o) {
                            return o.customerId==model.loanCustomer.customer.id && o.partyType == 'loanCustomer';
                        });

                        if(loanCustomerKey == -1) {
                            model.loanAccount.telecallingDetails.push({"customerId":model.loanCustomer.customer.id, "partyType":"loanCustomer","telecallingQuestionnaireList":model.loanCustomer.questions});
                        } else {
                            model.loanAccount.telecallingDetails[loanCustomerKey].telecallingQuestionnaireList = model.loanCustomer.questions;
                        }

                        // co-applicant telecalling details 
                        _.forEach(model.coApplicants, function(val) {
                            var coAppKey = _.findIndex(model.loanAccount.telecallingDetails, function(o) {
                                return o.customerId==val.customer.id && o.partyType == 'coApplicant';
                            });

                            if(coAppKey == -1) {
                                model.loanAccount.telecallingDetails.push({"customerId":val.customer.id, "partyType":"coApplicant","telecallingQuestionnaireList":val.questions});
                            } else {
                                model.loanAccount.telecallingDetails[coAppKey].telecallingQuestionnaireList = val.questions;       
                            }
                        });


                        // guarantor telecalling details 
                        _.forEach(model.guarantors, function(val) {
                             var guarantorKey = _.findIndex(model.loanAccount.telecallingDetails, function(o) {
                                return o.customerId==val.customer.id && o.partyType == 'guarantor';
                            });

                            if(guarantorKey == -1) {
                                model.loanAccount.telecallingDetails.push({"customerId":val.customer.id, "partyType":"guarantor","telecallingQuestionnaireList":val.questions});
                            } else {
                                model.loanAccount.telecallingDetails[guarantorKey].telecallingQuestionnaireList = val.questions;                                
                            }
                        });*/
                        

                        // return false;
                        
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
