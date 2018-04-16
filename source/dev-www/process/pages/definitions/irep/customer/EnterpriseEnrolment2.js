define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "irep.customer.EnterpriseEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository) {

            var getIncludes = function (model) {
                return [
                    "EnterpriseInformation",
                    "EnterpriseInformation.customerId",
                    "EnterpriseInformation.customerBranchId",
                    "EnterpriseInformation.entityId",
                    "EnterpriseInformation.urnNo",
                    "EnterpriseInformation.centreId",
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
                    "BankAccounts.customerBankAccounts.accountType",
                    "BankAccounts.customerBankAccounts.bankingSince",
                    "BankAccounts.customerBankAccounts.netBankingAvailable",
                    "BankAccounts.customerBankAccounts.sanctionedAmount",
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
                    "EnterpriseFinancials.incomeThroughSales",
                    "EnterpriseFinancials.incomeThroughSales.buyerName",
                    "EnterpriseFinancials.incomeThroughSales.incomeType",
                    "EnterpriseFinancials.incomeThroughSales.invoiceType",
                    "EnterpriseFinancials.incomeThroughSales.amount",
                    "EnterpriseFinancials.incomeThroughSales.incomeSalesDate",
                    "EnterpriseFinancials.incomeThroughSales.invoiceDocId",
                    "EnterpriseFinancials.enterpriseMonthlySales",
                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType", 
                    "EnterpriseFinancials.rawMaterialExpenses",
                    "EnterpriseFinancials.rawMaterialExpenses.vendorName",
                    "EnterpriseFinancials.rawMaterialExpenses.amount",
                    "EnterpriseFinancials.rawMaterialExpenses.frequency",
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialDate",
                    "EnterpriseFinancials.rawMaterialExpenses.invoiceDocId",


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
                                    "CommercialCBCheck",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"

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
                                        "condition": "model.customer.id",
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                    "EnterpriseReferences",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"
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
                                    "EnterpriseReferences.verifications.customerResponse",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialDate": {
                                        "condition": "model.customer.rawMaterialExpenses[].frequency == 'Daily'"
                                    },
                                    "EnterpriseInformation": {
                                        "orderNo": 1
                                    },
                                    "EnterpriseFinancials.incomeThroughSales": {
                                        "title": "SALES_INVOICE_DETATILS"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                    "EnterpriseAssets",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                    "EnterpriseAssets",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                    "EnterpriseAssets",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                    "EnterpriseAssets",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                                    "EnterpriseAssets",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.month",
                                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType",
                                    "EnterpriseFinancials.rawMaterialExpenses.frequency"
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
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                                        "resolver": "MailingPincodeLOVConfiguration"
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
                    console.log("model information");
                    console.log(model);
                    var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    var self = this;
                    p1.then(function(repo){
                        var formRequest = {
                            "overrides": "",
                            "includes": getIncludes(model),
                            "excludes": [],
                            "options": {
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
                                        "condition": "model.customer.currentStage",
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
                                    }/*,
                                    {
                                        "targetID": "BusinessInformation",
                                        "items": [
                                            {
                                                "condition": "model.loanProcess.applicantEnrolmentProcess.customer.id == null",
                                                "type": "section",
                                                "htmlClass": "alert alert-warning",
                                                "html":"<h4><i class='icon fa fa-warning'></i>Applicant not yet enrolled.</h4> Kindly save Applicant details.",
                                                "orderNo": 10
                                            }
                                        ]
                                    }*/
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
                        Queries.getEnterpriseCustomerId(params.customer.id)
                            .then(function(response){
                                if (!response || !response.customer_id){
                                    return false;
                                }

                                if (response.customer_id == model.customer.id){
                                    return false;
                                }

                                return EnrolmentProcess.fromCustomerID(response.customer_id).toPromise();
                            })
                            .then(function(enrolmentProcess){
                                if (!enrolmentProcess){
                                    /* IF no enrolment present, reset to applicant */
                                    model.customer.firstName = params.customer.firstName;
                                    model.customer.villageName = params.customer.villageName;
                                    model.customer.pincode = params.customer.pincode;
                                    model.customer.area = params.customer.area;
                                    return;
                                }
                                $log.info("Inside customer loaded of applicant-updated");
                                if (model.customer.id) {
                                    model.loanProcess.removeRelatedEnrolmentProcess(enrolmentProcess, 'Customer');
                                }
                                model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);

                                /* Setting for the current page */
                                model.enrolmentProcess = enrolmentProcess;
                                model.customer = enrolmentProcess.customer;

                                /* Setting enterprise customer relation on the enterprise customer */
                                model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                            })
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
