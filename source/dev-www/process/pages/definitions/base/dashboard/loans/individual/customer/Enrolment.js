define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function(EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
 
    return {
        pageUID: "base.dashboard.loans.individual.customer.Enrolment",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring','irfFormToggler', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],
 
        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring,irfFormToggler, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
                            AngularResourceService.getInstance().setInjector($injector);
                            var overridesFields_businessbasic = function(bundlePageObj){
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
                    "ContactInformation.mobilePhone" : {
                        "inputmode": "number",
                        "numberType": "number",
                        "type": "number",
                    },
                    "Machinery.fixedAssetsMachinaries.hypothecatedToUs": {
                        "title": "CAN_BE_HYPOTHECATED_TO_US"

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
                        "orderNo":140 ,
                        readonly:true
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
                        "orderNo": 50
                    },
                    "ContactInformation": {
                        "orderNo": 20
                    },
                    "BankAccounts": {
                        "orderNo": 30
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
                    "EnterpriseInformation.enterpriseRegistrations.registrationNumber":{
                        "required":true
                    },
                    "EnterpriseInformation.enterpriseRegistrations.registeredDate":{
                        "required":true
                    },
                    "EmployeeDetails.avgMonthlySalary":{
                        "condition":"model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 ",
                    },
                    "Machinery.fixedAssetsMachinaries":{
                        "title":"MACHINERY",
                    },
                    "Machinery.fixedAssetsMachinaries.machineDescription":{
                        "required":true
                    },
                    "Machinery.fixedAssetsMachinaries.manufacturerName":{
                        "required":true
                    },
                    "ContactInformation.distanceFromBranch":{
                        "enumCode": "distanceFromBranchOffice",
                    }  
                    
            }
            }
            var repositoryAdditions_businessbasic = function(bundlePageObj){
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
                                    "condition": "model.currentStage=='FieldAppraisal'",
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
                            },
                            "SpokeID2":{
                                title: "CENTRE_ID",
                                key: "customer.centreId",
                                orderNo:55,
                                condition: "model.customer.id",
                                readonly: true
                            },
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
            var getIncludes_businessbasic = function (model) {
                return [
                    "EnterpriseInformation",
                    "EnterpriseInformation.customerId",
                    "EnterpriseInformation.customerBranchId",
                    "EnterpriseInformation.entityId",
                    "EnterpriseInformation.urnNo",
                    "EnterpriseInformation.centreId",
                    "EnterpriseInformation.SpokeID",
                    "EnterpriseInformation.SpokeID2",
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
                    //"EnterpriseInformation.noOfPartners",
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
                    //"EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed",
                    //"EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate",

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
                    "BankAccounts.customerBankAccounts.bankStatements.openingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.closingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.emiAmountdeducted",
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
                    "Machinery.fixedAssetsMachinaries.workProcess",
                    "Machinery.fixedAssetsMachinaries.machineModel",
                    "Machinery.fixedAssetsMachinaries.serialNumber",
                    "Machinery.fixedAssetsMachinaries.purchasePrice",
                    "Machinery.fixedAssetsMachinaries.machinePurchasedYear",
                    "Machinery.fixedAssetsMachinaries.presentValue",
                    "Machinery.fixedAssetsMachinaries.depreciationPercentage",
                    "Machinery.fixedAssetsMachinaries.marketPrice",
                    "Machinery.fixedAssetsMachinaries.finalPrice",
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
            
            var configFile_businessbasic = function() {
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
                                    "EnterpriseInformation":{
                                        "orderNo":10
                                    },
                                    "ContactInformation":{
                                        "orderNo":20
                                    },
                                    "Liabilities":{
                                        "orderNo":30
                                    },
                                    "BuyerDetails":{
                                        "orderNo":40
                                    },
                                    "SuppliersDeatils":{
                                        "orderNo":50
                                    },
                                    "SuppliersDeatils.supplierDetails.supplierName":{
                                        "required":true
                                    },
                                    "CurrentAssets":{
                                        "orderNo":60
                                    },
                                    "EnterpriseAssets":{
                                        "title":"ENTERPRISE_ASSETS",
                                        "orderNo":70
                                    },
                                    "EnterpriseAssets.enterpriseAssets.assetType":{
                                        "required":true
                                    },
                                    "EnterpriseAssets.enterpriseAssets.valueOfAsset":{
                                        "required":true
                                    },
                                    "EmployeeDetails":{
                                        "orderNo":80
                                    },
                                    "Machinery":{
                                        "type":"box",
                                        "title":"MACHINERY",
                                        "orderNo":90,
                                        "readonly":false,
                                         "items":{
                                            "fixedAssetsMachinaries":{
                                               "key":"customer.fixedAssetsMachinaries",
                                                "type":"array",
                                                "startEmpty": true,
                                                "title":"MACHINERY",
                                                "items":{
                                                    "machineDescription":{
                                                        "key":"customer.fixedAssetsMachinaries[].machineDescription",
                                                        "title":"MACHINE_DESCRIPTION",
                                                        "required": true,
                                                        "type": "string",
                                                        "orderNo":10
                                                     }, 
                         
                                                     "manufacturerName":{
                                                        key: "customer.fixedAssetsMachinaries[].manufacturerName",
                                                        type:"string",
                                                        required:true,
                                                        "orderNo":20,
                                                        // type: "lov",
                                                       // autolov: true,
                                                        // inputMap: {
                                                        //     "machineName": {
                                                        //     "key": "customer.fixedAssetsMachinaries[].manufacturerName",
                                                        //     "title": "MANUFACTURER_NAME"
                                                        // },
                        
                                                    },
                                                    //     outputMap: {
                                                    //          "machineName": "customer.fixedAssetsMachinaries[arrayIndex].manufacturerName",
                                                    //     },
                                                    //     searchHelper: formHelper,
                                                    //     search: function(inputModel, form, model) {
                                                    //         if (!inputModel.machineName) {
                                                    //             return $q.reject();
                                                    //         }
                                                    //         return Queries.searchMachineName(inputModel.machineName);
                                                    //     },
                                                    //     getListDisplayItem: function(item, index) {
                                                    //         return [
                                                    //             item.machineName
                                                    //         ];
                                                    //     }
                                                    //  }, 
                                                     "machineType":{
                                                        key:"customer.fixedAssetsMachinaries[].machineType",
                                                        title:"MACHINE_TYPE",
                                                        "orderNo":30,
                                                        type:"string"
                                                        //type: "lov",
                                                       // autolov: true,
                                                        //lovonly:true,
                                                        //searchHelper: formHelper,
                                                        
                                                    //     outputMap: {
                                                    //          "machineType": "customer.fixedAssetsMachinaries[arrayIndex].machineType",
                                                    //          "depreciationPercentage": "customer.fixedAssetsMachinaries[arrayIndex].depreciationPercentage"
                                                    //      },
                                                    //     search: function(inputModel, form, model) {
                                                            
                                                    //         return Queries.searchMachineType(
                                                    //             model.customer.fixedAssetsMachinaries[model.arrayIndex].manufacturerName);
                                                    //     },
                                                    //     getListDisplayItem: function(item, index) {
                                                    //         return [
                                                    //             item.machineType,
                                                    //             item.depreciationPercentage
                                                    //         ];
                                                    //     },
                                                    //     onSelect: function(result, model, context) {
                                                            
                                                    //        if(model.customer.fixedAssetsMachinaries[context.arrayIndex].workProcess){                                                                         
                                                    //             model.customer.fixedAssetsMachinaries[context.arrayIndex].workProcess=null;                                  
                                                    //             model.customer.fixedAssetsMachinaries[context.arrayIndex].machineModel=null;
                                                               
                                                    //             model.customer.fixedAssetsMachinaries[context.arrayIndex].marketPrice=null;
                                                    //             model.customer.fixedAssetsMachinaries[context.arrayIndex].finalPrice=null;
                                                    //        }
                                                    //         $log.info(result);
                                                    //     }
                                                    }, 
                                                     "workProcess":{
                                                        key:"customer.fixedAssetsMachinaries[].workProcess",
                                                        title:"WORK_PROCESS",
                                                        type:"string",
                                                        "orderNo":40
                                                       // type: "lov",
                                                        // autolov: true,
                                                        // lovonly:true,
                                                        // searchHelper: formHelper,
                                                        
                                                        // outputMap: {
                                                        //      "workProcess": "customer.fixedAssetsMachinaries[arrayIndex].workProcess"
                                                        //  },
                                                        // search: function(inputModel, form, model) {
                                                            
                                                        //     return Queries.searchMachineWorkProcess(
                                                        //         model.customer.fixedAssetsMachinaries[model.arrayIndex].manufacturerName,
                                                        //         model.customer.fixedAssetsMachinaries[model.arrayIndex].machineType);
                                                        // },
                                                        // getListDisplayItem: function(item, index) {
                                                        //     return [
                                                        //         item.workProcess
                                                        //     ];
                                                        // },
                                                        // onSelect: function(result, model, context) {
                                                        //    if(model.customer.fixedAssetsMachinaries[context.arrayIndex].machineModel){
                                                        //         model.customer.fixedAssetsMachinaries[context.arrayIndex].machineModel=null;
                                                        //         model.customer.fixedAssetsMachinaries[context.arrayIndex].depreciationPercentage=null;
                                                        //         model.customer.fixedAssetsMachinaries[context.arrayIndex].marketPrice=null;
                                                        //         model.customer.fixedAssetsMachinaries[context.arrayIndex].finalPrice=null;
                                                        //    }
                                                        //     $log.info(result);
                                                        // }
                                                     }, 
                                                    
                                                     "machineModel":{
                                                        key: "customer.fixedAssetsMachinaries[].machineModel",
                                                        title:"MACHINE_MODEL",
                                                        type:"string",
                                                        "orderNo":50
                                                        // type: "lov",
                                                        // autolov: true,
                                                        // searchHelper: formHelper,
                                                       
                                                        // outputMap: {
                                                        //      "machineModel": "customer.fixedAssetsMachinaries[arrayIndex].machineModel"
                                                        //  },
                                                        // search: function(inputModel, form, model) {
                                                            
                                                        //     return Queries.searchMachineModel(
                                                        //         model.customer.fixedAssetsMachinaries[model.arrayIndex].manufacturerName,
                                                        //         model.customer.fixedAssetsMachinaries[model.arrayIndex].machineType,
                                                        //         model.customer.fixedAssetsMachinaries[model.arrayIndex].workProcess);
                                                        // },
                                                        // getListDisplayItem: function(item, index) {
                                                        //     return [
                                                        //         item.machineModel
                                                        //     ];
                                                        // },
                                                        // onSelect: function(result, model, context) {
                                                        //     //model.customer.fixedAssetsMachinaries[context.arrayIndex].manufacturerName=result.machineName;
                                                        //     priceCalculation(null, null, model);
                                                        //     if (model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice && model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue) {
                                                        //         if(model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice <=0 && model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue > 0) {
                                                        //             model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = Math.round(model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue);
                                                        //         }                                        
                                                        //         else if(model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice > 0 && model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue <=0){
                                                        //             model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = Math.round(model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice);
                                                        //         }                                        
                                                        //         else{
                                                        //          model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = Math.round(((model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue+model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice) /2)*100)/100;
                                                        //         }    
                                                        //     } else {
                                                        //         model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = null;
                                                        //     }
                                                        // }
                                                     },
                                                     "serialNumber":{
                                                         key: "customer.fixedAssetsMachinaries[].serialNumber",
                                                         title:"SERIAL_NUMBER",
                                                         type: "string",
                                                         required: true,
                                                         "orderNo":60,
                                                     },
                                                     "purchasePrice":{
                                                        key: "customer.fixedAssetsMachinaries[].purchasePrice",
                                                        title:"PURCHASE_PRICE",
                                                        type: "amount",
                                                        "orderNo":70,
                                                        required: true,
                                                        "onChange": function(modelValue, form, model) {
                                                            priceCalculation(modelValue, form, model);
                                                            if (model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice && model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue) {
                                                                model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = Math.round(((model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue+model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice) /2)*100)/100;
                                                            } else {
                                                                model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = null;
                                                            }
                                                        }
                         
                                                     },
                                                     "machinePurchasedYear":{
                                                        key: "customer.fixedAssetsMachinaries[].machinePurchasedYear",
                                                        title:"MACHINE_PURCHASED_YEAR",
                                                        type: "number",
                                                        "orderNo":80,
                                                        "schema":{
                                                            "minimum":1000,
                                                            "maximum":9999
                                                        },
                                                        "onChange": function(modelValue, form, model) {
                                                            priceCalculation(modelValue, form, model);
                                                        }
                                                     },    
                                                     "presentValue":{
                                                        key: "customer.fixedAssetsMachinaries[].presentValue",
                                                        title:"PRESSENT_VALUE",
                                                        type: "amount",
                                                        required: true,
                                                        "orderNo":90,
                                                        "onChange": function(modelValue, form, model) {
                                                            if (model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice && model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue) {
                                                                model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = Math.round(((model.customer.fixedAssetsMachinaries[model.arrayIndex].presentValue+model.customer.fixedAssetsMachinaries[model.arrayIndex].marketPrice) /2)*100)/100;
                                                            } else {
                                                                model.customer.fixedAssetsMachinaries[model.arrayIndex].finalPrice = null;
                                                            }
                                                        }
                                                     },
                                                    //  "depreciationPercentage":{
                                                    //      key: "customer.fixedAssetsMachinaries[].depreciationPercentage",
                                                    //      readonly:true,
                                                    //      title:"DEPRECIATION_PERCENTAGE",
                                                    //      "orderNo":100,
                         
                                                    //  },
                                                    //  "marketPrice":{
                                                    //      key: "customer.fixedAssetsMachinaries[].marketPrice",
                                                    //      readonly:true,
                                                    //      title:"MARKET_PRICE",
                                                    //      "orderNo":110,
                         
                                                    //  },
                                                    //  "finalPrice":{
                                                    //      key: "customer.fixedAssetsMachinaries[].finalPrice",
                                                    //      readonly:true,
                                                    //      title:"FINAL_PRICE",
                                                    //      "orderNo":120,
                                                    //  },
                                                     "isTheMachineNew":{
                                                         key: "customer.fixedAssetsMachinaries[].isTheMachineNew",
                                                         title:"IS_THE_MACHINE_NEW",
                                                         type: "select",
                                                         enumCode: "decisionmaker",
                                                         "orderNo":130,
                                                     },
                                                     "fundingSource":{
                                                         key: "customer.fixedAssetsMachinaries[].fundingSource",
                                                         title:"FUNDING_SOURCE",
                                                         type: "select",
                                                         enumCode: "machinery_funding_source",
                                                         "orderNo":140,
                                                     },
                                                     "isTheMachineHypothecated":{
                                                        key: "customer.fixedAssetsMachinaries[].isTheMachineHypothecated",
                                                        title:"IS_THE_MACHINE_HYPOTHECATED",
                                                        type: "radios",
                                                        enumCode: "decisionmaker",
                                                        "orderNo":150,
                                                        onChange: function(modelValue, form, model, formCtrl, event) {
                                                            if (modelValue && modelValue.toLowerCase() === 'no')
                                                                model.customer.fixedAssetsMachinaries[form.arrayIndex].hypothecatedTo = null;
                                                            else if(modelValue && modelValue.toLowerCase() === 'yes')
                                                                model.customer.fixedAssetsMachinaries[form.arrayIndex].hypothecatedToUs = null;
                                                        }
                                                     },
                                                     "hypothecatedTo":{
                                                         key: "customer.fixedAssetsMachinaries[].hypothecatedTo",
                                                         title:"HYPOTHECATED_TO",
                                                         type: "string",
                                                         "orderNo":160,
                                                         condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                                                     },
                                                     "hypothecatedToUs":{
                                                         key: "customer.fixedAssetsMachinaries[].hypothecatedToUs",
                                                         title:"CAN_BE_HYPOTHECATED_TO_US",
                                                         type: "radios",
                                                         enumCode: "decisionmaker",
                                                         "orderNo":170,
                                                         condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                                                     },
                                                     "machinePermanentlyFixedToBuilding":{
                                                         key: "customer.fixedAssetsMachinaries[].machinePermanentlyFixedToBuilding",
                                                         title:"MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                                         type: "radios",
                                                         enumCode: "decisionmaker",
                                                         "orderNo":180,
                                                     },
                                                     "machineBillsDocId":{
                                                        key: "customer.fixedAssetsMachinaries[].machineBillsDocId",
                                                        title:"MACHINE_BILLS",
                                                        "category":"Loan",
                                                        "subCategory":"DOC1",
                                                        type: "file",
                                                        fileType:"application/pdf",
                                                        using: "scanner",
                                                        offline:true,
                                                        "orderNo":190,
                                                     },
                                                     "machineImage":{
                                                        key: "customer.fixedAssetsMachinaries[].machineImage",
                                                        title:"MACHINE_IMAGE",
                                                        "type": "file",
                                                        "fileType": "image/*",
                                                        "category": "Loan",
                                                        "subCategory": "COLLATERALPHOTO",
                                                        "orderNo":200,
                                                        offline:true
                                                     },
                                                    }
                                              }
                                            }
                                     },
                                    "References":{
                                        "orderNo":100
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
                                        "orderNo": 110,
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
                                        "readonly": true
                                    }
                                    
                                }
                            }, 
                            "ApplicationReview":{
                                "excludes": [
                                    "ProxyIndicators"
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
                                    "References",
                                    "EmployeeDetails.avgMonthlySalary"
                                ],
                                "overrides": {
                                    "BankAccounts.customerBankAccounts.accountNumber": {
                                        "required": false
                                },
                                "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                                    "title": "CONFIRMED_ACCOUNT_NUMBER",
                                    "required": false
                                },
                                }
                        },
                        "FieldAppraisal":{
                            "excludes": [
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
                                    "orderNo": 100
                                },
                                "Machinery":{
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
                                    "readonly":true
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
                                    "readonly":true
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
                                "References": {
                                    "readonly": true
                                },
                            }
                        },
                        "FieldAppraisalReview":{
                            "overrides":{
                                "References": {
                                    "readonly": true
                                }
                            }
                        },
                        "CentralRiskReview":{
                            "overrides":{
                                "References": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditCommitteeReview":{
                            "overrides":{
                                "References": {
                                    "readonly": true
                                }
                            }
                        },
                        "loanView":{
                            "overrides":{
                                "References": {
                                    "readonly": true
                                }
                            }
                        },
                        "Rejected":{
                            "overrides":{
                                "References": {
                                    "readonly": true
                                }
                            }
                        }
                            // "Televerification": {
                        

                        }


                    }
            }
            var overridesFields_businessFinancials = function(bundlePageObj){
                return{
                 "BankAccounts":{
                     colClass: "col-sm-12",
                     orderNo:10
                 },
                 "BankAccounts.customerBankAccounts.ifscCode":{
                     required:true
                 },
                 "BankAccounts.customerBankAccounts":{
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
                 "BankAccounts.customerBankAccounts.accountNumber":{
                     required:false,
                     type: "password",
                     inputmode: "number",
                     numberType: "tel"
                 },
                 "BankAccounts.customerBankAccounts.confirmedAccountNumber":{
                     inputmode: "number",
                     numberType: "tel",
                     title: "CONFIRMED_ACCOUNT_NUMBER",
                 },
                 "BankAccounts.customerBankAccounts.sanctionedAmount":{
                     condition: "model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                     type: "amount",
                     required: true,
                 },
                 "BankAccounts.customerBankAccounts.bankStatements":{
                    "key": "customer.customerBankAccounts[].bankStatements",
                     type: "datatable",
                     startEmpty: true,
                     resolver:"BusinessBankStatementsDTElementConfiguration",
                 },
                 "BankAccounts.customerBankAccounts.isDisbersementAccount":{
                     type: "checkbox"
                 },
                 "EnterpriseFinancials":{
                     colClass: "col-sm-12",
                     orderNo:20
                 },
                 "EnterpriseFinancials.monthlyTurnover":{
                     required:true
                 },
                 "IncomeThroughSales":{
                     orderNo:30
                 },
                 "Expenditures":{
                     orderNo:40
                 },
                 "RawMaterialExpenses":{
                     orderNo:50
                 },
                 "EnterpriseFinancials.otherBusinessIncomes.incomeSource":{
                    required:true
                 },
                 "EnterpriseFinancials.otherBusinessIncomes.amount":{
                    required:true
                 }
                 
                }
             }
             var repositoryAdditions_businessFinancials = function(bundlePageObj){
                return{
                }
             }
             var getIncludes_businessFinancials = function (model) {
                 return[
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
                     //"BankAccounts.customerBankAccounts.bankStatementDocId",
                     "BankAccounts.customerBankAccounts.bankStatements",
                     "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                     "BankAccounts.customerBankAccounts.bankStatements.openingBalance",
                     "BankAccounts.customerBankAccounts.bankStatements.closingBalance",
                     "BankAccounts.customerBankAccounts.bankStatements.emiAmountdeducted",
                     "BankAccounts.customerBankAccounts.bankStatements.cashDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.nonCashDeposits",
                     "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                     "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                     "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                     "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                     "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                     "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                     "BankAccounts.customerBankAccounts.isDisbersementAccount",
 
                     "EnterpriseFinancials",
                     "EnterpriseFinancials.monthlyTurnover",
                     "EnterpriseFinancials.monthlyBusinessExpenses",
                     "EnterpriseFinancials.avgMonthlyNetIncome",
                     "EnterpriseFinancials.otherBusinessIncomes",
                     "EnterpriseFinancials.otherBusinessIncomes.incomeSource",
                     "EnterpriseFinancials.otherBusinessIncomes.amount",
                     "EnterpriseFinancials.otherBusinessIncomes.otherBusinessIncomeDate",
 
                     "IncomeThroughSales",
                     "IncomeThroughSales.incomeThroughSales",
 
                     "Expenditures",
                     "Expenditures.expenditures",
 
                     "RawMaterialExpenses",
                     "RawMaterialExpenses.rawMaterialExpenses"
                 ]
             }
             
             var configFile_businessFinancials = function() {
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
                                     }
                                     
                                 }
                             },  
                             "Application": {
                                 "excludes": [
                                     "ProxyIndicators"
                                 ],
                                 "overrides": {
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
                                         "readonly": true
                                     }
                                     
                                 }
                             }, 
                             "ApplicationReview":{
                                 "excludes": [
                                     "ProxyIndicators"
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
                                     "References"
                                 ],
                                 "overrides": {
                                         
                                 }
                             },
                             "FieldAppraisal":{
                                 "excludes": [
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
                                         "orderNo": 100
                                     },
                                     "Machinery":{
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
                                         "readonly":true
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
                                         "readonly":true
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
                                     "References": {
                                         "readonly": true
                                     },
                                 }
                             },
                             "FieldAppraisalReview":{
                                 "overrides":{
                                     "References": {
                                         "readonly": true
                                     }
                                 }
                             },
                             "CentralRiskReview":{
                                 "overrides":{
                                     "References": {
                                         "readonly": true
                                     }
                                 }
                             },
                             "CreditCommitteeReview":{
                                 "overrides":{
                                     "References": {
                                         "readonly": true
                                     }
                                 }
                             },
                             "loanView":{
                                 "overrides":{
                                     "References": {
                                         "readonly": true
                                     }
                                 }
                             },
                             "Rejected":{
                                 "overrides":{
                                     "References": {
                                         "readonly": true
                                     }
                                 }
                             }
                             // "Televerification": {
                         }
                     }
             }
             var formRequest_businessbasic = function(model){
                 return {
                "overrides": overridesFields_businessbasic(model),
                "includes": getIncludes_businessbasic(model),
                "excludes": [],
                "options": {
                    "repositoryAdditions":repositoryAdditions_businessbasic(model)
                }
            }
            };
            var formRequest_businessFinancials = function(model){
                return {
                "overrides": overridesFields_businessFinancials(model),
                "includes": getIncludes_businessFinancials(model),
                "excludes": [],
                "options": {
                    "repositoryAdditions":repositoryAdditions_businessFinancials(model)
                }
            }
            };
            return {
                //"type": "child-tabs",
                "type":"schema-form",
                "title": "BUSINESS",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    self = this;
                    self.forms=[];
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }
                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType = "Customer";
                    model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */

                    model.customer = model.enrolmentProcess.customer;
                    var branchId = SessionStore.getBranchId();
                    if(branchId && !model.customer.customerBranchId)
                        {
                            model.customer.customerBranchId = branchId;
                    };

                    // var formRequest_businessbasic = {
                    //     "overrides": overridesFields_businessbasic(model),
                    //     "includes": getIncludes_businessbasic(model),
                    //     "excludes": [],
                    //     "options": {
                    //         "repositoryAdditions":repositoryAdditions_businessbasic(model)
                    //     }
                    // };
                    // var formRequest_businessFinancials = {
                    //     "overrides": overridesFields_businessFinancials(model),
                    //     "includes": getIncludes_businessFinancials(model),
                    //     "excludes": [],
                    //     "options": {
                    //         "repositoryAdditions":repositoryAdditions_businessFinancials(model)
                    //     }
                    // };
                    var formaction=[
                        
                            {
                                "type": "actionbox",
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
                            {
                                "type": "actionbox",
                                "condition": "model.customer.currentStage && (model.currentStage=='KYC' || model.currentStage == 'Appraisal' || model.currentStage=='Screening')",
                                "orderNo": 220,
                                "items": [
                                    {
                                        "type": "button",
                                        "title": "UPDATE",
                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                    }
                                ]
                            }
                        
                        ]
                        var generateChildForms=[];
                        generateChildForms.push(UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest_businessbasic(model), configFile_businessbasic(), model)
                        }).then(function(form){
                            self.forms.push({
                                "form": form,
                                "title":"Business",
                                "default":true
                            })}));
                            generateChildForms.push(UIRepository.getEnrolmentProcessUIRepository().$promise
                            .then(function(repo){
                                return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest_businessFinancials(model), configFile_businessFinancials(), model)
                            }).then(function(form){
                                self.forms.push({
                                    "form": form,
                                    "title":"Business Financials",
                                })}));
                    $q.all(generateChildForms).then(function(){
                        form=irfFormToggler.prepareToggleForm('BUSINESS', self.forms, formaction, model);
                        console.log(form);
                        self.form=form;
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
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest_businessbasic(model), configFile_businessbasic(), model);
                    })
                    var p2 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    var self = this;
                    p2.then(function (repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest_businessFinancials(model), configFile_businessFinancials(), model);
                    })
                }
                ,
                form:[],
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
                        var businessForm = BundleManager.getFormControl('business');
                        if(businessForm){
                            if(PageHelper.isFormInvalid(businessForm,false)) {
                                PageHelper.showProgress('enrolment', 'Business Financial page has some errors. Please resolve and continue.',5000);
                                return false;
                            }
                        }
                        var businessFinForm = BundleManager.getFormControl('business-financial');
                        if(businessFinForm){
                            if(PageHelper.isFormInvalid(businessFinForm,false)) {
                                PageHelper.showProgress('enrolment', 'Business Financial page has some errors. Please resolve and continue.',5000);
                                return false;
                            }
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
                        //EnrollmentHelper.proceed(model,form);
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        // var businessForm = BundleManager.getFormControl('business');
                        // if(businessForm){
                        //     if(PageHelper.isFormInvalid(businessForm,false)) {
                        //         PageHelper.showProgress('enrolment', 'Business Financial page has some errors. Please resolve and continue.',5000);
                        //         return false;
                        //     }
                        // }
                        // //BundleManager.broadcastSchemaFormValidate('business-financial');
                        // var businessFinForm = BundleManager.getFormControl('business-financial');
                        // if(businessFinForm){
                        //     if(PageHelper.isFormInvalid(businessFinForm,false)) {
                        //         PageHelper.showProgress('enrolment', 'Business Financial page has some errors. Please resolve and continue.',5000);
                        //         return false;
                        //     }
                        // }
                        
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