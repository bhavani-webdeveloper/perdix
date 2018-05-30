define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "witfin.customer.EnterpriseEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository) {

            // var getLocation = function() {
            //     var deferred = $q.defer();
            //     navigator.geolocation.getCurrentPosition((p) => {
            //         console.log(p);
            //         deferred.resolve(p);
            //     }, (err) => {
            //         console.log("Error");
            //         deferred.reject(err)
            //     })
            //     return deferred.promise;
            // }

            var getLocation = function() {
                return new Promise(function(resolve, reject) {
                    navigator.geolocation.getCurrentPosition(function(p) {
                        console.log(p);
                        resolve(p);
                    }, function(err) {
                        console.log("Error");
                        reject(err);
                    })
                });
            };

            var getIncludes = function (model) {
                return [
                    "EnterpriseInformation",
                    "EnterpriseInformation.firstName",
                    "EnterpriseInformation.customerId",
                    "EnterpriseInformation.customerBranchId",
                    "EnterpriseInformation.entityId",
                    "EnterpriseInformation.urnNo",
                    "EnterpriseInformation.centreId",
                    "EnterpriseInformation.firstName",
                    "EnterpriseInformation.referredBy",
                    "EnterpriseInformation.referredName",
                    "EnterpriseInformation.companyOperatingSince",
                    "EnterpriseInformation.companyEmailId",
                    "EnterpriseInformation.latitude",
                    "EnterpriseInformation.photoImageId",
                    "EnterpriseInformation.ownership",
                    "EnterpriseInformation.businessConstitution",
                    "EnterpriseInformation.businessHistory",
                    "EnterpriseInformation.noOfPartners",
                    "EnterpriseInformation.anyPartnerOfPresentBusiness",
                    "EnterpriseInformation.partnershipDissolvedDate",
                    "EnterpriseInformation.companyRegistered",
                    "EnterpriseInformation.isGSTAvailable",
                    "EnterpriseInformation.netBusinessIncome",
                    "EnterpriseInformation.enterpriseRegistrations",
                    "EnterpriseInformation.enterpriseRegistrations.registrationType",
                    "EnterpriseInformation.enterpriseRegistrations.registrationNumber",
                    "EnterpriseInformation.enterpriseRegistrations.registeredDate",
                    "EnterpriseInformation.enterpriseRegistrations.expiryDate",
                    "EnterpriseInformation.enterpriseRegistrations.documentId",
                    "EnterpriseInformation.businessType",
                    "EnterpriseInformation.businessActivity",
                    "EnterpriseInformation.businessSector",
                    "EnterpriseInformation.businessSubsector",
                    "EnterpriseInformation.itrAvailable",
                    "EnterpriseInformation.HouseVerificationPhoto",
                    "EnterpriseInformation.enterpriseCustomerRelations",
                    "EnterpriseInformation.enterpriseCustomerRelations.relationshipType",
                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId",
                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName",
                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness",
                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement",
                    "EnterpriseInformation.enterpriseCustomerRelations.partnerOfAnyOtherCompany",
                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed",
                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate",
                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.landLineNo",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.pincode",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.distanceFromBranch",
                    "ContactInformation.businessInPresentAreaSince",
                    "ContactInformation.businessInCurrentAddressSince",
                    "EnterpriseReferences",
                    "EnterpriseReferences.verifications",
                    "EnterpriseReferences.verifications.referenceFirstName",
                    "EnterpriseReferences.verifications.knownSince",
                    "EnterpriseReferences.verifications.customerResponse",
                    "EnterpriseReferences.verifications.opinion",
                    "Liabilities",
                    "Liabilities.liabilities",
                    // "Liabilities.liabilities.loanType",
                    // "Liabilities.liabilities.loanSourceCategory",
                    // "Liabilities.liabilities.loanSource",
                    // "Liabilities.liabilities.loanSource1",
                    "Liabilities.liabilities.loanAmountInPaisa",
                    "Liabilities.liabilities.installmentAmountInPaisa",
                    // "Liabilities.liabilities.outstandingAmountInPaisa",
                    "Liabilities.liabilities.startDate",
                    // "Liabilities.liabilities.maturityDate",
                    "Liabilities.liabilities.noOfInstalmentPaid",
                    "Liabilities.liabilities.frequencyOfInstallment",
                    "Liabilities.liabilities.udf1",
                    // "Liabilities.liabilities.liabilityLoanPurpose",
                    // "Liabilities.liabilities.interestOnly",
                    // "Liabilities.liabilities.interestRate",
                    // "Liabilities.liabilities.proofDocuments",
                    "Liabilities.liabilities.customerLiabilityRepayments",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiNo",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiAmount",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiDueDate",
                    "Liabilities.liabilities.customerLiabilityRepayments.actualRepaymentDate",
                    "EnterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets.assetType",
                    "EnterpriseAssets.enterpriseAssets.endUse",
                    "EnterpriseAssets.enterpriseAssets.natureOfUse",
                    "EnterpriseAssets.enterpriseAssets.manufacturer",
                    "EnterpriseAssets.enterpriseAssets.make",
                    "EnterpriseAssets.enterpriseAssets.assetCategory",
                    "EnterpriseAssets.enterpriseAssets.vehicleMakeModel",
                    "EnterpriseAssets.enterpriseAssets.manufactureDate",
                    "EnterpriseAssets.enterpriseAssets.details",
                    "EnterpriseAssets.enterpriseAssets.subDetails",
                    "EnterpriseAssets.enterpriseAssets.assetregistrationNumber",
                    "EnterpriseAssets.enterpriseAssets.valueOfAsset",
                    "BankAccounts",
                    "BankAccounts.customerBankAccounts",
                    "BankAccounts.customerBankAccounts.ifscCode",
                    "BankAccounts.customerBankAccounts.customerBankName",
                    "BankAccounts.customerBankAccounts.customerBankBranchName",
                    "BankAccounts.customerBankAccounts.customerNameAsInBank",
                    "BankAccounts.customerBankAccounts.accountNumber",
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber",
                    "BankAccounts.customerBankAccounts.accountType",
                    "BankAccounts.customerBankAccounts.bankingSince",
                    "BankAccounts.customerBankAccounts.netBankingAvailable",
                    "BankAccounts.customerBankAccounts.sanctionedAmount",
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",
                    "TrackDetails",
                    "TrackDetails.vehiclesOwned",
                    "TrackDetails.vehiclesFinanced",
                    "TrackDetails.vehiclesFree",
                    "TangibleNetWorth",
                    "TangibleNetWorth.enterpriseNetworth",
                    "TangibleNetWorth.enterpriseNetworth.tangibleNetworth",
                    "TangibleNetWorth.enterpriseNetworth.financialYear",
                    "enterpriseDocuments",
                    "enterpriseDocuments.enterpriseDocuments",
                    "enterpriseDocuments.enterpriseDocuments.docType",
                    "enterpriseDocuments.enterpriseDocuments.fileId"
                ];
            }

            var configFile = function() {
                return {
                        "loanProcess.loanAccount.currentStage": {
                            "ScreeningReview": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "GoNoGoApproval1": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "GoNoGoApproval2": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "DeviationApproval1": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "DeviationApproval2": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "BusinessApproval1": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "BusinessApproval2": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "BusinessApproval3": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "BusinessApproval4": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "BusinessApproval5": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "CreditApproval1": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "CreditApproval2": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "CreditApproval3": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "CreditApproval4": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            "CreditApproval5": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    },
                                    "tangibleNetworth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
                                ]
                            },
                            // "ApplicationReview": {
                            //     "overrides": {
                            //         "EnterpriseInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseInformation.enterpriseType" : {
                            //             "readonly": true
                            //         },
                            //         "Liabilities": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseAssets": {
                            //             "readonly": true
                            //         },
                            //         "BankAccounts": {
                            //             "readonly": true
                            //         },
                            //         "ContactInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseReferences": {
                            //             "readonly": true
                            //         },
                            //         "TrackDetails": {
                            //             "readonly": true
                            //         },
                            //         "tangibleNetworth": {
                            //           "readonly": true
                            //         }
                            //     }
                            // },
                            // "BranchCreditAppraisal": {
                            //     "overrides": {
                            //         "EnterpriseInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseInformation.enterpriseType" : {
                            //             "readonly": true
                            //         },
                            //         "Liabilities": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseAssets": {
                            //             "readonly": true
                            //         },
                            //         "BankAccounts": {
                            //             "readonly": true
                            //         },
                            //         "ContactInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseReferences": {
                            //             "readonly": true
                            //         },
                            //         "TrackDetails": {
                            //             "readonly": true
                            //         },
                            //         "tangibleNetworth": {
                            //           "readonly": true
                            //         }
                            //     }
                            // },
                            // "HOCreditAppraisal": {
                            //     "overrides": {
                            //         "EnterpriseInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseInformation.enterpriseType" : {
                            //             "readonly": true
                            //         },
                            //         "Liabilities": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseAssets": {
                            //             "readonly": true
                            //         },
                            //         "BankAccounts": {
                            //             "readonly": true
                            //         },
                            //         "ContactInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseReferences": {
                            //             "readonly": true
                            //         },
                            //         "TrackDetails": {
                            //             "readonly": true
                            //         },
                            //         "tangibleNetworth": {
                            //           "readonly": true
                            //         }
                            //     }
                            // },
                            // "ManagementCommittee": {
                            //     "overrides": {
                            //         "EnterpriseInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseInformation.enterpriseType" : {
                            //             "readonly": true
                            //         },
                            //         "Liabilities": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseAssets": {
                            //             "readonly": true
                            //         },
                            //         "BankAccounts": {
                            //             "readonly": true
                            //         },
                            //         "ContactInformation": {
                            //             "readonly": true
                            //         },
                            //         "EnterpriseReferences": {
                            //             "readonly": true
                            //         },
                            //         "TrackDetails": {
                            //             "readonly": true
                            //         },
                            //         "tangibleNetworth": {
                            //           "readonly": true
                            //         }
                            //     }
                            // },
                            "REJECTED": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    }
                                }
                            }

                        },
                        "loanProcess.loanAccount.isReadOnly": {
                            "Yes": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "readonly": true
                                    },
                                    "TrackDetails": {
                                        "readonly": true
                                    }
                                }

                            }
                        }
                    }
            }

            return {
                "type": "schema-form",
                "title": "ENTITY_ENROLLMENT",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType = "Customer";
                    model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */


                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    /* End of setting data for the form */
                    var calculateVehiclesFree = function(modelValue, form, model) {
                        model.customer.vehiclesFree = model.customer.vehiclesOwned - model.customer.vehiclesFinanced;
                    }
                    var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    var self = this;
                    p1.then(function(repo){
                        var formRequest = {
                            "overrides": {
                                "BankAccounts.customerBankAccounts.accountNumber": {
                                    "type": "password",
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                                    "type": "string",
                                    "required": true
                                },
                                "TrackDetails.vehiclesFree": {
                                    "readonly": true
                                },
                                "TrackDetails.vehiclesOwned": {
                                    "onChange": calculateVehiclesFree
                                },
                                "TrackDetails.vehiclesFinanced": {
                                    "onChange": calculateVehiclesFree
                                },
                                "ContactInformation.locality": {
                                    "readonly": true
                                },
                                "ContactInformation.villageName": {
                                    "readonly": true
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.pincode": {
                                     fieldType: "number",
                                     resolver: "PincodeLOVConfiguration"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                    "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                    "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.relationshipType": {
                                    "required": true
                                },
                                "EnterpriseAssets.enterpriseAssets.assetType": {
                                    "required": true
                                },
                                "EnterpriseAssets.enterpriseAssets.valueOfAsset": {
                                    "required": true
                                },
                                "EnterpriseAssets.enterpriseAssets.endUse": {
                                    "type": "select",
                                    "enumCode": "vehicle_end_use"
                                },
                                "EnterpriseInformation": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "ContactInformation": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "EnterpriseInformation.enterpriseType": {
                                    "title": "ENTERPRISE_TYPE",
                                    "resolver": "SoleProprietorshipBusinessConfiguration"
                                },
                                "EnterpriseInformation.centreId" : {
                                    "readonly": true
                                },
                                "EnterpriseInformation.customerBranchId" :{
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "condition" : "model.customer.enterprise.enterpriseType == 'Enterprise'"
                                },
                                "BankAccounts.customerBankAccounts": {
                                    startEmpty: true
                                },
                                "EnterpriseAssets.enterpriseAssets": {
                                    startEmpty: true
                                },
                                "EnterpriseAssets.enterpriseAssets.subDetails": {
                                    "enumCode": "business_asset_sub_description",
                                    "parentEnumCode": "business_asset_description",
                                    "parentValueExpr": "model.customer.enterpriseAssets[arrayIndex].details"
                                },
                                "Liabilities.liabilities": {
                                    startEmpty: true
                                },
                                "Liabilities.liabilities.frequencyOfInstallment": {
                                    "title": "REPAYMENT_FREQUENCY",
                                    "required": true
                                },
                                "Liabilities.liabilities.noOfInstalmentPaid": {
                                    "title": "TENURE",
                                    "required": true
                                },
                                "Liabilities.liabilities.startDate": {
                                    "title": "LOAN_START_DATE",
                                    "required": true
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName" :{
                                    "readonly": true
                                },
                                "EnterpriseReferences": {
                                    "title": "NEIGHBOUR_CHECK"
                                },
                                "EnterpriseReferences.verifications.referenceFirstName": {
                                    "title":"NAME_OF_NEIGHBOUR",
                                    "required": true
                                },
                                "EnterpriseReferences.verifications.knownSince": {
                                    "title":"KNOWN_SINCE_(_IN_YEARS_)",
                                    "type" : "number",
                                    "required": true
                                },
                                "EnterpriseReferences.verifications.customerResponse": {
                                    "title":"NEIGHBOUR_REFERENCE"
                                },
                                "EnterpriseReferences.verifications.opinion": {
                                    "title":"COMMENTS_OF_NEIGHBOUR"
                                }
                            },
                            "includes": getIncludes(model),
                            "excludes": [
                                "EnterpriseInformation.referredBy",
                                "EnterpriseInformation.referredName",
                                "EnterpriseInformation.businessHistory",
                                "EnterpriseInformation.noOfPartners",
                                "EnterpriseInformation.anyPartnerOfPresentBusiness",
                                "EnterpriseInformation.partnershipDissolvedDate",
                                "EnterpriseInformation.businessType",
                                "EnterpriseInformation.businessActivity",
                                "EnterpriseInformation.businessSector",
                                "EnterpriseInformation.businessSubsector"
                            ],
                            "options": {
                                "repositoryAdditions": {
                                    "Liabilities": {
                                        "items": {
                                            "liabilities": {
                                                "items": {
                                                    "udf1": {
                                                        "title": "VEHICLE_MODEL",
                                                        "type": "string",
                                                        "key": "customer.liabilities[].udf1"
                                                    },
                                                    "customerLiabilityRepayments" : {
                                                        "key": "customer.liabilities[].customerLiabilityRepayments",
                                                        "type": "array",
                                                        "startEmpty": true,
                                                        "title": "REPAYMENT_DETAILS",
                                                        "items": {
                                                            "emiNo": {
                                                                "key": "customer.liabilities[].customerLiabilityRepayments[].emiNo",
                                                                "title": "EMI_NO",
                                                                "type": "number",
                                                                "required": true
                                                            },
                                                            "emiAmount": {
                                                              "key": "customer.liabilities[].customerLiabilityRepayments[].emiAmount",
                                                              "title": "EMI_AMOUNT",
                                                              "type": "number",
                                                              "required": true
                                                            },
                                                            "emiDueDate": {
                                                              "key": "customer.liabilities[].customerLiabilityRepayments[].emiDueDate",
                                                              "title": "EMI_DUE_DATE",
                                                              "type": "date",
                                                              "required": true
                                                            },
                                                            "actualRepaymentDate": {
                                                                "key": "customer.liabilities[].customerLiabilityRepayments[].actualRepaymentDate",
                                                                "title": "ACTUAL_REPAYMENT_DATE",
                                                                "type": "date",
                                                                "required": true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "EnterpriseInformation": {
                                        "items": {
                                            "HouseVerificationPhoto": {
                                                "key": "customer.houseVerificationPhoto",
                                                "type": "file",
                                                "title": "HOUSE_VERIFICATION_PHOTO",
                                                "category": "CustomerEnrollment",
                                                "subCategory": "PHOTO",
                                                "onChange": function(){
                                                    console.log("INSIDE ONCHANGE1");
                                                },
                                                "viewParams" : function(modelValue, form, model) {
                                                    getLocation().then((pos)=>{
                                                        console.log("successful");
                                                        model.customer.latitude = pos.coords.latitude;
                                                        model.customer.longitude = pos.coords.longitude;
                                                    });
                                                    getLocation().catch((err)=>{
                                                        console.log(err);
                                                    });
                                                }
                                            },
                                            "netBusinessIncome": {
                                                "type": "number",
                                                "title": "CASH_PROFIT",
                                                "key": "customer.enterprise.netBusinessIncome"
                                                // "condition": "model.customer.customerCategory.toLowerCase() == 'captive - retail'"
                                            }
                                        }

                                    }
                                },
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "condition": "!model.customer.currentStage",
                                        "orderNo": 1200,
                                        "items": [
                                            {
                                                "type": "submit",
                                                "title": "SUBMIT"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "actionbox",
                                        "condition": "model.customer.currentStage && (model.loanProcess.loanAccount.currentStage=='Screening' || model.loanProcess.loanAccount.currentStage=='Application')",
                                        "orderNo": 1200,
                                        "items": [
                                            {
                                                "type": "button",
                                                "title": "UPDATE",
                                                "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                            }
                                        ]
                                    },
                                    {
                                        "orderNo": 1,
                                        "type": "box",
                                        "title": "BUSINESS_SELECTION",
                                        "items":[
                                            {
                                                "condition": "model.loanProcess.applicantEnrolmentProcess.customer.id == null || model.loanProcess.applicantEnrolmentProcess.customer.currentStage != 'Completed'",
                                                "type": "section",
                                                "htmlClass": "alert alert-warning",
                                                "html":"<h4><i class='icon fa fa-warning'></i>Applicant not yet enrolled.</h4> Kindly save Applicant details.",
                                                "orderNo": 10
                                            },
                                            "EnterpriseInformation.enterpriseType"
                                        ]
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
                        item.customer.centreId,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "applicant-updated": function(bundleModel, model, params){
                        $log.info("inside applicant-updated of EnterpriseEnrolment2");
                        /* Load an existing customer associated with applicant, if exists. Otherwise default details*/
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "co-applicant-updated": function(bundleModel, model, params){
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "guarantor-updated": function(bundleModel, model, params){
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    }
                },
                form: [

                ],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    save: function(model, formCtrl, formName){

                    },
                    submit: function(model, form, formName){
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();

                        model.enrolmentProcess.save()
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(){
                                model.loanProcess.refreshRelatedCustomers();
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                model.enrolmentProcess.proceed()
                                    .subscribe(function(enrolmentProcess) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    }, function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                    })
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    proceed: function(model, form){
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                            }, function (err) {
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
