define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
    return {
        pageUID: "customer.EnterpriseEnrolment2new",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository", "Dedupe"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository, Dedupe) {

            var validateRequest = function(req){
                if (req.customer && req.customer.customerBankAccounts) {
                    for (var i=0; i<req.customer.customerBankAccounts.length; i++){
                        var bankAccount = req.customer.customerBankAccounts[i];
                        if (bankAccount.accountNumber!=bankAccount.confirmedAccountNumber){
                            PageHelper.showProgress('validate-error', 'Bank Accounts: Account Number doesnt match with Confirmed Account Number', 5000);
                            return false;
                        }
                    }
                }
                return true;
            }

            var getIncludes = function (model) {
                return [
                    "EnterpriseInformation",
                    "EnterpriseInformation.customerId",
                    "EnterpriseInformation.customerBranchId",
                    "EnterpriseInformation.entityId",
                    "EnterpriseInformation.urnNo",
                    "EnterpriseInformation.centreId",
                    "EnterpriseInformation.spokeId",
                    "EnterpriseInformation.oldCustomerId",
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
                    "ContactInformation.landmark",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.distanceFromBranch",
                    "ContactInformation.businessInPresentAreaSince",
                    "ContactInformation.businessInCurrentAddressSince",

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
                    "BankAccounts.customerBankAccounts.limit",
                    "BankAccounts.customerBankAccounts.bankStatementDocId",
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",

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
                    "Liabilities.liabilities.proofDocuments",

                    "EnterpriseFinancials",
                    "EnterpriseFinancials.monthlyTurnover",
                    "EnterpriseFinancials.monthlyBusinessExpenses",
                    "EnterpriseFinancials.avgMonthlyNetIncome",

                    "EmployeeDetails",
                    "EmployeeDetails.noOfFemaleEmployees",
                    "EmployeeDetails.noOfMaleEmployees",
                    "EmployeeDetails.avgMonthlySalary",

                    "ProxyIndicators",
                    "ProxyIndicators.properAndMatchingSignboard",
                    "ProxyIndicators.bribeOffered",
                    "ProxyIndicators.shopOrganized",
                    "ProxyIndicators.isIndustrialArea",
                    "ProxyIndicators.customerAttitudeToKinara",
                    "ProxyIndicators.bookKeepingQuality",
                    "ProxyIndicators.challengingChequeBounce",
                    "ProxyIndicators.allMachinesAreOperational",
                    "ProxyIndicators.employeeSatisfaction",
                    "ProxyIndicators.politicalOrPoliceConnections",
                    "ProxyIndicators.multipleProducts",
                    "ProxyIndicators.multipleBuyers",
                    "ProxyIndicators.seasonalBusiness",
                    "ProxyIndicators.incomeStability",
                    "ProxyIndicators.utilisationOfBusinessPremises",
                    "ProxyIndicators.approachForTheBusinessPremises",
                    "ProxyIndicators.safetyMeasuresForEmployees",
                    "ProxyIndicators.childLabours",
                    "ProxyIndicators.isBusinessEffectingTheEnvironment",
                    "ProxyIndicators.stockMaterialManagement",
                    "ProxyIndicators.customerWalkinToBusiness",
                    "ProxyIndicators.businessSignboardImage",

                    "CommercialCBCheck",
                    "CommercialCBCheck.enterpriseBureauDetails",
                    "CommercialCBCheck.enterpriseBureauDetails.bureau",
                    "CommercialCBCheck.enterpriseBureauDetails.fileId",
                    "CommercialCBCheck.enterpriseBureauDetails.doubtful",
                    "CommercialCBCheck.enterpriseBureauDetails.loss",
                    "CommercialCBCheck.enterpriseBureauDetails.specialMentionAccount",
                    "CommercialCBCheck.enterpriseBureauDetails.standard",
                    "CommercialCBCheck.enterpriseBureauDetails.subStandard",

                    "BuyerDetails",
                    "BuyerDetails.buyerDetails",
                    "BuyerDetails.buyerDetails.buyerName",
                    "BuyerDetails.buyerDetails.customerSince",
                    "BuyerDetails.buyerDetails.paymentDate",
                    "BuyerDetails.buyerDetails.paymentFrequency",
                    "BuyerDetails.buyerDetails.paymentTerms",
                    "BuyerDetails.buyerDetails.product",
                    "BuyerDetails.buyerDetails.sector",
                    "BuyerDetails.buyerDetails.sector",
                    "BuyerDetails.buyerDetails.subSector",
                    "BuyerDetails.buyerDetails.receivablesOutstanding",

                    "SuppliersDeatils",
                    "SuppliersDeatils.supplierDetails",
                    "SuppliersDeatils.supplierDetails.supplierName",
                    "SuppliersDeatils.supplierDetails.supplierType",
                    "SuppliersDeatils.supplierDetails.paymentTerms",
                    "SuppliersDeatils.supplierDetails.amount",

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

                    "Machinery",
                    "Machinery.fixedAssetsMachinaries",
                    "Machinery.fixedAssetsMachinaries.machineDescription",
                    "Machinery.fixedAssetsMachinaries.manufacturerName",
                    "Machinery.fixedAssetsMachinaries.machineType",
                    "Machinery.fixedAssetsMachinaries.machineModel",
                    "Machinery.fixedAssetsMachinaries.serialNumber",
                    "Machinery.fixedAssetsMachinaries.purchasePrice",
                    "Machinery.fixedAssetsMachinaries.machinePurchasedYear",
                    "Machinery.fixedAssetsMachinaries.presentValue",
                    "Machinery.fixedAssetsMachinaries.isTheMachineNew",
                    "Machinery.fixedAssetsMachinaries.fundingSource",
                    "Machinery.fixedAssetsMachinaries.isTheMachineHypothecated",
                    "Machinery.fixedAssetsMachinaries.hypothecatedTo",
                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs",
                    "Machinery.fixedAssetsMachinaries.machinePermanentlyFixedToBuilding",
                    "Machinery.fixedAssetsMachinaries.machineBillsDocId",
                    "Machinery.fixedAssetsMachinaries.machineImage",

                    "EnterpriseReferences",
                    "EnterpriseReferences.verifications",
                    "EnterpriseReferences.verifications.relationship",
                    "EnterpriseReferences.verifications.businessName",
                    "EnterpriseReferences.verifications.referenceFirstName",
                    "EnterpriseReferences.verifications.mobileNo",
                    "EnterpriseReferences.verifications.address",
                    "EnterpriseReferences.verifications.knownSince",
                    "EnterpriseReferences.verifications.goodsSold",
                    "EnterpriseReferences.verifications.goodsBought",
                    "EnterpriseReferences.verifications.paymentTerms",
                    "EnterpriseReferences.verifications.modeOfPayment",
                    "EnterpriseReferences.verifications.outstandingPayable",
                    "EnterpriseReferences.verifications.outstandingReceivable",
                    "EnterpriseReferences.verifications.customerResponse"
                ];
            }

            var configFile = function() {
                return {
                        "currentStage": {
                            "Screening": {
                                "excludes": [
                                    "ProxyIndicators",
                                    "BuyerDetails",
                                    "SuppliersDeatils",
                                    "EnterpriseAssets",
                                    "Machinery",
                                    "EnterpriseReferences",
                                    "CommercialCBCheck"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES"
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 5
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 6
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    }
                                }
                            },
                            "ScreeningReview": {
                                "excludes": [
                                    "ProxyIndicators",
                                    "BuyerDetails",
                                    "SuppliersDeatils",
                                    "EnterpriseAssets",
                                    "Machinery",
                                    "EnterpriseReferences"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1,
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 5,
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 6,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 7
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo"
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId"
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 || model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "BankAccounts.customerBankAccounts.accountNumber" : {
                                       type: "number" 
                                    }
                                }
                            },
                            "Application": {
                                "excludes": [
                                    "ProxyIndicators",
                                    "EnterpriseAssets",
                                    "EnterpriseReferences.verifications.knownSince",
                                    "EnterpriseReferences.verifications.goodsSold",
                                    "EnterpriseReferences.verifications.goodsBought",
                                    "EnterpriseReferences.verifications.paymentTerms",
                                    "EnterpriseReferences.verifications.modeOfPayment",
                                    "EnterpriseReferences.verifications.outstandingPayable",
                                    "EnterpriseReferences.verifications.outstandingReceivable",
                                    "EnterpriseReferences.verifications.customerResponse"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES"
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8
                                    },
                                    "Machinery": {
                                        "orderNo": 9
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 10
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    }
                                }
                            },
                            "FieldAppraisal": {
                                "excludes": [
                                    "EnterpriseAssets"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES"
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8
                                    },
                                    "Machinery": {
                                        "orderNo": 9
                                    },
                                    "ProxyIndicators": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 11
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 12,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    }
                                }
                            },
                            "FieldAppraisalReview": {
                                "excludes": [
                                    "EnterpriseAssets"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1,
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5,
                                        "readonly": true
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7,
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8,
                                        "readonly": true
                                    },
                                    "Machinery": {
                                        "orderNo": 9,
                                        "readonly": true
                                    },
                                    "ProxyIndicators": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 12,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    }
                                }
                            },
                            "ZonalRiskReview": {
                                "excludes": [
                                    "EnterpriseAssets"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1,
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5,
                                        "readonly": true
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7,
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8,
                                        "readonly": true
                                    },
                                    "Machinery": {
                                        "orderNo": 9,
                                        "readonly": true
                                    },
                                    "ProxyIndicators": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 12,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    }
                                }
                            },
                            "CentralRiskReview": {
                                "excludes": [
                                    "EnterpriseAssets"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1,
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5,
                                        "readonly": true
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7,
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8,
                                        "readonly": true
                                    },
                                    "Machinery": {
                                        "orderNo": 9,
                                        "readonly": true
                                    },
                                    "ProxyIndicators": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 12,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    }
                                }
                            },
                            "CreditCommitteeReview": {
                                "excludes": [
                                    "EnterpriseAssets"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1,
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5,
                                        "readonly": true
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7,
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8,
                                        "readonly": true
                                    },
                                    "Machinery": {
                                        "orderNo": 9,
                                        "readonly": true
                                    },
                                    "ProxyIndicators": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 12,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    }
                                }
                            },
                            "Sanction": {
                                "excludes": [
                                    "EnterpriseAssets"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1,
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5,
                                        "readonly": true
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7,
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8,
                                        "readonly": true
                                    },
                                    "Machinery": {
                                        "orderNo": 9,
                                        "readonly": true
                                    },
                                    "ProxyIndicators": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 12,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    }
                                }
                            },
                            "Rejected": {
                                "excludes": [
                                    "EnterpriseAssets"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 1,
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 2,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 3,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 4,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 5,
                                        "readonly": true
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 6,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 7,
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 8,
                                        "readonly": true
                                    },
                                    "Machinery": {
                                        "orderNo": 9,
                                        "readonly": true
                                    },
                                    "ProxyIndicators": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 12,
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "condition": "model.customer.id",
                                        "resolver": "EnterpriseCustomerIDLOVConfiguration"
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
                                        "condition": "model.customer.oldCustomerId",
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.referredBy": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.referredName": {
                                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'"
                                    },
                                    "EnterpriseInformation.companyOperatingSince": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.companyEmailId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessHistory": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.noOfPartners": {
                                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                                    },
                                    "EnterpriseInformation.partnershipDissolvedDate": {
                                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'"
                                    },
                                    "EnterpriseInformation.companyRegistered": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations": {
                                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseRegistrations.documentId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessActivity": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSector": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.businessSubsector": {
                                        "required": true,
                                        "resolver": "BusinessSubsectorLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                        "resolver": "LinkedToCustomeridLOVConfiguration"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
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
                                    "ContactInformation.businessInPresentAreaSince": {
                                        "required": true
                                    },
                                    "ContactInformation.businessInCurrentAddressSince": {
                                        "required": true
                                    },
                                    "ContactInformation.pincode": {
                                        "required": true,
                                        "resolver": "PincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.monthlyTurnover": {
                                        "required": true
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName": {
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications.relationship": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineDescription": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.machineType": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.purchasePrice": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.presentValue": {
                                        "required": true
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedTo": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                    },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
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
                    var branch = SessionStore.getBranch();
                    var centres = SessionStore.getCentres();
                    var centreName = [];
                    var allowedCentres = [];
                    if (centres && centres.length) {
                        for (var i = 0; i < centres.length; i++) {
                            centreName.push(centres[i].id);
                            allowedCentres.push(centres[i]);
                        }
                    }

                    var self = this;
                    $q.when()
                    .then(function(){
                        /* return a promise / a customer object */
                        if (_.hasIn(model, 'loanRelation')){
                            var p1 = Enrollment.getCustomerById({id: model.loanRelation.customerId}).$promise;
                            p1.then(function(res){
                                model.customer = res;
                            
                                if (model.customer.stockMaterialManagement) {
                                model.proxyIndicatorsHasValue = true;
                                $log.debug('PROXY_INDICATORS already has value');
                                }

                                bundleModel.business = model.customer;

                                 if(model.customer.enterprise.isGSTAvailable == null || model.customer.enterprise.isGSTAvailable == undefined){
                                             model.customer.enterprise.isGSTAvailable = "No";
                                 }
                                 if(model.customer.enterprise.isGSTAvailable == "Yes"){
                                     model.customer.enterprise.companyRegistered = "YES";
                                 }

                                if(model.customer.enterpriseCustomerRelations)
                                {
                                    var linkedIds = [];
                                    for(i=0;i<model.customer.enterpriseCustomerRelations.length;i++) {
                                        linkedIds.push(model.customer.enterpriseCustomerRelations[i].linkedToCustomerId);
                                    };

                                    Queries.getCustomerBasicDetails({
                                        "ids": linkedIds
                                    }).then(function(result) {
                                        if (result && result.ids) {
                                            for (var i = 0; i < model.customer.enterpriseCustomerRelations.length; i++) {
                                                var cust = result.ids[model.customer.enterpriseCustomerRelations[i].linkedToCustomerId];
                                                if (cust) {
                                                    model.customer.enterpriseCustomerRelations[i].linkedToCustomerName = cust.first_name;
                                                }
                                            }
                                        }
                                    });
                                }
                                var actualCentre = $filter('filter')(allowedCentres, {id: model.customer.centreId}, true);
                                model.customer.centreName = actualCentre && actualCentre.length > 0 ? actualCentre[0].centreName : model.customer.centreName;
                                console.log("model info")
                                console.log(model)
                                BundleManager.broadcastEvent('business-loaded', model.customer);
                            })

                            return p1;
                        } else {
                            model.customer = model.customer || {};
                            if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                                 model.customer.enterprise = {};
                            }
                            //model.branchId = SessionStore.getBranchId() + '';
                            //model.customer.kgfsName = SessionStore.getBranch();
                            model.customer.customerType = "Enterprise";
                            var branch1 = formHelper.enum('branch_id').data;
                            for (var i = 0; i < branch1.length; i++) {
                                if ((branch1[i].name) == SessionStore.getBranch()) {
                                    model.customer.customerBranchId = branch1[i].value;
                                    model.customer.kgfsName = branch1[i].name;
                                }
                            }

                            model.customer.centreId = centreName[0];
                            model.customer.centreName = (allowedCentres && allowedCentres.length > 0) ? allowedCentres[0].centreName : "";
                            model.customer.enterpriseCustomerRelations = model.customer.enterpriseCustomerRelations || [];
                            model.customer.enterprise.isGSTAvailable = 'YES';
                            model.customer.enterprise.companyRegistered = "YES";
                        }

                    })
                    .then(function(customer){
                        // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                        if (bundlePageObj) {
                            model._bundlePageObj = _.cloneDeep(bundlePageObj);
                        }

                        /* Setting data recieved from Bundle */
                        model.loanCustomerRelationType = "Customer";
                        model.currentStage = bundleModel.currentStage;
                        /* End of setting data recieved from Bundle */

                        var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                        p1.then(function(repo){
                            var formRequest = {
                                "overrides": {
                                    "EnterpriseInformation.customerId": {
                                        "type": "lov",
                                        "lovonly": true,
                                         initialize: function(model, form, parentModel, context) {
                                                        model.customerBranchId = parentModel.customer.customerBranchId;
                                                        model.centreId = parentModel.customer.centreId;
                                                        var centreCode = formHelper.enum('centre').data;
                                                        var centreName = $filter('filter')(centreCode, {value: parentModel.customer.centreId}, true);
                                                        if(centreName && centreName.length > 0) {
                                                            model.centreName = centreName[0].name;
                                                        }
                                                    },
                                        "inputMap": {
                                            "firstName": {
                                                "key": "customer.firstName",
                                                "title": "CUSTOMER_NAME"
                                            },
                                            "urnNo": {
                                                "key": "customer.urnNo",
                                                "title": "URN_NO",
                                                "type": "string"
                                            },
                                            "customerBranchId": {
                                                "key": "customer.customerBranchId",
                                                "type": "select",
                                                "screenFilter": true,
                                                "readonly": true,
                                                "enumCode": "branch_id"
                                            },
                                            "centreName": {
                                                "key": "customer.place",
                                                "title":"CENTRE_NAME",
                                                "type": "string",
                                                "readonly": true,

                                            },
                                            "centreId":{
                                                key: "customer.centreId",
                                                type: "lov",
                                                autolov: true,
                                                lovonly: true,
                                                bindMap: {},
                                                searchHelper: formHelper,
                                                search: function(inputModel, form, model, context) {
                                                    var centres = SessionStore.getCentres();
                                                    // $log.info("hi");
                                                    // $log.info(centres);

                                                    var centreCode = formHelper.enum('centre').data;
                                                    var out = [];
                                                    if (centres && centres.length) {
                                                        for (var i = 0; i < centreCode.length; i++) {
                                                            for (var j = 0; j < centres.length; j++) {
                                                                if (centreCode[i].value == centres[j].id) {

                                                                    // if( out.length == 0){
                                                                    //     model.customer.centreId = centreCode[i].value;
                                                                    // }
                                                                    out.push({
                                                                        name: centreCode[i].name,
                                                                        id:centreCode[i].value
                                                                    })
                                                                }
                                                            }
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
                                                    model.centreId = valueObj.id;
                                                    model.centreName = valueObj.name;
                                                },
                                                getListDisplayItem: function(item, index) {
                                                    return [
                                                        item.name
                                                    ];
                                                }
                                            },
                                        },
                                        "outputMap": {
                                            "urnNo": "customer.urnNo",
                                            "firstName":"customer.firstName"
                                        },
                                        "searchHelper": formHelper,
                                        "search": function(inputModel, form) {
                                            var branches = formHelper.enum('branch_id').data;
                                            var branchName;
                                            for (var i=0; i<branches.length;i++){
                                                if(branches[i].code==inputModel.customerBranchId)
                                                    branchName = branches[i].name;
                                            }
                                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                            var promise = Enrollment.search({
                                                'branchName': branchName ||SessionStore.getBranch(),
                                                'firstName': inputModel.firstName,
                                                'centreId':inputModel.centreId,
                                                'customerType':"enterprise",
                                                'urnNo': inputModel.urnNo
                                            }).$promise;
                                            return promise;
                                        },
                                        getListDisplayItem: function(data, index) {
                                            return [
                                                [data.firstName, data.fatherFirstName].join(' | '),
                                                data.id,
                                                data.urnNo
                                            ];
                                        },
                                        onSelect: function(valueObj, model, context){
                                            PageHelper.showProgress('customer-load', 'Loading customer...');
                                            Enrollment.getCustomerById({id: valueObj.id})
                                                .$promise
                                                .then(function(res){
                                                    PageHelper.showProgress("customer-load", "Done..", 5000);
                                                    model.customer = Utils.removeNulls(res, true);
                                                    BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                                                }, function(httpRes){
                                                    PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                                })
                                        }
                                    },
                                    "BankAccounts.customerBankAccounts.accountNumber" : {
                                       type: "password" 
                                    },
                                    "BankAccounts.customerBankAccounts.sanctionedAmount" : {
                                       condition:"model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'"
                                    }
                                },
                                "includes": getIncludes(model),
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions": {
                                        "EnterpriseInformation": {
                                            "type": "box",
                                            "title": "ENTITY_INFORMATION",
                                            "orderNo": 10,
                                            "items": {
                                                "spokeId": {
                                                    key: "customer.centreId",
                                                    orderNo: 51,
                                                    condition: "!model.customer.id",
                                                    type: "lov",
                                                    autolov: true,
                                                    lovonly: true,
                                                    bindMap: {},
                                                    searchHelper: formHelper,
                                                    search: function(inputModel, form, model, context) {
                                                        var centres = SessionStore.getCentres();
                                                        // $log.info("hi");
                                                        // $log.info(centres);

                                                        var centreCode = formHelper.enum('centre').data;
                                                        var out = [];
                                                        if (centres && centres.length) {
                                                            for (var i = 0; i < centreCode.length; i++) {
                                                                for (var j = 0; j < centres.length; j++) {
                                                                    if (centreCode[i].value == centres[j].id) {
                                                                        out.push({
                                                                            name: centreCode[i].name,
                                                                            id:centreCode[i].value
                                                                        })
                                                                    }
                                                                }
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
                                                        model.customer.centreId = valueObj.id;
                                                    },
                                                    getListDisplayItem: function(item, index) {
                                                        return [
                                                            item.name
                                                        ];
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "additions": [
                                        {
                                            "type": "actionbox",
                                            "orderNo": 1200,
                                            "condition": "!model.customer.id && !(model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview')",
                                            "items": [
                                                {
                                                    "type": "button",
                                                    "icon": "fa fa-circle-o",
                                                    "title": "SUBMIT",
                                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                                }
                                            ]
                                        },
                                        {
                                            "type": "actionbox",
                                            "orderNo": 1200,
                                            "condition": "model.customer.id && !(model.currentStage=='ApplicationReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView')",
                                            "items": [
                                                {
                                                    "type": "submit",
                                                    "title": "COMPLETE_ENROLMENT"
                                                }
                                            ]
                                        }]
                                }
                            };
                            self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                        })
                    });
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
                    "new-applicant": function(bundleModel, model, params){
                        $log.info("Inside new-applicant of EnterpriseEnrollment");

                        var addToRelation = true;
                        for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                            if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                                addToRelation = false;
                                break;
                            }
                        }
                        if (addToRelation){
                            var newLinkedCustomer = {
                                "linkedToCustomerId": params.customer.id,
                                "linkedToCustomerName": params.customer.firstName
                            };

                            model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);
                        }
                    },
                    "lead-loaded": function(bundleModel, model, obj){
                        $log.info(obj);

                        var overlayData = function(model, obj){
                            try {
                                model.customer.mobilePhone = obj.mobileNo;
                                model.customer.gender = obj.gender;
                                model.customer.firstName = obj.businessName;
                                model.customer.maritalStatus=obj.maritalStatus;
                                model.customer.customerBranchId=obj.branchId;
                                model.customer.centreId=obj.centreId;
                                model.customer.centreName=obj.centreName;
                                model.customer.street=obj.addressLine2;
                                model.customer.doorNo=obj.addressLine1;
                                model.customer.pincode=obj.pincode;
                                model.customer.district=obj.district;
                                model.customer.state=obj.state;
                                model.customer.locality=obj.area;
                                model.customer.villageName=obj.cityTownVillage;
                                model.customer.landLineNo=obj.alternateMobileNo;
                                model.customer.dateOfBirth=obj.dob;
                                model.customer.age=obj.age;
                                model.customer.mobilePhone = obj.mobileNo;
                                model.customer.latitude =obj.location;
                                if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                                    model.customer.enterprise = {};
                                }
                                model.customer.enterprise.ownership =obj.ownership;
                                model.customer.enterprise.companyOperatingSince =obj.companyOperatingSince;
                                model.customer.enterprise.companyRegistered =obj.companyRegistered;
                                model.customer.enterprise.businessType =obj.businessType;
                                model.customer.enterprise.businessActivity=obj.businessActivity;
                            } catch (e){
                                $log.error("Error while overlay");
                            }

                        }

                        var lep = null;
                        if (obj.customerId != null) {
                            lep = Enrollment.getCustomerById({id: obj.customerId})
                                .$promise;
                            lep.then(function(res){
                                PageHelper.showProgress("customer-load", "Done..", 5000);
                                model.customer = Utils.removeNulls(res, true);
                                overlayData(model, obj);
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                            }, function(httpRes){
                                PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                            })
                        } else {
                            overlayData(model, obj);
                        }

                    },
                    "new-co-applicant": function(bundleModel, model, params){
                        $log.info("Inside new co-applicant of EnterpriseEnrollment");

                        var addToRelation = true;
                        for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                            if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                                addToRelation = false;
                                break;
                            }
                        }
                        if (addToRelation){
                            var newLinkedCustomer = {
                                "linkedToCustomerId": params.customer.id,
                                "linkedToCustomerName": params.customer.firstName
                            };

                            model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);
                        }
                    },
                    "new-guarantor": function(bundleModel, model, params){
                        $log.info("Inside new guarantor of EnterpriseEnrollment");

                        var addToRelation = true;
                        for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                            if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                                addToRelation = false;
                                break;
                            }
                        }
                        if (addToRelation){
                            var newLinkedCustomer = {
                                "linkedToCustomerId": params.customer.id,
                                "linkedToCustomerName": params.customer.firstName
                            };

                            model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);
                        }
                    },
                    "origination-stage": function(bundleModel, model, obj){
                        model.currentStage = obj
                    },
                    "remove-customer-relation": function(bundleModel, model, enrolmentDetails){
                        $log.info("Inside remove-customer-relation of EnterpriseEnrolment2");
                        /**
                         * Following to be Done
                         *
                         * 1. Remove customer from Enterprise Customer Relation if exists.
                         */

                        _.remove(model.customer.enterpriseCustomerRelations, function(relation){
                            return relation.linkedToCustomerId==enrolmentDetails.customerId;
                        })
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
                        $log.info("Inside save()");
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                        if (model.customer.enterprise.isGSTAvailable === "YES"){
                            try
                            {
                                var count = 0;
                                for (var i = 0; i < model.customer.enterpriseRegistrations.length; i++) {
                                    if (model.customer.enterpriseRegistrations[i].registrationType === "GST No"
                                        && model.customer.enterpriseRegistrations[i].registrationNumber != ""
                                        && model.customer.enterpriseRegistrations[i].registrationNumber != null
                                        ) {
                                        count++;
                                    }
                                }
                                if (count < 1) {
                                    PageHelper.showProgress("enrolment","Since GST is applicable so please select Registration type GST No and provide Registration details ",9000);
                                    return false;
                                }
                            }
                            catch(err){
                                console.error(err);
                            }
                        }

                        if (model.customer.enterprise.companyRegistered != "YES"){
                            try
                            {
                                delete model.customer.enterpriseRegistrations;
                            }
                            catch(err){
                                console.error(err);
                            }
                        }

                        var reqData = _.cloneDeep(model);
                        EnrollmentHelper.fixData(reqData);

                        if (!(validateRequest(reqData))){
                            return;
                        }
                        if (model.currentStage == 'ApplicationReview') {
                            PageHelper.showProgress("enrolment","Loan must be saved/updated for psychometric test", 6000);
                        }

                        PageHelper.showProgress('enrolment','Saving..');
                        EnrollmentHelper.saveData(reqData).then(function(resp){
                            formHelper.resetFormValidityState(formCtrl);
                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                            Utils.removeNulls(resp.customer, true);
                            model.customer = resp.customer;
                            if (model._bundlePageObj){
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                            }
                        }, function(httpRes){
                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(httpRes);
                        });
                    },
                    submit: function(model, form, formName){
                        $log.info("Inside submit()");
                        $log.warn(model);

                        var sortFn = function(unordered){
                            var out = {};
                            Object.keys(unordered).sort().forEach(function(key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        if (model.customer.enterprise.companyRegistered != "YES"){
                            try
                            {
                                delete model.customer.enterpriseRegistrations;
                            }
                            catch(err){
                                console.error(err);
                            }
                        }

                        if (model.customer.enterprise.isGSTAvailable === "YES"){
                            try
                            {
                                var count = 0;
                                for (var i = 0; i < model.customer.enterpriseRegistrations.length; i++) {
                                    if (model.customer.enterpriseRegistrations[i].registrationType === "GST No"
                                        && model.customer.enterpriseRegistrations[i].registrationNumber != ""
                                        && model.customer.enterpriseRegistrations[i].registrationNumber != null
                                        && model.customer.enterpriseRegistrations[i].registeredDate != ""
                                        && model.customer.enterpriseRegistrations[i].registeredDate != null) {
                                        count++;
                                    }
                                }
                                if (count < 1) {
                                    PageHelper.showProgress("enrolment","Since GST is applicable so please select Registration type GST No and provide Registration details ",9000);
                                    return false;
                                }
                            }
                            catch(err){
                                console.error(err);
                            }
                        }

                        if (model.currentStage == 'Application') {
                            if (model.customer.verifications.length<2){
                                PageHelper.showProgress("enrolment","minimum two references are mandatory",5000);
                                return false;
                            }
                        }
                        if (model.currentStage == 'ApplicationReview') {
                            PageHelper.showProgress("enrolment","Loan must be saved/updated for psychometric test", 6000);
                        }
                        if(model.currentStage=='ScreeningReview'){
                            var commercialCheckFailed = false;
                            if(model.customer.enterpriseBureauDetails && model.customer.enterpriseBureauDetails.length>0){
                                for (var i = model.customer.enterpriseBureauDetails.length - 1; i >= 0; i--) {
                                    if(!model.customer.enterpriseBureauDetails[i].fileId
                                        || !model.customer.enterpriseBureauDetails[i].bureau
                                        || model.customer.enterpriseBureauDetails[i].doubtful==null
                                        || model.customer.enterpriseBureauDetails[i].loss==null
                                        || model.customer.enterpriseBureauDetails[i].specialMentionAccount==null
                                        || model.customer.enterpriseBureauDetails[i].standard==null
                                        || model.customer.enterpriseBureauDetails[i].subStandard==null){
                                        commercialCheckFailed = true;
                                        break;
                                    }
                                }
                            }
                            else
                                commercialCheckFailed = true;
                            if(commercialCheckFailed && model.customer.customerBankAccounts && model.customer.customerBankAccounts.length>0){
                                for (var i = model.customer.customerBankAccounts.length - 1; i >= 0; i--) {
                                    if(model.customer.customerBankAccounts[i].accountType == 'OD' || model.customer.customerBankAccounts[i].accountType == 'CC'){
                                        PageHelper.showProgress("enrolment","Commercial bureau check fields are mandatory",5000);
                                        return false;
                                    }
                                }
                            }
                        }
                        var reqData = _.cloneDeep(model);
                        EnrollmentHelper.fixData(reqData);

                        if (!(validateRequest(reqData))){
                            return;
                        }

                        PageHelper.showProgress('enrolment','Updating...', 2000);
                        EnrollmentHelper.proceedData(reqData).then(function(resp){
                            formHelper.resetFormValidityState(form);
                            PageHelper.showProgress('enrolmet','Done.', 5000);
                            Utils.removeNulls(resp.customer,true);
                            model.customer = resp.customer;
                            if (model._bundlePageObj){
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer});
                                Dedupe.create({
                                    "customerId": model.customer.id,
                                    "status": "pending"
                                    }).$promise;
                            }
                        }, function(httpRes){
                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(httpRes);
                        });
                    }

                }
            };
        }
    }
});
