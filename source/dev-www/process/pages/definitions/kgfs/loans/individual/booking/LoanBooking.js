define([], function () {

    return {
        pageUID: "kgfs.loans.individual.booking.LoanBooking",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function ($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            //PMT calculation
            var pmt = function (rate, nper, pv, fv, type) {
                if (!fv) fv = 0;
                if (!type) type = 0;

                if (rate == 0) return -(pv + fv) / nper;

                var pvif = Math.pow(1 + rate, nper);
                var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

                if (type == 1) {
                    pmt /= (1 + rate);
                };

                return pmt;
            }
            //pmt function completed

            var self;
            var validateForm = function (formCtrl) {
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };

            var getRelationFromClass = function (relation) {
                if (relation == 'guarantor') {
                    return 'Guarantor';
                } else if (relation == 'applicant') {
                    return 'Applicant';
                } else if (relation == 'co-applicant') {
                    return 'Co-Applicant';
                }
            };



            var configFiles = function () {
                return {
                    "loanAccount.currentStage": {
                        "KYC": {
                            "excludes": [
                                "LoanRecommendation",
                                "LoanSanction",
                                "LoanMitigants",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "AdditionalLoanInformation",
                                "NomineeDetails",
                                "PreliminaryInformation.expectedPortfolioInsurancePremium",
                                "ProposedUtilizationPlan",
                                "CollateralDetails"
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
                                    "type": "select",
                                    "schema": {
                                        "enumCode": "tenure_requested"
                                    }
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
                                "PreliminaryInformation.loanPurpose1": {
                                    "resolver": "LoanPurpose1LOVConfiguration"
                                },
                                "PreliminaryInformation.loanPurpose2": {
                                    "resolver": "LoanPurpose2LOVConfiguration"
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
                        },
                        "GuarantorAddition": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "NomineeDetails.nominees.nomineeButton",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanRecommendation.udf8": {
                                    "readonly": true
                                },
                                "LoanRecommendation.udf3": {
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }
                            }
                        },
                        "KYCReview": {
                            "excludes": [
                                "LoanRecommendation",
                                "LoanSanction",
                                "LoanMitigants",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "AdditionalLoanInformation",
                                "NomineeDetails",
                                "ProposedUtilizationPlan",
                                "CollateralDetails"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
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
                                    "remove": null,
                                    "startEmpty": false
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'"
                                }
                            }
                        },
                        "Appraisal": {
                            "excludes": [
                                "LoanRecommendation",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
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
                                "CollateralDetails": {
                                    "orderNo": 7
                                },
                                "NomineeDetails": {
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
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                    "required": true
                                },
                                "AdditionalLoanInformation.productCategory": {
                                    "required": true,
                                    "type": "select",
                                    "enumCode": "loan_product_category"
                                },
                                "AdditionalLoanInformation.proposedHires": {
                                    "required": true
                                },
                                "NomineeDetails.nominees.nomineeFirstName": {
                                    "required": true,
                                    "resolver": "NomineeFirstNameLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeGender": {
                                    "required": true
                                },
                                "NomineeDetails.nominees.nomineeDOB": {
                                    "required": true
                                },
                                "NomineeDetails.nominees.nomineeButton": {
                                    "orderNo": 41,
                                },
                                "NomineeDetails.nominees.nomineeDoorNo": {
                                    "required": true
                                },
                                "NomineeDetails.nominees.nomineePincode": {
                                    "required": true,
                                    "resolver": "NomineePincodeLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeRelationship": {
                                    "required": true
                                },
                                "CollateralDetails.collateral.collateralDescription": {
                                    "required": true,
                                    "orderNo": 10
                                },
                                "CollateralDetails.collateral.collateralValue": {
                                    "required": true,
                                    "orderNo": 20
                                },
                                "CollateralDetails.collateral.expectedIncome": {
                                    "required": true,
                                    "orderNo": 30
                                },
                                "CollateralDetails.collateral.collateralType": {
                                    "required": true,
                                    "orderNo": 40
                                },
                                "CollateralDetails.collateral.manufacturer": {
                                    "required": true,
                                    "orderNo": 50
                                },
                                "CollateralDetails.collateral.modelNo": {
                                    "required": true,
                                    "orderNo": 60
                                },
                                "CollateralDetails.collateral.serialNo": {
                                    "orderNo": 70
                                },
                                "CollateralDetails.collateral.expectedPurchaseDate": {
                                    "required": true,
                                    "orderNo": 80
                                },
                                "CollateralDetails.collateral.machineAttachedToBuilding": {
                                    "required": true,
                                    "orderNo": 90
                                },
                                "CollateralDetails.collateral.hypothecatedToBank": {
                                    "required": true,
                                    "orderNo": 100
                                },
                                "CollateralDetails.collateral.electricityAvailable": {
                                    "required": true,
                                    "orderNo": 110
                                },
                                "CollateralDetails.collateral.spaceAvailable": {
                                    "required": true,
                                    "orderNo": 120
                                },
                                "CollateralDetails.collateral.collateral1FilePath": {
                                    "required": true,
                                    "orderNo": 130
                                },

                            }
                        },
                        "AppraisalReview": {
                            "excludes": [
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "NomineeDetails.nominees.nomineeButton",
                                "LoanMitigants",
                                "LoanRecommendation.udf8",
                                "LoanRecommendation.udf3",
                                "LoanMitigants.deviationParameter"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }
                            }
                        },
                        "Televerification": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "LoanMitigants",
                                "LoanRecommendation.udf8",
                                "LoanRecommendation.udf3",
                                "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }

                            }
                        },
                        "Evaluation": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }

                            }
                        },

                        "CreditCommitteeReview": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "LoanRecommendation.udf8": {
                                    "readonly": true
                                },
                                "LoanRecommendation.udf3": {
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }

                            }
                        },
                        "Sanction": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanRecommendation.udf8": {
                                    "readonly": true
                                },
                                "LoanRecommendation.udf3": {
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "LoanSanction": {
                                    "orderNo": 9
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }

                            }
                        }

                    }

                }
            }

            var overridesFieldss = function (bundlePageObj) {
                return {
                    "PreliminaryInformation.linkedAccountNumber": {
                        "resolver": "LinkedAccountNumberLOVConfiguration"
                    },
                    "LoanRecommendation.udf8": {
                        "title": "ELIGIBLE_DISPOSABLE_INCOME",
                        "onChange": function (modelValue, form, model, formCtrl, event) {
                            var eligibleDi = modelValue * podiValue / 100;
                            var rate = model.loanAccount.expectedInterestRate / 100;
                            var ir = rate / 12;
                            var tenure = model.loanAccount.tenureRequested;
                            var constant = 1;
                            var pmt1 = pmt(ir, tenure, constant, 0, 0);
                            var maximumLoanEligible = eligibleDi / (-pmt(ir, tenure, constant, 0, 0)) * 1;
                            model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3 = Math.round(maximumLoanEligible);
                        }
                    },
                    "LoanRecommendation.udf3": {
                        "title": "MAXIMUM_ELIGIBLE_LOAN",
                        "readonly": true
                    },
                    "CollateralDetails.collateral.HYPOTHECATED_TO_IREPatedToBank": {
                        "title": "HYPOTHECATED_TO_IREP"
                    },
                    "PreliminaryInformation.expectedInterestRate": {
                        "type": "select",
                        "enumCode": "customerinfo_expect_interestra"
                    },
                    "PreliminaryInformation.emiPaymentDateRequested": {
                        "enumCode": "customerinfo_emirequest_date"
                    },
                    "PreliminaryInformation.collectionPaymentType": {
                        "enumCode": "customerinfo_colctn_Pymt_type"
                    },
                    "LoanCustomerRelations.loanCustomerRelations": {
                        "add": null,
                        "remove": null,
                        "startEmpty": true
                    },
                    "ProposedUtilizationPlan.loanUtilisationDetail.utilisationType": {
                        "required": true
                    },
                    "ProposedUtilizationPlan.loanUtilisationDetail.fundAllocationPercentage": {
                        "required": true
                    },
                    "NomineeDetails.nominees.nomineeFirstName": {
                        "orderNo": 10
                    },
                    "NomineeDetails.nominees.nomineeGender": {
                        "orderNo": 20
                    },
                    "NomineeDetails.nominees.nomineeDOB": {
                        "orderNo": 30
                    },
                    "NomineeDetails.nominees.nomineeRelationship": {
                        "orderNo": 40
                    },
                    "NomineeDetails.nominees.nomineePincode": {
                        "resolver": "PincodeLOVConfiguration",
                        "orderNo": 50
                    },
                    "NomineeDetails.nominees.nomineeDoorNo": {
                        "orderNo": 60
                    },
                    "NomineeDetails.nominees.nomineeStreet": {
                        "orderNo": 70
                    },
                    "NomineeDetails.nominees.nomineeLocality": {
                        "orderNo": 80
                    },
                    "NomineeDetails.nominees.nomineeDistrict": {
                        "orderNo": 90
                    },
                    "NomineeDetails.nominees.nomineeState": {
                        "orderNo": 100
                    }

                }
            }

            var getIncludess = function (model) {

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
                    "PreliminaryInformation.actualAmountRequired",
                    "PreliminaryInformation.fundsFromDifferentSources",


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
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionSelected",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionSelected.selected",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionMitigantName",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionMitigantName.mitigantName",

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
                    "LoanRecommendation.udf8",
                    "LoanRecommendation.udf3",

                    "LoanSanction",
                    "LoanSanction.sanctionDate",
                    "LoanSanction.numberOfDisbursements",
                    "LoanSanction.disbursementSchedules",
                    "LoanSanction.disbursementSchedules.disbursementAmount",

                    "AdditionalLoanInformation",
                    "AdditionalLoanInformation.estimatedDateOfCompletion",
                    "AdditionalLoanInformation.productCategory",
                    "AdditionalLoanInformation.customerSignDateExpected",
                    "AdditionalLoanInformation.proposedHires",
                    "AdditionalLoanInformation.percentageIncreasedIncome",
                    "AdditionalLoanInformation.percentageInterestSaved",

                    "CollateralDetails",
                    "CollateralDetails.collateral",
                    "CollateralDetails.collateral.collateralDescription",
                    "CollateralDetails.collateral.collateralValue",
                    "CollateralDetails.collateral.expectedIncome",
                    "CollateralDetails.collateral.collateralType",
                    "CollateralDetails.collateral.manufacturer",
                    "CollateralDetails.collateral.modelNo",
                    "CollateralDetails.collateral.serialNo",
                    "CollateralDetails.collateral.expectedPurchaseDate",
                    "CollateralDetails.collateral.machineAttachedToBuilding",
                    "CollateralDetails.collateral.hypothecatedToBank",
                    "CollateralDetails.collateral.electricityAvailable",
                    "CollateralDetails.collateral.spaceAvailable",
                    "CollateralDetails.collateral.collateral1FilePath",

                    "NomineeDetails",
                    "NomineeDetails.nominees",
                    "NomineeDetails.nominees.nomineeFirstName",
                    "NomineeDetails.nominees.nomineeGender",
                    "NomineeDetails.nominees.nomineeDOB",
                    "NomineeDetails.nominees.nomineeButton",
                    "NomineeDetails.nominees.nomineeDoorNo",
                    "NomineeDetails.nominees.nomineeLocality",
                    "NomineeDetails.nominees.nomineeStreet",
                    "NomineeDetails.nominees.nomineePincode",
                    "NomineeDetails.nominees.nomineeDistrict",
                    "NomineeDetails.nominees.nomineeState",
                    "NomineeDetails.nominees.nomineeRelationship",

                    "PostReview",
                    "PostReview.action",
                    "PostReview.proceed",
                    "PostReview.proceed.remarks",
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
                    "PostReview.hold.holdButton",

                    "ProposedUtilizationPlan",
                    "ProposedUtilizationPlan.loanUtilisationDetail",
                    "ProposedUtilizationPlan.loanUtilisationDetail.utilisationType",
                    "ProposedUtilizationPlan.loanUtilisationDetail.fundAllocationPercentage",
                    "ProposedUtilizationPlan.loanUtilisationDetail.consumptionDetails"
                ];

            }
            var getIncludes = function (model) {
                return [
                    "LoanDetails",
                    "LoanDetails.loanType",
                    "LoanDetails.partner",
                    "LoanDetails.frequency",
                    "LoanDetails.loanProducts",
                    "LoanDetails.loanApplicationDate",
                    "LoanDetails.loanAmountRequested",
                    "LoanDetails.requestedTenure",
                    "LoanDetails.loanPurpose1",
                    "LoanDetails.loanPurpose2",
                    "LoanDetails.loanPurpose3",
                    "LoanDetails.centreName",
                    "LoanDetails.borrowers.borrowers",
                    "LoanDetails.borrowers.borrowersFullName",
                    "LoanDetails.borrowers.borrowersRelationship",
                    "LoanDetails.witnessDetails",
                    "LoanDetails.witnessDetails.witnessFirstName",
                    "LoanDetails.witnessDetails.witnessRelationship",

                    "NomineeDetails",
                    "NomineeDetails.nominees",
                    "NomineeDetails.nominees.nomineeFirstName",
                    "NomineeDetails.nominees.nomineeGender",
                    "NomineeDetails.nominees.nomineeDOB",
                    "NomineeDetails.nominees.nomineeButton",
                    "NomineeDetails.nominees.nomineeAddressSameasBorrower",
                    "NomineeDetails.nominees.nomineeDoorNo",
                    "NomineeDetails.nominees.nomineeLocality",
                    "NomineeDetails.nominees.nomineeStreet",
                    "NomineeDetails.nominees.nomineePincode",
                    "NomineeDetails.nominees.nomineeDistrict",
                    "NomineeDetails.nominees.nomineeState",
                    "NomineeDetails.nominees.nomineeRelationship",
                    "NomineeDetails.nominees.nomineeMinor",
                    "NomineeDetails.nominees.nomineeGuardian",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianFirstName",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDOB",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDoorNo",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianLocality",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianStreet",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianPincode",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDistrict",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianState",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship",









                ]
            }
            var configFile = function (model) {
                return []
            }
            var overridesFields = function (model) {
                return {
                    "LoanDetails": {
                        "orderNo": 1
                    },
                    "LoanDetails.loanType": {
                        "orderNo": 1,
                        "enumCode": "loan_type"
                    },
                    "LoanDetails.partner": {
                        "orderNo": 2,
                        "enumCode": "partner"
                    },
                    "LoanDetails.frequency": {
                        "orderNo": 3,
                        "enumCode": "loan_product_frequency"
                    },
                    "LoanDetails.loanProducts": {
                        "orderNo": 4,
                        "enumCode": "loan_product",
                        onChange: function (valueObj, model, context) {
                            console.log("Its time for place Holder");
                            console.log(valueObj);
                            console.log(model);
                            console.log(context);
                        }

                    },
                    "LoanDetails.loanPurpose1": {
                        "orderNo": 6,
                        "enumCode": "loan_purpose_1"
                    },
                    "LoanDetails.loanPurpose2": {
                        "orderNo": 7,
                        "enumCode": "loan_purpose_2",
                        "parentEnumCode": "loan_purpose_1"
                    },
                    "LoanDetails.loanPurpose3": {
                        "orderNo": 8,
                        "enumCode": "loan_purpose_3",
                        "parentEnumCode": "loan_purpose_2"
                    },
                    "LoanDetails.loanAmountRequested": {
                        "orderNo": 5,
                    },
                    "LoanDetials.witnessDetails": {
                        "type": "array",
                        "view": "fixed"
                    },
                    "LoanDetails.witnessDetails.witnessFirstName": {
                        "type": "lov",
                        // "key": "model.LoanAccounts.witnessDetails[].witnessFirstName",
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var out = [];
                            if (!model.customer.familyMembers) {
                                return out;
                            }

                            for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                out.push({
                                    name: model.customer.familyMembers[i].familyMemberFirstName,
                                    // value: model.customer.familyDetails[i].value,
                                    relationship: model.customer.familyMembers[i].relationShip
                                })
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function (valueObj, model, context) {
                            //add to the witnees array.
                            if (_.isUndefined(model.loanAccount.witnessDetails[0])) {
                                 model.loanAccount.witnessDetails[0] = [];
                             }
                            model.loanAccount.witnessDetails[0].witnessFirstName = valueObj.name;
                            model.loanAccount.witnessDetails[0].witnessRelationship = valueObj.relationship;
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    "NomineeDetails": {
                        "orderNo": 2
                    },
                    "NomineeDetails.nominees.nomineeGuardian": {

                    }
                }
            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);
                    console.log("test");
                    console.log(model);
                    var familyDetails = [];
                    model.customer = {};
                    model.loanAccount = model.loanProcess.loanAccount;
                    // $q.when(Enrollment.get({
                    //     'id': model.loanAccount.customerId
                    // })).then(function (resp) {
                    //     model.customer.familyDetails = resp;
                    // });

                    // model.loanAccount.witnessFirstName="Harish";
                    // model.loanAccount.witnessRelationship="Tester";


                    // model.customer.familyDetails=[
                    //     {
                    //         name:"Mahesh",
                    //         value:"Mahesh",
                    //         relationshipWithApplicant:"Brother"
                    //     },
                    //     {
                    //         name:"Satya",
                    //         value:"Satya",
                    //         relationshipWithApplicant:"Friend"
                    //     }
                    // ];

                    // if (_.hasIn(model, 'loanAccount.loanCustomerRelations') &&
                    //     model.loanAccount.loanCustomerRelations != null &&
                    //     model.loanAccount.loanCustomerRelations.length > 0) {
                    //     var lcr = model.loanAccount.loanCustomerRelations;
                    //     var idArr = [];
                    //     for (var i = 0; i < lcr.length; i++) {
                    //         idArr.push(lcr[i].customerId);
                    //     }
                    //     Queries.getCustomerBasicDetails({
                    //             'ids': idArr
                    //         })
                    //         .then(function (result) {
                    //             if (result && result.ids) {
                    //                 for (var i = 0; i < lcr.length; i++) {
                    //                     var cust = result.ids[lcr[i].customerId];
                    //                     if (cust) {
                    //                         lcr[i].name = cust.first_name;
                    //                     }
                    //                 }
                    //             }
                    //         });
                    // }

                    BundleManager.broadcastEvent('loan-account-loaded', {
                        loanAccount: model.loanAccount
                    });

                    /* Deviations and Mitigations grouping */
                    if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)) {
                        var loanMitigantsGrouped = {};
                        for (var i = 0; i < model.loanAccount.loanMitigants.length; i++) {
                            var item = model.loanAccount.loanMitigants[i];
                            if (!_.hasIn(loanMitigantsGrouped, item.parameter)) {
                                loanMitigantsGrouped[item.parameter] = [];
                            }
                            loanMitigantsGrouped[item.parameter].push(item);
                        }
                        model.loanMitigantsByParameter = [];
                        _.forOwn(loanMitigantsGrouped, function (mitigants, key) {
                            var chosenMitigants = "<ul>";

                            for (var i = 0; i < mitigants.length; i++) {
                                chosenMitigants = chosenMitigants + "<li>" + mitigants[i].mitigant + "</li>";
                            }
                            chosenMitigants = chosenMitigants + "</ul>";
                            model.loanMitigantsByParameter.push({
                                'Parameter': key,
                                'Mitigants': chosenMitigants
                            })
                        })
                    }
                    /* End of Deviations and Mitigations grouping */

                    self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function (repo) {
                            console.log("Text");
                            // console.log(repo);                       
                            var formRequest = {
                                "overrides": overridesFields(model),
                                "includes": getIncludes(model),
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions": {
                                        "LoanDetails": {
                                            "items": {
                                                "borrowers": {
                                                    "items": {
                                                        "borrowers":{
                                                            "title": "BORROWERS",
                                                            "type": "radios",
                                                            "orderNo": 8,
                                                            "key": "yet to decided",
                                                            "titleMap": [{
                                                                    value: "Father",
                                                                    name: "Father"
                                                                },
                                                                {
                                                                    value: "Husband",
                                                                    name: "Husband"
                                                                }
                                                            ]
                                                        },
                                                        "borrowersFirstName":{
                                                            "title":"FULL_NAME",
                                                            "type": "text",
                                                            "readonly":true,
                                                            "key":"yet to decide",
                                                        },
                                                        "borrowersRealtionship":{
                                                            "title":"RELATIONSHIP",
                                                            "type":"text",
                                                            "readonly":true,
                                                            "key":"yet to decide",
                                                        }

                                                    }

                                                },
                                                "NomineeDetails":{
                                                    "items":{
                                                        "nominees":{
                                                            "items":{
                                                                "nomineeAddressSameasBorrower":{
                                                                    "type":"checkbox",
                                                                    "title": "ADDRESS_SAME_AS_BORROWER",
                                                                    "schema":{
                                                                        "type": ["boolean", "null"]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }

                                            }

                                        }
                                    },
                                    "additions": [{
                                        "type": "actionbox",
                                        "orderNo": 1000,
                                        "items": [{
                                            "type": "submit",
                                            "title": "SAVE"
                                        }, ]
                                    }]
                                }
                            };
                            var result = IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                            console.log(result);
                            console.log("test");
                            return result;
                        })
                        .then(function (form) {
                            self.form = form;
                        });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "new-applicant": function (bundleModel, model, obj) {
                        model.customer = obj.customer;
                        model.loanAccount.customerId = model.customer.id;
                        // $q.when(Enrollment.get({
                        //     'id': model.loanAccount.customerId
                        // })).then(function (resp) {
                        //     model.customer = resp;
                        // })
                    },
                    "lead-loaded": function (bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate;
                    },
                    "new-business": function (bundleModel, model, params) {
                        $log.info("Inside new-business of LoanRequest");
                        model.loanAccount.customerId = params.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.branchId = params.customer.customerBranchId;
                        model.loanAccount.loanCentre.centreId = params.customer.centreId;
                        model.enterprise = params.customer;
                    },
                    "load-deviation": function (bundleModel, model, params) {
                        $log.info("Inside Deviation List");
                        model.deviations = {};
                        model.deviations.deviationParameter = [];
                        model.deviations.deviationParameter = params.deviations.deviationParameter;
                        model.deviations.scoreName = params.deviations.scoreName;

                        if (_.isArray(model.deviations.deviationParameter)) {
                            _.forEach(model.deviations.deviationParameter, function (deviation) {
                                if (_.hasIn(deviation, 'ChosenMitigants') && _.isArray(deviation.ChosenMitigants)) {
                                    _.forEach(deviation.ChosenMitigants, function (mitigantChosen) {
                                        for (var i = 0; i < deviation.mitigants.length; i++) {
                                            if (deviation.mitigants[i].mitigantName == mitigantChosen) {
                                                deviation.mitigants[i].selected = true;
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                },
                form: [],
                schema: function () {
                    console.log("First thing to excecute I guess");
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    submit: function (model, formCtrl, form) {
                        /* Loan SAVE */
                        if (!model.loanAccount.id) {
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
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                    loanAccount: model.loanAccount
                                });
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function (model, formCtrl, form, $event) {
                        $log.info("Inside save()");
                        if (!model.loanAccount.id) {
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        model.loanAccount.status = "HOLD";
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.hold()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan hold.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function (model, formCtrl, form, $event) {
                        PageHelper.showLoader();
                        model.loanProcess.sendBack()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function (model, formCtrl, form, $event) {
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });
                    },
                    reject: function (model, formCtrl, form, $event) {
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        model.loanProcess.reject()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });
                    },
                    nomineeAddress: function (model, formCtrl, form, $event) {
                        PageHelper.showLoader();
                        if (model.loanProcess.applicantEnrolmentProcess) {
                            model.loanAccount.nominees[0].nomineeDoorNo = model.loanProcess.applicantEnrolmentProcess.customer.doorNo;
                            model.loanAccount.nominees[0].nomineeLocality = model.loanProcess.applicantEnrolmentProcess.customer.locality;
                            model.loanAccount.nominees[0].nomineeStreet = model.loanProcess.applicantEnrolmentProcess.customer.street;
                            model.loanAccount.nominees[0].nomineePincode = model.loanProcess.applicantEnrolmentProcess.customer.pincode;
                            model.loanAccount.nominees[0].nomineeDistrict = model.loanProcess.applicantEnrolmentProcess.customer.district;
                            model.loanAccount.nominees[0].nomineeState = model.loanProcess.applicantEnrolmentProcess.customer.state;
                        } else {
                            PageHelper.hideLoader();
                        }
                        PageHelper.hideLoader();
                    }
                }
            };

        }
    }
});
