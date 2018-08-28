define([], function() {

    return {
        pageUID: "pahal.loans.individual.screening.LoanRequest",
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
                        "GoNoGoApproval1": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification",
                                "FieldInvestigationDetails",
                                "LoanRecommendation"
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
                                "FieldInvestigationDetails",
                                "LoanRecommendation"
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
                        "Application": {
                            "excludes": [
                                "TeleVerification",
                                "FieldInvestigationDetails",
                                "LoanRecommendation"
                            ],
                            "overrides": {

                            }
                        },
                        "ApplicationReview": {
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
                        "TeleVerification": {
                            "excludes": [
                                "LoanRecommendation",
                                "FieldInvestigationDetails"
                            ],
                            "overrides": {
                                "FieldInvestigationDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "FieldInvestigation1": {
                            "excludes": [
                                "LoanRecommendation",
                            ],
                            "overrides": {

                            }
                        },
                        "FieldInvestigation2": {
                            "excludes": [
                                "LoanRecommendation",
                            ],
                            "overrides": {

                            }
                        },
                        "FieldInvestigation3": {
                            "excludes": [
                                "LoanRecommendation",
                            ],
                            "overrides": {

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
                        "DeviationApproval": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
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
                        "REJECTED": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                                "LoanRecommendation"
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
                                }
                            }
                        }
                    }

                }
            }

            var getIncludes = function(model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.linkedAccountNumber",
                    "PreliminaryInformation.loan",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.schemeCode",
                    "PreliminaryInformation.productCategory",
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
                    "DeductionsFromLoan",
                    "DeductionsFromLoan.expectedProcessingFeePercentage",
                    "DeductionsFromLoan.dsaPayout",
                    "DeductionsFromLoan.securityEmiRequired",
                    "DeductionsFromLoan.estimatedEmi",
                    "DeductionsFromLoan.calculateDisbursedAmount",
                    "DeductionsFromLoan.fee3",
                    "DeductionsFromLoan.OtherFee",
                    "DeductionsFromLoan.fee4",
                    "DeductionsFromLoan.expectedPortfolioInsurancePremium",
                    "DeductionsFromLoan.dealIrr",
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
                    "LoanRecommendation.frequency",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.processingFeePercentage",
                    "LoanRecommendation.securityEmiRequired",
                    "LoanRecommendation.commercialCibilCharge",
                    "LoanRecommendation.calculateNominalRate",
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
                    "actionbox.holdAction",
                    "PostReview",
                    "PostReview.options",
                    "PostReview.proceed",
                    "PostReview.proceed.remarks",
                    "PostReview.proceed.valuator",
                    "PostReview.proceed.proceedButton",
                    "PostReview.sendBack",
                    "PostReview.sendBack.remarks",
                    "PostReview.sendBack.stage",
                    "PostReview.sendBack.sendBackButton",
                    "PostReview.reject",
                    "PostReview.reject.remarks",
                    "PostReview.reject.rejectReason",
                    "PostReview.reject.rejectButton",
                    "PostReview.hold",
                    "PostReview.hold.remarks",
                    "PostReview.hold.holdButton"

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

                    // model.loanAccount.accountUserDefinedFields = model.loanAccount.accountUserDefinedFields || {};

                    var self = this;
                    var formRequest = {
                        "overrides": {
                            "PreliminaryInformation.productCategory": {
                                "orderNo": 45
                            },
                            "PreliminaryInformation.expectedInterestRate": {
                                "title": "NOMINAL_RATE",
                                "readonly": true
                            },
                            "TeleVerification.verifications.personContacted": {
                                "required": true
                            },
                            "TeleVerification.verifications.customerResponse":{
                                "type": "select",
                                "enumCode": "customer_response"
                            },
                            "LoanRecommendation.interestRate": {
                                "title": "NOMINAL_RATE",
                                "readonly": true
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
                                        "productCategory": {
                                            "key": "loanAccount.productCategory",
                                            "title": "PRODUCT_TYPE",
                                            "enumCode": "loan_product_category",
                                            "type": "select"
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
                                            "title": "HOSPI_CASH_INSURANCE",
                                            "orderNo": 40
                                        },
                                        "expectedPortfolioInsurancePremium": {
                                            "key": "loanAccount.expectedPortfolioInsurancePremium",
                                            "title": "LOAN_PROTECTION_INSURANCE",
                                            "orderNo": 50
                                        },
                                        "fee4": {
                                            "key": "loanAccount.fee4",
                                            "title": "VEHICLE_INSURANCE",
                                            "orderNo": 60
                                        },
                                        "OtherFee": {
                                            "key": "loanAccount.otherFee",
                                            "title": "OTHER_DEDUCTIONS",
                                            "orderNo": 65
                                        },
                                        "dealIrr": {
                                            "key": "loanAccount.dealIrr",
                                            "title": "XIRR",
                                            "type": "number",
                                            "orderNo": 110,
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
                                        "udf6": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6",
                                            "title": "FLAT_RATE",
                                            "type": "string",
                                            "required": true,
                                            "orderNo": 25
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
                                "PostReview": {
                                    "type": "box",
                                    "orderNo": 999,
                                    "title": "POST_REVIEW",
                                    "condition": "model.loanAccount.id",
                                    "items": {
                                        "options": {
                                            key: "review.action",
                                            type: "radios",
                                            titleMap: {
                                                "REJECT": "REJECT",
                                                "SEND_BACK": "SEND_BACK",
                                                "PROCEED": "PROCEED",
                                                "HOLD": "HOLD"
                                            }
                                        },
                                        "proceed": {
                                            type: "section",
                                            condition: "model.review.action=='PROCEED'",
                                            items: {
                                                "remarks": {
                                                    title: "REMARKS",
                                                    key: "loanProcess.remarks",
                                                    type: "textarea",
                                                    required: true
                                                },
                                                "valuator": {
                                                    "title": "VALUATOR",
                                                    "key": "loanAccount.valuator",
                                                    "type": "select",
                                                    "condition": "model.loanProcess.loanAccount.currentStage == 'ScreeningReview' && (model.loanAccount.loanPurpose1 == 'Purchase – Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance')",
                                                    "titleMap": {
                                                        "test": "test"
                                                    }
                                                },
                                                "proceedButton": {
                                                    key: "review.proceedButton",
                                                    type: "button",
                                                    title: "PROCEED",
                                                    onClick: "actions.proceed(model, formCtrl, form, $event)"
                                                }
                                            }
                                        },
                                        "sendBack": {
                                            type: "section",
                                            condition: "model.review.action=='SEND_BACK'",
                                            items: {
                                                "remarks": {
                                                    title: "REMARKS",
                                                    key: "loanProcess.remarks",
                                                    type: "textarea",
                                                    required: true
                                                },
                                                "stage": {
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
                                                },
                                                "sendBackButton": {
                                                    key: "review.sendBackButton",
                                                    type: "button",
                                                    title: "SEND_BACK",
                                                    onClick: "actions.sendBack(model, formCtrl, form, $event)"
                                                }
                                            }
                                        },
                                        "reject": {
                                            type: "section",
                                            condition: "model.review.action=='REJECT'",
                                            items: {
                                                "remarks": {
                                                    title: "REMARKS",
                                                    key: "loanProcess.remarks",
                                                    type: "textarea",
                                                    required: true
                                                },
                                                "rejectReason": {
                                                    title: "REJECT_REASON",
                                                    fieldType: "string",
                                                    key: "loanAccount.rejectReason",
                                                    "type": "lov",
                                                    "autolov": true,
                                                    "resolver": "RejectReasonLOVConfiguration"
                                                },
                                                "rejectButton": {
                                                    key: "review.rejectButton",
                                                    type: "button",
                                                    title: "REJECT",
                                                    required: true,
                                                    onClick: "actions.reject(model, formCtrl, form, $event)"
                                                }
                                            }
                                        },
                                        "hold": {
                                            type: "section",
                                            condition: "model.review.action=='HOLD'",
                                            items: {
                                                "remarks": {
                                                    title: "REMARKS",
                                                    key: "review.remarks",
                                                    type: "textarea",
                                                    required: true
                                                },
                                                "holdButton": {
                                                    key: "review.holdButton",
                                                    type: "button",
                                                    title: "HOLD",
                                                    required: true,
                                                    onClick: "actions.holdAction(model, formCtrl, form, $event)"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };

                    UIRepository.getLoanProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                        });

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
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.loanPurpose2 = obj.loanPurpose2;
                        model.loanAccount.vehicleLoanDetails.registrationNumber = obj.vehicleRegistrationNumber;
                        model.loanAccount.screeningDate = obj.screeningDate || moment().format("YYYY-MM-DD");
                        model.loanAccount.parentLoanAccount = obj.parentLoanAccount;
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
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        PageHelper.showProgress('enrolment', 'Updating Loan');

                    },
                    reject: function(model, formCtrl, form, $event) {
                        PageHelper.showLoader();
                        model.loanProcess.reject()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    holdAction: function(model, formCtrl, form, $event) {
                        $log.info("Inside save()");
                        PageHelper.clearErrors();
                        /* TODO Call save service for the loan */
                        // if(isEnrollmentsSubmitPending(model)){
                        //     return;
                        // }

                        if (model.review.remarks==null || model.review.remarks ==""){
                            PageHelper.showProgress("update-loan", "Remarks is mandatory");
                            return false;
                        }

                        Utils.confirm("Are You Sure?")
                        .then(
                            function(){
                                PageHelper.showLoader();
                                model.loanProcess.hold()
                                    .finally(function() {
                                        PageHelper.hideLoader();
                                    })
                                    .subscribe(function(value) {
                                        Utils.removeNulls(value, true);
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                        irfNavigator.goBack();
                                    }, function(err) {
                                        PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                        PageHelper.showErrors(err);
                                        PageHelper.hideLoader();
                                    });
                                }
                        );
                    }
                }
            };

        }
    }
});
