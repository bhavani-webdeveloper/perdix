define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function(EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "base.dashboard.loans.individual.customer.EnterpriseEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository) {
        AngularResourceService.getInstance().setInjector($injector);
            var overridesFields = function(bundlePageObj){
               return {
                    "ContactInformation.pincode": {
                         "title": "pincode",
                        "required": true,
                        "resolver": "PincodeLOVConfiguration"
                    },
                    "ContactInformation.district":{
                        "required": false
                    },
                    "ContactInformation.state":{
                        "required": false
                    },
                    "ContactInformation.mobilePhone": {
                        "inputmode": "number",
                        "numberType": "number",
                        "type": "number",
                    },
                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                         "title": "CAN_BE_HYPOTHECATED_TO_US"

                    },
                    "EnterpriseReferences.verifications.relationship":{
                        "required":true
                    },
                    // "EnterpriseInformation.businessHistory": {
                    //      "title": "BUSINESSINFO_BUSINESS_OWNERSHIP",
                    //      "enumCode": "businessinfo_business_ownershi"
                    // },
                    "EnterpriseInformation.entityId":{
                        "condition": "model.customer.id",
                    },
                    "EnterpriseInformation.photoImageId":{
                        "key": "customer.photoImageId",
                        "title": "BUSINESS_LOCATION_PHOTO",
                        "type": "file",
                        "fileType": "application/pdf",
                        "category": "CustomerEnrollment",
                        "using": "scanner"

                    },
                    "EnterpriseInformation.referredName":{
                        "condition": "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'",
                    },
                    "EnterpriseInformation.partnershipDissolvedDate":{
                        "condition": "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'",
                    },
                    "EnterpriseInformation.enterpriseRegistrations":{
                        "condition": "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'", 
                    },
                    "EnterpriseInformation.oldCustomerId":{
                        "condition": "model.customer.oldCustomerId"
                    },
                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId":{
                        type: "lov",
                        "required": true,
                        title: "CUSTOMER_ID",
                            inputMap: {
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "customerBranchId": {
                                    "key": "customer.customerBranchId",
                                    "type": "select",
                                    "screenFilter": true,
                                    "readonly": true
                                },
                                "centreName": {
                                    "key": "customer.place",
                                    "title":"CENTRE_NAME",
                                    "type": "string",
                                    "readonly": true,
                        
                                },
                                "centreId":{
                                    "key": "customer.centreId",
                                    "type": "lov",
                                    "autolov": true,
                                    "lovonly": true,
                                    "bindMap": {},
                                    "search": function(inputModel, form, model, context) {
                                        let SessionStore = AngularResourceService.getInstance().getNGService("SessionStore");
                                        let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
                                        let $q = AngularResourceService.getInstance().getNGService("$q");
                                        let centres = SessionStore.getCentres();
                                        // $log.info("hi");
                                        // $log.info(centres);
                        
                                        let centreCode = formHelper.enum('centre').data;
                                        let out = [];
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
                                    "onSelect": function(valueObj, model, context) {
                                        model.centreId = valueObj.id;
                                        model.centreName = valueObj.name;
                                    },
                                    "getListDisplayItem": function(item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                }
                            },
                            outputMap: {
                                "id": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerId",
                                "firstName": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerName"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                if (!inputModel.branchName)
                                    inputModel.branchName = SessionStore.getBranch();
                                var promise = Enrollment.search({
                                    'branchName': inputModel.branchName,
                                    'firstName': inputModel.firstName,
                                    'centreId': inputModel.centreId,
                                    'customerType': 'Individual'
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    [data.firstName, data.fatherFirstName].join(' '),
                                    data.id
                                ];
                            },
                            onSelect: function(valueObj, model, context){
                                PageHelper.showProgress('customer-load', 'Loading customer...');
                                Enrollment.getCustomerById({id: valueObj.id})
                                    .$promise
                                    .then(function(res){
                                        PageHelper.showProgress("customer-load", "Done..", 5000);
                                        model.customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerId = res.customer.id;
                                        model.customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerName = res.customer.firstName;
                                    }, function(httpRes){
                                        PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                })
                            }
                       
                    },
                    "EnterpriseInformation.enterpriseRegistrations.registrationType": {
                         "enumCode": "business_registration_type",
                         "required": false
                    },
                    "EnterpriseInformation.enterpriseRegistrations.registeredDate": {
                        "required": false
                    },
                    "EnterpriseInformation.enterpriseRegistrations.registrationNumber":{
                        "required": false
                    },
                    "EnterpriseInformation.enterpriseRegistrations.documentId":{
                        "required":true
                    },
                    "EnterpriseInformation.isGSTAvailable": {
                        "required": true
                    },
                    "EnterpriseInformation.referredBy":{
                        "required":true
                    },
                    //over ride for mandatory 
                    
                    "EnterpriseAssets":{
                        "title": "Enterprise Assets",
                    },
                    "EnterpriseAssets.enterpriseAssets":{
                        "title": "Enterprise Assets",
                    },
                    "EnterpriseAssets.enterpriseAssets.assetType":{
                        "title": "Asset Type"
                    },                    
                    "EnterpriseAssets.enterpriseAssets.valueOfAsset":{
                        "title": "Present Value"
                    },
                    "EnterpriseAssets.enterpriseAssets.details":{
                        title: "DESCRIPTION",
                        key: "customer.enterpriseAssets[].details",
                        orderNo:125,
                        condition:  "model.customer.enterpriseAssets[arrayIndex].assetType  == 'Furniture' || model.customer.enterpriseAssets[arrayIndex].assetType  == 'Fixtures'",
                        type: "string",
                        required: true,
                    }, 
                    "CurrentAssets":{
                        "orderNo":100
                    },
                    "EnterpriseAssets":{
                        "orderNo":110 
                    },
                    "BuyerDetails":{
                        "orderNo":120 
                    },
                    "SuppliersDeatils":{
                        "orderNo":130 
                    },
                    "Machinery":{
                        "orderNo":140,
                    },
                    "Machinery.fixedAssetsMachinaries":{
                        "title": "MACHINERY"
                    },
                    //
                //    "currentAssets": {
                //        type: "box",
                //        //condition: "model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                //        readonly: true,
                //        title: "STOCKS",
                //        items: [{
                //            key: "customer.currentAssets",
                //            type: "pivotarray",
                //            startEmpty: false,
                //            view: "fixed",
                //            addButtonExpr: " ('ADD'| translate ) + ' ' + (pivotValue | translate)",
                //            pivotFieldEnumCode: 'stock_current_assets',
                //            pivotField: "assetCategory",
                //            // title: "RAW_MATERIAL",
                //            items: [{
                //                key: "customer.currentAssets[].description",
                //                title: "DESCRIPTION",
                //                type: "string",
                //            },
                //            {
                //                key: "customer.currentAssets[].assetType",
                //                title: "TYPE",
                //                type: "select",
                //                enumCode: "stock_asset_type",
                //                parentEnumCode: "stock_current_assets",
                //                parentValueExpr: "model.customer.currentAssets[arrayIndex].assetCategory",
                //            }, {
                //                key: "customer.currentAssets[].assetValue",
                //                title: "PRESENT_VALUE",
                //                type: "amount",
                //            }, {
                //                key: "customer.currentAssets[].isHypothecated",
                //                title: "IS_THE_MACHINE_HYPOTHECATED",
                //                type: "radios",
                //                titleMap: {
                //                    "No": "No",
                //                    "Yes": "Yes"
                //                }
                //            }, {
                //                key: "customer.currentAssets[].hypothecatedToUs",
                //                condition: "model.customer.currentAssets[arrayIndex].isHypothecated == 'No' ",
                //                title: "HYPOTHECATED_TO_KINARA",
                //                type: "radios",
                //                titleMap: {
                //                    "No": "No",
                //                    "Yes": "Yes"
                //                }
                //            }, {
                //                key: "customer.currentAssets[].assetImageId",
                //                title: "IMAGE",
                //                "type": "file",
                //                "fileType": "image/*",
                //                "category": "Loan",
                //                "subCategory": "COLLATERALPHOTO"
                //            }]

                //        }]
                //    },
                    //
                    "EnterpriseInformation.companyOperatingSince":{
                        "required": true
                    },
                    // "EnterpriseInformation.companyEmailId":{
                    //     "required": true
                    // },
                    "EnterpriseInformation.photoImageId":{
                        "required": true
                    },
                    "EnterpriseInformation.ownership":{
                        "required": true
                    },
                    "EnterpriseInformation.companyRegistered":{
                        "required": true
                    },
                    "EnterpriseInformation.businessActivity":{
                        "required": true
                    },
                    "EnterpriseInformation.businessSubsector":{
                        "required": true,
                        "resolver":"BusinessSubsectorLOVConfiguration"
                    },
                    "EnterpriseInformation.enterpriseCustomerRelations.relationshipType":{
                        "required": true
                    },
                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness":{
                        "required": true
                    },
                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement":{
                        "required": true
                    },
                    "ContactInformation.businessInPresentAreaSince":{
                        "required": true
                    },
                    "ContactInformation.businessInCurrentAddressSince":{
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
                    "BankAccounts.customerBankAccounts.isDisbersementAccount":{
                        //"title": "Is Disbursement"
                    },
                    "BankAccounts.customerBankAccounts.accountNumber": {
                         "type": "password",
                         "required": true
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.closingBalance":{
                        "orderNo":125,
                        "title":"Closing Bank Balance",
                        "onChange": function(modelValue, form, model, formCtrl, event) {
                            var index = form.key[2];
                            var indexBank = form.key[4];
                            if (model.customer.customerBankAccounts[index].bankStatements[indexBank].closingBalance) {
                             model.customer.customerBankAccounts[index].bankStatements[indexBank].totalWithdrawals = model.customer.customerBankAccounts[index].bankStatements[indexBank].totalDeposits - model.customer.customerBankAccounts[index].bankStatements[indexBank].closingBalance;
                            }
                        }
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
                    "EnterpriseInformation.businessSector":{
                        "required": true,
                        onChange: function(modelValue, form, model) {
                            model.customer.enterprise.businessSubsector=null;
                        }
                    },
                    // "EnterpriseAssets":{
                    //     "title":"ENTERPRICE_ASSETS"
                    // },
                    "EnterpriseFinancials": {
                        "orderNo": 50,
                    },
                    "ContactInformation": {
                        "orderNo": 20
                    },
                    "BankAccounts": {
                        "orderNo": 30
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits":{
                        "readonly": true
                    },
                    "EmployeeDetails": {
                        "orderNo": 60
                    },
                    "EnterpriseFinancials.monthlyTurnover": {
                         "orderNo": 10,
                         "required":true
                     },
                    "EnterpriseFinancials.monthlyBusinessExpenses":{
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.avgMonthlyNetIncome": {
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.otherBusinessIncomes": {
                         "orderNo": 40,
                         "condition":"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                    },
                    "EnterpriseFinancials.otherBusinessIncomes.incomeSource": {
                         "orderNo": 10,
                         "required":true
                    },
                    "EnterpriseFinancials.otherBusinessIncomes.amount":{
                         "orderNo": 20,
                         "required":true
                    },
                    "EnterpriseFinancials.otherBusinessIncomes.otherBusinessIncomeDate":{
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.incomeThroughSales": {
                         "orderNo": 50,
                         "condition":"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                    },
                    "EnterpriseFinancials.incomeThroughSales.buyerName":{
                         "orderNo": 10,
                         "required": true,
                         "title": "BUYER_NAME",
                         "resolver": "BuyerNameLOVConfiguration"
                    },
                    "EnterpriseFinancials.incomeThroughSales.incomeType":{
                         "orderNo": 20,
                         //"enumCode": "salesinfo_income_type"
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
                        "orderNo": 60,
                        "required": true,
                        "condition": "model.customer.incomeThroughSales[arrayIndex].incomeType != 'Cash'",
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
                         "orderNo": 120,
                         "condition":"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.vendorName":{
                         "orderNo": 10,
                         "required": true,
                         "title": "VENDOR_NAME",
                         "resolver": "VendorNameLOVConfiguration"
                    },                   
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialType": {
                         //"enumCode" : "purchase_income_type",
                         "orderNo": 15
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.amount":{
                         "orderNo": 20
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialDate":{
                         "orderNo": 30
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.freequency":{
                         "orderNo": 30,
                         "enumCode": "enterprise_purchase_frequency"
                    },                    
                    "EnterpriseFinancials.rawMaterialExpenses.invoiceDocId":{
                        "orderNo": 50,
                        "required":true,
                        "condition":"model.customer.rawMaterialExpenses[arrayIndex].rawMaterialType != 'Cash'",
                    },
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                         "type": "string",
                         "title": "CONFIRMED_ACCOUNT_NUMBER",
                         "required": true
                    },
                    "BankAccounts.customerBankAccounts.bankStatements": {
                        "titleExpr": "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                        "titleExprLocals": {moment: window.moment},
                    },    
                    "BankAccounts.customerBankAccounts.sanctionedAmount": {
                        required : true, 
                        condition:"model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'"
                    },    
                    "EnterpriseInformation.businessHistory": {
                        "required": true
                    },  
                    "Liabilities":{
                        "title":"BUSINESS_LIABILITIES",
                        "orderNo": 40
                    },    
                    "Liabilities.liabilities.installmentAmountInPaisa":{
                        "title": "INSTALLEMENT_AMOUNT",
                    },
                    "Liabilities.liabilities.loanSource":{
                        "enumCode": "sorted_loan_source",
                    },
                    "ContactInformation.distanceFromBranch":{
                        "enumCode": "distanceFromBranchOffice",
                    },
                    "EnterpriseInformation.noOfPartners": {
                        "condition": "model.customer.enterprise.businessConstitution=='Partnership'"
                    },     
                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                    },   
                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                        "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
                    },  
                    "ProxyIndicators.incomeStability" : {
                        "title": "Income Stability"
                    }    
               }
            }
            var repositoryAdditions = function(bundlePageObj){
               return {
                                "EnterpriseInformation": {
                                    "items" : {
                                        "customerName": {
                                           "condition": "model.currentStage=='ApplicationReview' || model.currentStage=='ScreeningReview'", 
                                            "key": "customer.firstName",
                                            "title": "CUSTOMER_NAME",
                                            "orderNo": 1
                                        }
                                    }
                                },    // "EnterpriseInformation": {
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
                    "References":{
                        "type": "box",
                        "title": "REFERENCES",
                        "orderNo":180,
                        "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
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
                                    "condition": "model.currentStage=='FieldAppraisal' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                    "EnterpriseInformation":{
                        "items":{
                            "SpokeID":{
                                title: "CENTRE_ID",
                                key: "customer.centreId",
                                orderNo:55,
                                condition: "!model.customer.id && (model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal')",
                                type: "lov",
                                required: true, 
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
                            },
                            "SpokeID2":{
                                title: "CENTRE_ID",
                                key: "customer.centreId",
                                orderNo:55,
                                condition: "model.customer.id && (model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal')",
                                readonly: true
                            },
                        }
                    },
                    "EnterpriseFinancials":{
                        "items":{
                            "rawMaterialExpenses":{
                                "items":{
                                    "invoiceDocId1":{
                                        key: "customer.rawMaterialExpenses[].invoiceDocId",
                                        title: "PURCHASE_BILLS",
                                        "condition":"model.customer.rawMaterialExpenses[arrayIndex].rawMaterialType == 'Cash'",
                                        "category": "Loan",
                                        "subCategory": "DOC1",
                                        type: "file",
                                        fileType: "application/pdf",
                                        using: "scanner"
                                    }
                                }
                            },
                            "incomeThroughSales":{
                                "items":{
                                    "invoiceDocId1": {
                                        key: "customer.incomeThroughSales[].invoiceDocId",
                                        type: "file",
                                        "condition": "model.customer.incomeThroughSales[arrayIndex].incomeType =='Cash'",
                                        title: "INVOICE_DOCUMENT",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner"
                                    }
                                }
                            }
                        }
                    },
                    "BankAccounts": {
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
                                                "onChange": function(modelValue, form, model, formCtrl, event) {
                                                    var index = form.key[2];
                                                    var indexBank = form.key[4];
                                                    modelValue = modelValue == null ? 0 : modelValue;
                                                    var nonCashDeposits = 0;
                                                    if (modelValue != null) {
                                                        nonCashDeposits = ( model.customer.customerBankAccounts[index].bankStatements[indexBank].nonCashDeposits != null) ? model.customer.customerBankAccounts[index].bankStatements[indexBank].nonCashDeposits : 0;

                                                        model.customer.customerBankAccounts[index].bankStatements[indexBank].totalDeposits = nonCashDeposits + modelValue;
                                                    }
                                                }
                                            },
                                            "nonCashDeposits": {
                                                "key": "customer.customerBankAccounts[].bankStatements[].nonCashDeposits",
                                                "title": "Non-cash Deposits",
                                                type : "amount",
                                                "orderNo": 117,
                                                "onChange": function(modelValue, form, model, formCtrl, event) {
                                                    var index = form.key[2];
                                                    var indexBank = form.key[4];
                                                    modelValue = modelValue == null ? 0 : modelValue;
                                                    var cashDeposits = 0;
                                                    if (modelValue != null) {
                                                        cashDeposits = ( model.customer.customerBankAccounts[index].bankStatements[indexBank].cashDeposits != null) ? model.customer.customerBankAccounts[index].bankStatements[indexBank].cashDeposits : 0;

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
                    "EnterpriseAssets":{
                        "items": {
                            "enterpriseAssets" : {
                                "items": { 
                                    "assetName":{
                                        key: "customer.enterpriseAssets[].assetName",
                                        condition : "model.customer.enterpriseAssets[arrayIndex].assetType  == 'Furniture' || model.customer.enterpriseAssets[arrayIndex].assetType  == 'Fixtures'",
                                        title: "TYPE",
                                        required:true,
                                        type: "select",
                                        enumCode: "enterprise_asset_name",
                                        orderNo:130,
                                    },
                                    "isHypothecated":{
                                        key: "customer.enterpriseAssets[].isHypothecated",
                                        condition : "model.customer.enterpriseAssets[arrayIndex].assetType  == 'Furniture' || model.customer.enterpriseAssets[arrayIndex].assetType  == 'Fixtures'",
                                        title: "IS_THE_MACHINE_HYPOTHECATED" ,
                                        type: "radios",
                                        titleMap: {
                                            "No": "No",
                                            "Yes": "Yes"
                                        },
                                        orderNo:135,
                                    },
                                    "hypothecatedToUs":{
                                        key: "customer.enterpriseAssets[].hypothecatedToUs",
                                        title: "CAN_BE_HYPOTHECATED_TO_US",
                                        condition : "model.customer.enterpriseAssets[arrayIndex].isHypothecated == 'No'",
                                        type: "radios",
                                        titleMap: {
                                            "No": "No",
                                            "Yes": "Yes"
                                        },
                                        orderNo:140,
                                    },
                                    "assetImageId":{
                                        key: "customer.enterpriseAssets[].assetImageId",
                                        condition : "model.customer.enterpriseAssets[arrayIndex].assetType  == 'Furniture' || model.customer.enterpriseAssets[arrayIndex].assetType  == 'Fixtures'",
                                        title: "IMAGE",
                                        "type": "file",
                                        "fileType": "image/*",
                                        "category": "Loan",
                                        "subCategory": "COLLATERALPHOTO",
                                        orderNo:145,
                                    },
                                }
                            }
                        }
                    }
               }
            }
            var getIncludes = function (model) {
                return [
                    "EnterpriseInformation",
                    "EnterpriseInformation.customerName",
                    "EnterpriseInformation.customerId",
                    "EnterpriseInformation.customerBranchId",
                    "EnterpriseInformation.entityId",
                    "EnterpriseInformation.urnNo",
                    "EnterpriseInformation.centreId",
                    "EnterpriseInformation.SpokeID",
                    "EnterpriseInformation.SpokeID2",
                    //"EnterpriseInformation.oldCustomerId",
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
                    //"EnterpriseInformation.regularEmployees",
                    //"EnterpriseInformation.contractEmployee",
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
                    //"ContactInformation.postOffice",
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
                    //"BankAccounts.customerBankAccounts.bankStatementDocId",
                    "BankAccounts.customerBankAccounts.limit",
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                   // "BankAccounts.customerBankAccounts.bankStatements.openingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.closingBalance",
                   // "BankAccounts.customerBankAccounts.bankStatements.emiAmountdeducted",
                    "BankAccounts.customerBankAccounts.bankStatements.cashDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.nonCashDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",
                    
                    "Liabilities",
                    "Liabilities.liabilities",
                   // "Liabilities.liabilities.liabilityType",
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
                    "EnterpriseFinancials.otherBusinessIncomes",
                    "EnterpriseFinancials.otherBusinessIncomes.incomeSource",
                    "EnterpriseFinancials.otherBusinessIncomes.amount",
                    "EnterpriseFinancials.otherBusinessIncomes.otherBusinessIncomeDate",
                    "EnterpriseFinancials.incomeThroughSales",
                    "EnterpriseFinancials.incomeThroughSales.buyerName",
                    "EnterpriseFinancials.incomeThroughSales.incomeType",
                    "EnterpriseFinancials.incomeThroughSales.invoiceType",
                    "EnterpriseFinancials.incomeThroughSales.amount",
                    "EnterpriseFinancials.incomeThroughSales.incomeSalesDate",
                    "EnterpriseFinancials.incomeThroughSales.invoiceDocId",
                    "EnterpriseFinancials.incomeThroughSales.invoiceDocId1",
                    "EnterpriseFinancials.expenditures",
                    "EnterpriseFinancials.expenditures.expenditureSource",
                    "EnterpriseFinancials.expenditures.annualExpenses",
                    "EnterpriseFinancials.expenditures.frequency",
                    "EnterpriseFinancials.expenditures.billDocId",
                    "EnterpriseFinancials.rawMaterialExpenses",
                    "EnterpriseFinancials.rawMaterialExpenses.vendorName",
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialType",
                    "EnterpriseFinancials.rawMaterialExpenses.amount",
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialDate",
                    "EnterpriseFinancials.rawMaterialExpenses.invoiceDocId",
                    "EnterpriseFinancials.rawMaterialExpenses.invoiceDocId1",
                   
                    
                    "EmployeeDetails",
                    "EmployeeDetails.noOfFemaleEmployees",
                    "EmployeeDetails.noOfMaleEmployees",
                    "EmployeeDetails.avgMonthlySalary",
                    
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
                    "EnterpriseAssets.enterpriseAssets.valueOfAsset", 
                    "EnterpriseAssets.enterpriseAssets.details",
                    "EnterpriseAssets.enterpriseAssets.assetName",
                    "EnterpriseAssets.enterpriseAssets.isHypothecated",
                    "EnterpriseAssets.enterpriseAssets.hypothecatedToUs",
                    "EnterpriseAssets.enterpriseAssets.assetImageId", 
                     
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
                    
                    "CurrentAssets",
                    "CurrentAssets.currentAssets",
                    "CurrentAssets.currentAssets.description",
                    "CurrentAssets.currentAssets.assetType",
                    "CurrentAssets.currentAssets.assetValue",
                    "CurrentAssets.currentAssets.isHypothecated",
                    "CurrentAssets.currentAssets.assetImageId",
                    
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
                    
                    "EnterpriseReferences",
                    "EnterpriseReferences.verifications",
                    "EnterpriseReferences.verifications.relationship",
                    "EnterpriseReferences.verifications.businessName",
                    "EnterpriseReferences.verifications.referenceFirstName",
                    "EnterpriseReferences.verifications.mobileNo",
                    "EnterpriseReferences.verifications.address",
                   // "EnterpriseReferences.verifications.knownSince",
                    //"EnterpriseReferences.verifications.goodsSold",
                    //"EnterpriseReferences.verifications.goodsBought",
                    //"EnterpriseReferences.verifications.paymentTerms",
                    //"EnterpriseReferences.verifications.modeOfPayment",
                    //"EnterpriseReferences.verifications.outstandingPayable",
                    //"EnterpriseReferences.verifications.outstandingReceivable",
                    //"EnterpriseReferences.verifications.customerResponse"
                    
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
                                    "EnterpriseFinancials.rawMaterialExpenses",
                                    "References"
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
                                    "EnterpriseFinancials.marginDetails",
                                    "References"                   
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
                                    "EnterpriseReferences.verifications.customerResponse",,
                                    "References"

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
                                    // "EnterpriseInformation.businessSubsector": {
                                    //     "required": true,
                                    //     "resolver": "BusinessSubsectorLOVConfiguration"
                                    // },
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
                                    "ProxyIndicators",
                                    "References"
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
                                    },
                                    "EnterpriseReferences":{
                                        "readonly": true
                                    },
                                    "EnterpriseReferences.verifications":{
                                        "readonly": true
                                    }
                                    
                                }
                            },  
                            "ScreeningReview":{
                                "excludes": [
                                    "CurrentAssets",
                                    "EnterpriseAssets",
                                    "BuyerDetails",
                                    "ProxyIndicators",
                                    "SuppliersDeatils",
                                    "Machinery",
                                    "EnterpriseReferences",
                                    "EnterpriseReferences.verifications",
                                    //"EnterpriseInformation.customerId",
                                    "References"
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
                                        "orderNo": 110,
                                        "readonly": false
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
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    }
                                    
                                }
                            },  
                            "Application": {
                                "excludes": [
                                    "ProxyIndicators",
                                    "BankAccounts",
                                    "EnterpriseFinancials"
                                ],
                                "overrides": {
                                    "EnterpriseReferences":{

                                    },
                                    "EnterpriseAssets":{
                                        "title":"ENTERPRISE_ASSETS"
                                    },
                                    "EnterpriseInformation.customerBranchId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.centreId": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.oldCustomerId": {
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
                                    // "Liabilities": {
                                    //     "readonly": true
                                    // },
                                    // "EnterpriseAssets": {
                                    //     "readonly": true
                                    // },
                                    "BankAccounts.customerBankAccounts.customerBankName": {
                                        "readonly": true
                                    },
                                    "BankAccounts.customerBankAccounts.customerBankBranchName": {
                                        "readonly": true
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
                                    "EnterpriseReferences": {
                                        "readonly": false
                                    }
                                    
                                }
                            }, 
                            "ApplicationReview":{
                                "excludes": [
                                    "ProxyIndicators",
                                     //"EnterpriseInformation.customerId"
                                    
                                ],
                                "overrides": {
                                    "EnterpriseReferences.EnterpriseReferences.verifications":
                                     {
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
                                        "title":"ENTERPRISE_ASSETS",
                                        "readonly": true
                                    },
                                    "currentAssets": {
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
                                    "References": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    }
                                }
                            },
                            "Screening":{
                                "excludes": [
                                    "CommercialCBCheck",
                                    "ProxyIndicators",
                                    "BuyerDetails",
                                    "CurrentAssets",
                                    "EnterpriseAssets",
                                    "SuppliersDeatils",
                                    "Machinery",
                                    "EnterpriseReferences",
                                    "EnterpriseReferences.verifications",
                                    "References"
                                ],
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "orderNo": 10
                                    },                                   
                                    "ContactInformation": {
                                        "orderNo": 20
                                    },
                                    "BankAccounts": {
                                        "orderNo": 30
                                    },
                                    "Liabilities": {
                                        "orderNo": 40
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 60
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 50
                                    },
                                    "BankAccounts.customerBankAccounts.accountNumber": {
                                        "required": false
                                   },
                                   "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                                       "title": "CONFIRMED_ACCOUNT_NUMBER",
                                       "required": false
                                    },
                                    "BankAccounts.customerBankAccounts.ifscCode": {
                                        "required": true,
                                        "resolver": "IFSCCodeLOVConfiguration"
                                    },
                                    "BankAccounts.customerBankAccounts.isDisbersementAccount":{
                                        "type":"checkbox"
                                    },
                                    "BankAccounts.customerBankAccounts.bankStatements.startMonth":{
                                        "required":false
                                    },
                                    "EmployeeDetails.avgMonthlySalary": {
                                        "condition": "model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 "
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
                                }
                            },
                            "FieldAppraisal":{
                                "excludes": [
                                    "EnterpriseReferences"
                                    // "EnterpriseFinancials.currentAsset",
                                    // "EnterpriseFinancials.otherBusinessIncomes",
                                    // "EnterpriseReferences",
                                    // "EnterpriseFinancials.expenditures",
                                    // "EnterpriseFinancials.incomeThroughSales",
                                    // "EnterpriseFinancials.enterpriseMonthlySales",
                                    // "EnterpriseFinancials.dailySales",
                                    // "EnterpriseFinancials.marginDetails",                        
                                    // "EnterpriseFinancials.rawMaterialExpenses"
                                ],
                                "overrides": {
                                    "ProxyIndicators":{
                                        "readonly":false,
                                        "orderNo": 120
                                    },
                                    "Machinery":{
                                        "orderNo":110,
                                        "readonly":true
                                    },
                                    "CommercialCBCheck":{
                                        "readonly":true,
                                        "orderNo": 140
                                    },
                                    "BuyerDetails":{
                                        "orderNo":50,
                                        "readonly":true
                                    },
                                    "EnterpriseInformation": {
                                        "orderNo": 10
                                    },                                   
                                    "References": {
                                        "orderNo": 130
                                    },                                   
                                    "ContactInformation": {
                                        "orderNo": 20
                                    },
                                    // "EnterpriseFinancials.incomeThroughSales": {
                                    //     "title": "SALES_INFO_DETAILS"
                                    // },
                                    "BankAccounts": {
                                        "orderNo": 30
                                    },
                                    "SuppliersDeatils": {
                                        "orderNo": 60
                                    },
                                    "CurrentAssets":{
                                        "orderNo":80
                                    },
                                    "EnterpriseAssets":{
                                        "orderNo":90,
                                        "title":"ENTERPRISE_ASSETS"
                                    },
                                    "Liabilities": {
                                        "orderNo": 40,
                                        "title": "BUSINESS_LIABILITIES"
                                    },
                                    "IndividualInformation.centreId" :{
                                        "resolver": "CentreLovConfiguration"
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 100
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 70
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
                            "Sanction":
                            {
                                "excludes": [
                                    //"ProxyIndicators"
                                    // "EnterpriseFinancials.otherBusinessIncomes",
                                    // "EnterpriseReferences",
                                    // "EnterpriseFinancials.expenditures",
                                    // "EnterpriseFinancials.incomeThroughSales",
                                    // "EnterpriseFinancials.enterpriseMonthlySales",
                                    // "EnterpriseFinancials.dailySales",
                                    // "EnterpriseFinancials.marginDetails",                        
                                    // "EnterpriseFinancials.rawMaterialExpenses"
                                ],
                                "overrides": {
                                    "Machinery":{
                                        "readonly":true
                                    },
                                    "ProxyIndicators":{
                                        "readonly":true,
                                        "orderNo": 100

                                    },
                                    "SuppliersDeatils":{
                                        "readonly":true
                                    },
                                    "CurrentAssets":{
                                        "readonly":true
                                    },
                                    "CurrentAssets.currentAssets":{
                                        "readonly":true
                                    },
                                    "EnterpriseAssets":{
                                        "readonly":true
                                    },
                                    "CommercialCBCheck":{
                                        "readonly":true,
                                        "orderNo": 90
                                    },
                                    "BuyerDetails":{
                                        "readonly":true
                                    },
                                    "EnterpriseInformation": {
                                        "orderNo": 10,
                                        "readonly":true
                                    },                                   
                                    "ContactInformation": {
                                        "orderNo": 20,
                                        "readonly":true
                                    },
                                    "EnterpriseFinancials.incomeThroughSales": {
                                        "title": "SALES_INFO_DETAILS",
                                        "readonly":true
                                    },
                                    "BankAccounts": {
                                        "orderNo": 30,
                                        "readonly":true
                                    },
                                    "Liabilities": {
                                        "orderNo": 40,
                                        "title": "BUSINESS_LIABILITIES",
                                        "readonly":true
                                    },
                                    "IndividualInformation.centreId" :{
                                        "resolver": "CentreLovConfiguration",
                                        "readonly":true
                                    },
                                    "EmployeeDetails": {
                                        "orderNo": 50,
                                        "readonly":true
                                    },
                                    "EnterpriseFinancials": {
                                        "orderNo": 60,
                                        "readonly":true
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
                                    },
                                    "EnterpriseReferences":{
                                        "required": true
                                    },
                                    "EnterpriseReferences.verifications":{
                                        "required": true
                                    },
                                    "EnterpriseReferences":{
                                        "readonly": true
                                    },
                                    "EnterpriseReferences.verifications":{
                                        "readonly": true
                                    },
                                    "References": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    }
                                }
                            },
                            "FieldAppraisalReview":{
                                "overrides":{
                                    "References": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    }
                                }
                            },
                            "CentralRiskReview":{
                                "overrides":{
                                    "References": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    }
                                }
                            },
                            "CreditCommitteeReview":{
                                "overrides":{
                                    "References": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    }
                                }
                            },
                            "loanView":{
                                "overrides":{
                                    "References": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    }
                                }
                            },
                            "Rejected":{
                                "overrides":{
                                    "EnterpriseInformation":{
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.customerId":{
                                        "key": "customer.firstName",
                                        "title":"CUSTOMER_NAME"
                                    },
                                    "ContactInformation":
                                    {
                                        "readonly": true
                                    },
                                    "BankAccounts":{
                                        "readonly": true
                                    },
                                    "Liabilities":{
                                        "readonly": true
                                    },
                                    "EnterpriseFinancials":{
                                        "readonly": true
                                    },
                                    "EmployeeDetails":
                                    {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck":{
                                        "readonly": true
                                    },
                                    "BuyerDetails":{
                                        "readonly": true
                                    },
                                    "SuppliersDeatils":{
                                        "readonly": true
                                    },
                                    "Machinery":{
                                        "readonly": true
                                    },
                                    "CurrentAssets":{
                                        "readonly": true
                                    },
                                   "ProxyIndicators":{
                                    "readonly": true
                                   },
                                    "EnterpriseReferences":{
                                        "readonly": true
                                    },
                                    "References":
                                    {
                                        "readonly": true
                                    }
                    
                                }
                            }
                                // "Televerification": {
                            

                            }


                    }
            }
            var formRequest = function(model){
                return {
                "overrides": overridesFields(model),
                "includes": getIncludes(model),
                "excludes": [],
                "options": {
                    "additions": [
                        {
                            "type": "actionbox",
                           // "condition": "model.customer.currentStage == 'Application'",
                           "condition": "model.customer.id && !(model.currentStage=='ApplicationReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView')",
                            "orderNo": 220,
                            "items": [
                                {
                                    "type": "button",
                                    "title": "COMPLETE_ENROLMENT",//PROCEED
                                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                }
                            ]
                        },
                        {
                            "type": "actionbox",
                            "condition": "!model.customer.currentStage",
                            "orderNo": 220,
                            "items": [
                                {
                                    "type": "submit",
                                    "title": "SUBMIT"
                                   
                                }
                            ]
                        },
                        // {
                        //     "type": "actionbox",
                        //     "condition": "model.customer.currentStage && (model.currentStage=='KYC' || model.currentStage == 'Appraisal' || model.currentStage=='Screening')",
                        //     "orderNo": 220,
                        //     "items": [
                        //         {
                        //             "type": "button",
                        //             "title": "UPDATE",
                        //             "onClick": "actions.proceed(model, formCtrl, form, $event)"
                        //         }
                        //     ]
                        // }
                    ],
                    "repositoryAdditions":repositoryAdditions(model)
                }
            
            }
        };
            

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
                    // if( model.currentStage=="FieldAppraisal"){

                    // }else{
                    model.customer = model.enrolmentProcess.customer;
                    var branchId = SessionStore.getBranchId();
                    if(branchId && !model.customer.customerBranchId)
                        {
                            model.customer.customerBranchId = branchId;
                    };
                //}
                    /* End of setting data for the form */
                    console.log("model information");
                    console.log(model);

                    var self = this;
                        UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(), configFile(), model)
                        })
                        .then(function(form){
                            console.log(form);
                            self.form = form;
                        });
                },
                offline: false,
                offlineInitialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.loanProcess = bundleModel.loanProcess;
                    if (_.hasIn(model.loanProcess, 'loanCustomerEnrolmentProcess')) {
                        model.enrolmentProcess = model.loanProcess.loanCustomerEnrolmentProcess;
                        model.customer = model.enrolmentProcess.customer;
                    }
                    var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    var self = this;
                    p1.then(function (repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
                    })
                },
                getOfflineDisplayItem: function(item, index){
                    return [
                        item.customer.firstName,
                        item.customer.centreId,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    
                    "lead-loaded": function(bundleModel, model, obj){
                        $log.info(obj);
        
                        var overlayData = function(model, obj){
                            try {
                               // model.customer.mobilePhone = obj.mobileNo;
                                model.customer.gender = obj.gender;
                                model.customer.firstName = obj.businessName;
                                model.customer.maritalStatus=obj.maritalStatus;
                                model.customer.customerBranchId=obj.branchId;
                                model.customer.centreId=obj.centreId;
                                model.customer.centreName=obj.centreName;
                                //model.customer.street=obj.addressLine2;
                                //model.customer.doorNo=obj.addressLine1;
                                model.customer.pincode=obj.pincode;
                                model.customer.district=obj.district;
                                model.customer.state=obj.state;
                                model.customer.locality=obj.area;
                                model.customer.villageName=obj.cityTownVillage;
                               // model.customer.landLineNo=obj.alternateMobileNo;
                               // model.customer.dateOfBirth=obj.dob;
                               // model.customer.age=obj.age;
                               // model.customer.mobilePhone = obj.mobileNo;
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
                    
                    "applicant-updated": function(bundleModel, model, params){
                        $log.info("inside applicant-updated of EnterpriseEnrolment2");
                        /* Load an existing customer associated with applicant, if exists. Otherwise default details*/
                        Queries.getEnterpriseCustomerId(params.customer.id)
                            .then(function(response){
                                if (!response || !response.customer_id){
                                    return false;
                                }

                                if (response.customer_id == model.customer.id){
                                   // return false;
                                }

                                return EnrolmentProcess.fromCustomerID(response.customer_id).toPromise();
                            })
                            .then(function(enrolmentProcess){
                                if (!enrolmentProcess){
                                    /* IF no enrolment present, reset to applicant */
                                    if (_.hasIn(model.customer, 'enterpriseCustomerRelations') && _.isArray(model.customer.enterpriseCustomerRelations) && model.customer.enterpriseCustomerRelations.length != 0){
                                        model.customer.enterpriseCustomerRelations[0].linkedToCustomerId = params.customer.id;
                                        model.customer.enterpriseCustomerRelations[0].linkedToCustomerName = params.customer.firstName;
                                    }
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
                                        BundleManager.pushEvent("new-"+model._bundlePageObj.pageClass, model._bundlePageObj, enrolmentProcess);
                            
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
                        //model.enrolmentProcess.customer = model.customer;
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
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', err.message, 5000);                                
                                PageHelper.hideLoader();
                            });
                    }

                }
            };
        }
    }
});
