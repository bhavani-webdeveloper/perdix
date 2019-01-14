// pageUID: "base.dashboard.loans.individual.customer.IndividualEnrolment2",
define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "base.dashboard.loans.individual.customer.IndividualEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

            AngularResourceService.getInstance().setInjector($injector);
            var branch = SessionStore.getBranch();
           /* var pageParams = {
                readonly: true
            };*/

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
                        "Screening":{
                            "excludes": [
                                "IndividualFinancials",                               
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "PhysicalAssets",
                                "IndividualReferences",
                                "References"
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1
                                },
                                "HouseVerification.place":{
                                    "condition": "model.customer.ownership == 'Rented but own house in different place'",
                                    "required": true
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
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "ContactInformation.state": {
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
                                    "view": "fixed"
                                }
                            }
                        },
                        "KYC": {
                            "excludes": [
                                "IndividualFinancials",                               
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "PhysicalAssets",
                                "IndividualReferences",
                                "References"
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1
                                },
                                "HouseVerification.place":{
                                    "condition": "model.customer.ownership == 'Rented but own house in different place'",
                                    "required": true
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
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "ContactInformation.state": {
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
                                    "view": "fixed"
                                }
                            }
                        },
                        "KYCReview": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
                                    "readonly": true,
                                    "condition":"model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() == 'self'"
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "ContactInformation.state": {
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
                                "ContactInformation.whatsAppMobileNoOption",
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "HouseVerification.place",
                                "PhysicalAssets",
                                "IndividualReferences",
                                "References"
                            ]
                        },
                        "Appraisal": {
                            "excludes": [
                                "IndividualReferences.verifications.ReferenceCheck",
                                "PhysicalAssets.physicalAssets.vehicleModel",
                                "IndividualReferences",
                                "FamilyDetails.familyMembers.noOfDependents",
                                "PhysicalAssets",
                                "IndividualFinancials",
                                "References"
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
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
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
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
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
                                }
                            }
                        },
                        "AppraisalReview": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "IndividualFinancials",
                                "References"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
                                    "readonly": true,
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() == 'self'"
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
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "ContactInformation.state": {
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
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "IndividualFinancials",
                                "References"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "IndividualFinancials":{
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
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
                                },
                                "BankAccounts.customerBankAccounts":{
                                    "readonly": true
                                }
                            }
                        },
                        "Evaluation": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "IndividualFinancials",
                                "References"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
                                    "readonly": true
                                },
                                "IndividualFinancials": {
                                    "readonly": true
                                },
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "ContactInformation.state": {
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
                                },
                                "BankAccounts.customerBankAccounts":{
                                    "readonly": true
                                }
                            }
                        },
                        "GuarantorAddition": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck",
                                "IndividualReferences",
                                "FamilyDetails.familyMembers.noOfDependents",
                                "PhysicalAssets",
                                "IndividualFinancials",
                                "References"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "ContactInformation.locality":{
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.familyMemberFirstName": {
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                },
                                "ContactInformation.villageName":{
                                    "readonly": true
                                },
                                "ContactInformation.district":{
                                    "readonly": true
                                },
                                "IndividualInformation.customerId": {
                                    "readonly": true
                                },
                                "IndividualInformation.urnNo": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                }, 
                                "IndividualFinancials": {
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
                                },
                                "BankAccounts.customerBankAccounts":{
                                    "readonly": true
                                }
                            }
                        },
                        "ScreeningReview": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "IndividualFinancials",
                                "References"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
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
                                    "title": "FAMILY_DETAILS"
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
                                },
                                "BankAccounts.customerBankAccounts":{
                                    "readonly": true
                                }
                            }
                        },
                        "ApplicationReview":{
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck",
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
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
                                    "title": "FAMILY_DETAILS"
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
                                },
                                "BankAccounts.customerBankAccounts":{
                                    "readonly": true
                                },
                                "References": {
                                    "readonly": true
                                },
                            }
                        },
                        "Sanction": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                //"IndividualReferences.verifications.ReferenceCheck",
                                //"IndividualReferences",
                                "IndividualFinancials"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
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
                                },
                                "BankAccounts.customerBankAccounts":{
                                    "readonly": true
                                },
                                "References": {
                                    "readonly": true
                                },
                            }
                        },
                        "Rejected": {
                            "excludes": [
                                "IndividualFinancials"
                            ],
                            "overrides": {
                                "KYC": {
                                    "orderNo": 1,
                                    "readonly":true
                                },
                                "FamilyDetails.familyMembers.noOfDependents":{
                                    "readonly": true
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
                                    "resolver": "MailingPincodeLOVConfiguration",
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
                                // "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                //     "required": true
                                // },
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
                                },
                                "References": {
                                    "readonly": true
                                },
                            }
                        }
                    },
                    "pageClass" : {
                        "guarantor": {
                            "overrides" : {
                                "KYC": {
                                    "readonly": false
                                },
                                "IndividualFinancials": {
                                    "readonly": false
                                },
                                "IndividualInformation": {
                                    "readonly": false
                                },
                                "ContactInformation": {
                                    "readonly": false
                                },
                                "FamilyDetails": {
                                    "readonly": false,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": false
                                },
                                "IndividualReferences": {
                                    "readonly": false
                                },
                                "References": {
                                    "readonly": true
                                },
                                "TrackDetails": {
                                    "readonly": false
                                },
                                "reference": {
                                    "readonly": false
                                },
                                "HouseVerification": {
                                    "readonly": false
                                },
                                "ResidenceVerification":{
                                    "readonly": false
                                },
                                "PhysicalAssets": {
                                    "readonly": false
                                },
                                "BankAccounts.customerBankAccounts":{
                                    "readonly": false
                                }
                            }
                        }
                    }
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    //over 
                    "KYC.customerId": {
                        "orderNo": 10,
                        "resolver": "IndividualCustomerIDLOVConfiguration"
                    },
                    "PhysicalAssets.physicalAssets.unit": {
                          "type": "string"
                    },
                    "IndividualInformation.existingLoan": {
                        "title": "EXISTING_LOAN"
                    },
                    "BankAccounts.customerBankAccounts.isDisbersementAccount":{
                        "title": "Is Disbursement"
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits":{
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced":{
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced":{
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto":{
                        "required": true
                    },
                     "IndividualInformation.centreId": {
                        "resolver": "CentreLOVConfiguration"
                    },
                    "IndividualInformation.spouseFirstName":{
                        "condition": "model.customer.maritalStatus==='MARRIED'" 
                    },
                    "IndividualInformation.spouseDateOfBirth":{
                        "condition": "model.customer.maritalStatus==='MARRIED'"
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
                        "resolver": "PincodeLOVConfiguration",
                        "searchHelper": formHelper
                        
                    },
                    "ContactInformation.mailingPincode": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "resolver": "MailingPincodeLOVConfiguration"
                    },
                    "HouseVerification.houseDetailsFieldSet": {
                        "orderNo": 10
                    },
                    "HouseVerification.ownership": {
                        "orderNo": 20,
                        "enumCode": "houseveri_rent_lease_status"
                    },
                    "HouseVerification.inCurrentAddressSince": {
                        "key": "customer.udf.userDefinedFieldValues.udf4",
                        "enumCode": "years_in_current_address",
                        "schema": {
                            "type": "string"
                        },
                        "orderNo": 30
                    },
                    "HouseVerification.inCurrentAreaSince": {
                        "key": "customer.udf.userDefinedFieldValues.udf5",
                        "enumCode": "years_in_current_area",
                        "required": true,
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
                    // "IndividualInformation.caste": {
                    //     "enumCode": "caste"
                    // },
                    "Liabilities.liabilities.startDate":{
                        "onChange":function(modelValue, form, model, formCtrl, $event){
                            var index;
                            if(moment(modelValue).isAfter(new Date())){
                                modelValue=null;
                                index=form.key[2];
                                model.customer.liabilities[index].startDate=null;
                                PageHelper.showProgress("pre-save-validation", "Start date can not be a future date.", 3000);
                                return false;
                            }
                        }
                    },
                    "Liabilities.liabilities.maturityDate":{
                        "onChange":function(modelValue, form, model, formCtrl, event){
                            var index;
                            if(moment(modelValue).isBefore(new Date())){
                                modelValue=null;
                                index=form.key[2];
                                model.customer.liabilities[index].maturityDate=null;
                                PageHelper.showProgress("pre-save-validation", "Maturity date can not be a past date.", 3000);
                                return false;
                            }
                        }
                    },
                    "HouseVerification.rentLeaseStatus": {
                        "schema": {
                            "enumCode": "rent_lease_status"
                        },
                        "condition": "model.customer.ownership.toLowerCase() == 'rent' || model.customer.ownership.toLowerCase() == 'lease'",
                        "orderNo": 21,
                        "required": true
                    },
                    "HouseVerification.rentLeaseAgreement": {
                        "condition": "model.customer.udf.userDefinedFieldValues.udf3 == 'Available'",
                        "orderNo": 22,
                        "required": true
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
                    },
                    "FamilyDetails.familyMembers.incomes.incomeEarned":{
                        "title":"INCOME_EARNED",
                        "key": "customer.familyMembers[].incomes[].incomeEarned",
                        "type":"amount"
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
                    //"IndividualInformation.caste",

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
                    //"ContactInformation.mandal",
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
                    //"ContactInformation.mailingMandal",
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
                    "FamilyDetails.familyMembers.noOfDependents",

                    "Liabilities",
                    "Liabilities.liabilities",
                    "Liabilities.liabilities.loanType",
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
                    // "BankAccounts.customerBankAccounts.bankStatements.openingBalance",
                    // "BankAccounts.customerBankAccounts.bankStatements.closingBalance",
                    //"BankAccounts.customerBankAccounts.bankStatements.emiAmountdeducted",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",
//
                    "PhysicalAssets",
                    "PhysicalAssets.physicalAssets",
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.vehicleModel",
                    "PhysicalAssets.physicalAssets.registeredOwner",
                    "PhysicalAssets.physicalAssets.ownedAssetValue",
                    "PhysicalAssets.physicalAssets.unit",

                    // "IndividualReferences",
                    // "IndividualReferences.verifications",
                    // "IndividualReferences.verifications.referenceFirstName",
                    // "IndividualReferences.verifications.mobileNo",
                    // "IndividualReferences.verifications.occupation",
                    // "IndividualReferences.verifications.address",
                    // "IndividualReferences.verifications.ReferenceCheck",
                    // "IndividualReferences.verifications.ReferenceCheck.knownSince",
                    // "IndividualReferences.verifications.ReferenceCheck.relationship",
                    // "IndividualReferences.verifications.ReferenceCheck.opinion",
                    // "IndividualReferences.verifications.ReferenceCheck.financialStatus",
                    // "IndividualReferences.verifications.ReferenceCheck.customerResponse",

                    "References",
                    "References.verifications",
                    "References.verifications.relationship",
                    "References.verifications.businessName",
                    "References.verifications.referenceFirstName",
                    "References.verifications.mobileNo",
                    "References.verifications.address",
                    "References.verifications.ReferenceCheck",
                    "References.verifications.ReferenceCheck.knownSince",
                    "References.verifications.ReferenceCheck.goodsSold",
                    "References.verifications.ReferenceCheck.goodsBought",
                    "References.verifications.ReferenceCheck.paymentTerms",
                    "References.verifications.ReferenceCheck.modeOfPayment",
                    "References.verifications.ReferenceCheck.outstandingPayable",
                    "References.verifications.ReferenceCheck.outstandingReceivable",
                    "References.verifications.ReferenceCheck.customerResponse",


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
                    };
                    model.UIUDF = {
                        'family_fields': {}
                    };

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType =getLoanCustomerRelation(bundlePageObj.pageClass);
                    model.pageClass = bundlePageObj.pageClass;
                    model.currentStage = bundleModel.currentStage;
                    // if( model.currentStage=="FieldAppraisal"){

                    // }else{

                        model.enrolmentProcess.currentStage =  model.currentStage;
                        model.customer = model.enrolmentProcess.customer;
                   // }
                    /* End of setting data recieved from Bundle */
        
                    /* Setting data for the form */
                    var branchId = SessionStore.getBranchId();
                    if(!model.customer){

                    }

                    else if(branchId && !model.customer.customerBranchId)
                        {
                            model.customer.customerBranchId = branchId;
                    };

                    /* End of setting data for the form */
                    model.UIUDF.family_fields.dependent_family_member = 0;
                    if(model.customer){
                     _.each(model.customer.familyMembers, function(member) {
                        if (member.incomes && member.incomes.length == 0)
                            model.UIUDF.family_fields.dependent_family_member++;
                    });
                }

                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            "KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "ContactInformation": {
                                    "items": {
                                        "mandal": {
                                            "key": "customer.udf.userDefinedFieldValues.udf1",
                                            "title": "MANDAL_TAHSIL",
                                            "type": "string",
                                            "orderNo": 100
                                        },
                                        "mailingMandal": {
                                            "key": "customer.udf.userDefinedFieldValues.udf2",
                                            "title": "MANDAL_TAHSIL",
                                            "type": "string",
                                            "orderNo": 181
                                        }
                                    }
                                },
                                "FamilyDetails": {
                                    "items": {
                                        "familyMembers": {
                                            "items": {
                                                "relationShip1": {
                                                    "key": "customer.familyMembers[].relationShip",
                                                    "type": "select",
                                                    "title": "T_RELATIONSHIP"
                                                }
                                            }
                                        }
                                    }
                                },
                                "HouseVerification": {
                                    "items": {
                                        "rentLeaseStatus": {
                                            "type":"select",
                                            "key": "customer.udf.userDefinedFieldValues.udf3",
                                            "title":"RENT_LEASE_STATUS"
                                        },
                                        "rentLeaseAgreement": {
                                            "type":"date",
                                            "key": "customer.udf.userDefinedDateFieldValues.udfDate1",
                                            "title":"RENT_LEASE_AGREEMENT_VALID_TILL"
                                        }
                                    }
                                },
                                "References":{
                                    "type": "box",
                                    "title": "REFERENCES",
                                    "orderNo":2500,
                                    //"condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                                    "items": {
                                        "verifications" : {
                                            key:"customer.verifications",
                                            title:"REFERENCES",
                                            type: "array",
                                            items:{
                                                "relationship" : {
                                                    key:"customer.verifications[].relationship",
                                                    title:"REFERENCE_TYPE",
                                                    type:"select",
                                                    required:"true",
                                                    enumCode: "business_reference_type"
                                                },
                                                "businessName" : {
                                                    key:"customer.verifications[].businessName",
                                                    title:"BUSINESS_NAME",
                                                    type:"string"
                                                },
                                                "referenceFirstName" : {
                                                    key:"customer.verifications[].referenceFirstName",
                                                    title:"CONTACT_PERSON_NAME",
                                                    type:"string"
                                                },
                                                "mobileNo" : {
                                                    key:"customer.verifications[].mobileNo",
                                                    title:"CONTACT_NUMBER",
                                                    type:"string",
                                                    inputmode: "number",
                                                    numberType: "tel",
                                                    "schema": {
                                                         "pattern": "^[0-9]{10}$"
                                                    }
                                                }/*,
                                                {
                                                    key:"customer.verifications[].businessSector",
                                                    title:"BUSINESS_SECTOR",
                                                    type:"select",
                                                    enumCode: "businessSector"
                                                },
                                                {
                                                    key:"customer.verifications[].businessSubSector",
                                                    title:"BUSINESS_SUBSECTOR",
                                                    type:"select",
                                                    enumCode: "businessSubSector",
                                                    parentEnumCode: "businessSector"
                                                },
                                                {
                                                    key:"customer.verifications[].selfReportedIncome",
                                                    title:"SELF_REPORTED_INCOME",
                                                    type:"number"
                                                }*/,
                                                "address" : {
                                                    key:"customer.verifications[].address",
                                                    type:"textarea"
                                                },
                                                "ReferenceCheck" : {
                                                type: "fieldset",
                                                title: "REFERENCE_CHECK",
                                                //"condition": "model.currentStage=='FieldAppraisal'",
                                                items: {
                                                    /*,
                                                    {
                                                        key:"customer.verifications[].remarks",
                                                        title:"REMARKS",
                                                    },*/
                                                    "knownSince" : {
                                                        key:"customer.verifications[].knownSince",
                                                        required:true
                                                    },
                                                    "goodsSold" : {
                                                        key:"customer.verifications[].goodsSold",
                                                        "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                                    },
                                                    "goodsBought" : {
                                                        key:"customer.verifications[].goodsBought",
                                                        "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                                    },
                                                    "paymentTerms" : {
                                                        key:"customer.verifications[].paymentTerms",
                                                        type:"select",
                                                        "title":"payment_tarms",
                                                        enumCode: "payment_terms"
                                                    },
                                                    "modeOfPayment" : {
                                                        key:"customer.verifications[].modeOfPayment",
                                                        type:"select",
                                                        enumCode: "payment_mode"
                                                    },
                                                    "outstandingPayable" : {
                                                        key:"customer.verifications[].outstandingPayable",
                                                        "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                                    },
                                                    "outstandingReceivable" : {
                                                        key:"customer.verifications[].outstandingReceivable",
                                                        "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                                    },
                                                    "customerResponse" : {
                                                        key:"customer.verifications[].customerResponse",
                                                        title:"CUSTOMER_RESPONSE",
                                                        type:"select",
                                                        required:true,
                                                        titleMap: [{
                                                                        value: "positive",
                                                                        name: "positive"
                                                                    },{
                                                                        value: "Negative",
                                                                        name: "Negative"
                                                                    }]
                                                    }
                                                }
                                                }
                                            }
                                        },
                                    }
                                },
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "condition": "!model.customer.currentStage",
                                    "orderNo": 2700,
                                    "items": [
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT"
                                        }
                                    ]
                                },
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.id",
                                    "orderNo": 2800,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE",
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
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails);
                        model.loanProcess.removeRelatedEnrolmentProcess(model.enrolmentProcess, model.loanCustomerRelationType);
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "lead-loaded": function (bundleModel, model, obj) {
              
                        return $q.when()
                            .then(function(){
                                if (obj.applicantCustomerId){
                                    return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                } else {
                                    return null;
                                }
                            })
                            .then(function(enrolmentProcess){
                                if (enrolmentProcess!=null){
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;
                                    model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
                                    BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                }
                                if(obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
                                    model.customer.existingLoan = 'YES';
                                } else {
                                    model.customer.existingLoan = 'NO';
                                }
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
                                model.customer.age = moment().diff(moment(obj.dob, SessionStore.getSystemDateFormat()), 'years');
                                model.customer.gender = obj.gender;
                                model.customer.referredBy = obj.referredBy;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.landmark = obj.landmark;
                                model.customer.postOffice = obj.postOffice;

                                for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                    // $log.info(model.customer.familyMembers[i].relationShip);
                                    // model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                                    if (model.customer.familyMembers[i].relationShip.toUpperCase() == "SELF") {
                                        model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                                     }
                                }
                            })








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
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
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
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer});

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
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
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer});

                                model.enrolmentProcess.proceed()
                                .subscribe(function(enrolmentProcess) {
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                }, function(err) {
                                    PageHelper.showErrors(err);
                                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                })
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);                                
                                PageHelper.hideLoader();
                            });
                    }
                }
            };
        }
    }
})

