irf.pageCollection.factory(irf.page("customer.EnterpriseEnrolment2"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl, bundlePageObj) {
            if (bundlePageObj){
                model._bundlePageObj = bundlePageObj;
            }
            model.customer = model.customer || {};
            //model.branchId = SessionStore.getBranchId() + '';
            //model.customer.kgfsName = SessionStore.getBranch();
            model.customer.customerType = "Enterprise";
            model.customer.enterpriseCustomerRelations = [];
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
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
            }
        },
        form: [
            {
                "type": "box",
                "title": "ENTITY_INFORMATION",
                "items": [
                    {
                        "key": "customer.id",
                        "title": "LOAD_EXISTING_CUSTOMER",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap": {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "kgfsName": {
                                "key": "customer.kgfsName",
                                "type": "select",
                                "screenFilter": true
                            },
                            "centreId": {
                                "key": "customer.centreId",
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "outputMap": {
                            "urnNo": "customer.urnNo",
                            "firstName":"customer.firstName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'branchName': inputModel.kgfsName ||SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId':inputModel.centreId,
                                'customerType':"enterprise"
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
                    {
                        key: "customer.customerBranchId",
                        title:"BRANCH_NAME",
                        type: "select"
                    },
                    {
                        key: "customer.id",
                        condition: "model.customer.id",
                        title:"ENTITY_ID",
                        readonly: true
                    },
                    {
                        key: "customer.urnNo",
                        condition: "model.customer.urnNo",
                        title:"URN_NO",
                        readonly: true
                    },
                    {
                        key:"customer.centreId",
                        type:"select",
                        /*filter: {
                            "parentCode": "model.branch_id"
                        },*/
                        parentEnumCode:"branch_id"
                    },
                    {
                        key: "customer.oldCustomerId",
                        title:"ENTITY_ID",
                        titleExpr:"('ENTITY_ID'|translate)+' (Artoo)'",
                        condition: "model.customer.oldCustomerId",
                        readonly: true
                    },
                    {
                        key: "customer.firstName",
                        title:"ENTITY_NAME"
                    },
                    {
                        key: "customer.enterprise.referredBy",
                        title:"REFERRED_BY",
                        type: "select",
                        enumCode: "referredBy"
                    },
                    {
                        key: "customer.enterprise.referredName",
                        title:"REFERRED_NAME"
                    },/*
                    {
                        key: "customer.enterprise.businessName",
                        title:"COMPANY_NAME"
                    },*/
                    { /*TODO Not working when this is enabled */
                       key: "customer.enterprise.companyOperatingSince",
                       title:"OPERATING_SINCE",
                       type: "date"
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        key: "customer.enterprise.ownership",
                        title: "OWNERSHIP",
                        type: "select",
                        enumCode: "ownership"
                    },
                    {
                        key: "customer.enterprise.businessConstitution",
                        title: "CONSTITUTION",
                        type: "select",
                        enumCode: "constitution"
                    },
                    {
                        key: "customer.enterprise.noOfPartners",
                        title: "NO_OF_PARTNERS",
                        type: "select",
                        condition: "model.customer.enterprise.businessConstitution=='Partnership'"
                    },
                    {
                        key: "customer.enterprise.anyPartnerOfPresentBusiness",
                        title: "HAS_ANYONE_ELSE_PARTNER",
                        type: "select",
                        enumCode: "decisionmaker"
                    },
                    {
                        key: "customer.enterprise.partnershipDissolvedDate",
                        title: "PREVIOUS_PARTNERSHIP_DISSOLVED_DATE",
                        type: "date"
                    },
                    {
                        key: "customer.enterprise.companyRegistered",
                        type: "radios",
                        titleMap: {
                            "YES": "Yes",
                            "NO": "No"
                        },
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "customer.enterprise.registrationType",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        title: "REGISTRATION_TYPE",
                        type: "select",
                        enumCode: "business_registration_type"
                    },
                    {
                        key: "customer.enterprise.registrationNumber",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        title: "REGISTRATION_NUMBER"
                    },
                    {
                        key: "customer.enterprise.registrationDate",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        type: "date",
                        title: "REGISTRATION_DATE"
                    },
                    {
                        key: "customer.enterprise.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        enumCode: "businessType"
                    },
                    {
                        key: "customer.enterprise.businessLine",
                        title: "BUSINESS_LINE",
                        type: "select",
                        enumCode: "businessLine",
                        parentEnumCode: "businessType"
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        enumCode: "businessSector",
                        parentEnumCode: "businessType"
                    },
                    {
                        key: "customer.enterprise.businessSubsector",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        enumCode: "businessSubSector",
                        parentEnumCode: "businessSector"
                    },
                    {
                        key: "customer.enterprise.itrAvailable",
                        title: "ITR_AVAILABLE",
                        type: "select",
                        enumCode: "decisionmaker"
                    },
                    {
                        key: "customer.enterpriseCustomerRelations",
                        type: "array",
                        title: "RELATIONSHIP_TO_BUSINESS",
                        items: [
                            {
                                key: "customer.enterpriseCustomerRelations[].relationshipType",
                                title: "RELATIONSHIP_TYPE",
                                type: "select",
                                enumCode: "relationship_type"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].linkedToCustomerId",
                                type: "lov",
                                title: "CUSTOMER_ID",
                                inputMap: {
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.kgfsName",
                                        "type": "select"
                                    },
                                    "centreId": {
                                        "key": "customer.centreId",
                                        "type": "select"
                                    }
                                },
                                outputMap: {
                                    "id": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerId",
                                    "firstName": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerName"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    $log.info("inputModel.centreId: " + inputModel.centreId);
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
                                }
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].linkedToCustomerName",
                                readonly: true,
                                title: "CUSTOMER_NAME"
                            }
                        ]
                    },
                    {
                        key: "customer.enterpriseRegistrations",
                        type: "array",
                        title: "ADDITIONAL_REGISTRATION",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        startEmpty: true,
                        items: [
                            {
                                key: "customer.enterpriseRegistrations[].registrationType",
                                title: "REGISTRATION_TYPE",
                                type: "select",
                                enumCode: "business_registration_type"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].registrationNumber",
                               title: "REGISTRATION_NUMBER"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].registeredDate",
                                type: "date",
                                title: "REGISTRATION_DATE"
                            },
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "items":[
                    "customer.mobilePhone",
                    "customer.landLineNo",
                    "customer.doorNo",
                    "customer.street",
                    "customer.enterprise.landmark",
                    {
                        key: "customer.pincode",
                        type: "lov",
                        fieldType: "number",
                        autolov: true,
                        inputMap: {
                            "pincode": "customer.pincode",
                            "district": {
                                key: "customer.district"
                            },
                            "state": {
                                key: "customer.state"
                            }
                        },
                        outputMap: {
                            "division": "customer.locality",
                            "region": "customer.villageName",
                            "pincode": "customer.pincode",
                            "district": "customer.district",
                            "state": "customer.state"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            if (!inputModel.pincode) {
                                return $q.reject();
                            }
                            return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.division + ', ' + item.region,
                                item.pincode,
                                item.district + ', ' + item.state
                            ];
                        }
                    },
                    "customer.locality",
                    "customer.villageName",
                    "customer.district",
                    "customer.state",
                    {
                       key: "customer.enterprise.businessInPresentAreaSince", // customer.enterprise.businessInPresentAreaSince
                       type: "select",
                       enumCode: "years_in_present_area",
                       title: "YEARS_OF_BUSINESS_PRESENT_AREA"
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince", // customer.enterprise.businessInCurrentAddressSince
                        type: "select",
                        enumCode: "years_in_current_address",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                    }
                ]
            },
            {
                type: "box",
                title: "CUSTOMER_BANK_ACCOUNTS",
                items: [
                    {
                        key: "customer.customerBankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        items: [
                            {
                                key: "customer.customerBankAccounts[].ifscCode",
                                type: "lov",
                                lovonly: true,
                                inputMap: {
                                    "ifscCode": {
                                        "key": "customer.customerBankAccounts[].ifscCode"
                                    },
                                    "bankName": {
                                        "key": "customer.customerBankAccounts[].customerBankName"
                                    },
                                    "branchName": {
                                        "key": "customer.customerBankAccounts[].customerBankBranchName"
                                    }
                                },
                                outputMap: {
                                    "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
                                    "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
                                    "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = CustomerBankBranch.search({
                                        'bankName': inputModel.bankName,
                                        'ifscCode': inputModel.ifscCode,
                                        'branchName': inputModel.branchName
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        data.ifscCode,
                                        data.branchName,
                                        data.bankName
                                    ];
                                }
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankName",
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankBranchName",
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerNameAsInBank"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountNumber"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountType",
                                type: "select"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankingSince",
                                type: "date",
                                title: "BANKING_SINCE"
                            },
                            {
                                key: "customer.customerBankAccounts[].netBankingAvailable",
                                type: "select",
                                title: "NET_BANKING_AVAILABLE",
                                enumCode:"decisionmaker"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankStatement",
                                type: "array",
                                title: "STATEMENT_DETAILS",
                                items: [
                                    {
                                        key: "customer.customerBankAccounts[].bankStatement[].startMonth",
                                        type: "date",
                                        title: "START_MONTH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatement[].totalDeposits",
                                        type: "amount",
                                        title: "TOTAL_DEPOSITS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatement[].totalWithdrawals",
                                        type: "amount",
                                        title: "TOTAL_WITHDRAWALS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatement[].balanceAsOn15th",
                                        type: "amount",
                                        title: "BALANCE_AS_ON_15TH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatement[].noOfChequeBounced",
                                        type: "amount",
                                        title: "NO_OF_CHEQUE_BOUNCED"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatement[].noOfEmiChequeBounced",
                                        type: "amount",
                                        title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                    },
                                ]
                            },
                            {
                                key: "customer.customerBankAccounts[].isDisbersementAccount",
                                type: "radios",
                                titleMap: [{
                                    value: true,
                                    name: "Yes"
                                },{
                                    value: false,
                                    name: "No"
                                }]
                            }
                        ]
                    }
                ]
            },
            {
               type:"box",
               title:"T_LIABILITIES",
                items:[
                    {
                       key:"customer.liabilities",
                       type:"array",
                       startEmpty: true,
                       title:"FINANCIAL_LIABILITIES",
                       items:[
                           {
                               key:"customer.liabilities[].loanType",
                               type:"select"
                           },
                           {
                               key:"customer.liabilities[].loanSource",
                               type:"select"
                           },
                           "customer.liabilities[].instituteName",
                           {
                               key: "customer.liabilities[].loanAmountInPaisa",
                               type: "amount"
                           },
                           {
                               key: "customer.liabilities[].installmentAmountInPaisa",
                               type: "amount"
                           },
                           {
                                key: "customer.liabilities[].outstandingAmountInPaisa",
                                type: "amount",
                                title: "OUTSTANDING_AMOUNT"
                           },
                           {
                               key: "customer.liabilities[].startDate",
                               type:"date"
                           },
                           {
                               key:"customer.liabilities[].maturityDate",
                               type:"date"
                           },
                           {
                                key: "customer.liabilities[].noOfInstalmentPaid",
                                type: "number",
                                title: "NO_OF_INSTALLMENT_PAID"
                           },
                           {
                               key:"customer.liabilities[].frequencyOfInstallment",
                               type:"select"
                           },
                           {
                               key:"customer.liabilities[].liabilityLoanPurpose",
                               type:"select"
                           }
                       ]
                    }
                ]
            },
            
            
            {
               type:"box",
               title:"T_BUSINESS_FINANCIALS",
                items:[
                    {
                        key: "customer.enterprise.monthlyTurnover",
                        title: "MONTHLY_TURNOVER",
                        type: "amount"
                    },
                    {
                        key: "customer.enterprise.monthlyBusinessExpenses",
                        title: "MONTHLY_BUSINESS_EXPENSES",
                        type: "amount"
                    },
                    {
                        key: "customer.enterprise.avgMonthlyNetIncome",
                        title: "AVERAGE_MONTHLY_NET_INCOME",
                        type: "amount"
                    },
                
                        {
                                type:"fieldset",
                                title:"Income",
                                items:[]
                        },
                         {
                            key:"customer.incomeThroughSales",
                            type:"array",
                            startEmpty: true,
                            title:"Through Sales",
                            items:[
                                {
                                    key: "customer.incomeThroughSales[].buyerName",
                                    title: "BUYER_NAME",
                                    type: "select"
                                },
                                {
                                    key: "customer.incomeThroughSales[].incomeType",
                                    title: "INCOME_TYPE",
                                    type: "radios",
                                    titleMap: {
                                    Cash:"Cash",
                                    Invoice:"Invoice"
                                    }
                                },
                                {
                                    key: "customer.incomeThroughSales[].amount",
                                    title: "AMOUNT",
                                    type: "amount"   
                                },
                                {
                                    key: "customer.incomeThroughSales[].date",
                                    title: "DATE",
                                    type: "date"
                                }, 
                                
                            ]
                        },
                        {
                          key:"customer.otherBusinessIncomes",
                            type:"array",
                            startEmpty: true,
                            title:"OTHER_BUSINESS_INCOME",
                            items:[
                                {
                                    key: "customer.otherBusinessIncomes[].incomeSource",
                                    title: "INCOME_SOURCE",
                                    type: "select"
                                },
                                {
                                    key: "customer.otherBusinessIncomes[].amount",
                                    title: "AMOUNT",
                                    type: "amount"
                                },
                                {
                                    key: "customer.otherBusinessIncomes[].date",
                                    title: "DATE",
                                    type: "date"
                                }, 
                             ]    
                        }, 
                         {
                                type:"fieldset",
                                title:"EXPENSES",
                                items:[]
                        },
                         {
                            key:"customer.rawMaterialExpenses",
                            type:"array",
                            startEmpty: true,
                            title:"Raw material expense",
                            items:[
                                {
                                    key: "customer.rawMaterialExpenses[].vendorName",
                                    title: "VENDOR_NAME",
                                    type: "string"
                                },
                                {
                                    key: "customer.rawMaterialExpenses[].rawMaterialType",
                                    title: "TYPE",
                                    type: "radios",
                                        titleMap: {
                                            Cash:"Cash",
                                            Invoice:"Invoice"
                                        }
                                },
                                {
                                    key: "customer.rawMaterialExpenses[].amount",
                                    title: "AMOUNT",
                                    type: "amount"
                                },
                                {
                                    key: "customer.rawMaterialExpenses[].date",
                                    title: "DATE",
                                    type: "date"
                                },
                                
                            ]
                        },
                        

                ]
            },
            {
               type:"box",
               title:"EMPLOYEE_DETAILS",
                items:[
                    {
                        key: "customer.enterprise.noOfFemaleEmployees",
                        title: "No Of Male Employees",
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.noOfMaleEmployees",
                        title: "No Of Female Employees",
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.averagemonthlysalary",
                        title: "Average Monthly Salary",
                        type: "amount"
                    }

                ]
            },
            {
               type:"box",
               title:"CUSTROMER_BUYER_DETAILS",
                items:[
                    {
                      key:"customer.buyerDetails",
                       type:"array",
                       startEmpty: true,
                       title:"BUYER_DETAILS",
                       items:[
                            {
                                key: "customer.buyerDetails[].buyerName",
                                title: "BUYER_NAME",
                                type: "string"
                            }, 
                            {
                                key: "customer.buyerDetails[].customerSince",
                                title: "CUSTOMER_SINCE",
                                type: "date"
                            },
                            
                            {
                                key: "customer.buyerDetails[].paymentDate",
                                title: "Payment Date",
                                type: "date"
                            },
                            {
                                key: "customer.buyerDetails[].paymentFrequency",
                                title: "PAYMENT_FREQUENCY",
                                type: "select",
                                enumCode: "payment_frequency"
                            },
                            {
                                key: "customer.buyerDetails[].paymentTerms",
                                title: "PAYEMNT_TERMS",
                                type: "number"
                            },
                            {
                                key: "customer.buyerDetails[].product",
                                title:"Product",
                                type: "string"
                            },
                            {
                                key: "customer.buyerDetails[].receivablesOutstanding",
                                title:"Receivables Out Standing",
                                type: "number"
                            },
                        
                            {
                                key: "customer.buyerDetails[].sector",
                                title: "SECTOR",
                                type: "select"
                            },
                            {
                                key: "customer.buyerDetails[].subSector",
                                title: "SUBSECTOR",
                                type: "select"
                            },
                            {
                                key: "customer.buyerDetails[].receivablesOutstanding/CustomerCredit",
                                title:"Receivables Outstanding / Customer Credit",
                                type: "number"
                            },
                        ]
                    }
                ]
            },
            {
               type:"box",
               key:"customer.verification",
               title:"REFERENCES",
                items:[
                    {
                        key:"customer.verification.referenceType",
                        title:"REFERENCE_TYPE",
                        type:"select",
                        required:"true",
                        enumCode: "business_reference_type"
                    },
                     {
                        key:"customer.verification.businessName",
                        title:"BUSINESS_NAME",
                        type:"string"
                    },
                    {
                        key:"customer.verification.fullNameofPOC",
                        title:"Full Name Of POC",
                        type:"string"
                    },
                    {
                        key:"customer.verification.mobileNo",
                        title:"Mobile No",
                        type:"number"
                    },
                    {
                        key:"customer.verification.businessSector",
                        title:"BUSINESS_SECTOR",
                        type:"select"
                    },
                    {
                        key:"customer.verification.businessSubSector",
                        title:"BUSINESS_SUBSECTOR",
                        type:"select"
                    },
                    {
                        key:"customer.verification.self-reportedIncome",
                        title:"Self-Reported Income",
                        type:"number"
                    },

                 ] 
             },
                     

            {
                "type": "actionbox",
                "condition": "!model.customer.id",
                "items": [
                    {
                        "type": "button",
                        "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition": "model.customer.id",
                "items": [
                    {
                        "type": "submit",
                        "title": "COMPLETE_ENROLMENT"
                    }
                ]
            }
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

                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);
                PageHelper.showProgress('enrolment','Saving..');
                EnrollmentHelper.saveData(reqData).then(function(resp){
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
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);
                PageHelper.showProgress('enrolment','Updaing...');
                EnrollmentHelper.proceedData(reqData).then(function(resp){
                    PageHelper.showProgress('enrolmet','Done.', 5000);
                    Utils.removeNulls(resp.customer,true);
                    model.customer = resp.customer;
                    if (model._bundlePageObj){
                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                    }
                }, function(httpRes){
                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    PageHelper.showErrors(httpRes);
                });
            }
        }
    };
}]);
