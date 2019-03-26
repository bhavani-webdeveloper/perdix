// pageUID: "shramsarathi.dashboard.loans.individual.customer.IndividualEnrolment",
define(["perdix/domain/model/loan/LoanProcess",'perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (LoanProcess,EnrolmentProcess, AngularResourceService) {
    var LoanProcess = LoanProcess["LoanProcess"];
    var EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "shramsarathi.customer.IndividualEnrollment",
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
                        "Initiation": {
                            "excludes": [
                                "ContactInformation.careOf",
                                "ContactInformation.postOffice",
                                "ContactInformation.mailingPostoffice",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.place",
                                "HouseVerification.date"
                                

                            ], "overrides": {
                                "PhysicalAssets":{
                                    "title":"FIXED_ASSET"
                                },
                                "PhysicalAssets.physicalAssets.nameOfOwnedAsset": {
                                    "title": "ASSET_TYPE",
                                    "type": "select",
                                    "enumCode": "fixed_asset_type"
                                },
                                "IndividualInformation.centreId": {
                                    "required": true,
                                    "readonly": false,
                                    "title": "ZONE_ID"
                                },
                                "IndividualInformation.centreId1": {
                                    "title": "ZONE_NAME"
                                },
                                "HouseVerification.inCurrentAreaSince": {
                                    "required": false,
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required": false,
                                },

                            }
                        },


                        "Application":
                        {
                            "excludes": [
                                "KYC.firstName",
                                //"References.verifications.ReferenceCheck",
                                "IndividualReferences",
                                "References"
                              
                            ],
                            "overrides": {
                                "KYC.addressProofFieldSet":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO' || model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProof": {
                                    "readonly": false,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO' || model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofImageId": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofNo": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofIssueDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofValidUptoDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                               
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE",
                                    "required": true
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
                                },
                                "BankAccounts.customerBankAccounts.accountType":{
                                    "title":"TYPE_OF_BANK_ACCOUNT"   
                               },
                                "BankAccounts.customerBankAccounts.bankingSince":{
                                   "title":"ACTIVE_FROM"
                                }
                                

                            }
                        },
                        "FieldAppraisal":
                        {
                            "excludes": [
                                "KYC.firstName",
                                "IndividualReferences"
                            ],
                            "overrides": {
                               
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE"
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
                                }
                                
                            }
                        },
                        "Screening": {
                            "excludes": [
                               // "IndividualFinancials",
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "IndividualReferences",
                                "IndividualInformation.centreId",
                                "References",
                                "KYC.firstName",
                            ],
                            "overrides": {
                                "FamilyDetails.familyMembers": {
                                    "title": "MIGRANT_DETAILS"
                                },
                                "FamilyDetails.familyMembers.maritalStatus":{
                                    "required": true
                                },
                                "EnterpriseFinancials.currentAsset.value":{
                                    "type":"amount"
                                },

                                "IndividualInformation.centreId": {
                                    "required": true,
                                    "readonly": false,
                                    "title": "ZONE_ID"
                                },
                                "IndividualInformation.centreId1":{
                                    "title": "ZONE_NAME"
                                },
                                "IndividualInformation.age":{
                                    "required":false
                                },
                                "IndividualInformation.dateOfBirth":{ 
                                    "onChange": function (modelValue, form, model) {
                                    if (model.customer.dateOfBirth) {
                                        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                            }
                        ,
                                "KYC": {
                                    "orderNo": 1
                                },
                                "HouseVerification.place": {
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
                                    "required": true,
                                    "schema": {
                                        "pattern": "(^\\d{4}\\d{4}\\d{4}$)|(^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$)",
                                        "type": ["integer", "string"]
                                    }
                                },
                                "KYC.addressProofFieldSet":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO' || model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProof": {
                                    "readonly": false,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO' || model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofImageId": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofNo": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofIssueDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofValidUptoDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": false,
                                    "required": true
                                },
                                
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE",
                                    
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
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
                        
                                "IndividualInformation.maritalStatus": {
                                    "required": true
                                },
                                "IndividualInformation.spouseFirstName": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                // "FamilyDetails.familyMembers.relationShip": {
                                //     "readonly": true
                                // },
                                "HouseVerification.ownership": {
                                    "required": true
                                },
                                "HouseVerification.udf30": {
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.ifscCode": {
                                    "required": true,
                                    "resolver": "IFSCCodeLOVConfiguration",
                                    
                                },
                                "BankAccounts.customerBankAccounts.customerBankName": {
                                    "readonly": true,
                                    "title":"BANK"
                                },
                                "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                                    "readonly": true,
                                    "title":"DEPOSIT_AMOUNT"
                                },
                                "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th":{
                                    "title":"BALANCE_IN_THE_ACCOUNT"
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
                                
                                "BankAccounts.customerBankAccounts.accountNumber": {
                                    required: true
                                },
                                "BankAccounts.customerBankAccounts.isDisbersementAccount": {
                                    "type": "radios"
                                    
                                },
                                "BankAccounts.customerBankAccounts.accountType":{
                                     "title":"TYPE_OF_BANK_ACCOUNT"   
                                },
                                 "BankAccounts.customerBankAccounts.bankingSince":{
                                    "title":"ACTIVE_FROM"
                                 }
                            }
                        },
                        "KYC": {
                            "excludes": [
                                //"IndividualFinancials",
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
                                "HouseVerification.place": {
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
                                "KYC.addressProofFieldSet":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProof": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofImageId": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofNo": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofIssueDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofValidUptoDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE"
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
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
                                // "FamilyDetails.familyMembers.relationShip": {
                                //     "title": "RELATIONSHIP_WITH_MIGRANT"
                                // },
                                "FamilyDetails.familyMembers": {
                                    "title": "MIGRANT_DETAILS"
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
                                    "readonly": true
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
                                // "FamilyDetails.familyMembers": {
                                //     "view": "fixed"
                                // }
                                "FamilyDetails.familyMembers": {
                                    "title": "MIGRANT_DETAILS"
                                },
                                "Liabilities.liabilities.maturityDate":{
                                    "title":"END_DATE"
                                },
                            }
                        },
                        "KYCReview": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents": {
                                    "readonly": true,
                                    "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() == 'self'"
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                              
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE"
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
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
                                   // "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    //"condition": "model.customer.maritalStatus==='MARRIED'"
                                }
                            },
                            "excludes": [
                                "IndividualFinancials",
                                // "FamilyDetails.familyMembers.familyMemberFirstName",
                                // "FamilyDetails.familyMembers.anualEducationFee",
                                // "FamilyDetails.familyMembers.salary",
                                // "FamilyDetails.familyMembers.incomes",
                                // "FamilyDetails.familyMembers.incomes.incomeSource",
                                // "FamilyDetails.familyMembers.incomes.incomeEarned",
                                // "FamilyDetails.familyMembers.incomes.frequency",
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
                                "KYC.addressProofFieldSet":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProof": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofImageId": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofNo": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProof": {
                                    "readonly": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofIssueDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofValidUptoDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": false,
                                    "title": "ZONE_ID"
                                },
                                "IndividualInformation.centreId1":{
                                    "title": "ZONE_NAME"
                                },
                                // "IndividualInformation.age":{
                                //     "required":true
                                // },
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
                                    //"condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                    //"condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                // "ContactInformation.mailingStreet": {
                                //     "condition": "!model.customer.mailSameAsResidence"
                                // },
                                "ContactInformation.mailingMobilePhone": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration"
                                },
                                "ContactInformation.mailingLandmark": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "title":"LANDMARK"
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "title":"PANCHAYAT"
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                // "FamilyDetails.familyMembers.relationShip": {
                                //     "readonly": true
                                // },
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
                                    "readonly": true
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
                                // "FamilyDetails.familyMembers": {
                                //     "view": "fixed"
                                // },
                                "FamilyDetails.familyMembers": {
                                    "title": "MIGRANT_DETAILS"
                                },
                               
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE"
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
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
                                // "FamilyDetails.familyMembers.familyMemberFirstName": {
                                //     "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                // }
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
                                "FamilyDetails.familyMembers.noOfDependents": {
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
                                
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE"
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                "reference": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true,
                                    "title":"FINANCIAL_ASSET"
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
                                // "KYC": {
                                //     "readonly": true
                                // },
                                // "FamilyDetails.familyMembers.noOfDependents": {
                                //     "readonly": true
                                // },
                                // "IndividualInformation": {
                                //     "readonly": true
                                // },
                                // "IndividualFinancials": {
                                //     "readonly": true
                                // },
                                // "ContactInformation": {
                                //     "readonly": true
                                // },
                                // "FamilyDetails": {
                                //     "readonly": true,
                                //     "title": "HOUSEHOLD_DETAILS"
                                // },
                                
                                // "ContactInformation.villageName": {
                                //     "readonly": true,
                                //     "title":"VILLAGE"
                                // },
                                // "ContactInformation.district": {
                                //     "readonly": true
                                // },
                                // "ContactInformation.state": {
                                //     "readonly": true
                                // },
                                // "ContactInformation.landLineNo":{
                                //     "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                // },
                                // "ContactInformation.residentialAddressFieldSet":{
                                //     "title":"SOURCE_ADDRESS"
                                // },
                                // "ContactInformation.doorNo":{
                                //     "title":"HAMLET_FALA",
                                //     "required":false
                                // },
                                // "ContactInformation.permanentAddressFieldSet":{
                                //     "title":"DESTINATION_ADDRESS"
                                // },
                                // "Liabilities": {
                                //     "readonly": true
                                // },
                                // "IndividualReferences": {
                                //     "readonly": true
                                // },
                                // "TrackDetails": {
                                //     "readonly": true
                                // },
                                // "reference": {
                                //     "readonly": true
                                // },
                                // "HouseVerification": {
                                //     "readonly": true
                                // },
                                // "ResidenceVerification": {
                                //     "readonly": true
                                // },
                                // "PhysicalAssets": {
                                //     "readonly": true
                                // },
                                // "BankAccounts.customerBankAccounts": {
                                //     "readonly": true
                                // }
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
                                "FamilyDetails.familyMembers.noOfDependents": {
                                    "readonly": true
                                },
                                "IndividualFinancials": {
                                    "readonly": true
                                },
                               
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE"
                                },
                                "ContactInformation.district": {
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
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true,
                                    "title":"FINANCIAL_ASSET"
                                },
                                "BankAccounts.customerBankAccounts": {
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
                                //"References",
                                
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "KYC.customerId": {
                                    "resolver": "IndividualCustomerIDLOVConfiguration"
                                },
                                "ContactInformation.locality": {
                                   // "readonly": true,
                                    "title":"PANCHAYAT",
                                    "required":true,
                                    "readonly":true
                                },
                                // "FamilyDetails.familyMembers.familyMemberFirstName": {
                                //     "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                // },
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE"
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.landLineNo":{
                                    "title":"ALTERNATIVE_MOBILE_NO",
                                   
                                },
                                "ContactInformation.residentialAddressFieldSet":{
                                    "title":"SOURCE_ADDRESS"
                                },
                                "ContactInformation.doorNo":{
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                "ContactInformation.permanentAddressFieldSet":{
                                    "title":"DESTINATION_ADDRESS"
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
                                    "readonly": false
                                },
                                "TrackDetails": {
                                    "readonly": true
                                },
                                "reference": {
                                    "readonly": false
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true,
                                    "title":"FINANCIAL_ASSET"
                                },
                                "BankAccounts.customerBankAccounts": {
                                    "readonly": true
                                }
                            }
                        },
                        "ScreeningReview": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                "IndividualReferences.verifications.ReferenceCheck",
                                "IndividualReferences",
                               
                                "IndividualFinancials",
                                "References",
                                "HouseVerification.latitude",
                                "HouseVerification.houseVerificationPhoto",
                                "HouseVerification.date",
                                "HouseVerification.place",
                                "KYC.customerId"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly":true
                                },
                                "EnterpriseFinancials.currentAsset.assetType":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials.currentAsset.value":{
                                    "readonly": true,
                                    "type":"amount"
                                },  
                                "PhysicalAssets.physicalAssets":{
                                "readonly":true
                                },
                              
                                "FamilyDetails.familyMembers.noOfDependents": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "IndividualInformation.photoImageId": {
                                    "required": true
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
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true,
                                    
                                },
                                "BankAccounts.customerBankAccounts": {
                                    "readonly": true
                                }
                            }
                        },
                        "ApplicationReview": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption",
                                //"IndividualReferences.verifications.ReferenceCheck",
                                "KYC.customerId"

                            ],
                            "overrides": {
                                "KYC.addressProofFieldSet":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProof": {
                                    "readonly": false,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofImageId": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofNo": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofIssueDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC.addressProofValidUptoDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                                },
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents": {
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
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts": {
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
                                "IndividualReferences",
                                "IndividualFinancials"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents": {
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
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts": {
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
                                    "readonly": true
                                },
                                "FamilyDetails.familyMembers.noOfDependents": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "IndividualFinancials": {
                                    "orderNo": 4,
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "orderNo": 5,
                                    "readonly": true
                                },
                                "Liabilities": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "orderNo": 9,
                                    "readonly": true
                                },
                                "References": {
                                    "orderNo": 9,
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "orderNo": 10,
                                    "readonly": true
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
                                "KYC.addressProofFieldSet":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProof": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofImageId": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofNo": {
                                    "required": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProof": {
                                    // "readonly": true,
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofIssueDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.addressProofValidUptoDate":{
                                    "condition":"model.customer.addressPfSameAsIdProof=='NO'"
                                },
                                "KYC.additionalKYCs.kyc1ImagePath": {
                                    "required": true
                                },
                                "IndividualInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "IndividualInformation.centreId": {
                                    "readonly": false,
                                    "title": "ZONE_ID"
                                },
                                "IndividualInformation.centreId1":{
                                    "title": "ZONE_NAME"
                                },
                                // "IndividualInformation.age":{
                                //     "required":true
                                // },
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
                                    //"condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "IndividualInformation.spouseDateOfBirth": {
                                   // "condition": "model.customer.maritalStatus==='MARRIED'"
                                },
                                "ContactInformation.locality": {
                                    //"readonly": true,
                                    "title":"PANCHAYAT",
                                    "required":true,
                                    "readonly":true
                                },
                                "ContactInformation.villageName": {
                                    "readonly": true,
                                    "title":"VILLAGE",
                                    "required": true
                                },
                                "ContactInformation.district": {
                                    "readonly": true,
                                    "required": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true,
                                    "required": true
                                },
                                "ContactInformation.mailingDoorNo": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "title":"HAMLET_FALA",
                                    "required":false
                                },
                                // "ContactInformation.mailingStreet": {
                                //     "condition": "!model.customer.mailSameAsResidence"
                                // },
                                "ContactInformation.mailingPostoffice": {
                                    "condition": "!model.customer.mailSameAsResidence"
                                },
                                "ContactInformation.mailingPincode": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "resolver": "MailingPincodeLOVConfiguration",
                                },
                                "ContactInformation.mailingLocality": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true,
                                    "title":"PANCHAYAT",
                                    "required":true
                                },
                                "ContactInformation.mailingDistrict": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                "ContactInformation.mailingState": {
                                    "condition": "!model.customer.mailSameAsResidence",
                                    "readonly": true
                                },
                                // "FamilyDetails.familyMembers.relationShip": {
                                //     "readonly": true
                                // },
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
                                // "FamilyDetails.familyMembers": {
                                //     "add": null,
                                //     "remove": null,
                                //     "view": "fixed"
                                // },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "required": true
                                },
                                "IndividualFinancials.expenditures.expenditureSource": {
                                    "required": true
                                },
                                // "FamilyDetails.familyMembers.familyMemberFirstName": {
                                //     "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                // },
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
                                "EnterpriseFinancials.currentAsset":{
                                    "readonly":true
                                },
                                "Machinery":{
                                    "readonly":true
                                }
                            }
                        },
                        "FieldAppraisalReview": {
                            "overrides": {
                                "References": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true
                                },
                            }
                        },
                        "CentralRiskReview": {
                            "overrides": {
                                "References": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true
                                },
                            }
                        },
                        "CreditCommitteeReview": {
                            "overrides": {
                                "References": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true
                                },
                            }
                        },
                        "pageClass": {
                            "guarantor": {
                                "overrides": {
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
                                        "title": "MIGRANT_DETAILS"
                                    },
                                    "Liabilities": {
                                        "readonly": false
                                    },
                                    // "IndividualReferences": {
                                    //     "readonly": false
                                    // },
                                    "References": {
                                        "readonly": false
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
                                    "ResidenceVerification": {
                                        "readonly": false
                                    },
                                    "PhysicalAssets": {
                                        "readonly": false
                                    },
                                    "BankAccounts.customerBankAccounts": {
                                        "readonly": false
                                    }
                                }
                            }
                        },
                        "loanView": {
                            "overrides": {
                                "KYC":{
                                    "readonly": true
                                },
                                "IndividualInformation":{
                                    "readonly":true
                                },
                                "IndividualFinancials.expenditures":{
                                   "readonly":true
                                },
                                "References": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts": {
                                    "readonly": true
                                },
                                "EnterpriseFinancials.currentAsset":{
                                    "readonly":true
                                },
                                "Machinery":{
                                    "readonly":true
                                }
                            }
                        },
                    }
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "ContactInformation.mailingDoorNo": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "title":"HAMLET_FALA",
                        "required":false
                    },
                   "Liabilities.liabilities.noOfInstalmentPaid":{
                    "key": "customer.liabilities[].noOfInstalmentPaid",
                    "type" : "select",
                     "orderNo":23,
                     "enumCode": "no_of_payments" 
                    },
                    // "FamilyDetails.familyMembers.dateOfBirth":{
                    //     "onChange": function (modelValue, form, model, formCtrl, event) {
                    //         if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                    //             model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                    //         }
                    //     }
                    // },
                    "IndividualFinancials.expenditures.annualExpenses":{
                        "required":true,
                        "title":"EXPENSE_AMOUNT"
                    },
                    "IndividualFinancials.expenditures.frequency":{
                        "required":true
                    },
                    "FamilyDetails.familyMembers.incomes.occupation":{
                        "required":true
                    },
                    "KYC.addressProofImageId":{
                        "required":false
                    },
                    "KYC.addressProof":{
                        "required":false
                    },
                    "KYC.identityProofImageId":{
                        "required":false
                    },
                    "ContactInformation.locality":{
                        "title":"PANCHAYAT",
                        "required":true,
                        "readonly":true
                    },
                    "KYC.addressProofFieldSet":{
                        "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                    },
                    "KYC.addressProof": {
                        "readonly": false,
                        "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                    },
                    "KYC.addressProofImageId": {
                        "required": true,
                        "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                    },
                    "KYC.addressProofNo": {
                        "required": true,
                        "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                    },
                    "KYC.addressProofIssueDate":{
                        "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                    },
                    "KYC.addressProofValidUptoDate":{
                        "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'"
                    },
                   
                    "IndividualInformation.age":{
                        "required":false
                    },
                    //over 
                    "KYC.idProofIssueDate":{
                        "orderNo":50
                    },
                    "KYC.idProofValidUptoDate":{
                        "orderNo":60
                    },
                    "KYC.identityProofBackside":{
                        "orderNo":40
                    },
                    "KYC.addressProofIssueDate":{
                        "orderNo":80
                    },
                    "KYC.addressProofValidUptoDate":{
                        "orderNo":80
                    },
                    "EnterpriseFinancials":{
                        "title":"CURRENT_ASSET",
                        "orderNo":300
                    },
                    "Machinery":{
                        "title":"FIXED_ASSET",
                        "orderNo":400
                    },
                    "PhysicalAssets":{
                        "title":"FINANCIAL_ASSET"
                    },
                    "IndividualInformation.customerBranchId": {
                        "required": true,
                        "readonly": false
                    },
                    "IndividualInformation.photoImageId": {
                        "required": true,
                    },
                    "IndividualInformation.fatherFirstName": {
                        "required": false,
                        "title": "FATHER_NAME"
                    },
                    "ContactInformation.mobilePhone":{
                        "title": "SOURCE_PHONE_NO",
                        "required":false
                        
                    },
                    
                    "KYC.customerId": {
                        "orderNo": 10,
                        "resolver": "IndividualCustomerIDLOVConfiguration"
                    },
                    "PhysicalAssets.physicalAssets.unit": {
                        "type": "string"
                    },
                    "IndividualInformation.existingLoan": {
                        "title": "EXISTING_LOAN_SHRAMSARATI"
                    },
                    "BankAccounts.customerBankAccounts.isDisbersementAccount": {
                        //"title": "Is Disbursement"
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                        "readonly": true
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
                    "IndividualInformation.centreId": {
                        "resolver": "CentreLOVConfiguration",
                        "title": "CENTRE_ID",
                        "readonly": false
                    },
                    "IndividualInformation.spouseFirstName": {
                        "condition": "model.customer.maritalStatus==='MARRIED'",
                    },
                    "IndividualInformation.spouseDateOfBirth": {
                        "condition": "model.customer.maritalStatus==='MARRIED'",
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
                        "orderNo": 70,
                        "required": false,
                        "readonly": true
                    },
                    "KYC.addressProofImageId": {
                        "orderNo": 70
                    },
                    "KYC.addressProofNo": {
                        "orderNo": 78
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
                    "FamilyDetails.familyMembers.relationShip":{
                        "title":"RELATIONSHIP_WITH_MIGRANT",
                        "enumCode":"relationship"
                    },
                    "FamilyDetails.familyMembers.familyMemberFirstName":{
                        "title":"MIGRANT_NAME",
                        "required":true,
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
                        onArrayAdd: function (modelValue, form, model, formCtrl, $event) {
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
                        "titleExprLocals": { moment: window.moment },
                    },
                    "BankAccounts.customerBankAccounts.ifscCode": {
                        "required": true,
                        "resolver": "IFSCCodeLOVConfiguration"
                    },
                    "PhysicalAssets":{
                        "title":"FIXED_ASSET"
                    },

                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset": {
                        "enumCode": "fixed_asset_type"
                    },
                    // "FamilyDetails.familyMembers.relationShip": {
                    //     "condition":"(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() =='SELF'",
                    //     "onChange": function(modelValue, form, model, formCtrl, event) {
                    //         if (modelValue && modelValue.toLowerCase() === 'self') {
                    //             if (model.customer.id)
                    //                 model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                    //             if (model.customer.firstName)
                    //                 model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                    //             if (model.customer.gender)
                    //                 model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                    //             model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                    //             if (model.customer.dateOfBirth)
                    //                 model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                    //             if (model.customer.maritalStatus)
                    //                 model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                    //             if (model.customer.mobilePhone)
                    //                 model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                    //         } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                    //             if (model.customer.spouseFirstName)
                    //                 model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                    //             if (model.customer.gender)
                    //                 model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                    //                     (model.customer.gender == 'FEMALE' ? 'FEMALE': model.customer.gender);
                    //             model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                    //             if (model.customer.spouseDateOfBirth)
                    //                 model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                    //             if (model.customer.maritalStatus)
                    //                 model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                    //         }
                    //     }
                    // },
                    // "FamilyDetails.familyMembers.relationShip1": {
                    //     "condition":"(model.customer.familyMembers[arrayIndex].relationShip).toUpperCase() !=='SELF'",
                    //     "onChange": function(modelValue, form, model, formCtrl, event) {
                    //         if (modelValue && modelValue.toLowerCase() === 'self') {
                    //             if (model.customer.id)
                    //                 model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                    //             if (model.customer.firstName)
                    //                 model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                    //             if (model.customer.gender)
                    //                 model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                    //             model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                    //             if (model.customer.dateOfBirth)
                    //                 model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                    //             if (model.customer.maritalStatus)
                    //                 model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                    //             if (model.customer.mobilePhone)
                    //                 model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                    //         } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                    //             if (model.customer.spouseFirstName)
                    //                 model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                    //             if (model.customer.gender)
                    //                 model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                    //                     (model.customer.gender == 'FEMALE' ? 'FEMALE': model.customer.gender);
                    //             model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                    //             if (model.customer.spouseDateOfBirth)
                    //                 model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                    //             if (model.customer.maritalStatus)
                    //                 model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                    //         }
                    //     }
                    // },
                    "IndividualInformation.caste": {
                        "enumCode": "caste"
                    },
                    "Liabilities.liabilities.startDate": {
                        "orderNo":20,
                        "onChange": function (modelValue, form, model, formCtrl, $event) {
                            var index = form.key[2];
                            if (moment(modelValue).isAfter(new Date().toDateString())) {
                                modelValue = null;
                                model.customer.liabilities[index].startDate = null;
                                PageHelper.showProgress("pre-save-validation", "Start date can not be a future date.", 3000);
                                return false;
                            }
                            if (model.customer.liabilities[index].maturityDate) {
                                if (moment(model.customer.liabilities[index].maturityDate).isBefore(model.customer.liabilities[index].startDate)) {
                                    model.customer.liabilities[index].maturityDate = null;
                                    PageHelper.showProgress("pre-save-validation", "Maturity date can not be less than start date", 3000);
                                    return false;
                                }
                            }
                        }
                    },
                    "Liabilities.liabilities.maturityDate": {
                        "orderNo":21,
                        "onChange":function (modelValue, form, model, formCtrl, event) {
                            var index = form.key[2];
                            if (model.customer.liabilities[index].startDate && moment(modelValue).isBefore(model.customer.liabilities[index].startDate)) {
                                modelValue = null;
                                model.customer.liabilities[index].maturityDate = null;
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
                        "condition": "!model.customer.mailSameAsResidence",
                        "title":"HAMLET_FALA",
                        "required":false
                    },
                    // "ContactInformation.mailingStreet": {
                    //     "condition": "!model.customer.mailSameAsResidence"
                    // },
                    "ContactInformation.mailingPostoffice": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingPincode": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "resolver": "MailingPincodeLOVConfiguration"
                    },
                    "ContactInformation.mailingLocality": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true,
                        "title":"PANCHAYAT"
                    },
                    "ContactInformation.mailingDistrict": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    },
                    "ContactInformation.mailingState": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    },
                    "FamilyDetails.familyMembers.incomes.incomeEarned": {
                        "title": "INCOME_EARNED",
                        "key": "customer.familyMembers[].incomes[].incomeEarned",
                        "type": "amount"
                    },
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset": {
                        "title": "ASSET_TYPE",
                        "type": "select",
                        "enumCode": "fixed_asset_type"
                    },
                    "PhysicalAssets.physicalAssets.vehicleModel": {
                        "condition": "model.customer.physicalAssets[arrayIndex].nameOfOwnedAsset=='Two wheeler' || model.customer.physicalAssets[arrayIndex].nameOfOwnedAsset=='Four Wheeler'"
                    },
                    "IndividualFinancials.expenditures.expenditureSource": {
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth": {
                        "required": false
                    },
                    "KYC.identityProof":{
                        "enumCode":"identity_proof",
                        "orderNo":21
                    },
                    "KYC.addressProof":{
                        "enumCode":"address_proof",
                        "orderNo":61
                    },
                    "FamilyDetails.familyMembers.educationStatus":{
                        "enumCode":"education_status"
                    },
                    "EnterpriseFinancials.currentAsset.assetType":{
                        "enumCode":"current_asset_type"
                    },
                    "Liabilities.liabilities.liabilityType":{
                        "enumCode":"financial_liabilities"
                    },
                  
                    "Liabilities.liabilities.interestRate":{
                        "type":"number",
                        //"enumCode":"rate_of_interest",
                        "orderNo":22,
                    },
                    "KYC.additionalKYCs.kyc1ProofType":{
                        "enumCode":"age_proof",
                        "orderNo":91
                    },
                    // "IndividualInformation.existingLoan":{
                    //     "title":""
                    // },
                    // "KYC.addressPfSameAsIdProof":{
                    //     "onChange": function(modelValue, form, model, formCtrl, event) {
                    //         if(model.addressPfSameAsIdProof==='YES'){
                    //             model.addressProofNo=model.identityProofNo
                    //         }
                    //     }                    },

                }
            }
            var getIncludes = function (model) {

                return [
                    "KYC",
                    //"KYC.customerId",
                    "KYC.firstName",
                    "KYC.identityProofFieldSet",
                    "KYC.identityProof",
                    "KYC.identityProofImageId",
                    "KYC.identityProofNo",
                    "KYC.idProofIssueDate",
                    "KYC.idProofValidUptoDate",
                    "KYC.identityProofBackside",
                    "KYC.addressProofSameAsIdProof",
                    "KYC.addressProofFieldSet",
                    "KYC.addressProof",
                    "KYC.addressProofImageId",
                    "KYC.addressProofBackside",
                    "KYC.addressProofNo",
                    "KYC.addressProofIssueDate",
                    "KYC.addressProofValidUptoDate",
                    "KYC.additionalKYCs",
                    "KYC.additionalKYCs.kyc1ProofType",
                    "KYC.additionalKYCs.kyc1ImagePath",
                    "KYC.additionalKYCs.kyc1ProofNumber",
                    "KYC.additionalKYCs.kyc1IssueDate",
                    "KYC.additionalKYCs.kyc1ValidUptoDate",

                    "IndividualInformation",
                    // "IndividualInformation.groupID",
                    // "IndividualInformation.groupName",
                    "IndividualInformation.customerBranchId",
                    "IndividualInformation.centreId",
                    "IndividualInformation.centreId1",
                    "IndividualInformation.customerId",
                    // "IndividualInformation.urnNo",
                    "IndividualInformation.photoImageId",
                    "IndividualInformation.existingLoan",
                    "IndividualInformation.title",
                    "IndividualInformation.firstName",
                    "IndividualInformation.enrolledAs",
                    "IndividualInformation.gender",
                    "IndividualInformation.dateOfBirth",
                    "IndividualInformation.age",
                    // "IndividualInformation.religion",
                    "IndividualInformation.language",
                    "IndividualInformation.fatherFirstName",
                    // "IndividualInformation.motherName",
                    "IndividualInformation.maritalStatus",
                    "IndividualInformation.spouseFirstName",
                    "IndividualInformation.spouseDateOfBirth",
                    "IndividualInformation.numberOfDependents",
                    "IndividualInformation.caste",

                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                   // "ContactInformation.alternativeMobileNo",
                     "ContactInformation.landLineNo",
                    "ContactInformation.whatsAppMobileNoOption",
                    "ContactInformation.whatsAppMobileNo",
                    "ContactInformation.email",
                    "ContactInformation.residentialAddressFieldSet",
                    "ContactInformation.careOf",
                    "ContactInformation.doorNo",
                    //"ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.landmark",
                    //"ContactInformation.collectionArea",
                    "ContactInformation.mandal",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.mailSameAsResidence",
                    "ContactInformation.permanentAddressFieldSet",
                    "ContactInformation.mailingLandmark",
                    "ContactInformation.mailingMobilePhone",
                    "ContactInformation.mailingDoorNo",
                    //"ContactInformation.mailingStreet",
                    "ContactInformation.mailingPostoffice",
                    "ContactInformation.mailingMandal",
                    "ContactInformation.mailingPincode",
                    "ContactInformation.mailingLocality",
                    "ContactInformation.mailingDistrict",
                    "ContactInformation.mailingState",
                    "ContactInformation.mailingMobileNo",

                    "IndividualFinancials",
                    "IndividualFinancials.expenditures",
                    "IndividualFinancials.expenditures.expenditureSource",
                    "IndividualFinancials.expenditures.annualExpenses",
                    "IndividualFinancials.expenditures.frequency",
                    "IndividualFinancials.expenditures.from",

                    "FamilyDetails",
                    "FamilyDetails.familyMembers",
                    "FamilyDetails.familyMembers.migrantType",
                    "FamilyDetails.familyMembers.relationShip",
                    "FamilyDetails.familyMembers.customerId",
                    "FamilyDetails.familyMembers.familyMemberFirstName",
                    "FamilyDetails.familyMembers.gender",
                    "FamilyDetails.familyMembers.dateOfBirth",
                    "FamilyDetails.familyMembers.age",
                    "FamilyDetails.familyMembers.educationStatus",
                    "FamilyDetails.familyMembers.maritalStatus",
                    "FamilyDetails.familyMembers.mobilePhone",
                    "FamilyDetails.familyMembers.healthStatus",
                    "FamilyDetails.familyMembers.incomes",
                    "FamilyDetails.familyMembers.incomes.incomeSource",
                    "FamilyDetails.familyMembers.incomes.incomeEarned",
                    "FamilyDetails.familyMembers.incomes.frequency",
                    "FamilyDetails.familyMembers.incomes.occupation",
                    "FamilyDetails.familyMembers.incomes.workSector",
                    "FamilyDetails.familyMembers.incomes.incomeEarned",
                    "FamilyDetails.familyMembers.incomes.frequency",
                    "FamilyDetails.familyMembers.incomes.occupationType",
                    "FamilyDetails.familyMembers.incomes.skillLevel",
                    "FamilyDetails.familyMembers.incomes.avarageTimeSpend",
                    "FamilyDetails.familyMembers.incomes.avarageReturn",
                    "FamilyDetails.familyMembers.incomes.incomeFrom",
                    "FamilyDetails.familyMembers.incomes.noOfDaysWorkedInMonth",

                    "Liabilities",
                    "Liabilities.liabilities",
                    "Liabilities.liabilities.loanType",
                    //"Liabilities.liabilities.liabilityType",
                    "Liabilities.liabilities.mortage",
                    "Liabilities.liabilities.mortageAmount",
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
                    "Liabilities.liabilities.masonValuation",
                    "Liabilities.liabilities.amountPaidInterest",
                    "Liabilities.liabilities.amountPaid",

                    

                    "HouseVerification",
                    "HouseVerification.houseDetailsFieldSet",
                    "HouseVerification.ownership",
                    "HouseVerification.inCurrentAddressSince",
                    "HouseVerification.inCurrentAreaSince",
                    "HouseVerification.latitude",
                    "HouseVerification.houseVerificationPhoto",
                    "HouseVerification.date",
                    "HouseVerification.place",
                    "HouseVerification.houseStatus",
                    "HouseVerification.noOfRooms",
                    //"HouseVerification.rentLeaseStatus",
                    //"HouseVerification.rentLeaseAgreement",

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
                    "BankAccounts.customerBankAccounts.bankStatements.cashDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.nonCashDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",
                    //
                    "PhysicalAssets",
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.ownedAssetValue",
                    // "PhysicalAssets.financialAssets",
                    // "PhysicalAssets.financialAssets.installmentAmount",
                    // "PhysicalAssets.financialAssets.balance",
                    "EnterpriseFinancials",
                    "EnterpriseFinancials.currentAsset",
                    "EnterpriseFinancials.currentAsset.assetType",
                    "EnterpriseFinancials.currentAsset.value",
                    // "Machinery",
                    // "Machinery.fixedAssetsMachinaries",
                    // "Machinery.fixedAssetsMachinaries.machineType",
                    // "Machinery.fixedAssetsMachinaries.presentValue",
                    // "Machinery.fixedAssetsMachinaries.balance",
                    
                    //"IndividualReferences",
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
                    "IndividualReferences.verifications.ReferenceCheck.customerResponse",

                    "References",
                    "References.verifications",
                    "References.verifications.relationship",
                    "References.verifications.businessName",
                    "References.verifications.referenceFirstName",
                    "References.verifications.mobileNo",
                    "References.verifications.occupation",
                    "References.verifications.address",
                    "References.verifications.ReferenceCheck",
                    "References.verifications.ReferenceCheck.relationship",
                    "References.verifications.ReferenceCheck.opinion",
                    "References.verifications.ReferenceCheck.financialStatus",
                    "References.verifications.ReferenceCheck.knownSince",
                    //"References.verifications.ReferenceCheck.goodsSold",
                    // "References.verifications.ReferenceCheck.goodsBought",
                    // "References.verifications.ReferenceCheck.paymentTerms",
                    // "References.verifications.ReferenceCheck.modeOfPayment",
                    // "References.verifications.ReferenceCheck.outstandingPayable",
                    // "References.verifications.ReferenceCheck.outstandingReceivable",
                    "References.verifications.ReferenceCheck.customerResponse",


                ];

            }

            function getLoanCustomerRelation(pageClass) {
                switch (pageClass) {
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
                "title": "INDIVIDUAL_ENROLLMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    model.UIUDF = {
                        'family_fields': {}
                    };

                    model.enrolmentProcess={};
                    LoanProcess.createNewProcess().subscribe(function(loanProcess) {
                        model.loanProcess=loanProcess;
                    });
                    model.loanProcess.loanAccount.currentStage="Initiation";
                    EnrolmentProcess.createNewProcess()
                    .subscribe(function(enrolmentProcess) {
                        // loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, LoanCustomerRelationTypes.APPLICANT);
                        model.enrolmentProcess=enrolmentProcess;
                    });
                        /* Setting data recieved from Bundle */
                        // model.loanCustomerRelationType =getLoanCustomerRelation(bundlePageObj.pageClass);
                        //  model.pageClass = bundlePageObj.pageClass;
                        model.pageClass = "applicant";
                        // model.currentStage = bundleModel.currentStage;
                        model.currentStage = "Initiation";
                        // model.enrolmentProcess.currentStage = model.currentStage;
           
            // model.enrolmentProcess.currentStage = model.currentStage;
              model.customer = model.enrolmentProcess.customer;
             model.customer.addressPfSameAsIdProof = "NO";
                    // }
                    /* End of setting data recieved from Bundle */
                    // set Age from DateOfBirth
                    if (_.hasIn(model.customer, 'familyMembers') && _.isArray(model.customer.familyMembers)) {
                        if (model.customer.familyMembers.length != 0) {
                            for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                if (model.customer.familyMembers[i].dateOfBirth != null) {
                                    model.customer.familyMembers[i].age = moment().diff(moment(model.customer.familyMembers[i].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        }
                    }
                    /* Setting data for the form */
                    var branchId = SessionStore.getBranchId();
                    if (!model.customer) {

                    }

                    else if (branchId && !model.customer.customerBranchId) {
                        model.customer.customerBranchId = branchId;
                    };
                    /*initialize Self */
                    if ( model.customer.familyMembers.length > 0)
                    if(model.customer.familyMembers[0].relationShip == 'self')
                        model.customer.familyMembers[0].relationShip = 'Self';

                    /* End of setting data for the form */
                    model.UIUDF.family_fields.dependent_family_member = 0;
                    if (model.customer) {
                        _.each(model.customer.familyMembers, function (member) {
                            if (member.incomes && member.incomes.length == 0)
                                model.UIUDF.family_fields.dependent_family_member++;
                        });
                    }
                    model.customer.addressPfSameAsIdProof="NO";
                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                           // "KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "ContactInformation": {
                                    "items": {
                                        // "alternativeMobileNo": {
                                        //     "key": "customer.alternativeMobileNo",
                                        //     "title": "ALTERNATIVE_MOBILE_NO",
                                        //     "type": "number",
                                        //    // "orderNo": 100
                                        // },
                                        "mandal": {
                                            "key": "customer.villageName",
                                            "title": "SUB_DISTRICT",
                                            "type": "string",
                                            "required":true,
                                            "readonly":true,
                                            "orderNo": 130
                                        },
                                        // "mailingMandal": {
                                        //     "key": "customer.udf.userDefinedFieldValues.udf2",
                                        //     "title": "SUB_DISTRICT",
                                        //     "type": "string",
                                        //     "orderNo": 181
                                        // },
                                        "mailingLandmark": {
                                            "key": "customer.landmark",
                                            "title": "LANDMARK",
                                            "type": "string",
                                            "condition": "!model.customer.mailSameAsResidence"
                                            //"orderNo": 181
                                        },
                                        // "collectionArea":{
                                        //     "key":"ContactInformation.collectionArea",
                                        //     "title":"COLLECTION_CENTRE",
                                        //     //"required": true,
                                        //     "type":"select",
                                        //     "orderNo":110
                                        // },
                                        "mailingMobileNo":{
                                            "key":"ContactInformation.mailingMobileNo",
                                            "title":"DESTINATION_PHONE_NO",
                                            "type":"number",
                                            "condition": "!model.customer.mailSameAsResidence"
                                        }
                                    }
                                },
                                "FamilyDetails": {
                                    "items": {
                                        "familyMembers": {
                                            "items": {
                                                // "migrantType":{
                                                //     "key":"customer.familyMembers[].migrantType",
                                                //     "type":"select",
                                                //     "title":"MIGRATION_TYPE",
                                                //     "required":true,
                                                //     // "orderNo":0,
                                                //     "titleMap":
                                                //             {
                                                //             "LCM":"LCM",
                                                //             "SDM":"SDM",
                                                //             "CM":"CM",
                                                //             "RETURNEE":"RETURNEE",
                                                //             "NOTaMigrate":"NOT A MIGRANT"
                                                //             }
                                                // },
                                                "Gender":{
                                                    "key":"customer.familyMembers[].gender",
                                                    "type":"radios",
                                                    "title":"GENDER",
                                                    "orderNo":90,
                                                    "enumCode": "gender",
                                                    "required":true
                                                },
                                                "mobilePhone":{
                                                    "key":"customer.familyMembers[].mobilePhone",
                                                    "title":"MOBILE_PHONE",
                                                    "orderNo":130,
                                                    "type":"number"
                                                },
                                                "Health":{
                                                    "key":"customer.familyMembers[].Health",
                                                    "title":"HEALTH_STATUS",
                                                    "orderNo":200,
                                                    "type":"radios",
                                                    "titleMap":{
                                                        "good":"Good",
                                                        "bad":"bad"
                                                    }
                                                },
                                                "Age":{
                                                    "key":"customer.familyMembers[].age",
                                                    "type":"number",
                                                    "title":"AGE",
                                                   // "orderNo":140,
                                                    "required":true
                                                },
                                                // "incomes":{
                                                //     "items":{
                                                //         "workSector":{
                                                //             "key":"customer.familyMembers[].incomes[].workSector",
                                                //             "title":"WORK_SECTOR",
                                                //             "type": "select",
                                                //             "enumCode": "workSector"
                                                //         },
                                                //         "occupationType":{
                                                //             "key":"customer.familyMembers[].incomes[].occupationType",
                                                //             "title":"OCCUPATION_TYPE",
                                                //             "type": "select",
                                                //             "enumCode": "occupationType"
                                                            
                                                //         },
                                                //         "skillLevel":{
                                                //             "key":"customer.familyMembers[].incomes[].skillLevel",
                                                //             "title":"SKILL_LEVEL",
                                                //             "type": "select",
                                                //             "enumCode": "skillLevel"
                                                            
                                                //         },
                                                //         "avarageTimeSpend":{
                                                //             "key":"customer.familyMembers[].incomes[].avarageTimeSpend",
                                                //             "title":"AVARAGE_TIME_SPENT",
                                                //             "type": "number",
                                                           
                                                           
                                                //         },
                                                //         "avarageReturn":{
                                                //             "key":"customer.familyMembers[].incomes[].avarageReturn",
                                                //             "title":"AVARAGE_RETURN",
                                                //             "type": "numeber",
                                                //             "titleMap":{
                                                //                 "lessThanMonth":"Less Than Month",
                                                //                 "biMonthly":"Bi Monthly",
                                                //                 "etc":"etc"
                                                //             }
                                                           
                                                            
                                                //         },
                                                //         "incomeFrom":{
                                                //             "key":"customer.familyMembers[].incomes[].incomeFrom",
                                                //             "title":"INCOME_FROM",
                                                //             "type": "select",
                                                //             "titleMap":{
                                                //                 "sourceIncome":"Source Income",
                                                //                 "DistanationIncome":"Destination Income"
                                                //             }
                                                //         }
                                                        
                                                //     }
                                                // }
                                            }
                                        }
                                    }
                                },
                                "IndividualFinancials":{
                                    "items":{
                                        "expenditures":{
                                            "items":{
                                                "from":{
                                                    "key":"customer.expenditures[].expenseType",
                                                    "title":"EXPENSE_FROM",
                                                    "type":"select",
                                                    "enumCode":"expense_type"
                                                },
                                            }
                                        },
                                    }
                                },
                                "KYC": {
                                    "items": {
                                        "firstName": {
                                            "key": "customer.firstName",
                                            "title": "CUSTOMER_NAME",
                                            "type": "string",
                                            "orderNo": 1,
                                            //     "condition": "model.currentStage=='ApplicationReview' || model.currentStage=='ScreeningReview'",

                                        },
                                        "identityProofBackside":{
                                            "key":"customer.identityProofReverseImageId",
                                            "type": "file",
                                            "fileType": "application/pdf",
                                            "using": "scanner",
                                            "title":"IDENTITY_PROOF_BACKSIDE",
                                           // "orderNo":70
                                        },
                                        "addressProofSameAsIdProof":{
                                            "condition":"model.customer.identityProof!='PAN Card'",
                                            "key":"customer.addressPfSameAsIdProof",
                                            "title":"ADDRESS_PROOF_SAME_AS_IDPROOF",
                                            "type":"radios",
                                            "titleMap":{
                                                "YES":"Yes",
                                                "NO":"No"
                                            },
                                            "orderNo":60,
                                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                                        if(model.customer.addressPfSameAsIdProof==='YES'){
                                                            model.customer.addressProof=model.customer.identityProof,
                                                            model.customer.addressProofNo=model.customer.identityProofNo,
                                                            model.customer.addressProofImageId=model.customer.identityProofImageId,
                                                            model.customer.addressProofReverseImageId=model.customer.identityProofReverseImageId,
                                                            model.customer.addressProofIssueDate=model.customer.idProofIssueDate,
                                                            model.customer.addressProofValidUptoDate=model.customer.idProofValidUptoDate
                                                        }
                                                    }    
                                        },
                                        "addressProofBackside":{
                                            "key":"customer.addressProofReverseImageId",
                                            "title":"ADRESS_PROOF_BACKSIDE",
                                            "fileType":"application/pdf",
                                            "using":"scanner",
                                            "type":"file",
                                            "condition":"model.customer.addressPfSameAsIdProof=='NO'|| model.customer.identityProof=='PAN Card'",
                                            "orderNo":73
                                        },
                                    }

                                },
                                "FamilyDetails": {
                                    "type": "box",
                                    "title": "MIGRANT_DETAILS",
                                    "items": {
                                        "familyMembers": {
                                            key: "customer.familyMembers",
                                            type: "array",
                                            startEmpty: true,
                                            items: {
                                                "relationShip": {
                                                    key: "customer.familyMembers[].relationShip",
                                                    type: "select",
                                                    "orderNo": 1,
                                                    onChange: function (modelValue, form, model, formCtrl, event) {
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
                                                                    (model.customer.gender == 'FEMALE' ? 'FEMALE' : model.customer.gender);
                                                            model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                                            if (model.customer.spouseDateOfBirth)
                                                                model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                                            if (model.customer.maritalStatus)
                                                                model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                                        }
                                                    },
                                                    title: "T_RELATIONSHIP"
                                                },
                                                // "customerId": {
                                                //     "orderNo": 2,
                                                //     key: "customer.familyMembers[].customerId",
                                                //     title:"MIGRANT_ID",
                                                //     condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                                //     type: "lov",
                                                //     "inputMap": {
                                                //         "firstName": {
                                                //             "key": "customer.firstName",
                                                //             "title": "CUSTOMER_NAME"
                                                //         },
                                                //         "branchName": {
                                                //             "key": "customer.kgfsName",
                                                //             "type": "select"
                                                //         },
                                                //         "centreId": {
                                                //             "key": "customer.centreId",
                                                //             "type": "select"
                                                //         }
                                                //     },
                                                //     "outputMap": {
                                                //         "id": "customer.familyMembers[arrayIndex].customerId",
                                                //         "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"
                                                //     },
                                                //     "searchHelper": formHelper,
                                                //     "search": function (inputModel, form) {
                                                //         $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                                //         var promise = Enrollment.search({
                                                //             'branchName': SessionStore.getBranch() || inputModel.branchName,
                                                //             'firstName': inputModel.first_name,
                                                //             'centreId': inputModel.centreId,
                                                //         }).$promise;
                                                //         return promise;
                                                //     },
                                                //     onSelect: function(valueObj, model, context){
                                                //         // PageHelper.showProgress('customer-load', 'Loading customer...');
            
                                                //         Enrollment.getCustomerById({id: valueObj.id})
                                                //             .$promise
                                                //             .then(function(res){
                                                               
                                                //                 // PageHelper.showProgress("customer-load", "Done..", 5000);
                                                //         model.customer.familyMembers[context.arrayIndex].gender=res.gender;
                                                //          model.customer.familyMembers[context.arrayIndex].dateOfBirth=res.dateOfBirth;
                                                //          if (model.customer.familyMembers[context.arrayIndex].dateOfBirth) {
                                                //           model.customer.familyMembers[context.arrayIndex].age=moment().diff(moment(model.customer.familyMembers[model.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                                //          }
                                                //         //  model.customer.familyMembers[form.arrayIndex].educationStatus=res.customer.id;
                                                //          model.customer.familyMembers[context.arrayIndex].maritalStatus=res.maritalStatus;
                                                //          model.customer.familyMembers[context.arrayIndex].mobilePhone=res.mobilePhone;
                                                               
                                                //             }, function(httpRes){
                                                //                 // PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                                //         })
                                                //     },
                                                //     getListDisplayItem: function (data, index) {
                                                //         return [
                                                //             [data.firstName, data.fatherFirstName].join(' '),
                                                //             data.id
                                                //         ];
                                                //     }
                                                // },
                                                "familyMemberFirstName": {
                                                    "orderNo": 3,
                                                    key: "customer.familyMembers[].familyMemberFirstName",
                                                    condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                                    title: "FAMILY_MEMBER_FULL_NAME"
                                                },
                                                "gender": {
                                                    "orderNo": 4,
                                                    key: "customer.familyMembers[].gender",
                                                    condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                                    type: "radios",
                                                    title: "T_GENDER"
                                                },
                                                "dateOfBirth": {
                                                    "orderNo": 5,
                                                    key: "customer.familyMembers[].dateOfBirth",
                                                    condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                                    type: "date",
                                                    title: "T_DATEOFBIRTH",
                                                    "onChange": function (modelValue, form, model, formCtrl, event) {
                                                        if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                                            model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                                        }
                                                    }
                                                },
                                                "age": {
                                                    "orderNo": 6,
                                                    key: "customer.familyMembers[].age",
                                                    condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                                    title: "AGE",
                                                    type: "number",
                                                    "onChange": function (modelValue, form, model, formCtrl, event) {
                                                        if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                                            if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                                                model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                                            } else {
                                                                model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                                            }
                                                        }
                                                    }
                                                },
                                                "educationStatus": {
                                                    "orderNo": 7,
                                                    key: "customer.familyMembers[].educationStatus",
                                                    type: "select",
                                                    title: "T_EDUCATION_STATUS"
                                                },
                                                "maritalStatus": {
                                                    "orderNo": 8,
                                                    key: "customer.familyMembers[].maritalStatus",
                                                    condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                                    type: "select",
                                                    title: "T_MARITAL_STATUS"
                                                },
                                                "mobilePhone": {
                                                    "orderNo": 9,
                                                    key: "customer.familyMembers[].mobilePhone",
                                                    condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                                },
                                                "healthStatus": {
                                                    "orderNo": 10,
                                                    key: "customer.familyMembers[].healthStatus",
                                                    type: "radios",
                                                    titleMap: {
                                                        "GOOD": "GOOD",
                                                        "BAD": "BAD"
                                                    },

                                                },
                                                "migrantType":{
                                                    "key":"customer.familyMembers[].migrantType",
                                                    "type":"select",
                                                    "title":"MIGRATION_TYPE",
                                                    "required":true,
                                                     "orderNo":0,
                                                    "titleMap":
                                                            {
                                                            "LCM":"LCM",
                                                            "SDM":"SDM",
                                                            "CM":"CM",
                                                            "RETURNEE":"RETURNEE",
                                                            "NOTaMigrate":"NOT A MIGRANT"
                                                            }
                                                },
                                                "incomes": {
                                                    "orderNo": 11,
                                                    key: "customer.familyMembers[].incomes",
                                                    type: "array",
                                                    startEmpty: true,
                                                    items: {
                                                        "incomeSource": {
                                                            key: "customer.familyMembers[].incomes[].incomeSource",
                                                            type: "select",
                                                            title:"OCCUPATION",
                                                            required: false
                                                        },
                                                        "incomeEarned": {
                                                            key: "customer.familyMembers[].incomes[].incomeEarned",
                                                            title:"INCOME_AMOUNT"
                                                        },
                                                        "incomeType": {
                                                            "key": "customer.familyMembers[].incomes[].incomeType",
                                                            "title": "INCOME_TYPE",
                                                        },
                                                        "frequency": {
                                                            key: "customer.familyMembers[].incomes[].frequency",
                                                            type: "select",
                                                            "enumCode":"income_frequency"
                                                        },
                                                        "workSector":{
                                                            "key":"customer.familyMembers[].incomes[].workSector",
                                                            "title":"WORK_SECTOR",
                                                            "type":"select",
                                                            "enumCode":"work_sector",
                                                            "required":true
                                                        },
                                                        "occupationType":{
                                                            "key":"customer.familyMembers[].incomes[].occupationType",
                                                            "title":"OCCUPATION_TYPE",
                                                            "type":"select",
                                                            "enumCode":"occupation_type",
                                                            "required":true
                                                            
                                                        },
                                                        "skillLevel":{
                                                            "key":"customer.familyMembers[].incomes[].skillLevel",
                                                            "title":"SKILL_LEVEL",
                                                            "type":"select",
                                                            "titleMap":{
                                                                "skilled":"SKILLED",
                                                                "unskilled":"UNSKILLED",
                                                                "semi_skilled":"SEMI_SKILLED"
                                                            },
                                                            "required":true
                                                            
                                                        },
                                                        "avarageTimeSpend":{
                                                            "key":"customer.familyMembers[].incomes[].averageTimeSpent",
                                                            "title":"AVERAGE_TIME_SPENT",
                                                            "type":"text",
                                                            "required":true,
                                                            "schema": {
                                                                "pattern": "^[0-9]*$",
                                                                "type": ["integer", "string"]
                                                            }
                                                        },
                                                        "avarageReturn":{
                                                            "key":"customer.familyMembers[].incomes[].averageReturn",
                                                            "title":"AVERAGE_RETURN",
                                                            "type":"select",
                                                            "required":true,
                                                            "enumCode":"average_return"

                                                            
                                                        },
                                                        "incomeFrom":{
                                                            "key":"customer.familyMembers[].incomes[].incomeType",
                                                            "title":"INCOME_TYPE",
                                                            "type":"select",
                                                            "required":true,
                                                            "enumCode":"income_type" 
                                                        },
                                                        "noOfDaysWorkedInMonth":{
                                                            "key":"customer.familyMembers[].incomes[].noOfDaysWorkedInMonth",
                                                            "title":"NO_OF_DAYS_WORKED_IN_MONTH",
                                                            "type":"number",
                                                            "required":true
                                                        },
                                                    }

                                                },
                                               
                                            }
                                        }
                                    }
                                },
                                // "FamilyDetails": {
                                //     "items": {
                                //         "familyMembers": {
                                //             "items": {
                                //                 "relationShip1": {
                                //                     "key": "customer.familyMembers[].relationShip",
                                //                     "type": "select",
                                //                     "title": "T_RELATIONSHIP"
                                //                 }
                                //             }
                                //         }
                                //     }
                                // },
                                "HouseVerification": {
                                    "items": {
                                        "rentLeaseStatus": {
                                            "type": "select",
                                            "key": "customer.udf.userDefinedFieldValues.udf3",
                                            "title": "RENT_LEASE_STATUS"
                                        },
                                        "rentLeaseAgreement": {
                                            "type": "date",
                                            "key": "customer.udf.userDefinedDateFieldValues.udfDate1",
                                            "title": "RENT_LEASE_AGREEMENT_VALID_TILL"
                                        },
                                        "houseStatus":{
                                            "title":"HOUSE_STATUS",
                                            "key":"customer.houseStatus",
                                            "type":"select",
                                            "enumCode":"house_verification"
                                        },
                                        "noOfRooms":{
                                            "key":"customer.noOfRooms",
                                            "type":"number",
                                            "title":"NO_OF_ROOMS"
                                        }
                                    }
                                },
                                "Liabilities":{
                                    "items":{
                                        "liabilities":{
                                            "items":{
                                                "mortage": {
                                                    "key": "customer.liabilities[].udf1",
                                                    "title": "MORTAGE",
                                                    "condition": "model.customer.liabilities[arrayIndex].loanType.toLowerCase() === 'secured'",
                                                    "orderNo": 10
                                                },
                                                "mortageAmount": {
                                                    "key": "customer.liabilities[].mortageAmount",
                                                    "title": "MORTAGE_AMOUNT",
                                                    "orderNo": 10,
                                                    "condition": "model.customer.liabilities[arrayIndex].loanType.toLowerCase() === 'secured'",
                                                },
                                                "liabilityLoanPurpose":{
                                                    "orderNo": 11
                                                },
                                                "amountPaid":{
                                                    "key":"customer.liabilities[].principalExpense",
                                                    "title":"AMOUNT_PAID_PRINCIPAL",
                                                   // "orderNo":1
                                                },
                                                "amountPaidInterest":{
                                                    "key":"customer.liabilities[].interestExpense",
                                                    "title":"AMOUNT_PAID_INTEREST",
                                                    //"orderNo":2
                                                },
                                                "masonValuation":{
                                                    "key":"customer.liabilities[].udf2",
                                                    "title":"MASON_VALUATION_DOCUMENT",
                                                    "type":"file",
                                                    "fileType": "image/*",
                                                   // "orderNo":4
                                                }
                                               
                                            }
                                        }
                                    }

                                },
                                "BankAccounts": {
                                    "title":"SAVING_DETAILS",
                                    "items": {
                                        "customerBankAccounts": {
                                            "items": {
                                                "bankStatements": {
                                                    "items": {
                                                        "cashDeposits": {
                                                            "key": "customer.customerBankAccounts[].bankStatements[].cashDeposits",
                                                            "title": "Cash Deposits",
                                                            type: "amount",
                                                            "orderNo": 115,
                                                            "onChange": function (modelValue, form, model, formCtrl, event) {
                                                                var index = form.key[2];
                                                                var indexBank = form.key[4];
                                                                modelValue = modelValue == null ? 0 : modelValue;
                                                                var nonCashDeposits = 0;
                                                                if (modelValue != null) {
                                                                    nonCashDeposits = (model.customer.customerBankAccounts[index].bankStatements[indexBank].nonCashDeposits != null) ? model.customer.customerBankAccounts[index].bankStatements[indexBank].nonCashDeposits : 0;

                                                                    model.customer.customerBankAccounts[index].bankStatements[indexBank].totalDeposits = nonCashDeposits + modelValue;
                                                                }
                                                            }
                                                        },
                                                        "nonCashDeposits": {
                                                            "key": "customer.customerBankAccounts[].bankStatements[].nonCashDeposits",
                                                            "title": "Non-cash Deposits",
                                                            type: "amount",
                                                            "orderNo": 117,
                                                            "onChange": function (modelValue, form, model, formCtrl, event) {
                                                                var index = form.key[2];
                                                                var indexBank = form.key[4];
                                                                modelValue = modelValue == null ? 0 : modelValue;
                                                                var cashDeposits = 0;
                                                                if (modelValue != null) {
                                                                    cashDeposits = (model.customer.customerBankAccounts[index].bankStatements[indexBank].cashDeposits != null) ? model.customer.customerBankAccounts[index].bankStatements[indexBank].cashDeposits : 0;

                                                                    model.customer.customerBankAccounts[index].bankStatements[indexBank].totalDeposits = cashDeposits + modelValue;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                "References": {
                                    "type": "box",
                                    "title": "REFERENCES",
                                    "orderNo": 100,
                                    "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                                    "items": {
                                        "verifications": {
                                            key: "customer.verifications",
                                            title: "REFERENCES",
                                            type: "array",
                                            items: {
                                                // "relationship" : {
                                                //     key:"customer.verifications[].relationship",
                                                //     title:"REFERENCE_TYPE",
                                                //     type:"select",
                                                //     required:"true",
                                                //     enumCode: "business_reference_type"
                                                // },
                                                // "businessName" : {
                                                //     key:"customer.verifications[].businessName",
                                                //     title:"BUSINESS_NAME",
                                                //     type:"string"
                                                // },
                                                "referenceFirstName": {
                                                    key: "customer.verifications[].referenceFirstName",
                                                    title: "CONTACT_PERSON_NAME",
                                                    required: "true",
                                                    type: "string"
                                                },
                                                "mobileNo": {
                                                    key: "customer.verifications[].mobileNo",
                                                    title: "CONTACT_NUMBER",
                                                    type: "string",
                                                    required: "true",
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
                                                "occupation": {
                                                    key: "customer.verifications[].occupation",
                                                    title: "OCCUPATION",
                                                    type: "select",
                                                    "enumCode": "occupation",
                                                },
                                                "address": {
                                                    key: "customer.verifications[].address",
                                                    type: "textarea"
                                                },
                                                "ReferenceCheck": {
                                                    type: "fieldset",
                                                    title: "REFERENCE_CHECK",
                                                    //"condition": "model.currentStage=='FieldAppraisal'",
                                                    items: {
                                                        /*,
                                                        {
                                                            key:"customer.verifications[].remarks",
                                                            title:"REMARKS",
                                                        },*/
                                                        "knownSince": {
                                                            key: "customer.verifications[].knownSince",
                                                            required: true
                                                        },
                                                        "relationship": {
                                                            key: "customer.verifications[].relationship",
                                                            title: "REFERENCE_TYPE1",
                                                            type: "select",
                                                            required: true,
                                                            titleMap: {
                                                                "Neighbour": "Neighbour",
                                                                "Relative/friend": "Relative/friend"
                                                            }
                                                        },
                                                        "opinion": {
                                                            key: "customer.verifications[].opinion"
                                                        },
                                                        "financialStatus": {
                                                            key: "customer.verifications[].financialStatus"
                                                        },
                                                        // "goodsSold" : {
                                                        //     key:"customer.verifications[].goodsSold",
                                                        //     "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                                        // },
                                                        // "goodsBought" : {
                                                        //     key:"customer.verifications[].goodsBought",
                                                        //     "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                                        // },
                                                        // "paymentTerms" : {
                                                        //     key:"customer.verifications[].paymentTerms",
                                                        //     type:"select",
                                                        //     "title":"payment_tarms",
                                                        //     enumCode: "payment_terms"
                                                        // },
                                                        // "modeOfPayment" : {
                                                        //     key:"customer.verifications[].modeOfPayment",
                                                        //     type:"select",
                                                        //     enumCode: "payment_mode"
                                                        // },
                                                        // "outstandingPayable" : {
                                                        //     key:"customer.verifications[].outstandingPayable",
                                                        //     "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                                        // },
                                                        // "outstandingReceivable" : {
                                                        //     key:"customer.verifications[].outstandingReceivable",
                                                        //     "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                                        // },
                                                        
                                                        "customerResponse": {
                                                            key: "customer.verifications[].customerResponse",
                                                            title: "CUSTOMER_RESPONSE",
                                                            type: "select",
                                                            required: true,
                                                            titleMap: [{
                                                                value: "positive",
                                                                name: "positive"
                                                            }, {
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
                                "IndividualInformation": {
                                    "items": {
                                        "centreId1": {
                                            key: "customer.centreId",
                                            type: "select",
                                            readonly: false,
                                            title: "CENTRE_NAME",
                                            filter: {
                                                "parentCode": "branch_id"
                                            },
                                            parentEnumCode: "branch_id",
                                            orderNo: 12,
                                            parentValueExpr: "model.customer.customerBranchId",
                                        }
                                        // "groupName": {
                                        //     "key": "loanAccount.groupName",
                                        //     "title": "GROUP_NAME",
                                        //     "type": "string",
                                        //     "orderNo": 50
                                        // },
                                        // "groupID": {
                                        //     "key": "loanAccount.jlgGroupId ",
                                        //     "title": "GROUP_ID",
                                        //     "type": "string",
                                        //     "orderNo": 40,
                                        // }
                                    }
                                },
                                "PhysicalAssets":{
                                    "items":{
                                        "financialAssets":{
                                            "title":"FINANCIAL_ASSET",
                                            "items":{
                                                "installmentAmount":{
                                                    "key":"customer.financialAssets.amountInPaisa",
                                                    "title":"INSTALLMENT_AMOUNT",
                                                    "required":true
                                                    },
                                                    "balance":{
                                                        "key":"customer.financialAssets.balance",
                                                        "title":"BALANCE_IN_THE_ACCOUNT",
                                                        "required":true
                                                    }
                                            }


                                        }
                                             
                                    }
                                    
                                }
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
                                    "condition": "(model.customer.id && model.currentStage!=='ScreeningReview')",
                                    "orderNo": 2800,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "SUBMIT",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };

                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function (repo) {
                            console.log(model.pageClass);
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
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
                            .then(function () {
                                if (obj.applicantCustomerId) {
                                    return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                } else {
                                    return null;
                                }
                            })
                            .then(function (enrolmentProcess) {
                                if (enrolmentProcess != null) {
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;
                                    model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
                                    BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                }
                                if (obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
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
                                //model.customer.street = obj.addressLine2;
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
                                        model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                                    }
                                }
                            })








                    },
                    "origination-stage": function (bundleModel, model, obj) {
                        model.currentStage = obj
                    },
                    "new-applicant": function(bundleModel,model,obj){
                        if(model.customer.familyMembers){
                            for (i=0;i<model.customer.familyMembers.length;i++){
                                if (model.customer.familyMembers[i].dateOfBirth)
                                    model.customer.familyMembers[i].age = moment().diff(moment(model.customer.familyMembers[i].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    "new-co-applicant": function(bundleModel,model,obj){
                        if(model.customer.familyMembers){
                            for (i=0;i<model.customer.familyMembers.length;i++){
                                if (model.customer.familyMembers[i].dateOfBirth)
                                    model.customer.familyMembers[i].age = moment().diff(moment(model.customer.familyMembers[i].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    "new-guarantor": function(bundleModel,model,obj){
                        if(model.customer.familyMembers){
                            for (i=0;i<model.customer.familyMembers.length;i++){
                                if (model.customer.familyMembers[i].dateOfBirth)
                                    model.customer.familyMembers[i].age = moment().diff(moment(model.customer.familyMembers[i].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
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
                        if (PageHelper.isFormInvalid(formCtrl)) {
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
                                model.loanProcess.refreshRelatedCustomers();
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
                    proceed: function (model, form, formName) {
                    
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
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
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, { customer: model.customer });

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                            });
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                model.loanProcess.refreshRelatedCustomers();
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, { customer: model.customer });

                                model.enrolmentProcess.proceed()
                                    .subscribe(function (enrolmentProcess) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    }, function (err) {
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
