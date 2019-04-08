define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "kgfs.loans.individual.booking.TeleVerification",
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
                                                                "key": "applicant.customer.centreId",
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
                                                                "enumCode": "loan_product_frequency",
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
                                                    },
                                                    // {
                                                    //     "type": "fieldset",
                                                    //     "title": "Remarks",
                                                    //     "items":[
                                                    //         {
                                                    //             "title":"REMARKS",
                                                    //             "type":"text"
                                                    //         },
                                                    //         {
                                                    //             "title":"FEEDBACK",
                                                    //             "type":"textarea"
                                                    //         }
                                                    //     ]
                                                    // }
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
                                                                "key": "telecalling.applicant.telecallingResponse",
                                                                "type": "select",
                                                                "title": "TELECALLING_RESPONSE",
                                                                "enumCode": "telecalling_response1",
                                                                "required" : true
                                                            },
                                                            {
                                                                "key": "telecalling.applicant.noOfCallAttempts",
                                                                "type": "number",
                                                                "title": "NO_OF_CALLATTEMPTS"
                                                            },
                                                            {
                                                                "key": "telecalling.applicant.followupCallRequired",
                                                                "type": "date",
                                                                "title": "FOLLOWUP_ON",
                                                                "condition": "model.telecalling.applicant.telecallingResponse !='Reachable'",
                                                                "required":true,
                                                                onChange: function (value, form, model, event) {
                                                                if(model.telecalling.applicant.followupCallRequired){
                                                                    var followupCallRequiredDate = moment(model.telecalling.applicant.followupCallRequired, SessionStore.getSystemDateFormat());
                                                                    var customerCalledDateValid = moment(model.telecalling.applicant.customerCalledDate, SessionStore.getSystemDateFormat());
                                                                    if (followupCallRequiredDate < customerCalledDateValid) {
                                                                        model.telecalling.applicant.followupCallRequired = null;
                                                                        PageHelper.showErrors({data:{error:"Followup Call Required Date always more than customer Called Date"}});
                                                                        return false;
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                "key": "telecalling.applicant.customerCalledDate",
                                                                "type": "date",
                                                                "title": "CUSTOMER_CALLED",
                                                                "readonly":true
                                                            },
                                                            {
                                                                "key": "telecalling.applicant.telecallingRemarks",
                                                                "type": "textarea",
                                                                "title": "TELECALLING_REMARKS"
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
            }

            return {
                "type": "schema-form",
                "title": "TELEVERIFICATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                    model.loanCustomer = {};
                    model.applicant = {};
                    model.telecalling = [];
                    model.loanAccount = model.loanProcess.loanAccount;
                    // Setting necessary parties to child arrays.
                    model.applicant.customer = model.loanProcess.applicantEnrolmentProcess.customer;
                    model.loanCustomer.customer = model.loanProcess.loanCustomerEnrolmentProcess.customer;

                    // applicant telecalling details
                    var telecallingApplicant= _.filter(model.loanAccount.telecallingDetails, {"partyType": "applicant"}); 
                    if(telecallingApplicant.length != 0) {
                        model.telecalling.applicant = telecallingApplicant[telecallingApplicant.length -1];
                    }

                    if(model.loanAccount.telecallingDetails && model.loanAccount.telecallingDetails.length == 0){
                        model.telecalling.applicant ={}
                        model.telecalling.applicant.customerCalledDate=moment().format(SessionStore.getSystemDateFormat());
                    }
                    
                    //if (_.hasIn(model, 'telecalling.applicant.customerCalled'))
                    

                    model.telecalling.loanCustomer = _.filter(model.loanAccount.telecallingDetails, {"partyType": "loanCustomer"});
                    if (_.hasIn(model, 'loanProcess.applicantEnrolmentProcess') && model.loanProcess.applicantEnrolmentProcess !=null){
                        model.applicantEnrolmentProcessDetails = {}; 
                        model.applicantEnrolmentProcessDetails=model.loanProcess.applicantEnrolmentProcess.customer;
                        model.applicant.customer.customerBankAccounts=model.applicantEnrolmentProcessDetails.customerBankAccounts;
                    }

                    if(model.loanAccount.frequency)
                    model.loanAccount.frequencyRequested=model.loanAccount.frequency;

                    var self = this;
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
                        model.applicant.telecallingResponse = model.telecalling.applicant.telecallingResponse;
                        model.applicant.noOfCallAttempts = model.telecalling.applicant.noOfCallAttempts;
                        model.applicant.followupCallRequired = model.telecalling.applicant.followupCallRequired;
                        model.applicant.telecallingRemarks = model.telecalling.applicant.telecallingRemarks;
                        model.applicant.customerCalledDate = (model.telecalling.applicant.customerCalledDate == moment().format(SessionStore.getSystemDateFormat())) ? model.telecalling.applicant.customerCalledDate : moment().format(SessionStore.getSystemDateFormat());
                        model.loanAccount.telecallingDetails.push(model.applicant);

                        model.loanCustomer.customerId = model.loanCustomer.customer.id;
                        model.loanCustomer.partyType = "loanCustomer";
                        model.loanCustomer.customerCalledAt = new Date();
                        model.loanAccount.telecallingDetails.push(model.loanCustomer);

                     //   BundleManager.broadcastEvent("telecall",{telecallingDetails: model.loanAccount.telecallingDetails}); 
                        
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
                                  
                                    BundleManager.pushEvent('teleVerification-capture', model._bundlePageObj, {loanAccount: model.loanAccount});
                                
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