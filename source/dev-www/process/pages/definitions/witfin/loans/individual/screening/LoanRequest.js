define([], function() {

    return {
        pageUID: "witfin.loans.individual.screening.LoanRequest",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();


            var self;
            var validateForm = function(formCtrl) {
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };

            var getRelationFromClass = function(relation) {
                if (relation == 'guarantor') {
                    return 'Guarantor';
                } else if (relation == 'applicant') {
                    return 'Applicant';
                } else if (relation == 'co-applicant') {
                    return 'Co-Applicant';
                }
            };
            var configFile = function() {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "Screening": {
                            "excludes": [
                                "TeleVerification",
                                "FieldInvestigationDetails",
                                "LoanRecommendation"
                            ],
                            "overrides": {

                            }
                        },
                        "ScreeningReview": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification",
                                "FieldInvestigationDetails"
                            ],
                            "overrides": {
                                "PreliminaryInformation.linkedAccountNumber": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loan": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loanPurpose1": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loanPurpose2": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loanAmountRequested": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.loanToValue": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.parentLoanAccount": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.frequencyRequested": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.udf5": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.tenureRequested": {
                                    "readonly": true
                                }, 
                                "PreliminaryInformation.collectionPaymentType": {
                                    "readonly": true
                                },   
                                "PreliminaryInformation.expectedInterestRate": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.estimatedEmi": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "GoNoGoApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification",
                                "FieldInvestigationDetails"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "GoNoGoApproval2": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification",
                                "FieldInvestigationDetails"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "FieldInvestigation1": {
                            "excludes": [
                                "LoanRecommendation",
                                "TeleVerification"
                            ],
                            "overrides": {

                            }
                        },
                        "FieldInvestigation2": {
                            "excludes": [
                                "LoanRecommendation",
                                "TeleVerification"
                            ],
                            "overrides": {

                            }
                        },
                        "FieldInvestigation3": {
                            "excludes": [
                                "LoanRecommendation",
                                "TeleVerification"
                            ],
                            "overrides": {

                            }
                        },
                        "TeleVerification": {
                            "excludes": [
                                "LoanRecommendation",
                            ],
                            "overrides": {
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditAppraisal":  {
                            "excludes": [
                                "LoanRecommendation",
                                "VehicleRouteDetails",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures"
                            ],
                            "overrides": {
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "TeleVerification": {
                                    "readonly": true
                                }

                            }
                        },
                        "DeviationApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "DeviationApproval2": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval2": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval3": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval4": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval5": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval2": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval3": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval4": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval5": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                },
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                }
                            }
                        },

                        "REJECTED": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetViability": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                }
                            }
                        }
                    },
                    "loanProcess.loanAccount.isReadOnly": {
                        "Yes": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification",
                                "actionbox"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "VehicleAssetViability": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                "readonly": true
                            },
                            "LoanCustomerRelations": {
                                "orderNo": 2
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
                            }
                            }
                        }
                    }

                }
            }

            var getIncludes = function(model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.loan",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.loanToValue",
                    "PreliminaryInformation.parentLoanAccount",
                    "PreliminaryInformation.frequencyRequested",
                    "PreliminaryInformation.udf5",
                    "PreliminaryInformation.tenureRequested", 
                    "PreliminaryInformation.collectionPaymentType",   
                    "PreliminaryInformation.expectedInterestRate",
                    "PreliminaryInformation.calculateEmi",
                    "PreliminaryInformation.estimatedEmi",
                    "PreliminaryInformation.VehicleValuator",
                    "LoanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations.customerId",
                    "LoanCustomerRelations.loanCustomerRelations.urn",
                    "LoanCustomerRelations.loanCustomerRelations.name",
                    "LoanCustomerRelations.loanCustomerRelations.relation",
                    "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant",
                    "DeductionsFromLoan",
                    "DeductionsFromLoan.expectedProcessingFeePercentage",
                    "DeductionsFromLoan.dsaPayout",
                    "DeductionsFromLoan.securityEmiRequired",
                    "DeductionsFromLoan.estimatedEmi",
                    "DeductionsFromLoan.calculateDisbursedAmount",
                    "DeductionsFromLoan.fee3",
                    "DeductionsFromLoan.fee4",
                    "DeductionsFromLoan.fee5",
                    "DeductionsFromLoan.expectedPortfolioInsurancePremium",
                    "DeductionsFromLoan.dealIrr",
                    "DeductionsFromLoan.dsaPayoutFee",
                    "DeductionsFromLoan.processingFee",
                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",
                    "PayerDetails",
                    "PayerDetails.payeeName",
                    "PayerDetails.payeeMobileNumber",
                    "PayerDetails.payeeRelationToApplicant",
                    "LoanRecommendation",
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.processingFeePercentage",
                    "LoanRecommendation.securityEmiRequired",
                    "LoanRecommendation.loanChannels",
                    "LoanRecommendation.commercialCibilCharge",
                    "LoanRecommendation.calculateNominalRate",
                    "LoanRecommendation.processingFee",
                    "LoanRecommendation.udf6",
                    "TeleVerification",
                    "TeleVerification.verifications",
                    "TeleVerification.verifications.personContacted",
                    "TeleVerification.verifications.contactNumber",
                    "TeleVerification.verifications.occupation",
                    "TeleVerification.verifications.address",
                    "TeleVerification.verifications.knownSince",
                    "TeleVerification.verifications.relationship",
                    "TeleVerification.verifications.opinion",
                    "TeleVerification.verifications.financialStatus",
                    "TeleVerification.verifications.customerResponse",
                    "TeleVerification.verifications.remarks",
                    "FieldInvestigationDetails",
                    "FieldInvestigationDetails.fieldInvestigationDecision",
                    "FieldInvestigationDetails.fieldInvestigationReason",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                ];

            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);
                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;

                    if (!model.loanAccount.id){
                        model.loanAccount.accountUserDefinedFields = {
                            userDefinedFieldValues: {
                                udf1: 'NO'
                            }
                        };
                    }

                    model.loanAccount.processingFee = (model.loanAccount.expectedProcessingFeePercentage / 100) * model.loanAccount.loanAmountRequested;
                    model.loanAccount.dsaPayoutFee = (model.loanAccount.dsaPayout / 100) * model.loanAccount.loanAmountRequested;
                    // model.loanAccount.accountUserDefinedFields = model.loanAccount.accountUserDefinedFields || {};
                    if (_.hasIn(model, 'loanAccount.loanCustomerRelations') &&
                        model.loanAccount.loanCustomerRelations!=null &&
                        model.loanAccount.loanCustomerRelations.length > 0) {
                        var lcr = model.loanAccount.loanCustomerRelations;
                        var idArr = [];
                        for (var i=0;i<lcr.length;i++){
                            idArr.push(lcr[i].customerId);
                        }
                        Queries.getCustomerBasicDetails({'ids': idArr})
                            .then(function(result){
                                if (result && result.ids){
                                    for (var i = 0; i < lcr.length; i++) {
                                        var cust = result.ids[lcr[i].customerId];
                                        if (cust) {
                                            lcr[i].name = cust.first_name;
                                        }
                                    }
                                }
                            });
                    }
                    
                    var self = this;
                    var formRequest = {
                        "overrides": {
                            "TeleVerification.verifications.personContacted": {
                                "required": true
                            },
                            "TeleVerification.verifications.customerResponse":{
                                "type": "select",
                                "enumCode": "customer_response"
                            },
                            "LoanRecommendation.udf6": {
                                "title": "NOMINAL_RATE",
                                "readonly": true
                            },
                            "LoanRecommendation.loanChannels": {
                                "condition": "model.loanProcess.loanAccount.currentStage == 'CreditApproval2'",
                                "required": true
                            },
                            "LoanRecommendation.tenure": {
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                }
                            },
                            "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeAmount": {
                                "required": true
                            },
                            "VehicleExpensesInformation.VehicleExpenses.expenseAmount": {
                                "required": true
                            },
                            
                            "DeductionsFromLoan.estimatedEmi": {
                                "readonly": true,
                                "condition": "model.loanAccount.securityEmiRequired == 'YES'"
                            },                            
                            "PreliminaryInformation.loanAmountRequested": {
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                }
                            },
                            "PreliminaryInformation.estimatedEmi": {
                                "required": true,
                                "readonly": true
                            },
                            "PreliminaryInformation.frequencyRequested": {
                                "required": true,
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                    model.loanAccount.expectedInterestRate = null;
                                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                }
                            },
                            "PreliminaryInformation.udf5": {
                                "required": true,
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                    model.loanAccount.expectedInterestRate = null;
                                }
                            },
                            "PreliminaryInformation.tenureRequested": {
                                "required": true,
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                    model.loanAccount.expectedInterestRate = null;
                                }
                            },
                            
                            "PreliminaryInformation.expectedInterestRate": {
                                "required": true,
                                "title": "NOMINAL_RATE",
                                "readonly": true
                            },
                            "LoanCustomerRelations": {
                                "orderNo": 2
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
                            }
                            
                        },
                        "includes": getIncludes(model),
                        "excludes": [
                            ""
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "PreliminaryInformation": {
                                    "items": {
                                        "parentLoanAccount": {
                                            "key": "loanAccount.parentLoanAccount",
                                            "title": "PARENT_LOAN_ACCOUNT",
                                            "orderNo" : 45,
                                            "condition": "model.loanAccount.loanPurpose1 == 'Insurance Loan'"
                                        },
                                        "udf5": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5",
                                            "title" : "FLAT_RATE",
                                            "type": "string",
                                            "orderNo" : 75
                                        },
                                        "VehicleValuator": {
                                            key: "loanAccount.valuator",
                                            type: "lov",
                                            "resolver": "VehicleValuatorLOVConfiguration",
                                            title: "VALUATOR",
                                            "required": true,
                                            "condition": "model.loanProcess.loanAccount.currentStage == 'ScreeningReview' && (model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance')"
                                        },
                                        "calculateEmi": {
                                            "title": "CALCULATE_EMI",
                                            "type": "button",
                                            "onClick": function(model, formCtrl) {
                                                var frequencyRequested1, frequencyRequested2;
                                                if (model.loanAccount.frequencyRequested && model.loanAccount.tenureRequested && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5) {
                                                    switch (model.loanAccount.frequencyRequested) {
                                                        case 'Daily':
                                                            frequencyRequested1 = 365;
                                                            break;
                                                        case 'Fortnightly':
                                                            frequencyRequested1 = parseInt(365 / 15);
                                                            break;
                                                        case 'Monthly':
                                                            frequencyRequested1 = 12;
                                                            break;
                                                        case 'Quarterly':
                                                            frequencyRequested1 = 4;
                                                            break;
                                                        case 'Weekly':
                                                            frequencyRequested1 = parseInt(365 / 7);
                                                            break;
                                                        case 'Yearly':
                                                            frequencyRequested1 = 1;
                                                    }
                                                    model.loanAccount.expectedInterestRate = Math.round((((Math.pow((((parseFloat((model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5)/100)*2*parseFloat(model.loanAccount.tenureRequested))/(parseFloat(model.loanAccount.tenureRequested)+1))+1),(1/frequencyRequested1))-1)*frequencyRequested1)*100)*100)/100;
                                                } else {
                                                    PageHelper.showErrors({
                                                        data: {
                                                            error: "Please Enter Required Values for calculating Nominal Rate"
                                                        }
                                                    });
                                                    return false;
                                                }
                                                if (parseFloat(model.loanAccount.expectedInterestRate) && model.loanAccount.tenureRequested && model.loanAccount.frequencyRequested && model.loanAccount.loanAmountRequested) {
                                                    switch (model.loanAccount.frequencyRequested) {
                                                        case 'Daily':
                                                            frequencyRequested2 = 365;
                                                            break;
                                                        case 'Fortnightly':
                                                            frequencyRequested2 = parseInt(365 / 15);
                                                            break;
                                                        case 'Monthly':
                                                            frequencyRequested2 = 12;
                                                            break;
                                                        case 'Quarterly':
                                                            frequencyRequested2 = 4;
                                                            break;
                                                        case 'Weekly':
                                                            frequencyRequested2 = parseInt(365 / 7);
                                                            break;
                                                        case 'Yearly':
                                                            frequencyRequested2 = 1;
                                                    }
                                                    var rate = parseFloat((model.loanAccount.expectedInterestRate) / (100 * frequencyRequested2));
                                                    var n = parseFloat(model.loanAccount.tenureRequested);
                                                    var calculateEmi = (parseFloat(model.loanAccount.loanAmountRequested) * rate / parseFloat((1 - Math.pow(1 + rate, -n))));
                                                    model.loanAccount.estimatedEmi = parseInt(calculateEmi.toFixed());
                                                } else {
                                                    PageHelper.showErrors({
                                                        data: {
                                                            error: "Nominal Rate is not proper"
                                                        }
                                                    });
                                                    return false;
                                                }
                                            }
                                        }
                                        
                                        
                                    }
                                },
                                
                                "DeductionsFromLoan": {
                                    "items": {
                                        "dsaPayout": {
                                            "key": "loanAccount.dsaPayout",
                                            "type": "number",
                                            "title": "DSA_PAYOUT_IN_PERCENTAGE",
                                            "orderNo": 30
                                        },
                                        "fee3": {
                                            "key": "loanAccount.fee3",
                                            "title": "ACTUAL_FRANKING",
                                            "orderNo": 40
                                        },
                                        "expectedPortfolioInsurancePremium": {
                                            "key": "loanAccount.expectedPortfolioInsurancePremium",
                                            "title": "PERSONAL_INSURANCE",
                                            "orderNo": 50
                                        },
                                        "fee4": {
                                            "key": "loanAccount.fee4",
                                            "title": "VEHICLE_INSURANCE",
                                            "orderNo": 60
                                        },
                                        "fee5":{
                                            "key": "loanAccount.fee5",
                                            "title": "DOCUMENT_CHARGES",
                                            "type": "number",
                                            "orderNo": 70
                                        },
                                        "dealIrr": {
                                            "key": "loanAccount.dealIrr",
                                            "title": "XIRR",
                                            "type": "number",
                                            "orderNo": 110,
                                            "readonly": true
                                        },
                                        "processingFee":{
                                            "key": "loanAccount.processingFee",
                                            "title": "PROCESSING_FEE",
                                            "type": "number",
                                            "orderNo": 120,
                                            "readonly": true
                                        },
                                        "dsaPayoutFee":{
                                            "key": "loanAccount.dsaPayoutFee",
                                            "title": "DSA_PAYOUT",
                                            "type": "number",
                                            "orderNo": 130,
                                            "readonly": true
                                        },
                                        "calculateDisbursedAmount": {
                                            "type": "button",
                                            "title": "CALCULATE_XIRR",
                                            "orderNo": 90,
                                            onClick: function(model, formCtrl) {
                                                if (model.loanAccount.estimatedEmi == null) {
                                                    PageHelper.showProgress('calculateXirr', 'Please Click Calculate EMI Button', 5000);
                                                } else {
                                                    var processFee;
                                                    var dsaPayout;
                                                    var frequency;
                                                    var frequencyRequested;
                                                    var advanceEmi = model.loanAccount.estimatedEmi;
                                                    processFee = (model.loanAccount.expectedProcessingFeePercentage / 100) * model.loanAccount.loanAmountRequested;
                                                    dsaPayout = (model.loanAccount.dsaPayout / 100) * model.loanAccount.loanAmountRequested;
                                                    frankingCharge = model.loanAccount.fee3;
                                                    model.loanAccount.processingFee = processFee;
                                                    model.loanAccount.dsaPayoutFee = dsaPayout;
                                                    model.netDisbursementAmount = model.loanAccount.loanAmountRequested - processFee - advanceEmi + dsaPayout;
                                                    switch (model.loanAccount.frequencyRequested) {
                                                        case 'Monthly':
                                                            frequency = "MONTH";
                                                            break;
                                                        case 'Weekly':
                                                            frequency = "WEEK";
                                                            break;
                                                        case 'Yearly':
                                                            frequency = "YEAR";
                                                            break;
                                                        case 'Fortnightly':
                                                            frequency = "FORTNIGHT";
                                                            break;
                                                        case 'Quarterly':
                                                            frequency = "QUARTER";
                                                            break;
                                                        case 'Daily':
                                                            frequency = "DAY";
                                                            break;
                                                    }
                                                    switch (model.loanAccount.frequencyRequested) {
                                                        case 'Daily':
                                                            frequencyRequested = 1;
                                                            break;
                                                        case 'Fortnightly':
                                                            frequencyRequested = 15;
                                                            break;
                                                        case 'Monthly':
                                                            frequencyRequested = 30;
                                                            break;
                                                        case 'Quarterly':
                                                            frequencyRequested = 120;
                                                            break;
                                                        case 'Weekly':
                                                            frequencyRequested = 7;
                                                            break;
                                                        case 'Yearly':
                                                            frequencyRequested = 365;
                                                    }

                                                    LoanProcess.findPreOpenSummary({
                                                            "loanAmount": model.loanAccount.loanAmountRequested,
                                                            "tenure": model.loanAccount.tenureRequested,
                                                            "frequency": frequency,
                                                            "normalInterestRate": model.loanAccount.expectedInterestRate,
                                                            "productCode": "IRRTP",
                                                            "moratoriumPeriod": "0",
                                                            "openDate": Utils.getCurrentDate(),
                                                            "branchId": model.loanAccount.branchId || model.loanProcess.applicantEnrolmentProcess.customer.customerBranchId,
                                                            "firstRepaymentDate": moment().add(frequencyRequested, 'days').format("YYYY-MM-DD"),
                                                            "scheduledDisbursementDate": Utils.getCurrentDate(),
                                                            "scheduledDisbursementAmount": model.netDisbursementAmount
                                                        })
                                                        .$promise
                                                        .then(function(resp) {
                                                            $log.info(resp);
                                                            model.loanAccount.dealIrr = Number(resp.xirr.substr(0, resp.xirr.length - 1));
                                                        });
                                                }
                                            }
                                        },
                                        "securityEmiRequired": {
                                            "key": "loanAccount.securityEmiRequired",
                                            "title": "ADVANCE_EMI",
                                            "type": "radios",
                                            "orderNo": 70
                                        }
                                    }
                                },
                                "LoanRecommendation": {
                                    "items": {
                                        "calculateNominalRate": {
                                            "title": "CALCULATE_NOMINAL_RATE",
                                            "type": "button",
                                            onClick: function(model, formCtrl) {
                                                var frequencyRequested;
                                                if (model.loanAccount.frequencyRequested && model.loanAccount.loanAmount && model.loanAccount.tenure && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5) {
                                                    switch (model.loanAccount.frequencyRequested) {
                                                        case 'Daily':
                                                            frequencyRequested = 365;
                                                            break;
                                                        case 'Fortnightly':
                                                            frequencyRequested = parseInt(365 / 15);
                                                            break;
                                                        case 'Monthly':
                                                            frequencyRequested = 12;
                                                            break;
                                                        case 'Quarterly':
                                                            frequencyRequested = 4;
                                                            break;
                                                        case 'Weekly':
                                                            frequencyRequested = parseInt(365 / 7);
                                                            break;
                                                        case 'Yearly':
                                                            frequencyRequested = 1;
                                                    }
                                                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = Math.round((((Math.pow((((2 * parseFloat((model.loanAccount.interestRate)/100) * parseFloat(model.loanAccount.tenure)) / (parseFloat(model.loanAccount.tenure) + 1)) + 1), 1 / frequencyRequested) - 1) * frequencyRequested)*100)*100)/100;
                                                } else {
                                                    PageHelper.showErrors({
                                                        data: {
                                                            error: "Please Enter Required Values for calculating Nominal Rate"
                                                        }
                                                    });
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                },
                                "FieldInvestigationDetails": {
                                    "type": "box",
                                    "orderNo": 300,
                                    "title": "FIELD_INVESTIGATION_DETAILS",
                                    "items": {
                                        "fieldInvestigationDecision": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf2",
                                            "type": "select",
                                            "title": "FI_DECISION",
                                            "enumCode": "fi_decision"
                                        },
                                        "fieldInvestigationReason": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3",
                                            "type": "select",
                                            "title": "FI_REASON",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf2 == 'Negative' || model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf2 == 'Refer to Credit'",
                                            "enumCode": "fi_reason",
                                            "parentEnumCode": "fi_decision",
                                            "parentValueExpr": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf2"
                                        }
                                    }
                                }
                            },
                            "additions": [{
                                "type": "box",
                                "orderNo": 999,
                                "title": "POST_REVIEW",
                                "condition": "model.loanAccount.id && model.loanAccount.isReadOnly!='Yes'",
                                "items": [{
                                    key: "review.action",
                                    type: "radios",
                                    titleMap: {
                                        "REJECT": "REJECT",
                                        "SEND_BACK": "SEND_BACK",
                                        "PROCEED": "PROCEED"
                                    }
                                }, {
                                    type: "section",
                                    condition: "model.review.action=='PROCEED'",
                                    items: [{
                                        title: "REMARKS",
                                        key: "loanProcess.remarks",
                                        type: "textarea",
                                        required: true
                                    }, {
                                        key: "review.proceedButton",
                                        type: "button",
                                        title: "PROCEED",
                                        onClick: "actions.proceed(model, formCtrl, form, $event)"
                                    }]

                                }, {
                                    type: "section",
                                    condition: "model.review.action=='SEND_BACK'",
                                    items: [{
                                        title: "REMARKS",
                                        key: "loanProcess.remarks",
                                        type: "textarea",
                                        required: true
                                    }, {
                                        key: "loanProcess.stage",
                                        "required": true,
                                        type: "lov",
                                        autolov: true,
                                        lovonly: true,
                                        title: "SEND_BACK_TO_STAGE",
                                        bindMap: {},
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var stage1 = model.loanProcess.loanAccount.currentStage;
                                            var targetstage = formHelper.enum('targetstage').data;
                                            var out = [];
                                            for (var i = 0; i < targetstage.length; i++) {
                                                var t = targetstage[i];
                                                if (t.field1 == stage1) {
                                                    out.push({
                                                        name: t.name,
                                                        value: t.code
                                                    })
                                                }
                                            }
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function(valueObj, model, context) {
                                            model.review.targetStage1 = valueObj.name;
                                            model.loanProcess.stage = valueObj.value;

                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    }, {
                                        key: "review.sendBackButton",
                                        type: "button",
                                        title: "SEND_BACK",
                                        onClick: "actions.sendBack(model, formCtrl, form, $event)"
                                    }]

                                }, {
                                    type: "section",
                                    condition: "model.review.action=='REJECT'",
                                    items: [{
                                            title: "REMARKS",
                                            key: "loanProcess.remarks",
                                            type: "textarea",
                                            required: true
                                        }, {
                                            key: "loanAccount.rejectReason",
                                            type: "lov",
                                            autolov: true,
                                            required: true,
                                            title: "REJECT_REASON",
                                            bindMap: {},
                                            searchHelper: formHelper,
                                            search: function(inputModel, form, model, context) {
                                                var stage1 = model.loanProcess.loanAccount.currentStage;

                                                var rejectReason = formHelper.enum('application_reject_reason').data;
                                                var out = [];
                                                for (var i = 0; i < rejectReason.length; i++) {
                                                    var t = rejectReason[i];
                                                    if (t.field1 == stage1) {
                                                        out.push({
                                                            name: t.name,
                                                        })
                                                    }
                                                }
                                                return $q.resolve({
                                                    headers: {
                                                        "x-total-count": out.length
                                                    },
                                                    body: out
                                                });
                                            },
                                            onSelect: function(valueObj, model, context) {
                                                model.loanAccount.rejectReason = valueObj.name;
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.name
                                                ];
                                            }
                                        },
                                        {
                                            key: "review.rejectButton",
                                            type: "button",
                                            title: "REJECT",
                                            required: true,
                                            onClick: "actions.reject(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }]
                            }]
                        }
                    };
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    }, function(err) {
                        console.log(err);

                    })

                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "new-applicant": function(bundleModel, model, params){

                        $log.info(model.loanAccount.loanCustomerRelations);
        
                        $log.info("Inside new-applicant of LoanRequest");
                        var addToRelation = true;
                        for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                                addToRelation = false;
                                if (params.customer.urnNo)
                                    model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                                    model.loanAccount.loanCustomerRelations[i].name =params.customer.firstName;
                                break;
                            }
                        }
        
                        if (addToRelation){
                            model.loanAccount.loanCustomerRelations.push({
                                'customerId': params.customer.id,
                                'relation': "Applicant",
                                'urn':params.customer.urnNo,
                                'name':params.customer.firstName
                            });
                            model.loanAccount.applicant = params.customer.urnNo;
                        }
                        model.applicant = params.customer;
                        model.applicant.age1 = moment().diff(moment(model.applicant.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                    },
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.loanPurpose2 = obj.loanPurpose2;
                        model.loanAccount.vehicleLoanDetails.registrationNumber = obj.vehicleRegistrationNumber;
                        model.loanAccount.screeningDate = obj.screeningDate || moment().format("YYYY-MM-DD");
                        model.loanAccount.parentLoanAccount = obj.parentLoanAccount;

                        if(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle'){
                            model.loanAccount.vehicleLoanDetails.vehicleType = 'New';
                        }else if (model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle'){
                            model.loanAccount.vehicleLoanDetails.vehicleType = 'Used';
                        }
                        
                    },
                    "new-co-applicant": function(bundleModel, model, params){
                        $log.info("Insdie new-co-applicant of LoanRequest");
                        // model.loanAccount.coApplicant = params.customer.id;
                        var addToRelation = true;
                        for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                                addToRelation = false;
                                if (params.customer.urnNo)
                                    model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                                    model.loanAccount.loanCustomerRelations[i].name =params.customer.firstName;
                                break;
                            }
                        }
        
                        if (addToRelation) {
                            model.loanAccount.loanCustomerRelations.push({
                                'customerId': params.customer.id,
                                'relation': "Co-Applicant",
                                'urn':params.customer.urnNo,
                                'name':params.customer.firstName
                            })
                        }
                    },
                    "new-guarantor": function(bundleModel, model, params){
                        $log.info("Insdie guarantor of LoanRequest");
                        // model.loanAccount.coApplicant = params.customer.id;
                        var addToRelation = true;
                        for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                                addToRelation = false;
                                if (params.customer.urnNo)
                                    model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                                    model.loanAccount.loanCustomerRelations[i].name =params.customer.firstName;
                                break;
                            }
                        }
        
                        if (addToRelation) {
                            model.loanAccount.loanCustomerRelations.push({
                                'customerId': params.customer.id,
                                'relation': "Guarantor",
                                'urn': params.customer.urnNo,
                                'name':params.customer.firstName
                            })
                        };
        
                        model.loanAccount.guarantors = model.loanAccount.guarantors || [];
        
                        var existingGuarantorIndex = _.findIndex(model.loanAccount.guarantors, function(g){
                            if (g.guaUrnNo == params.customer.urnNo || g.guaCustomerId == params.customer.id)
                                return true;
                        })
        
                        if (existingGuarantorIndex<0){
                            model.loanAccount.guarantors.push({
                                'guaCustomerId': params.customer.id,
                                'guaUrnNo': params.customer.urnNo
                            });
                        } else {
                            if (!model.loanAccount.guarantors[existingGuarantorIndex].guaUrnNo){
                                model.loanAccount.guarantors[existingGuarantorIndex].guaUrnNo = params.customer.urnNo;
                            }
                        }
        
        
                    },
                    "remove-customer-relation": function(bundleModel, model, enrolmentDetails){
                        $log.info("Inside enrolment-removed");
                        /**
                         * Following should happen
                         *
                         * 1. Remove customer from Loan Customer Relations
                         * 2. Remove custoemr from the placeholders. If Applicant, remove from applicant. If Guarantor, remove from guarantors.
                         */
        
                        // 1.
                        _.remove(model.loanAccount.loanCustomerRelations, function(customer){
                            return (customer.customerId==enrolmentDetails.customerId && customer.relation == getRelationFromClass(enrolmentDetails.customerClass)) ;
                        })
        
                        // 2.
                        switch(enrolmentDetails.customerClass){
                            case 'guarantor':
                                _.remove(model.loanAccount.guarantors, function(guarantor){
                                    return (guarantor.guaCustomerId == enrolmentDetails.customerId)
                                })
                                break;
                            case 'applicant':
        
                                break;
                            case 'co-applicant':
        
                                break;
        
                        }
                    },
                    "cb-check-update": function(bundleModel, model, params){
                        $log.info("Inside cb-check-update of LoanRequest");
                        for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customerId) {
                                if(params.cbType == 'BASE')
                                    model.loanAccount.loanCustomerRelations[i].highmarkCompleted = true;
                                else if(params.cbType == 'CIBIL')
                                    model.loanAccount.loanCustomerRelations[i].cibilCompleted = true;
                            }
                        }
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
                    save: function(model, formCtrl, form, $event) {
                        /* Loan SAVE */
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        if (!model.loanAccount.id) {
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        PageHelper.showLoader();
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                             BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: value.loanAccount});


                             if (_.hasIn(model, 'loanAccount.loanCustomerRelations') &&
                             model.loanAccount.loanCustomerRelations!=null &&
                             model.loanAccount.loanCustomerRelations.length > 0) {
                             var lcr = model.loanAccount.loanCustomerRelations;
                             var idArr = [];
                             for (var i=0;i<lcr.length;i++){
                                 idArr.push(lcr[i].customerId);
                             }
                             Queries.getCustomerBasicDetails({'ids': idArr})
                                 .then(function(result){
                                     if (result && result.ids){
                                         for (var i = 0; i < lcr.length; i++) {
                                             var cust = result.ids[lcr[i].customerId];
                                             if (cust) {
                                                 lcr[i].name = cust.first_name;
                                             }
                                         }
                                     }
                                 });
                         }

                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                            }, function(err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function(model, formCtrl, form, $event) {
                        PageHelper.showLoader();

                        if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses) && !model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0])
                            delete model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses
                        if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && !model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0])
                            delete model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes

                        if (model.review.action==null || model.review.action =="" || model.review.targetStage1 ==null || model.review.targetStage1 ==""){
                               PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }

                        Utils.confirm("Are You Sure?")
                            .then(
                                function(){
                                    model.loanProcess.sendBack()
                                        .finally(function() {
                                            PageHelper.hideLoader();
                                        })
                                        .subscribe(function(value) {
                                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                                            irfNavigator.goBack();
                                        }, function(err) {
                                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                            PageHelper.showErrors(err);
                                            PageHelper.hideLoader();
                                        });
                                })
                    },
                    proceed: function(model, formCtrl, form, $event) {
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        model.loanProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {

                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                        // PageHelper.clearErrors();
                        // PageHelper.showLoader();
                        // PageHelper.showProgress('loan-process', 'Updating Loan');

                    },
                    reject: function(model, formCtrl, form, $event) {
                        PageHelper.showLoader();
                        model.loanProcess.reject()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Done.', 5000);
                                irfNavigator.goBack();
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
});
