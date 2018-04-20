define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "irep.customer.IndividualEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

            AngularResourceService.getInstance().setInjector($injector);
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            };

            var preSaveOrProceed = function (reqData) {
                if (_.hasIn(reqData, 'customer.familyMembers') && _.isArray(reqData.customer.familyMembers)) {
                    var selfExist = false
                    for (var i = 0; i < reqData.customer.familyMembers.length; i++) {
                        var f = reqData.customer.familyMembers[i];
                        if (_.isString(f.relationShip) && f.relationShip.toUpperCase() == 'SELF') {
                            selfExist = true;
                            break;
                        }
                    }
                    if (selfExist == false) {
                        PageHelper.showProgress("pre-save-validation", "Self Relationship is Mandatory", 5000);
                        return false;
                    }
                } else {
                    PageHelper.showProgress("pre-save-validation", "Family Members section is missing. Self Relationship is Mandatory", 5000);
                    return false;
                }
                return true;
            }

            var configFile = function () {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "KYC": {
                            "excludes": [
                                "IndividualFinancials",
                                "FamilyDetails.familyMembers.familyMemberFirstName",
                                "FamilyDetails.familyMembers.anualEducationFee",
                                "FamilyDetails.familyMembers.salary",
                                "FamilyDetails.familyMembers.incomes",
                                "FamilyDetails.familyMembers.incomes.incomeSource",
                                "FamilyDetails.familyMembers.incomes.incomeEarned",
                                "FamilyDetails.familyMembers.incomes.frequency",
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "HouseVerification.place",
                                "PhysicalAssets",
                                "IndividualReferences"
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1
                                },
                                "IndividualInformation": {
                                    "orderNo": 2
                                },
                                "ContactInformation": {
                                    "orderNo": 3
                                },
                                "FamilyDetails": {
                                    "orderNo": 4
                                },
                                "Liabilities": {
                                    "orderNo": 5
                                },
                                "HouseVerification": {
                                    "orderNo": 6
                                },
                                "BankAccounts": {
                                    "orderNo": 7
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
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
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true,
                                    "resolver": "IFSCCodeLOVConfiguration"
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                }
                            }
                        },
                        "KYCReview": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "IndividualFinancials": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                }
                            },
                             "excludes": [
                                "IndividualFinancials",
                                "FamilyDetails.familyMembers.familyMemberFirstName",
                                "FamilyDetails.familyMembers.anualEducationFee",
                                "FamilyDetails.familyMembers.salary",
                                "FamilyDetails.familyMembers.incomes",
                                "FamilyDetails.familyMembers.incomes.incomeSource",
                                "FamilyDetails.familyMembers.incomes.incomeEarned",
                                "FamilyDetails.familyMembers.incomes.frequency",
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "HouseVerification.place",
                                "PhysicalAssets",
                                "IndividualReferences"
                            ]
                        },
                        "Appraisal": {
                            "excludes": [
                                "IndividualReferences.verifications.ReferenceCheck",
                                "PhysicalAssets.physicalAssets.vehicleModel"
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1
                                },
                                "IndividualInformation": {
                                    "orderNo": 2
                                },
                                "ContactInformation": {
                                    "orderNo": 3
                                },
                                "IndividualFinancials": {
                                    "orderNo": 4
                                },
                                "FamilyDetails": {
                                    "orderNo": 5
                                },
                                "Liabilities": {
                                    "orderNo": 6
                                },
                                "HouseVerification": {
                                    "orderNo": 7
                                },
                                "BankAccounts": {
                                    "orderNo": 8
                                },
                                "IndividualReferences": {
                                    "orderNo": 9
                                },
                                "PhysicalAssets": {
                                    "orderNo": 10
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingStreet": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "view": "fixed"
                                },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "required": true
                                },
                                "IndividualFinancials.expenditures.expenditureSource": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers.familyMemberFirstName": {
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                },
                                "IndividualFinancials.expenditures.frequency": {
                                    "readonly": true
                                }
                            }
                        },
                        "AppraisalReview": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "readonly": true
                                },
                                "TrackDetails": {
                                    "readonly": true
                                },
                                "reference": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                }
                            }

                        },
                        "Televerification": {
                            "excludes": [
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1,
                                    "readonly":true
                                },
                                "IndividualInformation": {
                                    "orderNo": 2,
                                    "readonly":true
                                },
                                "ContactInformation": {
                                    "orderNo": 3,
                                    "readonly":true
                                },
                                "IndividualFinancials": {
                                    "orderNo": 4,
                                    "readonly":true
                                },
                                "FamilyDetails": {
                                    "orderNo": 5,
                                    "readonly":true
                                },
                                "Liabilities": {
                                    "orderNo": 6,
                                    "readonly":true
                                },
                                "HouseVerification": {
                                    "orderNo": 7,
                                    "readonly":true
                                },
                                "BankAccounts": {
                                    "orderNo": 8,
                                    "readonly":true
                                },
                                "IndividualReferences": {
                                    "orderNo": 9,
                                    "readonly":true
                                },
                                "PhysicalAssets": {
                                    "orderNo": 10,
                                    "readonly":true
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
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
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingStreet": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "required": true
                                },
                                "IndividualFinancials.expenditures.expenditureSource": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers.familyMemberFirstName": {
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                },
                                "IndividualReferences.verifications.knownSince": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.relationship": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.customerResponse": {
                                    "required": true
                                }
                            }
                        },
                        "Evaluation": {
                            "excludes": [
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1,
                                    "readonly":true
                                },
                                "IndividualInformation": {
                                    "orderNo": 2,
                                    "readonly":true
                                },
                                "ContactInformation": {
                                    "orderNo": 3,
                                    "readonly":true
                                },
                                "IndividualFinancials": {
                                    "orderNo": 4,
                                    "readonly":true
                                },
                                "FamilyDetails": {
                                    "orderNo": 5,
                                    "readonly":true
                                },
                                "Liabilities": {
                                    "orderNo": 6,
                                    "readonly":true
                                },
                                "HouseVerification": {
                                    "orderNo": 7,
                                    "readonly":true
                                },
                                "BankAccounts": {
                                    "orderNo": 8,
                                    "readonly":true
                                },
                                "IndividualReferences": {
                                    "orderNo": 9,
                                    "readonly":true
                                },
                                "PhysicalAssets": {
                                    "orderNo": 10,
                                    "readonly":true
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
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
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingStreet": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true,
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "required": true
                                },
                                "IndividualFinancials.expenditures.expenditureSource": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers.familyMemberFirstName": {
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                },
                                "IndividualReferences.verifications.knownSince": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.relationship": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.customerResponse": {
                                    "required": true
                                }
                            }
                        },
                        "GuarantorAddition": {
                            "excludes": [
                                "IndividualFinancials",
                                "FamilyDetails.familyMembers.familyMemberFirstName",
                                "FamilyDetails.familyMembers.anualEducationFee",
                                "FamilyDetails.familyMembers.salary",
                                "FamilyDetails.familyMembers.incomes",
                                "FamilyDetails.familyMembers.incomes.incomeSource",
                                "FamilyDetails.familyMembers.incomes.incomeEarned",
                                "FamilyDetails.familyMembers.incomes.frequency",
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "HouseVerification.place",
                                "PhysicalAssets",
                                "IndividualReferences"
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1
                                },
                                "IndividualInformation": {
                                    "orderNo": 2
                                },
                                "ContactInformation": {
                                    "orderNo": 3
                                },
                                "FamilyDetails": {
                                    "orderNo": 4
                                },
                                "Liabilities": {
                                    "orderNo": 5
                                },
                                "HouseVerification": {
                                    "orderNo": 6
                                },
                                "BankAccounts": {
                                    "orderNo": 7
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
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
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true,
                                    "resolver": "IFSCCodeLOVConfiguration"
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                }
                            }
                        },
                        "CreditCommitteeReview": {
                            "excludes": [
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1,
                                    "readonly":true
                                },
                                "IndividualInformation": {
                                    "orderNo": 2,
                                    "readonly":true
                                },
                                "ContactInformation": {
                                    "orderNo": 3,
                                    "readonly":true
                                },
                                "IndividualFinancials": {
                                    "orderNo": 4,
                                    "readonly":true
                                },
                                "FamilyDetails": {
                                    "orderNo": 5,
                                    "readonly":true
                                },
                                "Liabilities": {
                                    "orderNo": 6,
                                    "readonly":true
                                },
                                "HouseVerification": {
                                    "orderNo": 7,
                                    "readonly":true
                                },
                                "BankAccounts": {
                                    "orderNo": 8,
                                    "readonly":true
                                },
                                "IndividualReferences": {
                                    "orderNo": 9,
                                    "readonly":true
                                },
                                "PhysicalAssets": {
                                    "orderNo": 10,
                                    "readonly":true
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
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
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingStreet": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true,
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "required": true
                                },
                                "IndividualFinancials.expenditures.expenditureSource": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers.familyMemberFirstName": {
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                },
                                "IndividualReferences.verifications.knownSince": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.relationship": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.customerResponse": {
                                    "required": true
                                }
                            }
                        },
                        "Sanction": {
                            "excludes": [
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1,
                                    "readonly":true
                                },
                                "IndividualInformation": {
                                    "orderNo": 2,
                                    "readonly":true
                                },
                                "ContactInformation": {
                                    "orderNo": 3,
                                    "readonly":true
                                },
                                "IndividualFinancials": {
                                    "orderNo": 4,
                                    "readonly":true
                                },
                                "FamilyDetails": {
                                    "orderNo": 5,
                                    "readonly":true
                                },
                                "Liabilities": {
                                    "orderNo": 6,
                                    "readonly":true
                                },
                                "HouseVerification": {
                                    "orderNo": 7,
                                    "readonly":true
                                },
                                "BankAccounts": {
                                    "orderNo": 8,
                                    "readonly":true
                                },
                                "IndividualReferences": {
                                    "orderNo": 9,
                                    "readonly":true
                                },
                                "PhysicalAssets": {
                                    "orderNo": 10,
                                    "readonly":true
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
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
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingStreet": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true,
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "required": true
                                },
                                "IndividualFinancials.expenditures.expenditureSource": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers.familyMemberFirstName": {
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                },
                                "IndividualReferences.verifications.knownSince": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.relationship": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.customerResponse": {
                                    "required": true
                                }
                            }
                        },
                        "Rejected": {
                            "excludes": [
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1,
                                    "readonly":true
                                },
                                "IndividualInformation": {
                                    "orderNo": 2,
                                    "readonly":true
                                },
                                "ContactInformation": {
                                    "orderNo": 3,
                                    "readonly":true
                                },
                                "IndividualFinancials": {
                                    "orderNo": 4,
                                    "readonly":true
                                },
                                "FamilyDetails": {
                                    "orderNo": 5,
                                    "readonly":true
                                },
                                "Liabilities": {
                                    "orderNo": 6,
                                    "readonly":true
                                },
                                "HouseVerification": {
                                    "orderNo": 7,
                                    "readonly":true
                                },
                                "BankAccounts": {
                                    "orderNo": 8,
                                    "readonly":true
                                },
                                "IndividualReferences": {
                                    "orderNo": 9,
                                    "readonly":true
                                },
                                "PhysicalAssets": {
                                    "orderNo": 10,
                                    "readonly":true
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "KYC.identityProof": {
                                    "required": true
                                },
                                "KYC.identityProofImageId": {
                                    "required": true
                                },
                                "KYC.identityProofNo": {
                                    "required": true
                                },
                                "KYC.addressProofImageId": {
                                    "required": true
                                },
                                "KYC.addressProofNo": {
                                    "required": true
                                },
                                "KYC.addressProof": {
                                    "readonly": true
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "IndividualInformation.existingLoan": {
                                    "required": true
                                },
                                "IndividualInformation.dateOfBirth": {
                                    "required": true
                                },
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
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
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingStreet": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true,
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "required": true
                                },
                                "IndividualFinancials.expenditures.expenditureSource": {
                                    "required": true
                                },
                                "FamilyDetails.familyMembers.familyMemberFirstName": {
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                },
                                "IndividualReferences.verifications.knownSince": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.relationship": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.customerResponse": {
                                    "required": true
                                }
                            }
                        }
                    }
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {

                    "KYC.customerId": {
                        "orderNo": 10
                    },
                    "KYC.identityProofFieldSet": {
                        "orderNo": 20
                    },
                    "KYC.identityProof": {
                        "orderNo": 30
                    },
                    "KYC.identityProofImageId": {
                        "orderNo": 40
                    },
                    "KYC.identityProofNo": {
                        "orderNo": 50
                    },
                    "KYC.addressProofFieldSet": {
                        "orderNo": 60
                    },
                    "KYC.addressProof": {
                        "orderNo": 70
                    },
                    "KYC.addressProofImageId": {
                        "orderNo": 80
                    },
                    "KYC.addressProofNo": {
                        "orderNo": 90
                    },
                    "KYC.additionalKYCs": {
                        "orderNo": 100
                    },
                    "KYC.additionalKYCs.kyc1ProofType": {
                        "orderNo": 110
                    },
                    "KYC.additionalKYCs.kyc1ImagePath": {
                        "orderNo": 120
                    },
                    "KYC.additionalKYCs.kyc1ProofNumber": {
                        "orderNo": 130
                    },
                    "KYC.additionalKYCs.kyc1IssueDate": {
                        "orderNo": 140
                    },
                    "KYC.additionalKYCs.kyc1ValidUptoDate": {
                        "orderNo": 150
                    },
                    "ContactInformation.permanentAddressFieldSet": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.pincode": {
                        "resolver": "PincodeLOVConfiguration"
                    },
                    "HouseVerification.houseDetailsFieldSet": {
                        "orderNo": 10
                    },
                    "HouseVerification.ownership": {
                        "orderNo": 20
                    },
                    "HouseVerification.inCurrentAddressSince": {
                        "orderNo": 30
                    },
                    "HouseVerification.inCurrentAreaSince": {
                        // "required": true,
                        "orderNo": 40
                    },
                    "HouseVerification.latitude": {
                        "orderNo": 60
                    },
                    "HouseVerification.houseVerificationPhoto": {
                        "orderNo": 70
                    },
                    "HouseVerification.date": {
                        "orderNo": 80
                    },
                    "HouseVerification.place": {
                        "orderNo": 90
                    },
                    "BankAccounts.customerBankAccounts": {
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            modelValue.bankStatements = [];
                            var CBSDateMoment = moment(SessionStore.getCBSDate(), SessionStore.getSystemDateFormat());
                            var noOfMonthsToDisplay = 6;
                            var statementStartMoment = CBSDateMoment.subtract(noOfMonthsToDisplay, 'months').startOf('month');
                            for (var i = 0; i < noOfMonthsToDisplay; i++) {
                                modelValue.bankStatements.push({
                                    startMonth: statementStartMoment.format(SessionStore.getSystemDateFormat())
                                });
                                statementStartMoment = statementStartMoment.add(1, 'months').startOf('month');
                            }
                        }
                    },
                    "BankAccounts.customerBankAccounts.bankStatements": {
                        "titleExpr": "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                        "titleExprLocals": {moment: window.moment},
                    },
                    "BankAccounts.customerBankAccounts.ifscCode": {
                        "required": true,
                        "resolver": "IFSCCodeLOVConfiguration"
                    },
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset": {
                        "enumCode": "asset_type"
                    },
                    "FamilyDetails.familyMembers.relationShip": {
                        "condition":"(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() =='SELF'",
                        "onChange": function(modelValue, form, model, formCtrl, event) {
                            if (modelValue && modelValue.toLowerCase() === 'self') {
                                if (model.customer.id)
                                    model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                                if (model.customer.firstName)
                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                                if (model.customer.gender)
                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                if (model.customer.dateOfBirth)
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                if (model.customer.maritalStatus)
                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                if (model.customer.mobilePhone)
                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                            } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                                if (model.customer.spouseFirstName)
                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                if (model.customer.gender)
                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                                        (model.customer.gender == 'FEMALE' ? 'FEMALE': model.customer.gender);
                                model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                if (model.customer.spouseDateOfBirth)
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                if (model.customer.maritalStatus)
                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                            }
                        }
                    },
                    "FamilyDetails.familyMembers.relationShip1": {
                        "condition":"(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() !=='SELF'",
                        "onChange": function(modelValue, form, model, formCtrl, event) {
                            if (modelValue && modelValue.toLowerCase() === 'self') {
                                if (model.customer.id)
                                    model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                                if (model.customer.firstName)
                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                                if (model.customer.gender)
                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                if (model.customer.dateOfBirth)
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                if (model.customer.maritalStatus)
                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                if (model.customer.mobilePhone)
                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                            } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                                if (model.customer.spouseFirstName)
                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                if (model.customer.gender)
                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                                        (model.customer.gender == 'FEMALE' ? 'FEMALE': model.customer.gender);
                                model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                if (model.customer.spouseDateOfBirth)
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                if (model.customer.maritalStatus)
                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                            }
                        }
                    },
                    "IndividualInformation.caste": {
                        "enumCode": "caste"
                    },
                    "HouseVerification.rentLeaseStatus": {
                        "condition": "model.customer.ownership == 'Rental' || model.customer.ownership == 'Leased'"
                    },
                    "HouseVerification.rentLeaseAgreement": {
                        "condition": "model.customer.ownership == 'Rental' || model.customer.ownership == 'Leased'"
                    },
                    "ContactInformation.mailingMandal": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingDoorNo": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingStreet": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingPostoffice": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingPincode": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "resolver": "MailingPincodeLOVConfiguration"
                    },
                    "ContactInformation.mailingLocality": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    },
                    "ContactInformation.mailingDistrict": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    },
                    "ContactInformation.mailingState": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    }
                }
            }
            var getIncludes = function (model) {

                return [
                    "KYC",
                    "KYC.customerId",
                    "KYC.identityProofFieldSet",
                    "KYC.identityProof",
                    "KYC.identityProofImageId",
                    "KYC.identityProofNo",
                    "KYC.addressProofFieldSet",
                    "KYC.addressProof",
                    "KYC.addressProofImageId",
                    "KYC.addressProofNo",
                    "KYC.additionalKYCs",
                    "KYC.additionalKYCs.kyc1ProofType",
                    "KYC.additionalKYCs.kyc1ImagePath",
                    "KYC.additionalKYCs.kyc1ProofNumber",
                    "KYC.additionalKYCs.kyc1IssueDate",
                    "KYC.additionalKYCs.kyc1ValidUptoDate",

                    "IndividualInformation",
                    "IndividualInformation.customerBranchId",
                    "IndividualInformation.centreId",
                    "IndividualInformation.customerId",
                    "IndividualInformation.urnNo",
                    "IndividualInformation.photoImageId",
                    "IndividualInformation.existingLoan",
                    "IndividualInformation.title",
                    "IndividualInformation.firstName",
                    "IndividualInformation.enrolledAs",
                    "IndividualInformation.gender",
                    "IndividualInformation.dateOfBirth",
                    "IndividualInformation.religion",
                    "IndividualInformation.language",
                    "IndividualInformation.fatherFirstName",
                    "IndividualInformation.motherName",
                    "IndividualInformation.maritalStatus",
                    "IndividualInformation.spouseFirstName",
                    "IndividualInformation.spouseDateOfBirth",
                    "IndividualInformation.numberOfDependents",
                    "IndividualInformation.caste",

                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.landLineNo",
                    "ContactInformation.whatsAppMobileNoOption",
                    "ContactInformation.whatsAppMobileNo",
                    "ContactInformation.email",
                    "ContactInformation.residentialAddressFieldSet",
                    "ContactInformation.careOf",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.landmark",
                    "ContactInformation.mandal",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.mailSameAsResidence",
                    "ContactInformation.permanentAddressFieldSet",
                    "ContactInformation.mailingDoorNo",
                    "ContactInformation.mailingStreet",
                    "ContactInformation.mailingPostoffice",
                    "ContactInformation.mailingMandal",
                    "ContactInformation.mailingPincode",
                    "ContactInformation.mailingLocality",
                    "ContactInformation.mailingDistrict",
                    "ContactInformation.mailingState",

                    "IndividualFinancials",
                    "IndividualFinancials.expenditures",
                    "IndividualFinancials.expenditures.expenditureSource",
                    "IndividualFinancials.expenditures.annualExpenses",
                    "IndividualFinancials.expenditures.frequency",

                    "FamilyDetails",
                    "FamilyDetails.familyMembers",
                    "FamilyDetails.familyMembers.relationShip",
                    "FamilyDetails.familyMembers.relationShip1",
                    "FamilyDetails.familyMembers.educationStatus",
                    "FamilyDetails.familyMembers.familyMemberFirstName",
                    "FamilyDetails.familyMembers.anualEducationFee",
                    "FamilyDetails.familyMembers.salary",
                    "FamilyDetails.familyMembers.incomes",
                    "FamilyDetails.familyMembers.incomes.incomeSource",
                    "FamilyDetails.familyMembers.incomes.incomeEarned",
                    "FamilyDetails.familyMembers.incomes.frequency",

                    "Liabilities",
                    "Liabilities.liabilities",
                    "Liabilities.liabilities.loanSource",
                    "Liabilities.liabilities.loanAmountInPaisa",
                    "Liabilities.liabilities.installmentAmountInPaisa",
                    "Liabilities.liabilities.outstandingAmountInPaisa",
                    "Liabilities.liabilities.startDate",
                    "Liabilities.liabilities.maturityDate",
                    "Liabilities.liabilities.noOfInstalmentPaid",
                    "Liabilities.liabilities.frequencyOfInstallment",
                    "Liabilities.liabilities.liabilityLoanPurpose",
                    "Liabilities.liabilities.interestOnly",
                    "Liabilities.liabilities.interestRate",

                    "HouseVerification",
                    "HouseVerification.houseDetailsFieldSet",
                    "HouseVerification.ownership",
                    "HouseVerification.inCurrentAddressSince",
                    "HouseVerification.inCurrentAreaSince",
                    "HouseVerification.latitude",
                    "HouseVerification.houseVerificationPhoto",
                    "HouseVerification.date",
                    "HouseVerification.place",
                    "HouseVerification.rentLeaseStatus",
                    "HouseVerification.rentLeaseAgreement",

                    "BankAccounts",
                    "BankAccounts.customerBankAccounts",
                    "BankAccounts.customerBankAccounts.ifscCode",
                    "BankAccounts.customerBankAccounts.customerBankName",
                    "BankAccounts.customerBankAccounts.customerBankBranchName",
                    "BankAccounts.customerBankAccounts.customerNameAsInBank",
                    "BankAccounts.customerBankAccounts.accountNumber",
                    "BankAccounts.customerBankAccounts.accountType",
                    "BankAccounts.customerBankAccounts.bankingSince",
                    "BankAccounts.customerBankAccounts.netBankingAvailable",
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "BankAccounts.customerBankAccounts.bankStatements.openingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.closingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.EmiAmountdeducted",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",

                    "PhysicalAssets",
                    "PhysicalAssets.physicalAssets",
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.vehicleModel",
                    "PhysicalAssets.physicalAssets.registeredOwner",
                    "PhysicalAssets.physicalAssets.ownedAssetValue",
                    "PhysicalAssets.physicalAssets.unit",

                    "IndividualReferences",
                    "IndividualReferences.verifications",
                    "IndividualReferences.verifications.referenceFirstName",
                    "IndividualReferences.verifications.mobileNo",
                    "IndividualReferences.verifications.occupation",
                    "IndividualReferences.verifications.address",
                    "IndividualReferences.verifications.ReferenceCheck",
                    "IndividualReferences.verifications.ReferenceCheck.knownSince",
                    "IndividualReferences.verifications.ReferenceCheck.relationship",
                    "IndividualReferences.verifications.ReferenceCheck.opinion",
                    "IndividualReferences.verifications.ReferenceCheck.financialStatus",
                    "IndividualReferences.verifications.ReferenceCheck.customerResponse"
                ];

            }

            function getLoanCustomerRelation(pageClass){
                switch (pageClass){
                    case 'applicant':
                        return 'Applicant';
                        break;
                    case 'co-applicant':
                        return 'Co-Applicant';
                        break;
                    case 'guarantor':
                        return 'Guarantor';
                        break;
                    default:
                        return null;
                }
            }

            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT_2",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType =getLoanCustomerRelation(bundlePageObj.pageClass);
                    model.pageClass = bundlePageObj.pageClass;
                    model.currentStage = bundleModel.currentStage;
                    model.enrolmentProcess.currentStage =  model.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    /* End of setting data for the form */


                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            "KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "condition": "!model.customer.currentStage",
                                    "orderNo": 1000,
                                    "items": [
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT",
                                            "onClick": "actions.save(model, formCtrl, form, $event)"
                                        }
                                    ]
                                },
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage && model.customer.currentStage != 'KYCReview'",
                                    "orderNo": 1200,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE_ENROLMENT",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
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

                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    if (bundlePageObj) {
                        var enrolmentDetails = {
                            'customerId': model.customer.id,
                            'customerClass': bundlePageObj.pageClass,
                            'firstName': model.customer.firstName
                        }
                        // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "test-listener": function (bundleModel, model, obj) {

                    },
                    "lead-loaded": function (bundleModel, model, obj) {
                        model.customer.mobilePhone = obj.mobileNo;
                        model.customer.gender = obj.gender;
                        model.customer.firstName = obj.leadName;
                        model.customer.maritalStatus = obj.maritalStatus;
                        model.customer.customerBranchId = obj.branchId;
                        model.customer.centreId = obj.centreId;
                        model.customer.centreName = obj.centreName;
                        model.customer.street = obj.addressLine2;
                        model.customer.doorNo = obj.addressLine1;
                        model.customer.pincode = obj.pincode;
                        model.customer.district = obj.district;
                        model.customer.state = obj.state;
                        model.customer.locality = obj.area;
                        model.customer.villageName = obj.cityTownVillage;
                        model.customer.landLineNo = obj.alternateMobileNo;
                        model.customer.dateOfBirth = obj.dob;
                        model.customer.age = obj.age;
                        model.customer.gender = obj.gender;
                        model.customer.landLineNo = obj.alternateMobileNo;


                        for (var i = 0; i < model.customer.familyMembers.length; i++) {
                            $log.info(model.customer.familyMembers[i].relationShip);
                            model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                            /*if (model.customer.familyMembers[i].relationShip == "self") {
                             model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                             break;
                             }*/
                        }
                    },
                    "origination-stage": function (bundleModel, model, obj) {
                        model.currentStage = obj
                    }
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
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        // $q.all start
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent()
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, form, formName){
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                console.log("Inside hideLoader call");
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
                            });
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                model.enrolmentProcess.proceed()
                                .subscribe(function(enrolmentProcess) {
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                }, function(err) {
                                    PageHelper.showErrors(err);
                                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                })
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
})
