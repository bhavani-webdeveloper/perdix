define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "base.dashboard.loans.individual.customer.EnterpriseEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository) {
            var overridesFields = function(bundlePageObj){
               return {
                    "ContactInformation.pincode": {
                         "title": "pincode",
                        "required": true,
                        "resolver": "PincodeLOVConfiguration"
                    },
                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                         "title": "HYPOTHECATED_TO_IREP"

                    },
                    "EnterpriseInformation.businessHistory": {
                         "title": "BUSINESSINFO_BUSINESS_OWNERSHIP",
                         "enumCode": "businessinfo_business_ownershi"
                    },
                    "EnterpriseInformation.enterpriseRegistrations.registrationType": {
                         "enumCode": "business_registration_type_upd"
                    },
                    "EnterpriseInformation.enterpriseRegistrations.registeredDate": {
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.isDisbersementAccount":{
                        "title": "Is Disbursement"
                    },
                    "BankAccounts.customerBankAccounts.accountNumber": {
                         "type": "password",
                         "required": true
                    },
                    "EnterpriseInformation.rentLeaseStatus": {
                         "schema": {
                              "enumCode": "rent_lease_status"
                         },
                         "condition": "model.customer.enterprise.ownership=='Rental' || model.customer.enterprise.ownership=='Leased' "
                    },
                    "EnterpriseInformation.rentLeaseAgreement": {
                         "condition": "model.customer.enterprise.ownership=='Rental' || model.customer.enterprise.ownership=='Leased' ",
                         "orderNo":142
                    },
                    "EnterpriseFinancials": {
                        "orderNo": 50
                    },
                    "EnterpriseFinancials.monthlyTurnover": {
                         "orderNo": 10
                     },
                    "EnterpriseFinancials.monthlyBusinessExpenses":{
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.avgMonthlyNetIncome": {
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.otherBusinessIncomes": {
                         "orderNo": 40
                    },
                    "EnterpriseFinancials.otherBusinessIncomes.incomeSource": {
                         "orderNo": 10
                    },
                    "EnterpriseFinancials.otherBusinessIncomes.amount":{
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.otherBusinessIncomes.otherBusinessIncomeDate":{
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.incomeThroughSales": {
                         "orderNo": 50
                    },
                    "EnterpriseFinancials.incomeThroughSales.buyerName":{
                         "orderNo": 10,
                         "required": true,
                         "title": "BUYER_NAME",
                         "resolver": "BuyerNameLOVConfiguration"
                    },
                    "EnterpriseFinancials.incomeThroughSales.incomeType":{
                         "orderNo": 20,
                         "enumCode": "salesinfo_income_type"
                    },
                    "EnterpriseFinancials.incomeThroughSales.invoiceType": {
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.incomeThroughSales.amount": {
                         "orderNo": 40
                    },
                    "EnterpriseFinancials.incomeThroughSales.incomeSalesDate": {
                         "orderNo": 50
                    },
                    "EnterpriseFinancials.incomeThroughSales.invoiceDocId": {
                         "orderNo": 60
                    },
                    "EnterpriseFinancials.dailySales": {
                         "orderNo": 70
                    },
                    "EnterpriseFinancials.dailySales.avgDailySaleAmount":{
                         "orderNo": 10
                    },
                    "EnterpriseFinancials.dailySales.workingDaysInMonth": {
                         "orderNo" : 20
                    },                           
                    "EnterpriseFinancials.enterpriseMonthlySales":{
                         "orderNo": 100
                    },
                    "EnterpriseFinancials.enterpriseMonthlySales.month": {
                         "orderNo": 10
                    },
                    "EnterpriseFinancials.enterpriseMonthlySales.totalSales":{
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.enterpriseMonthlySales.seasonType":{
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.marginDetails":{
                         "orderNo": 108
                    },
                    "EnterpriseFinancials.marginDetails.grossMarginPercentage": {
                         "orderNo": 10
                    },
                    "EnterpriseFinancials.marginDetails.netMarginPercentage": {
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.expenditures": {
                         "orderNo": 110
                    },
                    "EnterpriseFinancials.expenditures.expenditureSource":{
                         "orderNo": 10
                    },
                    "EnterpriseFinancials.expenditures.annualExpenses":{
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.expenditures.frequency":{
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.expenditures.billDocId":{
                         "orderNo": 40
                    },
                    "EnterpriseFinancials.rawMaterialExpenses":{
                         "orderNo": 120
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.vendorName":{
                         "orderNo": 10,
                         "required": true,
                         "title": "VENDOR_NAME",
                         "resolver": "VendorNameLOVConfiguration"
                    },                   
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialType": {
                         "enumCode" : "purchase_income_type",
                         "orderNo": 15
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.amount":{
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.freequency":{
                         "orderNo": 30,
                         "enumCode": "enterprise_purchase_frequency"
                    },                    
                    "EnterpriseFinancials.rawMaterialExpenses.invoiceDocId":{
                         "orderNo": 50
                    },
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                         "type": "string",
                         "title": "CONFIRMED_ACCOUNT_NUMBER",
                         "required": true
                    }                         
               }
            }
            var repositoryAdditions = function(bundlePageObj){
               return {
                    // "EnterpriseInformation": {
                    //      "items": {
                    //           "lastFiledItr": {
                    //                "key": "customer.udf.userDefinedDateFieldValues.udfDate2",
                    //                "title": "LAST_AVAIL_ITR",
                    //                "orderNo": 311,
                    //                "type": "date"
                    //           },
                    //           "whetherAudited": {
                    //                "key": "customer.udf.userDefinedFieldValues.udf2",
                    //                "title": "WHETHER_AUDITED",
                    //                "orderNo": 312,
                    //                "type": "select",
                    //                "titleMap": {
                    //                     "Yes": "yes",
                    //                     "No": "No"
                    //                } 
                    //           },
                    //           "rentLeaseStatus": {
                    //                "type":"select",
                    //                "key": "customer.udf.userDefinedFieldValues.udf1",                                   
                    //                "title":"RENT_LEASE_STATUS",
                    //                "orderNo": 141
                    //           },
                    //           "rentLeaseAgreement": {
                    //                "type":"date",
                    //                "key": "customer.udf.userDefinedDateFieldValues.udfDate1",
                    //                "title":"RENT_LEASE_AGREEMENT_VALID_TILL",
                    //                "orderNo:": 142
                    //           },                              
                    //           "operatedBy": {
                    //                "key": "customer.udf.userDefinedFieldValues.udf3",
                    //                "title": "ENTERPRISE_OPERATED_BY",
                    //                "type": "select",
                    //                "orderNo": 193,
                    //                "enumCode": "enterpise_operated_by"
                    //           },
                    //      }
                    // }
               }
            }
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
                    "EnterpriseInformation.regularEmployees",
                    "EnterpriseInformation.contractEmployee",
                    "EnterpriseInformation.operatedBy",
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
                    "EnterpriseInformation.rentLeaseStatus",
                    "EnterpriseInformation.rentLeaseAgreement",
                    "EnterpriseInformation.itrAvailable",
                    "EnterpriseInformation.lastFiledItr",
                    "EnterpriseInformation.whetherAudited",
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
                    "BankAccounts.customerBankAccounts.bankStatementDocId",
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "BankAccounts.customerBankAccounts.bankStatements.openingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.closingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.emiAmountdeducted",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",

                    "Liabilities",
                    "Liabilities.liabilities",
                    "Liabilities.liabilities.liabilityType",
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

                ];
            }

            var configFile = function() {
                return {
                        "currentStage": {
                            "KYC": {
                                "excludes": [
                                    "ProxyIndicators",
                                    "BuyerDetails",
                                    "EnterpriseFinancials.currentAsset",
                                    "EnterpriseFinancials.otherBusinessIncomes",
                                    "SuppliersDeatils",
                                    "EnterpriseAssets",
                                    "Machinery",
                                    "EnterpriseReferences",
                                    "CommercialCBCheck",
                                    "EnterpriseFinancials.expenditures",
                                    "EnterpriseFinancials.incomeThroughSales",
                                    "EnterpriseFinancials.enterpriseMonthlySales",
                                    "EnterpriseFinancials.dailySales",
                                    "EnterpriseFinancials.marginDetails",                        
                                    "EnterpriseFinancials.rawMaterialExpenses"

                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 10
                                    },                                   
                                    "ContactInformation": {
                                        "orderNo": 20
                                    },
                                    "EnterpriseFinancials.incomeThroughSales": {
                                        "title": "SALES_INFO_DETAILS"
                                    },
                                    "BankAccounts": {
                                        "orderNo": 30
                                    },
                                    "Liabilities": {
                                        "orderNo": 40,
                                         "title": "BUSINESS_LIABILITIES"
                                    },
                                    "IndividualInformation.centreId" :{
                                        "resolver": "CentreLovConfiguration"
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 50
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 60
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.urnNo": {
                                        "condition": "model.customer.urnNo",
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
                                    "EnterpriseInformation.photoImageId": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.ownership": {
                                        "required": true
                                    },
                                    "EnterpriseInformation.rentLeaseStatus": {
                                        "schema": {
                                             "enumCode": "rent_lease_status"
                                        },
                                        "required": true,
                                        "condition": "model.customer.enterprise.ownership.toLowerCase() =='rental' || model.customer.enterprise.ownership.toLowerCase() =='leased' "
                                    },
                                    "EnterpriseInformation.rentLeaseAgreement": {
                                        "condition": "model.customer.udf.userDefinedFieldValues.udf1 == 'Available' ",
                                        "orderNo":142,
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
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId": {
                                         readonly : true
                                    },
                                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName": {
                                        "readonly": true
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
                            "KYCReview": {
                                "excludes": [
                                    "ProxyIndicators",
                                    "BuyerDetails",
                                    "EnterpriseFinancials.currentAsset",
                                    "EnterpriseFinancials.otherBusinessIncomes",
                                    "EnterpriseFinancials.expenditures",
                                    "SuppliersDeatils",
                                    "EnterpriseAssets",
                                    "Machinery",
                                    "EnterpriseReferences",
                                    "EnterpriseFinancials.incomeThroughSales",                                    
                                    "EnterpriseFinancials.enterpriseMonthlySales",                    
                                    "EnterpriseFinancials.rawMaterialExpenses",
                                    "EnterpriseFinancials.dailySales",
                                    "CommercialCBCheck",                   
                                   "EnterpriseFinancials.marginDetails"                   
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 10,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials.incomeThroughSales": {
                                        "title": "SALES_INFO_DETAILS"
                                    },
                                    "EnterpriseInformation.isGSTAvailable": {
                                        "required": true
                                    },
                                    "ContactInformation": {
                                        "orderNo": 20,
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 30,
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "orderNo": 40,
                                         "title": "BUSINESS_LIABILITIES",
                                        "readonly": true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 50,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 60,
                                        "readonly": true
                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 70
                                    },
                                    "EnterpriseInformation.customerId": {
                                        "resolver": "IndividualCustomerIDLOVConfiguration"
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
                            "Appraisal": {
                                "excludes": [
                                    "ProxyIndicators",
                                    "EnterpriseReferences.verifications.knownSince",
                                    "EnterpriseReferences.verifications.goodsSold",
                                    "EnterpriseReferences.verifications.goodsBought",
                                    "EnterpriseReferences.verifications.paymentTerms",
                                    "EnterpriseReferences.verifications.modeOfPayment",
                                    "EnterpriseReferences.verifications.outstandingPayable",
                                    "EnterpriseReferences.verifications.outstandingReceivable",
                                    "EnterpriseReferences.verifications.customerResponse",

                                ],
                                "overrides": {

                                    "EnterpriseInformation": {
                                        "orderNo": 10
                                    },
                                    "EnterpriseFinancials.currentAsset.assetType": {
                                        "required": true
                                    },
                                    "EnterpriseFinancials.incomeThroughSales": {
                                        "title": "SALES_INFO_DETAILS"
                                    },
                                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialDate":{
                                        "orderNo": 40,
                                        "condition": "model.customer.rawMaterialExpenses[arrayIndex].frequency.toUpperCase() == 'DATE'"
                                   },
                                    "ContactInformation": {
                                        "orderNo": 20
                                    },
                                    "BankAccounts": {
                                        "orderNo": 30
                                    },
                                    "Liabilities": {
                                        "orderNo": 40,
                                         "title": "BUSINESS_LIABILITIES"
                                    },
                                    "BuyerDetails": {
                                        "orderNo": 50
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 60
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 70
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 80
                                    },
                                    // "Machinery": {
                                    //     "orderNo": 9
                                    // },
                                    // "EnterpriseReferences": {
                                    //     "orderNo": 10
                                    // },
                                    // "CommercialCBCheck": {
                                    //     "orderNo": 11
                                    // },
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
                                    "EnterpriseInformation.rentLeaseStatus": {
                                        "schema": {
                                             "enumCode": "rent_lease_status"
                                        },
                                        "required": true,
                                        "condition": "model.customer.enterprise.ownership.toLowerCase() =='rental' || model.customer.enterprise.ownership.toLowerCase() =='leased' "
                                    },
                                    "EnterpriseInformation.rentLeaseAgreement": {
                                        "condition": "model.customer.udf.userDefinedFieldValues.udf1 == 'Available' ",
                                        "orderNo":140,
                                        "required": true

                                    },
                                    "EnterpriseAssets": {
                                        "title": "Enterprise Assets"
                                     },
                                     "EnterpriseAssets.enterpriseAssets": {
                                         "title": "Enterprise Assets"
                                     },
                                   "EnterpriseAssets.enterpriseAssets.assetType": {
                                         "title": "Enterprise Assets"                                        
                                   },
                                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                                        "condition":"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                    },
                                   "CommercialCBCheck.enterpriseBureauDetails.bureau":{
                                         "schema": { 
                                             "type": ["string","null"],
                                             "enumCode": "commercial_CBCheck_bureau_type"
                                        },
                                   }
                                }
                            },
                            "AppraisalReview": {
                                "excludes": [
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.rentLeaseStatus": {
                                        "schema": {
                                             "enumCode": "rent_lease_status"
                                        },
                                        "required": true,
                                        "condition": "model.customer.enterprise.ownership.toLowerCase() =='rental' || model.customer.enterprise.ownership.toLowerCase() =='leased' "
                                    },
                                    "EnterpriseInformation.rentLeaseAgreement": {
                                        "condition": "model.customer.udf.userDefinedFieldValues.udf1 == 'Available' ",
                                        "orderNo":142,
                                        "required": true

                                    },
                                    "CommercialCBCheck": {
                                        "orderNo": 11,
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials.incomeThroughSales": {
                                        "title": "SALES_INFO_DETAILS"
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
                                    }
                                    
                                }
                            },                            
                            // "Televerification": {
                            

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
                    var branchId = SessionStore.getBranchId();
                    if(branchId && !model.customer.customerBranchId)
                        {
                            model.customer.customerBranchId = branchId;
                    };
                    /* End of setting data for the form */
                    console.log("model information");
                    console.log(model);

                    var self = this;
                        var formRequest = {
                            "overrides": overridesFields(model),
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
                                        "condition": "model.customer.currentStage && (model.currentStage=='KYC' || model.currentStage == 'Appraisal' || model.currentStage=='Screening')",
                                        "orderNo": 1300,
                                        "items": [
                                            {
                                                "type": "button",
                                                "title": "UPDATE",
                                                "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                            }
                                        ]
                                    }
                                ],
                                "repositoryAdditions":repositoryAdditions(model)
                            }
                        };
                        UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
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
                                    model.customer.enterpriseCustomerRelations[0].linkedToCustomerId = params.customer.id;
                                    model.customer.enterpriseCustomerRelations[0].linkedToCustomerName = params.customer.firstName;
                                    //model.customer.firstName = params.customer.firstName;
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
                                        
                                        if(model.customer.currentStage && (model.currentStage=='KYC' || model.currentStage == 'Appraisal' || model.currentStage=='BasicEnrolment' || model.currentStage=='Screening')){

                                        }
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    }, function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);                                        
                                        PageHelper.hideLoader();
                                    })
                            }, function(err) {
                               PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);                                
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
                                BundleManager.pushEvent(model._bundlePageObj.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                            }, function (err) {
                                PageHelper.showErrors(err.message);
                                PageHelper.showProgress('enrolment', err.message, 5000);                                
                                PageHelper.hideLoader();
                            });
                    }

                }
            };
        }
    }
});