define([], function() {

    return {
        pageUID: "base.dashboard.loans.individual.screening.LoanRequestOld",
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

            var isVehcileDetailsSaved = function(model) {
                var failed = false;
                var pageClassList = ['vehicle-details'];

                BundleManager.broadcastSchemaFormValidate(pageClassList);
                vehicleValidityState = BundleManager.getBundlePagesFormValidity(pageClassList);

                keys = Object.keys(vehicleValidityState);
                for(var idx = 0; idx < keys.length; idx++) {
                    if(vehicleValidityState[keys[idx]].invalid){
                        PageHelper.showProgress("LoanRequest","Some of the mandatory information of " + $filter('translate')(keys[idx].split("@")[0]) + " is not filled and submitted." , 5000);
                        failed = true;
                        break;
                    }
                }
                BundleManager.resetBundlePagesFormState(pageClassList);
                return failed;
            }

            var excelRate = function(nper, pmt, pv, fv, type, guess) {
                // Sets default values for missing parameters
                fv = typeof fv !== 'undefined' ? fv : 0;
                pv = typeof pv !== 'undefined' ? pv : 0;
                type = typeof type !== 'undefined' ? type : 0;
                guess = typeof guess !== 'undefined' ? guess : 0.1;

                // Sets the limits for possible guesses to any
                // number between 0% and 100%
                var lowLimit = 0;
                var highLimit = 1;

                // Defines a tolerance of up to +/- 0.00005% of pmt, to accept
                // the solution as valid.
                var tolerance = Math.abs(0.00000005 * pmt);

                // Tries at most 40 times to find a solution within the tolerance.
                for (var i = 0; i < 40; i++) {
                    // Resets the balance to the original pv.
                    var balance = pv;

                    // Calculates the balance at the end of the loan, based
                    // on loan conditions.
                    for (var j = 0; j < nper; j++) {
                        if (type == 0) {
                            // Interests applied before payment
                            balance = balance * (1 + guess) + pmt;
                        } else {
                            // Payments applied before insterests
                            balance = (balance + pmt) * (1 + guess);
                        }
                    }

                    // Returns the guess if balance is within tolerance.  If not, adjusts
                    // the limits and starts with a new guess.
                    if (Math.abs(balance + fv) < tolerance) {
                        return guess;
                    } else if (balance + fv > 0) {
                        // Sets a new highLimit knowing that
                        // the current guess was too big.
                        highLimit = guess;
                    } else {
                        // Sets a new lowLimit knowing that
                        // the current guess was too small.
                        lowLimit = guess;
                    }

                    // Calculates the new guess.
                    guess = (highLimit + lowLimit) / 2;
                }

                // Returns null if no acceptable result was found after 40 tries.
                return null;
            };

            var calculateNominalRate = function(loanAmount, frequency, tenure, flatRate) {
                var frequencyFactor;
                if (frequency && tenure && flatRate) {
                    switch (frequency) {
                        case 'D':
                        case 'Daily':
                            frequencyFactor = 365;
                            break;
                        case 'F':
                        case 'Fortnightly':
                            frequencyFactor = parseInt(365 / 15);
                            break;
                        case 'M':
                        case 'Monthly':
                            frequencyFactor = 12;
                            break;
                        case 'Q':
                        case 'Quarterly':
                            frequencyFactor = 4;
                            break;
                        case 'H':
                        case 'Half Yearly':
                            frequencyFactor = 2;
                            break;
                        case 'W':
                        case 'Weekly':
                            frequencyFactor = parseInt(365 / 7);
                            break;
                        case 'Y':
                        case 'Yearly':
                            frequencyFactor = 1;
                            break;
                        default:
                            throw new Error("Invalid frequency");
                    }
                    var nominalRate = Math.round(excelRate(parseFloat(tenure),  -Math.round(parseFloat(loanAmount) * (1 + (parseFloat(flatRate) / 100 * parseFloat(tenure) / frequencyFactor)) / parseFloat(tenure)), parseFloat(loanAmount)) * frequencyFactor * 1000000)/10000;
                    var someRate = parseFloat(nominalRate / (100 * frequencyFactor));
                    var estimatedEmi = (parseFloat(loanAmount) * someRate / parseFloat((1 - Math.pow(1 + someRate, -tenure))));
                    return {
                        nominalRate: nominalRate,
                        estimatedEmi: Math.round(estimatedEmi)
                    };
                } else {
                    throw new Error("Invalid input for nominal rate calculation");
                }
            }

            var configFile = function() {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "Screening": {
                            "excludes": [
                                "FieldInvestigationDetails",
                                "LoanRecommendation"
                            ],
                            "overrides": {

                            }
                        },
                        "ScreeningReview": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
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
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                },
                                "LoanRecommendation":{
                                    "orderNo":60
                                }
                            }
                        },
                        "GoNoGoApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
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
                                "LoanRecommendation"
                            ],
                            "overrides": {

                            }
                        },
                        "FieldInvestigation2": {
                            "excludes": [
                                "LoanRecommendation"
                            ],
                            "overrides": {

                            }
                        },
                        "FieldInvestigation3": {
                            "excludes": [
                                "LoanRecommendation"
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
                                }

                            }
                        },
                        "DeviationApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":60
                                }
                            }
                        },
                        "BusinessApproval2": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":60
                                }
                            }
                        },
                        "BusinessApproval3": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":60
                                }
                            }
                        },
                        "BusinessApproval4": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":50
                                }
                            }
                        },
                        "BusinessApproval5": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":50
                                }
                            }
                        },
                        "CreditApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":60
                                }
                            }
                        },
                        "CreditApproval2": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":60
                                }
                            }
                        },
                        "CreditApproval3": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":60
                                }
                            }
                        },
                        "CreditApproval4": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":50
                                }
                            }
                        },
                        "CreditApproval5": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
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
                                },
                                "LoanRecommendation":{
                                    "orderNo":50
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
                                },
                                "PayerDetails": {
                                    "readonly": true
                                },
                                "LoanRecommendation":{
                                    "readonly": true
                                },
                                "FieldInvestigationDetails":{
                                    "readonly":true
                                }
                            }
                        }
                    },
                    "loanProcess.loanAccount.isReadOnly": {
                        "Yes": {
                            "excludes": [
                                "actionbox"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
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
                                "LoanRecommendation": {
                                    "readonly": true
                                },
                                "FieldInvestigationDetails": {
                                    "readonly": true
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
                    "PreliminaryInformation.expectedProcessingFeePercentage",
                    "PreliminaryInformation.estimatedEmi",
                    "LoanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations.customerId",
                    "LoanCustomerRelations.loanCustomerRelations.urn",
                    "LoanCustomerRelations.loanCustomerRelations.name",
                    "LoanCustomerRelations.loanCustomerRelations.relation",
                    "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant",
                    "DeductionsFromLoan",
                    "DeductionsFromLoan.dsaPayout",
                    "DeductionsFromLoan.securityEmiRequired",
                    "DeductionsFromLoan.calculateDisbursedAmount",
                    "DeductionsFromLoan.fee3",
                    "DeductionsFromLoan.fee4",
                    "DeductionsFromLoan.fee5",
                    "DeductionsFromLoan.expectedPortfolioInsurancePremium",
                    "DeductionsFromLoan.dealIrr",
                    "DeductionsFromLoan.dsaPayoutFee",
                    "DeductionsFromLoan.vExpectedProcessingFee",
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
                    "LoanRecommendation.frequency",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.processingFeePercentage",
                    "LoanRecommendation.securityEmiRequired",
                    "LoanRecommendation.loanChannels",
                    "LoanRecommendation.calculateNominalRate",
                    "LoanRecommendation.processingFee",
                    "LoanRecommendation.udf6",
                    "FieldInvestigationDetails",
                    "FieldInvestigationDetails.fieldInvestigationDecision",
                    "FieldInvestigationDetails.fieldInvestigationReason",
                    "deviationsMitigants",
                    "deviationsMitigants.deviationDetails",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                ];

            }

            var formRequest = function(model) { 
                return {
                    "overrides": {
                        "LoanRecommendation.loanChannels": {
                            "condition": "model.loanProcess.loanAccount.currentStage == 'CreditApproval2'",
                            "required": true
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
                        },
                        "LoanRecommendation.processingFee": {
                            "key": "loanAccount.vProcessingFee"
                        },
                        "LoanDocuments.loanDocuments.documentId": {
                            "offline": true
                        },
                        "actionbox.save": {
                            "buttonType": "submit"
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
                                            try{
                                                var obj = calculateNominalRate(model.loanAccount.loanAmountRequested, model.loanAccount.frequencyRequested, model.loanAccount.tenureRequested, parseFloat(model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5));
                                                model.loanAccount.expectedInterestRate = obj.nominalRate;
                                                model.loanAccount.estimatedEmi = obj.estimatedEmi;
                                            } catch (e){
                                                console.log(e);
                                                PageHelper.showProgress("nominal-rate-calculation", "Error while calculating nominal rate, check the input values.", 5000);
                                            }
                                        }
                                    },
                                    "expectedProcessingFeePercentage": {
                                        "key": "loanAccount.expectedProcessingFeePercentage",
                                        "title": "EXPECTED_PROCESSING_FEES_IN_PERCENTAGE",
                                        "type": "string",
                                    },
                                    "estimatedEmi": {
                                        "key": "loanAccount.estimatedEmi",
                                        "type": "amount",
                                        "readonly": true,
                                        "title": "EXPECTED_ADVANCE_EMI",
                                    }
                                    
                                    
                                }
                            },
                            
                            "DeductionsFromLoan": {
                                "orderNo": 40,
                                "items": {
                                    "dsaPayout": {
                                        "key": "loanAccount.dsaPayout",
                                        "type": "number",
                                        "title": "DSA_PAYOUT_IN_PERCENTAGE",
                                        "orderNo": 30,
                                        onChange: function(modelValue, form, model) {
                                            model.loanAccount.dsaPayoutFee = (model.loanAccount.dsaPayout / 100) * model.loanAccount.loanAmountRequested;
                                        }
                                    },
                                    "fee3": {
                                        "key": "loanAccount.fee3",
                                        "title": "ACTUAL_FRANKING",
                                        "orderNo": 40
                                    },
                                    "expectedPortfolioInsurancePremium": {
                                        "key": "loanAccount.expectedPortfolioInsurancePremium",
                                        "title": "PERSONAL_INSURANCE",
                                        "orderNo": 50,
                                        "readonly": true
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
                                    "vExpectedProcessingFee":{
                                        "key": "loanAccount.vExpectedProcessingFee",
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
                                                processFee = Math.round(((model.loanAccount.expectedProcessingFeePercentage / 100) * model.loanAccount.loanAmountRequested)* 100) / 100;
                                                dsaPayout = (model.loanAccount.dsaPayout / 100) * model.loanAccount.loanAmountRequested;
                                                frankingCharge = model.loanAccount.fee3;
                                                model.loanAccount.vExpectedProcessingFee = processFee;
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
                                                        "amountMagnitude": model.loanAccount.loanAmountRequested,
                                                        "tenureMagnitude": model.loanAccount.tenureRequested,
                                                        "tenureUnit": frequency,
                                                        "normalInterestRate": model.loanAccount.expectedInterestRate,
                                                        "productCode": "IRRTP",
                                                    //    "moratoriumPeriod": "0",
                                                        "openedOnDate": Utils.getCurrentDate(),
                                                        "branchId": model.loanAccount.branchId || model.loanProcess.applicantEnrolmentProcess.customer.customerBranchId,
                                                        "firstRepaymentDate": moment().add(frequencyRequested, 'days').format("YYYY-MM-DD"),
                                                        "scheduledDisbursementDate": Utils.getCurrentDate(),
                                                        "scheduledDisbursementAmount": model.loanAccount.loanAmountRequested,
                                                        "userSecurityDeposit": "100",
                                                        "inputFees": [
                                                            {
                                                            "FeeAmount": "900",
                                                            "Surcharge": "100",
                                                            "GrossAmount": "1000",
                                                            "TransactionName": "Processing Fee"
                                                            }
                                                        ],
                                                          "inputMoratoriums": [
                                                              {
                                                              "accountId": "",
                                                              "amendmentType": "",
                                                              "amount": "",
                                                              "computeStartDate": true,
                                                              "feeAmount": "",
                                                              "grossAmount": "",
                                                              "moratoriumInstallment": "0",
                                                              "moratoriumInterestRate": "23.61",
                                                              "moratoriumPeriod": "0 NONE",
                                                              "repaymentDate": "2017-10-24",
                                                              "surcharge": "",
                                                              "tenure": "",
                                                              "transactionDate": "",
                                                              "transactionId": "",
                                                              "transactionName": "",
                                                              "urnNo": ""
                                                            }
                                                          ],
                                                      "scheduledDisbursements": [],
                                                      "equatedInstallment": "31000"
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
                                "orderNo": 60,
                                "items": {
                                    "udf6": {
                                        "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6",
                                        "title": "FLAT_RATE",
                                        "type": "string",
                                        "required": true,
                                        "orderNo": 25
                                    },
                                    "frequency": {
                                        "key": "loanAccount.frequency",
                                        "type": "select",
                                        "title": "FREQUENCY",
                                        required: true,
                                        "enumCode": "loan_product_frequency",
                                        "orderNo": 45
                                    },
                                    "calculateNominalRate": {
                                        "title": "CALCULATE_NOMINAL_RATE",
                                        "type": "button",
                                        onClick: function(model, formCtrl) {
                                            try{
                                                var obj = calculateNominalRate(model.loanAccount.loanAmount,
                                                model.loanAccount.frequency,
                                                model.loanAccount.tenure,
                                                parseFloat(model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6));
                                                model.loanAccount.interestRate = obj.nominalRate;
                                                model.loanAccount.estimatedEmi = obj.estimatedEmi;

                                                model.loanAccount.vProcessingFee = null;
                                                if(model.loanAccount.loanAmount && model.loanAccount.processingFeePercentage) {
                                                    model.loanAccount.vProcessingFee = Math.round(((model.loanAccount.processingFeePercentage / 100) * model.loanAccount.loanAmount)* 100) / 100;
                                                }
                                            } catch (e){
                                                console.log(e);
                                                PageHelper.showProgress("nominal-rate-calculation", "Error while calculating nominal rate, check the input values.", 5000);
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
                            },
                            "deviationsMitigants": {
                                "type": "box",
                                "orderNo": 310,
                                "colClass": "col-sm-12",
                                "title": "DEVIATION_AND_MITIGATIONS",
                                "condition": "model.currentStage != 'Screening'",
                                "items": {
                                    "deviationDetails": {
                                        "type": "section",
                                        "colClass": "col-sm-12",
                                        "html": '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th></tr></thead><tbody>' +
                                            '<tr ng-repeat="item in model.deviationDetails">' +
                                            '<td>{{ item["parameter"] }}</td>' +
                                            '<td> <span class="square-color-box" style="background: {{ item.color_hexadecimal }}"> </span></td>' +
                                            '<td>{{ item["deviation"] }}</td>' +
                                            '<td><ul class="list-unstyled">' +
                                            '<li ng-repeat="m in item.mitigants " id="{{m.mitigant}}">' +
                                            '<input type="checkbox"  ng-model="m.selected" ng-checked="m.selected"> {{ m.mitigant }}' +
                                            '</li></ul></td></tr></tbody></table>'

                                    }
                                }
                            }
                        },
                        "additions": [
                            {
                            "type": "box",
                            "orderNo": 999,
                            "title": "POST_REVIEW",
                            "condition": "model.loanAccount.id && model.loanAccount.isReadOnly!='Yes' && model.currentStage != 'Rejected'",
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
                                    buttonType: "submit",
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
                            },
                            {
                                "type": "box",
                                "title": "REVERT_REJECT",
                                "condition": "model.currentStage=='Rejected'",
                                "items": [{
                                        type: "section",
                                        items: [{
                                            title: "REMARKS",
                                            key: "loanProcess.remarks",
                                            type: "textarea",
                                            required: true
                                        }, {
                                            title: "Reject Reason",
                                            key: "loanAccount.rejectReason",
                                            readonly: true,
                                            type: "textarea",
                                        }, {
                                            key: "loanProcess.stage",
                                            title: "SEND_BACK_TO_STAGE",
                                            type: "lov",
                                            lovonly:true,
                                            autolov: true,
                                            required: true,
                                            searchHelper: formHelper,
                                            search: function(inputModel, form, model, context) {
                                                var stage1 = model.review.preStage;
                                                var targetstage = formHelper.enum('targetstage').data;
                                                var out = [{'name': stage1, 'value': stage1}];
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
                                    },
                                ]
                            }
                        ]
                    }
                };
            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);
                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;
                    model.currentStage = bundleModel.currentStage;

                    model.review = model.review|| {};

                    if (!model.loanAccount.id){
                        model.loanAccount.accountUserDefinedFields = {
                            userDefinedFieldValues: {
                                udf1: 'NO'
                            }
                        };
                    }

                    if (_.hasIn(model, 'loanAccount.id') && _.isNumber(model.loanAccount.id)){
                        $log.info('Printing Loan Account');
                        IndividualLoan.loanRemarksSummary({id: model.loanAccount.id})
                        .$promise
                        .then(function (resp){
                            model.loanSummary = resp;
                            if(model.loanSummary && model.loanSummary.length)
                            {
                                for(i=0;i<model.loanSummary.length;i++)
                                {
                                    if(model.loanSummary[i].postStage=="Rejected" &&
                                        model.loanSummary[i].preStage != "Rejected")
                                    {
                                        if(model.currentStage=='Rejected')
                                        {
                                            model.review.preStage = model.loanSummary[i].preStage;
                                            model.review.targetStage1 = model.loanSummary[i].preStage;
                                        }
                                    }
                                }
                            }
                        },function (errResp){
        
                        });
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
                   
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
                    }, function(err) {
                        console.log(err);

                    })

                },
                offlineInitialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.loanProcess = bundleModel.loanProcess;
                    if(_.hasIn(model.loanProcess, 'loanAccount')) {
                        model.loanAccount = model.loanProcess.loanAccount;
                    }
                    var self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
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
                        },
                        "financial-summary": function(bundleModel, model, params) {
                            model._scores = params;
                            model._deviationDetails = model._scores[6].data;
                            model.deviationDetails = [];
                            var allMitigants = {};
                            model.allMitigants = allMitigants;
                            for (i in model._deviationDetails) {
                                var item = model._deviationDetails[i];
                                var mitigants = item.Mitigant.split('|');
                                for (j in mitigants) {
                                    allMitigants[mitigants[j]] = {
                                        mitigant: mitigants[j],
                                        parameter: item.Parameter,
                                        score: item.ParameterScore,
                                        selected: false
                                    };
                                    mitigants[j] = allMitigants[mitigants[j]];
                                }
                                if (item.ChosenMitigant && item.ChosenMitigant != null) {
                                    var chosenMitigants = item.ChosenMitigant.split('|');
                                    for (j in chosenMitigants) {
                                        allMitigants[chosenMitigants[j]].selected = true;
                                    }
                                }
                                model.deviationDetails.push({
                                    parameter: item.Parameter,
                                    score: item.ParameterScore,
                                    deviation: item.Deviation,
                                    mitigants: mitigants,
                                    color_english: item.color_english,
                                    color_hexadecimal: item.color_hexadecimal
                                });
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

                        model.loanAccount.loanMitigants = [];
                        _.forOwn(model.allMitigants, function(v, k) {
                            if (v.selected) {
                                model.loanAccount.loanMitigants.push(v);
                            }
                        });

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

                        if (model.loanProcess.remarks==null || model.loanProcess.remarks =="" || model.review.targetStage1 ==null || model.review.targetStage1 ==""){
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

                        if(model.loanProcess.loanAccount.currentStage == 'Screening' && isVehcileDetailsSaved(model)){
                            return;
                        }

                        if(model.loanProcess.loanAccount.currentStage=='TeleVerification' && (model.loanProcess.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanProcess.loanAccount.loanPurpose1 == 'Refinance') && (!_.hasIn(model.loanProcess.loanAccount.vehicleLoanDetails, 'vehicleValuationDoneAt') || model.loanProcess.loanAccount.vehicleLoanDetails.vehicleValuationDoneAt === null)) {
                            PageHelper.showErrors({"data": {"error":"Vehicle Valuation should be done"}});
                            return false;
                        }

                        model.loanAccount.loanMitigants = [];
                        _.forOwn(model.allMitigants, function(v, k) {
                            if (v.selected) {
                                model.loanAccount.loanMitigants.push(v);
                            }
                        });

                        PageHelper.showLoader();
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
                        if (model.loanProcess.remarks==null || model.loanProcess.remarks =="" || model.loanAccount.rejectReason ==null || model.loanAccount.rejectReason ==""){
                               PageHelper.showProgress("update-loan", "Reject Reason / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }
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
