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
                        "ScreeningReview": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "GoNoGoApproval1": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "GoNoGoApproval2": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "FieldInvestigation": {
                            "excludes": [
                                "LoanRecommendation",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "TeleVerification"
                            ]
                        },
                        "TeleVerification": {
                            "excludes": [
                                "LoanRecommendation",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "TeleVerification"
                            ]
                        },
                        "CreditAppraisal":  {
                            "excludes": [
                                "LoanRecommendation",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "TeleVerification"
                            ]
                        },
                        "DeviationApproval1": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "DeviationApproval2": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval1": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval2": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval3": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval4": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval5": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval1": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval2": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval3": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval4": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval5": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
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
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        // "Application": {
                        //     "excludes": [
                        //         "LoanRecommendation",
                        //         "TeleVerification"
                        //     ]
                        // },
                        // "ApplicationReview": {
                        //     "excludes": [
                        //         "PreliminaryInformation.calculateEmi",
                        //         "TeleVerification"
                        //     ],
                        //     "overrides": {
                        //         "PreliminaryInformation": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetUse": {
                        //             "readonly": true
                        //         },
                        //         "VehicleRouteDetails": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetViability": {
                        //             "readonly": true
                        //         },
                        //         "VehiclePhotoCaptures": {
                        //             "readonly": true
                        //         },
                        //         "DeductionsFromLoan": {
                        //             "readonly": true
                        //         },
                        //         "LoanDocuments": {
                        //             "readonly": true
                        //         },
                        //         "PayerDetails": {
                        //             "readonly": true
                        //         },
                        //         "NewVehicleDetails": {
                        //             "readonly": true
                        //         }
                        //     }
                        // },
                        // "BranchCreditAppraisal": {
                        //     "excludes": [
                        //         "PreliminaryInformation.calculateEmi"
                        //     ],
                        //     "overrides": {
                        //         "PreliminaryInformation": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetUse": {
                        //             "readonly": true
                        //         },
                        //         "VehicleRouteDetails": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetViability": {
                        //             "readonly": true
                        //         },
                        //         "VehiclePhotoCaptures": {
                        //             "readonly": true
                        //         },
                        //         "DeductionsFromLoan": {
                        //             "readonly": true
                        //         },
                        //         "LoanDocuments": {
                        //             "readonly": true
                        //         },
                        //         "PayerDetails": {
                        //             "readonly": true
                        //         },
                        //         "NewVehicleDetails": {
                        //             "readonly": true
                        //         }
                        //     }
                        // },
                        // "HOCreditAppraisal": {
                        //     "excludes": [
                        //         "PreliminaryInformation.calculateEmi"
                        //     ],
                        //     "overrides": {
                        //         "PreliminaryInformation": {
                        //             "readonly": true
                        //         },
                        //         "DeductionsFromLoan": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetUse": {
                        //             "readonly": true
                        //         },
                        //         "LoanDocuments": {
                        //             "readonly": true
                        //         },
                        //         "VehicleRouteDetails": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetViability": {
                        //             "readonly": true
                        //         },
                        //         "VehiclePhotoCaptures": {
                        //             "readonly": true
                        //         },
                        //         "PayerDetails": {
                        //             "readonly": true
                        //         },
                        //         "NewVehicleDetails": {
                        //             "readonly": true
                        //         },
                        //         "TeleVerification": {
                        //             "readonly": true
                        //         },
                        //         "NewVehicleDetails": {
                        //             "readonly": true
                        //         }
                        //     }
                        // },
                        // "ManagementCommittee": {
                        //     "excludes": [
                        //         "PreliminaryInformation.calculateEmi"
                        //     ],
                        //     "overrides": {
                        //         "PreliminaryInformation": {
                        //             "readonly": true
                        //         },
                        //         "DeductionsFromLoan": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetUse": {
                        //             "readonly": true
                        //         },
                        //         "LoanDocuments": {
                        //             "readonly": true
                        //         },
                        //         "PayerDetails": {
                        //             "readonly": true
                        //         },
                        //         "VehicleRouteDetails": {
                        //             "readonly": true
                        //         },
                        //         "VehicleAssetViability": {
                        //             "readonly": true
                        //         },
                        //         "VehiclePhotoCaptures": {
                        //             "readonly": true
                        //         },
                        //         "NewVehicleDetails": {
                        //             "readonly": true
                        //         },
                        //         "TeleVerification": {
                        //             "readonly": true
                        //         },
                        //         "NewVehicleDetails": {
                        //             "readonly": true
                        //         }
                        //     }
                        // },
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
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
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
                                "NewVehicleDetails": {
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
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.loanToValue",
                    "PreliminaryInformation.frequencyRequested",
                    "PreliminaryInformation.tenureRequested",
                    "PreliminaryInformation.udf5",
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
                    "VehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails.routeFrom",
                    "VehicleRouteDetails.vehicleRouteDetails.routeTo",
                    "VehicleRouteDetails.vehicleRouteDetails.routeVia",
                    "VehicleAssetUse",
                    "VehicleAssetUse.segment",
                    "VehicleAssetUse.subSegnment",
                    "VehicleAssetUse.entityType",
                    "VehicleAssetUse.attachedwith",
                    "VehicleAssetUse.attachedAddress",
                    "VehicleAssetUse.attachedContactNumber",
                    "VehicleAssetUse.locationAddress",
                    "VehicleAssetUse.locationContactName",
                    "VehicleAssetUse.locationContactNumber",
                    "VehicleLoanIncomesInformation",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeType",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeAmount",
                    "VehicleExpensesInformation",
                    "VehicleExpensesInformation.VehicleExpenses",
                    "VehicleExpensesInformation.VehicleExpenses.expenseType",
                    "VehicleExpensesInformation.VehicleExpenses.expenseAmount",
                    "VehiclePhotoCaptures",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures.photoFileId",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures.photoRemarks",
                    "LoanRecommendation",
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.processingFeePercentage",
                    "LoanRecommendation.securityEmiRequired",
                    "LoanRecommendation.commercialCibilCharge",
                    "LoanRecommendation.calculateNominalRate",
                    "LoanRecommendation.udf6",
                    "NewVehicleDetails",
                    "NewVehicleDetails.vehicleType",
                    "NewVehicleDetails.endUse",
                    "NewVehicleDetails.usedFor",
                    "NewVehicleDetails.segment",
                    "NewVehicleDetails.category",
                    "NewVehicleDetails.yearOfManufacture",
                    "NewVehicleDetails.yearOfManufacture1",
                    "NewVehicleDetails.make",
                    "NewVehicleDetails.make1",
                    "NewVehicleDetails.vehicleModel",
                    "NewVehicleDetails.vehicleModel1",
                    "NewVehicleDetails.assetDetails",
                    "NewVehicleDetails.assetSubDetails",
                    "NewVehicleDetails.registrationNumber",
                    "NewVehicleDetails.originalInvoiceValue",
                    "NewVehicleDetails.permitType",
                    "NewVehicleDetails.price",
                    "NewVehicleDetails.udf1",
                    "NewVehicleDetails.insuredDeclaredValue",
                    "VehicleViability",
                    "VehicleViability.viabilityCategory",
                    "VehicleViability.grossVehicleWeight",
                    "VehicleViability.payLoad",
                    "VehicleViability.typeofLoad",
                    "VehicleViability.ratePerTrip",
                    "VehicleViability.mileage",
                    "VehicleViability.noOfTyres",
                    "VehicleViability.costOfTyre",
                    "VehicleViability.lifeOfTyre",
                    "VehicleViability1",
                    "VehicleViability1.grossVehicleWeight1",
                    "VehicleViability1.payLoad1",
                    "VehicleViability1.typeofLoad1",
                    "VehicleViability1.ratePerTrip1",
                    "VehicleViability1.mileage1",
                    "VehicleViability1.noOfTyres1",
                    "VehicleViability1.costOfTyre1",
                    "VehicleViability1.lifeOfTyre1",
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
                    "vehicleLoanDocuments",
                    "vehicleLoanDocuments.vehicleLoanDocuments",
                    "vehicleLoanDocuments.vehicleLoanDocuments.docType",
                    "vehicleLoanDocuments.vehicleLoanDocuments.fileId",
                    "vehicleLoanDocuments.vehicleLoanDocuments.issueDate",
                    "vehicleLoanDocuments.vehicleLoanDocuments.expiryDate",
                    "LoanChannel",
                    "LoanChannel.loanChannels",
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

                    // model.loanAccount.accountUserDefinedFields = model.loanAccount.accountUserDefinedFields || {};

                    self = this;
                    var formRequest = {
                        "overrides": {
                            "vehicleLoanDocuments.vehicleLoanDocuments": {
                                "view": "fixed",
                                "titleExpr": "model.loanAccount.vehicleLoanDetails.vehicleLoanDocuments[arrayIndexes[0]].docType",
                                "add": null,
                                "remove": null
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments.docType": {
                                "required": true
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments.fileId": {
                                "required": true
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.routeFrom": {
                                "required": true
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.routeTo": {
                                "required": true
                            },
                            "LoanRecommendation.udf6": {
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
                            "VehicleAssetUse": {
                                "condition": "model.loanAccount.vehicleLoanDetails.usedFor == 'Commercial' && (model.loanAccount.loanPurpose1 == 'Purchase – New Vehicle' ||model.loanAccount.loanPurpose1 == 'Purchase – Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance')"
                            },
                            "VehicleRouteDetails": {
                                "condition": "model.loanAccount.vehicleLoanDetails.usedFor == 'Commercial' && (model.loanAccount.loanPurpose1 == 'Purchase – New Vehicle' ||model.loanAccount.loanPurpose1 == 'Purchase – Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance')"
                            },
                            "DeductionsFromLoan.estimatedEmi": {
                                "readonly": true,
                                "condition": "model.loanAccount.securityEmiRequired == 'YES'"
                            },
                            "NewVehicleDetails": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "NewVehicleDetails.permitType": {
                                "type": "select",
                                "enumCode": "permit_type",
                                "title": "PERMIT_TYPE"
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
                            "PreliminaryInformation.tenureRequested": {
                                "required": true,
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                    model.loanAccount.expectedInterestRate = null;
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
                            "PreliminaryInformation.expectedInterestRate": {
                                "required": true,
                                "title": "NOMINAL_RATE",
                                "readonly": true
                            },
                            "NewVehicleDetails.vehicleType": {
                                "orderNo": 10,
                                "enumCode": "new_vehicle_category",
                                "required": true
                            },
                            "NewVehicleDetails.endUse": {
                                "orderNo": 20,
                                "required": true
                            },
                            "NewVehicleDetails.usedFor": {
                                "orderNo": 30,
                                "required": true
                            },
                            "NewVehicleDetails.segment": {
                                "orderNo": 40,
                                "enumCode": "vehicle_segment",
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.vehicleLoanDetails.category = null;
                                    model.loanAccount.vehicleLoanDetails.make = null;
                                    model.loanAccount.vehicleLoanDetails.make1 = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                    model.loanAccount.vehicleLoanDetails.yearOfManufacture = null;
                                    model.loanAccount.vehicleLoanDetails.price = null;
                                },
                                "required": true
                            },
                            "NewVehicleDetails.category": {
                                "orderNo": 50,
                                "enumCode": "vehicle_type",
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.vehicleLoanDetails.make = null;
                                    model.loanAccount.vehicleLoanDetails.make1 = null
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                    model.loanAccount.vehicleLoanDetails.yearOfManufacture = null;
                                    model.loanAccount.vehicleLoanDetails.price = null;
                                },
                                "required": true
                            },
                            "NewVehicleDetails.make": {
                                "orderNo": 60,
                                "key": "loanAccount.vehicleLoanDetails.make",
                                "type": "lov",
                                "autolov": true,
                                "lovonly": true,
                                "title": "MAKE",
                                "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var vehicleDetails = model.vehicleDetails;
                                    var out = [];
                                    var res = $filter('filter')(vehicleDetails, {
                                        'segment': model.vehicleDetails.segment,
                                        'asset_type': model.vehicleDetails.category
                                    }, true);
                                    out = _.uniqBy(res, 'manufacturer');
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.vehicleLoanDetails.make = valueObj.manufacturer;
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                    model.loanAccount.vehicleLoanDetails.yearOfManufacture = null;
                                    model.loanAccount.vehicleLoanDetails.price = null;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.manufacturer
                                    ];
                                },
                                "required": true
                            },
                            "NewVehicleDetails.vehicleModel": {
                                "orderNo": 70,
                                "key": "loanAccount.vehicleLoanDetails.vehicleModel",
                                "type": "lov",
                                "autolov": true,
                                "lovonly": true,
                                "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var vehicleDetails = model.vehicleDetails;
                                    var out = [];
                                    var res = $filter('filter')(vehicleDetails, {
                                        'segment': model.loanAccount.vehicleLoanDetails.segment,
                                        'asset_type': model.loanAccount.vehicleLoanDetails.category,
                                        'manufacturer': model.loanAccount.vehicleLoanDetails.make
                                    }, true);
                                    out = _.uniqBy(res, 'model');
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = valueObj.model;
                                    model.loanAccount.vehicleLoanDetails.yearOfManufacture = null;
                                    model.loanAccount.vehicleLoanDetails.price = null;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.model
                                    ];
                                },
                                "required": true
                            },
                            "NewVehicleDetails.yearOfManufacture": {
                                "orderNo": 80,
                                "key": "loanAccount.vehicleLoanDetails.yearOfManufacture",
                                "title": "MANUFACTURER_YEAR",
                                "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                // bindMap: {},
                                // searchHelper: formHelper,
                                // search: function(inputModel, form, model, context) {
                                //     var vehicleDetails = model.vehicleDetails;
                                //     var out = [];
                                //     var res = $filter('filter')(vehicleDetails, {
                                //         'segment': model.loanAccount.vehicleLoanDetails.segment,
                                //         'asset_type': model.loanAccount.vehicleLoanDetails.category,
                                //         'manufacturer': model.loanAccount.vehicleLoanDetails.make,
                                //         'model': model.loanAccount.vehicleLoanDetails.vehicleModel
                                //     }, true);
                                //     out = _.uniqBy(res, 'year_of_manufacture');
                                //     return $q.resolve({
                                //         headers: {
                                //             "x-total-count": out.length
                                //         },
                                //         body: out
                                //     });
                                // },
                                // onSelect: function(valueObj, model, context) {
                                //     model.loanAccount.vehicleLoanDetails.yearOfManufacture = valueObj.year_of_manufacture;
                                //     var res = $filter('filter')(model.vehicleDetails, {
                                //         'segment': model.loanAccount.vehicleLoanDetails.segment,
                                //         'asset_type': model.loanAccount.vehicleLoanDetails.category,
                                //         'manufacturer': model.loanAccount.vehicleLoanDetails.make,
                                //         'model': model.loanAccount.vehicleLoanDetails.vehicleModel,
                                //         'year_of_manufacture': model.loanAccount.vehicleLoanDetails.yearOfManufacture
                                //     }, true);
                                //     model.loanAccount.vehicleLoanDetails.price = Number(res[0].price);
                                // },
                                // getListDisplayItem: function(item, index) {
                                //     return [
                                //         item.year_of_manufacture
                                //     ];
                                // },
                                "required": true
                            },
                            "NewVehicleDetails.assetDetails": {
                                "orderNo": 90
                            },
                            "NewVehicleDetails.assetSubDetails": {
                                "orderNo": 100,
                                "title": "SUB_DESCRIPTION"
                            },
                            "NewVehicleDetails.registrationNumber": {
                                "orderNo": 110,
                                "required": true
                            },
                            "NewVehicleDetails.originalInvoiceValue": {
                                "orderNo": 120,
                                "readonly": true,
                                "required": true
                            },
                            "VehiclePhotoCaptures": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase – New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase – Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
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
                                                    model.loanAccount.expectedInterestRate = (Math.pow((2 * parseFloat(model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5) * parseFloat(model.loanAccount.tenureRequested) / parseFloat(model.loanAccount.tenureRequested) + 1) + 1, 1 / frequencyRequested1) - 1) * frequencyRequested1;
                                                } else {
                                                    PageHelper.showErrors({
                                                        data: {
                                                            error: "Please Enter Required Values for calculating Nominal Rate"
                                                        }
                                                    });
                                                    return false;
                                                }
                                                if (model.loanAccount.expectedInterestRate && model.loanAccount.tenureRequested && model.loanAccount.frequencyRequested && model.loanAccount.loanAmountRequested) {
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
                                        },
                                        "udf5": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5",
                                            "title" : "FLAT_RATE",
                                            "type": "string",
                                            "orderNo" : 75
                                        },
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
                                        "calculateNominalRate": {
                                            "title": "CALCULATE_NOMINAL_RATE",
                                            "type": "button",
                                            onClick: function(model, formCtrl) {
                                                var frequencyRequested;
                                                if (model.loanAccount.frequencyRequested && model.loanAccount.tenure && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5) {
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
                                                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = (Math.pow((((2 * parseFloat(model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5) * parseFloat(model.loanAccount.tenure)) / (parseFloat(model.loanAccount.tenure) + 1)) + 1), 1 / frequencyRequested) - 1) * frequencyRequested;
                                                }
                                            }
                                        }
                                    }
                                },
                                "LoanChannel": {
                                    "type": "box",
                                    "title": "LOAN_CHANNEL",
                                    "orderNo": 998,
                                    "items": {
                                        "loanChannels": {
                                            "key": "loanAccount.loanChannels",
                                            "type": "select",
                                            "title": "LOAN_CHANNEL_TYPE",
                                            "titleMap": {
                                                "Green": "Green",
                                                "Yellow": "Yellow",
                                                "Red": "Red"
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
                                            "key": "loanAccount.udf10",
                                            "type": "select",
                                            "title": "FI_DECISION",
                                            "enumCode": "fi_decision"
                                        },
                                        "fieldInvestigationReason": {
                                            "key": "loanAccount.udf11",
                                            "type": "select",
                                            "title": "FI_REASON",
                                            "condition": "model.loanAccount.udf10 == 'Negative' || model.loanAccount.udf10 == 'Refer to Credit'",
                                            "enumCode": "fi_reason",
                                            "parentEnumCode": "fi_decision",
                                            "parentValueExpr": "model.loanAccount.udf10"
                                        }
                                    }
                                },
                                "NewVehicleDetails": {
                                    "items": {
                                        "udf1": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1",
                                            "title": "MODEL_NOT_LISTED",
                                            "enumCode": "decisionmaker",
                                            "type": "radios",
                                            "orderNo": 75,
                                            onChange: function(modelValue, form, model) {
                                                if(model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES') {
                                                    model.loanAccount.vehicleLoanDetails.viabilityCategory = "Non-Standard Asset";
                                                }
                                            }
                                        },
                                        "make1": {
                                            "orderNo": 60,
                                            "key": "loanAccount.vehicleLoanDetails.make",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "title": "MAKE",
                                            "required": true
                                        },
                                        "vehicleModel1": {
                                            "orderNo": 70,
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "key": "loanAccount.vehicleLoanDetails.vehicleModel",
                                            "required": true,
                                            "title": "MODEL"
                                        },
                                        "yearOfManufacture1": {
                                            "orderNo": 80,
                                            "key": "loanAccount.vehicleLoanDetails.yearOfManufacture",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "title": "MANUFACTURER_YEAR",
                                            "required": true
                                        },
                                        "insuredDeclaredValue": {
                                            "orderNo": 90,
                                            "key": "loanAccount.vehicleLoanDetails.insuredDeclaredValue",
                                            "title": "INSURED_DECLARED_VALUE"
                                        }
                                    }
                                },
                                "VehicleViability": {
                                    "type": "box",
                                    "title": "VEHICLE_VIABILITY",
                                    "orderNo": 45,
                                    "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'",
                                    "items": {
                                        "viabilityCategory": {
                                           "key": "loanAccount.vehicleLoanDetails.viabilityCategory",
                                           "title": "VIABILITY_CATEGORY",
                                           "readonly": "true"
                                        },
                                        "grossVehicleWeight": {
                                           "key": "loanAccount.vehicleLoanDetails.grossVehicleWeight",
                                           "title": "GROSS_VEHICLE_WEIGHT",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "payLoad": {
                                           "key": "loanAccount.vehicleLoanDetails.payLoad",
                                           "title": "PAYLOAD",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "typeofLoad": {
                                           "key": "loanAccount.vehicleLoanDetails.typeofLoad",
                                           "title": "TYPE_OF_LOAD",
                                           "readonly": "true"
                                        },
                                        "ratePerTrip": {
                                           "key": "loanAccount.vehicleLoanDetails.ratePerTrip",
                                           "title": "RATE_PER_TRIP",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "mileage": {
                                           "key": "loanAccount.vehicleLoanDetails.mileage",
                                           "title": "MILEAGE",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "noOfTyres": {
                                           "key": "loanAccount.vehicleLoanDetails.noOfTyres",
                                           "title": "NO_OF_TYRES",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "costOfTyre": {
                                           "key": "loanAccount.vehicleLoanDetails.costOfTyre",
                                           "title": "COST_OF_TYRE",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "lifeOfTyre": {
                                           "key": "loanAccount.vehicleLoanDetails.lifeOfTyre",
                                           "title": "LIFE_OF_TYRE",
                                           "type": "number",
                                           "readonly": "true"
                                        }
                                    }
                                },
                                "VehicleViability1": {
                                    "type": "box",
                                    "title": "VEHICLE_VIABILITY",
                                    "orderNo": 45,
                                    "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'",
                                    "items": {
                                        "grossVehicleWeight1": {
                                           "key": "loanAccount.vehicleLoanDetails.grossVehicleWeight",
                                           "title": "GROSS_VEHICLE_WEIGHT",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "payLoad1": {
                                           "key": "loanAccount.vehicleLoanDetails.payLoad",
                                           "title": "PAYLOAD",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "typeofLoad1": {
                                           "key": "loanAccount.vehicleLoanDetails.typeofLoad",
                                           "title": "TYPE_OF_LOAD",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                        },
                                        "ratePerTrip1": {
                                           "key": "loanAccount.vehicleLoanDetails.ratePerTrip",
                                           "title": "RATE_PER_TRIP",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "mileage1": {
                                           "key": "loanAccount.vehicleLoanDetails.mileage",
                                           "title": "MILEAGE",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "noOfTyres1": {
                                           "key": "loanAccount.vehicleLoanDetails.noOfTyres",
                                           "title": "NO_OF_TYRES",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "costOfTyre1": {
                                           "key": "loanAccount.vehicleLoanDetails.costOfTyre",
                                           "title": "COST_OF_TYRE",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "lifeOfTyre1": {
                                           "key": "loanAccount.vehicleLoanDetails.lifeOfTyre",
                                           "title": "LIFE_OF_TYRE",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
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
                                        "title": "VALUATOR",
                                        "key": "loanAccount.valuator",
                                        "type": "select",
                                        "condition": "model.loanProcess.loanAccount.currentStage == 'ScreeningReview' && (model.loanAccount.loanPurpose1 == 'Purchase – Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance')",
                                        "titleMap": {
                                            "test": "test"
                                        }
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
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.vehicleLoanDetails = {};
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.loanPurpose2 = obj.loanPurpose2;
                        model.loanAccount.vehicleLoanDetails.registrationNumber = obj.vehicleRegistrationNumber;
                        model.loanAccount.screeningDate = obj.screeningDate || moment().format("YYYY-MM-DD");
                    },
                    "get-vehicle-details": function(bundleModel, model, obj) {
                        $log.info(obj);
                        model.vehicleDetails = obj;
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
                    }
                }
            };

        }
    }
});
