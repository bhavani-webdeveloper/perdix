define([],function(){

    return {
        pageUID: "irep.loans.individual.origination.LoanRequest",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],

        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();


            var self;
            var validateForm = function(formCtrl){
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };





            var getRelationFromClass = function(relation){
                if (relation == 'guarantor'){
                    return 'Guarantor';
                } else if (relation == 'applicant'){
                    return 'Applicant';
                } else if (relation == 'co-applicant'){
                    return 'Co-Applicant';
                }
            };



            var configFile = function() {
                return {
                    "loanAccount.currentStage": {
                        "Screening": {
                            "excludes": [
                                "LoanRecommendation",
                                "AdditionalLoanInformation",
                                "NomineeDetails"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2
                                },
                                "DeductionsFromLoan": {
                                    "orderNo": 3
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "PreliminaryInformation.loanAmountRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.tenureRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedEmi": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.emiRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.collectionPaymentType": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedPortfolioInsurancePremium": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loanPurpose1": {
                                    "resolver": "LoanPurpose1LOVConfiguration"
                                },
                                "PreliminaryInformation.loanPurpose2": {
                                    "resolver": "LoanPurpose2LOVConfiguration"
                                },
                                "PreliminaryInformation.linkedAccountNumber": {
                                    "resolver": "LinkedAccountNumberLOVConfiguration"
                                },
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": false
                                },
                                "LoanCustomerRelations.loanCustomerRelations.customerId": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.urn": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.name": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relation": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                   "required": true
                                }
                            }
                        },
                        "ScreeningReview": {
                            "excludes": [
                                "AdditionalLoanInformation",
                                "NomineeDetails"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2
                                },
                                "DeductionsFromLoan": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "LoanRecommendation": {
                                    "orderNo": 6
                                },
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'"
                                }
                            }
                        },
                        "Application": {
                            "excludes": ["LoanRecommendation"],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2
                                },
                                "DeductionsFromLoan": {
                                    "orderNo": 3
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6
                                },
                                "NomineeDetails": {
                                    "orderNo": 7
                                },
                                "PreliminaryInformation.loanAmountRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.tenureRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedEmi": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.emiRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.collectionPaymentType": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedPortfolioInsurancePremium": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loanPurpose1": {
                                    "resolver": "LoanPurpose1LOVConfiguration"
                                },
                                "PreliminaryInformation.loanPurpose2": {
                                    "resolver": "LoanPurpose2LOVConfiguration"
                                },
                                "PreliminaryInformation.linkedAccountNumber": {
                                    "resolver": "LinkedAccountNumberLOVConfiguration"
                                },
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.customerId": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.urn": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.name": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relation": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                   "required": true
                                },
                                "AdditionalLoanInformation.productCategory": {
                                   "required":true,
                                   "type":"select",
                                   "enumCode":"loan_product_category"
                                },
                                "AdditionalLoanInformation.proposedHires": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeFirstName": {
                                   "required":true,
                                   "resolver": "NomineeFirstNameLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeGender": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeDOB": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeDoorNo": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineePincode": {
                                   "required": true,
                                   "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeRelationship": {
                                   "required":true
                                }

                            }
                        },
                        "FieldAppraisal": {
                            "excludes": [],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2
                                },
                                "DeductionsFromLoan": {
                                    "orderNo": 3
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6
                                },
                                "NomineeDetails": {
                                    "orderNo": 7
                                },
                                "LoanRecommendation": {
                                    "orderNo": 8
                                },
                                "PreliminaryInformation.loanAmountRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.tenureRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedEmi": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.emiRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.collectionPaymentType": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedPortfolioInsurancePremium": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loanPurpose1": {
                                    "resolver": "LoanPurpose1LOVConfiguration"
                                },
                                "PreliminaryInformation.loanPurpose2": {
                                    "resolver": "LoanPurpose2LOVConfiguration"
                                },
                                "PreliminaryInformation.linkedAccountNumber": {
                                    "resolver": "LinkedAccountNumberLOVConfiguration"
                                },
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.customerId": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.urn": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.name": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relation": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                   "required": true
                                },
                                "AdditionalLoanInformation.productCategory": {
                                   "required":true,
                                   "type":"select",
                                   "enumCode":"loan_product_category"
                                },
                                "AdditionalLoanInformation.proposedHires": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeFirstName": {
                                   "required":true,
                                   "resolver": "NomineeFirstNameLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeGender": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeDOB": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeDoorNo": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineePincode": {
                                   "required": true,
                                   "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeRelationship": {
                                   "required":true
                                },
                                "LoanRecommendation.loanAmount": {
                                   "required":true
                                },
                                "LoanRecommendation.tenure": {
                                   "required":true
                                },
                                "LoanRecommendation.interestRate": {
                                   "required":true
                                },
                                "LoanRecommendation.estimatedEmi": {
                                   "readonly":true
                                },
                                "LoanRecommendation.processingFeePercentage": {
                                   "required":true
                                },
                                "LoanRecommendation.securityEmiRequired": {
                                   "readonly":true
                                }
                            }
                        }
                    }

                }
            }

            var getIncludes = function (model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.linkedAccountNumber",
                    "PreliminaryInformation.loan",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.loanToValue",
                    "PreliminaryInformation.frequencyRequested",
                    "PreliminaryInformation.tenureRequested",
                    "PreliminaryInformation.expectedInterestRate",
                    "PreliminaryInformation.expectedEmi",
                    "PreliminaryInformation.emiRequested",
                    "PreliminaryInformation.emiPaymentDateRequested",
                    "PreliminaryInformation.collectionPaymentType",
                    "PreliminaryInformation.expectedPortfolioInsurancePremium",

                    "LoanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations.customerId",
                    "LoanCustomerRelations.loanCustomerRelations.urn",
                    "LoanCustomerRelations.loanCustomerRelations.name",
                    "LoanCustomerRelations.loanCustomerRelations.relation",
                    "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant",

                    "DeductionsFromLoan",
                    "DeductionsFromLoan.expectedProcessingFeePercentage",
                    "DeductionsFromLoan.expectedCommercialCibilCharge",
                    "DeductionsFromLoan.estimatedEmi",

                    "LoanMitigants",
                    "LoanMitigants.deviationParameter",
                    "LoanMitigants.deviationParameter.mitigants",
                    "LoanMitigants.deviationParameter.mitigants.selected",
                    "LoanMitigants.deviationParameter.mitigants.mitigantName",

                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",

                    "LoanRecommendation",
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.estimatedEmi",
                    "LoanRecommendation.processingFeePercentage",
                    "LoanRecommendation.securityEmiRequired",
                    "LoanRecommendation.commercialCibilCharge",

                    "AdditionalLoanInformation",
                    "AdditionalLoanInformation.estimatedDateOfCompletion",
                    "AdditionalLoanInformation.productCategory",
                    "AdditionalLoanInformation.customerSignDateExpected",
                    "AdditionalLoanInformation.proposedHires",
                    "AdditionalLoanInformation.percentageIncreasedIncome",
                    "AdditionalLoanInformation.percentageInterestSaved",

                    "NomineeDetails",
                    "NomineeDetails.nominees",
                    "NomineeDetails.nominees.nomineeFirstName",
                    "NomineeDetails.nominees.nomineeGender",
                    "NomineeDetails.nominees.nomineeDOB",
                    "NomineeDetails.nominees.nomineeDoorNo",
                    "NomineeDetails.nominees.nomineeLocality",
                    "NomineeDetails.nominees.nomineeStreet",
                    "NomineeDetails.nominees.nomineePincode",
                    "NomineeDetails.nominees.nomineeDistrict",
                    "NomineeDetails.nominees.nomineeState",
                    "NomineeDetails.nominees.nomineeRelationship"

                ];

            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);

                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;

                    self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function(repo) {
                        var formRequest = {
                            "overrides": "",
                            "includes": getIncludes(model),
                            "excludes": [
                            ],
                            "options": {
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "orderNo": 1000,
                                        "items": [
                                            {
                                                "type": "submit",
                                                "title": "SAVE"
                                            },
                                        ]
                                    },
                                    {
                                        "type": "box",
                                        "title": "POST_REVIEW",
                                        "condition": "model.loanAccount.id",
                                        "orderNo": 20,
                                        "items": [{
                                            key: "review.action",
                                            type: "radios",
                                            titleMap: {
                                                "REJECT": "REJECT",
                                                "SEND_BACK": "SEND_BACK",
                                                "PROCEED": "PROCEED",
                                                "HOLD": "HOLD"
                                            }
                                        }, {
                                            type: "section",
                                            condition: "model.review.action=='PROCEED'",
                                            items: [{
                                                title: "REMARKS",
                                                key: "review.remarks",
                                                type: "textarea",
                                                required: true
                                            }, {
                                                key: "review.proceedButton",
                                                type: "button",
                                                title: "PROCEED",
                                                onClick: "actions.proceed(model, formCtrl, form, $event)"
                                            }]

                                        }]
                                    }
                                ]
                            }
                        };
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    })

                },
                offline: false,
                getOfflineDisplayItem: function(item, index){
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate;
                    }
                },
                form: [],
                schema: function() {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    save: function(model, formCtrl, form, $event){
                        /* Loan SAVE */
                        if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                            }, function (err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function(model, formCtrl, form, $event){

                    },
                    sendBack: function(model, formCtrl, form, $event){


                    },
                    proceed: function(model, formCtrl, form, $event){
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    pageName: "irep.lead.ReadyForScreeningQueue"
                                });
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event){

                    }
                }
            };

        }
    }
});
