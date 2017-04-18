irf.pageCollection.factory(irf.page("customer360.BusinessProfile"),
["$log", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "$stateParams", "$timeout", "Queries", "CustomerBankBranch",
function($log, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, $stateParams, $timeout, Queries, CustomerBankBranch){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {
            var self = this;
            var init = function() {
                var deferred = $q.defer();
                model.customer = model.customer || {};
                if (model.customer.id) {
                    deferred.resolve();
                } else if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    Enrollment.get({id: $stateParams.pageId}).$promise.then(function(response){
                        model.customer = response;
                        deferred.resolve();
                    }, function(errorResponse){
                        PageHelper.showErrors(errorResponse);
                    }).finally(function(){
                        PageHelper.hideLoader();
                    });
                }
                return deferred.promise;
            };
            self.form = [];
            init().finally(function() {
                PagesDefinition.setReadOnlyByRole("Page/Engine/customer360.BusinessProfile", self.formSource).then(function(form){
                    self.form = form;
                });
                if (model.customer.enterpriseCustomerRelations && model.customer.enterpriseCustomerRelations.length) {
                    var linkedIds = [];
                    for (var i = 0; i < model.customer.enterpriseCustomerRelations.length; i++) {
                        linkedIds.push(model.customer.enterpriseCustomerRelations[i].linkedToCustomerId);
                    };
                    $log.debug(linkedIds);
                    Queries.getCustomerBasicDetails({"ids":linkedIds}).then(function(result) {
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
            });
        },
        form: [],
        formSource: [
            {
                "type": "box",
                "title": "ENTITY_INFORMATION",
                "items": [
                    {
                        key: "customer.customerBranchId",
                        title:"BRANCH_NAME",
                        readonly:true,
                        type: "select"
                    },
                    /*{
                        key: "customer.centreName",
                        type: "lov",
                        "title":"SPOKE_NAME",
                        autolov: true,
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var centres = SessionStore.getCentres();
                            $log.info("hi");
                            $log.info(centres);

                            var centreCode = formHelper.enum('centre').data;
                            var out = [];
                            if (centres && centres.length) {
                                for (var i = 0; i < centreCode.length; i++) {
                                    for (var j = 0; j < centres.length; j++) {
                                        if (centreCode[i].value == centres[j].id) {
                                            out.push({
                                                name: centreCode[i].name,
                                                id: centreCode[i].value
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
                            model.customer.centreName = valueObj.name;
                            model.customer.centreId = valueObj.id;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        }
                    },*/
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
                        title:"CENTRE_NAME",
                        filter: {
                         "parentCode": "branch_id"
                         },
                        parentEnumCode:"branch_id",
                        parentValueExpr:"model.customer.customerBranchId",
                    },
                    {
                        key: "customer.centreId",
                        condition: "model.customer.id",
                        readonly: true
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
                        title:"SOURCED",
                        required:true,
                        type: "select",
                        enumCode: "referredBy"
                    },
                    {
                        key: "customer.enterprise.referredName",
                        condition: "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'",
                        title:"REFERRED_NAME"
                    },/*
                    {
                        key: "customer.enterprise.businessName",
                        title:"COMPANY_NAME"
                    },*/
                    { /*TODO Not working when this is enabled */
                       key: "customer.enterprise.companyOperatingSince",
                       title:"OPERATING_SINCE",
                       required:true,
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
                        required:true,
                        enumCode: "ownership"
                    },
                    {
                        key: "customer.enterprise.businessConstitution",
                        title: "CONSTITUTION",
                        type: "select",
                        enumCode: "constitution"
                    },
                    {
                        key: "customer.enterprise.businessHistory",
                        title: "BUSINESS_HISTORY",
                        required:true,
                        type: "select",
                        enumCode: "business_history"
                    },
                    {
                        key: "customer.enterprise.noOfPartners",
                        title: "NO_OF_PARTNERS",
                        type: "select",
                        condition: "model.customer.enterprise.businessConstitution=='Partnership'",
                        titleMap: {
                            "2": "2",
                            "3": "3",
                            "4": "4",
                            ">4": ">4",
                        }
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
                        condition: "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'",
                        type: "date"
                    },
                    {
                        key: "customer.enterprise.companyRegistered",
                        type: "select",
                        enumCode: "decisionmaker",
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "customer.enterpriseRegistrations",
                        type: "array",
                        title: "REGISTRATION_DETAILS",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
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
                            {
                                key: "customer.enterpriseRegistrations[].expiryDate",
                                type: "date",
                                title: "VALID_UPTO"
                            },
                            {
                                key:"customer.enterpriseRegistrations[].documentId",
                                type:"file",
                                required: true,
                                title:"REGISTRATION_DOCUMENT",
                                category:"CustomerEnrollment",
                                subCategory:"REGISTRATIONDOCUMENT",
                                fileType:"application/pdf",
                                using: "scanner"
                            }
                        ]
                    },
                    {
                        key: "customer.enterprise.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        enumCode: "businessType"
                    },
                    {
                        key: "customer.enterprise.businessActivity",
                        required:true,
                        title: "BUSINESS_ACTIVITY",
                        type: "select",
                        enumCode: "businessActivity",
                        parentEnumCode: "businessType",
                        parentValueExpr:"model.customer.enterprise.businessType",
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        required:true,
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        enumCode: "businessSector",
                        parentEnumCode: "businessType",
                        parentValueExpr:"model.customer.enterprise.businessType",
                        onChange: function(modelValue, form, model, formCtrl, event) {
                            model.customer.enterprise.businessSubsector = null;
                        }
                    },
                    {
                        key: "customer.enterprise.businessSubsector",
                        required:true,
                        title: "BUSINESS_SUBSECTOR",
                        type: "lov",
                        "lovonly": true,
                        autolov: true,
                        bindMap: {
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var businessSubsectors = formHelper.enum('businessSubSector').data;
                            var businessSectors = formHelper.enum('businessSector').data;

                            var selectedBusinessSector  = null;
                            
                            for (var i=0;i<businessSectors.length;i++){
                                if (businessSectors[i].value == model.customer.enterprise.businessSector && businessSectors[i].parentCode == model.customer.enterprise.businessType){
                                    selectedBusinessSector = businessSectors[i];
                                    break;
                                }
                            }

                            var out = [];
                            for (var i=0;i<businessSubsectors.length; i++){
                                if (businessSubsectors[i].parentCode == selectedBusinessSector.code){
                                    out.push({
                                        name: businessSubsectors[i].name,
                                        value: businessSubsectors[i].value
                                    })    
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function(valueObj, model, context){
                            model.customer.enterprise.businessSubsector = valueObj.value;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    {
                        key: "customer.enterprise.itrAvailable",
                        title: "ITR_AVAILABLE",
                        type: "select",
                        enumCode: "decisionmaker"
                    },
                    /*{
                        key: "customer.enterprise.electricityAvailable",
                        title: "ELECTRICITY_AVAIALBLE",
                        type: "select",
                        enumCode: "decisionmaker",
                        required: true
                    },
                    {
                        key: "customer.enterprise.spaceAvailable",
                        title: "SPACE_AVAILABLE",
                        type: "select",
                        enumCode: "decisionmaker",
                        required: true
                    },*/
                    {
                        key: "customer.enterpriseCustomerRelations",
                        type: "array",
                        startEmpty: true,
                        title: "RELATIONSHIP_TO_BUSINESS",
                        items: [
                            {
                                key: "customer.enterpriseCustomerRelations[].relationshipType",
                                title: "RELATIONSHIP_TYPE",
                                type: "select",
                                enumCode: "relationship_type",
                                required: true
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
                                        "type": "select",
                                        title:"CENTRE_NAME"
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
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].experienceInBusiness",
                                title: "EXPERIENCE_IN_BUSINESS",
                                type:"select",
                                "enumCode": "years_in_current_area",
                                required:true,
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].businessInvolvement",
                                title: "BUSINESS_INVOLVEMENT",
                                required:true,
                                type: "select",
                                enumCode: "business_involvement"
                            },
                            
                            {
                                key: "customer.enterpriseCustomerRelations[].partnerOfAnyOtherCompany",
                                title: "PARTNER_OF_ANY_OTHER_COMPANY",
                                type: "select",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].otherBusinessClosed",
                                title: "OTHER_BUSINESS_CLOSED",
                                type: "select",
                                enumCode: "decisionmaker",
                                condition:"model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].otherBusinessClosureDate",
                                type: "date",
                                title: "OTHER_BUSINESS_CLOSE_DATE",
                                condition:"model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "items":[
                    {
                        "key": "customer.mobilePhone",
                        "inputmode": "number",
                        "numberType": "tel"
                    },
                    {
                        "key": "customer.landLineNo",
                        "inputmode": "number",
                        "numberType": "tel"  
                    },
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
                    {
                        key: "customer.locality",
                        readonly: true
                    },
                    {
                        key: "customer.villageName",
                        readonly: true
                    },
                    {
                        key: "customer.district",
                        readonly: true
                    },
                    {
                        key: "customer.state",
                        readonly: true,
                    },
                    {
                       key: "customer.distanceFromBranch",
                       type: "select",
                       enumCode: "distance_from_branch",
                       title: "DISTANCE_FROM_BRANCH"
                    },
                    {
                       key: "customer.enterprise.businessInPresentAreaSince", // customer.enterprise.businessInPresentAreaSince
                       type: "select",
                       required:true,
                       enumCode: "business_in_present_area_since",
                       title: "YEARS_OF_BUSINESS_PRESENT_AREA"
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince", // customer.enterprise.businessInCurrentAddressSince
                        type: "select",
                        required:true,
                        enumCode: "bsns_in_current_addrss_since",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                    }
                ]
            },
            {
                type: "box",
                title: "BANK_ACCOUNTS",
                items: [
                    {
                        key: "customer.customerBankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
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
                        },
                        items: [
                            {
                                key: "customer.customerBankAccounts[].ifscCode",
                                type: "lov",
                                lovonly: true,
                                required: true,
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
                                required: true,
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankBranchName",
                                required: true,
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerNameAsInBank"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountNumber",
                                type: "password"
                            },
                            {
                                key: "customer.customerBankAccounts[].confirmedAccountNumber"
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
                                key: "customer.customerBankAccounts[].sanctionedAmount",
                                condition:"model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                                type: "amount",
                                required:true,
                                title: "OUTSTANDING_BALANCE"
                            },
                            {
                                key: "customer.customerBankAccounts[].limit",
                                type: "amount"
                            },
                            {
                                key:"customer.customerBankAccounts[].bankStatementDocId",
                                type:"file",
                                required: true,
                                title:"BANK_STATEMENT_UPLOAD",
                                fileType:"application/pdf",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                using: "scanner"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankStatements",
                                type: "array",
                                title: "STATEMENT_DETAILS",
                                startEmpty: true,
                                items: [
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                        type: "date",
                                        title: "START_MONTH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                        type: "amount",
                                        calculator: true,
                                        title: "TOTAL_DEPOSITS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                        type: "amount",
                                        calculator: true,
                                        title: "TOTAL_WITHDRAWALS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                        type: "amount",
                                        title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                        type: "amount",
                                        //maximum:99,
                                        required:true,
                                        title: "NO_OF_CHEQUE_BOUNCED"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                        type: "amount",
                                        required:true, 
                                        //maximum:99,                                     
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
               title:"BUSINESS_LIABILITIES",
                items:[
                    {
                       key:"customer.liabilities",
                       type:"array",
                       startEmpty: true,
                       title:"LIABILITIES",
                       items:[
                           {
                               key:"customer.liabilities[].loanType",
                               type:"select",
                               enumCode:"liability_loan_type" 
                           },
                           {
                               key:"customer.liabilities[].loanSource",
                                type:"select",
                                enumCode:"loan_source"
                           },
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
                               /*type:"select",
                               enumCode: "loan_purpose_1"*/
                           },
                           {
                               key:"customer.liabilities[].interestOnly",
                               type:"radios",
                               title:"INTEREST_ONLY",
                               enumCode:"decisionmaker"
                           },
                           {
                               key:"customer.liabilities[].interestRate",
                               type:"number",
                               title:"RATE_OF_INTEREST"
                           },
                           
                           /*{
                               key:"customer.liabilities[].interestExpense",
                               title:"INTEREST_EXPENSE"
                           },
                           {
                               key:"customer.liabilities[].principalExpense",
                               title:"PRINCIPAL_EXPENSE"
                           }*/
                       ]
                    }
                ]
            },
            {
                type:"box",
                title:"CUSTOMER_BUYER_DETAILS",
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
                                type:"number"
                                /*type: "select",
                                enumCode: "customer_since"*/
                            },
                            {
                                key: "customer.buyerDetails[].paymentDate",
                                title: "PAYMET_DATE",
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
                                type: "select",
                                enumCode: "payment_terms"
                            },
                            {
                                key: "customer.buyerDetails[].product",
                                title:"PRODUCT",
                                type: "string"
                            }, 
                            {
                                key: "customer.buyerDetails[].sector",
                                title: "SECTOR",
                                type: "select",
                                enumCode: "businessSector"
                            },
                            {
                                key: "customer.buyerDetails[].subSector",
                                title: "SUBSECTOR",
                                type: "select",
                                parentEnumCode: "businessSector",
                                enumCode: "businessSubSector"
                            },
                            {
                                key: "customer.buyerDetails[].receivablesOutstanding",
                                title:"RECEIVABLES_OUTSTANDING_CUSTOMER_CREDIT",
                                type: "number"
                            },
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "SUPPLIERS_DEATILS",
                "items": [
                    {
                        key:"customer.supplierDetails",
                        title:"SUPPLIERS_DEATILS",
                        type: "array", 
                        items:[
                            {
                                key:"customer.supplierDetails[].supplierName",
                                title:"SUPPLIERS_NAME",
                                required:true,
                                type:"string"
                            },
                            {
                                key:"customer.supplierDetails[].supplierType",
                                title:"TYPE",
                                type:"select",
                                enumCode: "supplier_type"
                            },
                            {
                                key:"customer.supplierDetails[].paymentTerms",
                                title:"PAYMENT_TERMS_IN_DAYS",
                                type: "select",
                                enumCode: "payment_terms"
                            },
                            {
                                key:"customer.supplierDetails[].amount",
                                title:"PAYABLE_OUTSTANDING",
                                type:"amount"
                            },
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
                        required:true,
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
                        type:"section",
                        title:"INCOME_EXPENSE_INFORMATION",
                        items: [
                            {
                                key:"customer.otherBusinessIncomes",
                                type:"array",
                                startEmpty: true,
                                title:"OTHER_BUSINESS_INCOME",
                                items:[
                                    {
                                        key: "customer.otherBusinessIncomes[].incomeSource",
                                        title: "INCOME_SOURCE",
                                        type: "select",
                                        required: true,
                                        enumCode:"occupation"
                                    },
                                    {
                                        key: "customer.otherBusinessIncomes[].amount",
                                        title: "AMOUNT",
                                        required: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.otherBusinessIncomes[].otherBusinessIncomeDate",
                                        title: "DATE",
                                        type: "date"
                                    },
                                ]
                            },
                            {
                                key:"customer.incomeThroughSales",
                                type:"array",
                                startEmpty: true,
                                title:"INCOMRE_THROUGH_SALES",
                                items:[
                                    {
                                        key: "customer.incomeThroughSales[].buyerName",
                                        type: "lov",
                                        autolov: true,
                                        required: true,
                                        lovonly: true,
                                        title:"BUYER_NAME",
                                        bindMap: {
                                        },
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var out = [];
                                            if (!model.customer.buyerDetails){
                                                return out;
                                            }
                                            for (var i=0; i<model.customer.buyerDetails.length; i++){
                                                out.push({
                                                    name: model.customer.buyerDetails[i].buyerName,
                                                    value: model.customer.buyerDetails[i].buyerName
                                                })
                                            }
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function(valueObj, model, context){
                                            if (_.isUndefined(model.customer.incomeThroughSales[context.arrayIndex])) {
                                                model.customer.incomeThroughSales[context.arrayIndex] = {};
                                            }

                                            model.customer.incomeThroughSales[context.arrayIndex].buyerName = valueObj.value;
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].incomeType",
                                        title: "INCOME_TYPE",
                                        type: "radios",
                                        required: true,
                                        titleMap: {
                                        Cash:"Cash",
                                        Invoice:"Invoice",
                                        Scrap:"Scrap"
                                        }
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].amount",
                                        title: "AMOUNT",
                                        type: "amount",
                                        calculator: true,  
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].incomeSalesDate",
                                        title: "DATE",
                                        type: "date"
                                    }
                                ]
                            },
                            {
                                type:"fieldset",
                                title:"EXPENSES",
                                items:[]
                            },
                            {
                                key:"customer.expenditures",
                                type:"array",
                                title:"BUSINESS_EXPENSE",
                                items:[
                                    {
                                        key: "customer.expenditures[].expenditureSource",
                                        title: "EXPENDITURE_SOURCE",
                                        type: "select",
                                        enumCode: "business_expense"
                                    },
                                    {
                                        key: "customer.expenditures[].annualExpenses",
                                        title: "AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.expenditures[].frequency",
                                        title: "FREQUENCY",
                                        type: "select",
                                        enumCode: "frequency"
                                    }
                                ]
                            },
                            {
                                key:"customer.rawMaterialExpenses",
                                type:"array",
                                startEmpty: true,
                                title:"PURCHASES",
                                items:[
                                    {
                                        key: "customer.rawMaterialExpenses[].vendorName",
                                        type: "lov",
                                        autolov: true,
                                        required: true,
                                        lovonly: true,
                                        title:"VENDOR_NAME",
                                        bindMap: {
                                        },
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var out = [];
                                            if (!model.customer.supplierDetails){
                                                return out;
                                            }
                                            for (var i=0; i<model.customer.supplierDetails.length; i++){
                                                out.push({
                                                    name: model.customer.supplierDetails[i].supplierName,
                                                    value: model.customer.supplierDetails[i].supplierName
                                                })
                                            }
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function(valueObj, model, context){
                                            if (_.isUndefined(model.customer.rawMaterialExpenses[context.arrayIndex])) {
                                                model.customer.rawMaterialExpenses[context.arrayIndex] = {};
                                            }

                                            model.customer.rawMaterialExpenses[context.arrayIndex].vendorName = valueObj.value;
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
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
                                        key: "customer.rawMaterialExpenses[].rawMaterialDate",
                                        title: "DATE",
                                        type: "date"
                                    }

                                ]
                            },
                            ]
                        },
                            {
                                type:"fieldset",
                                title:"ASSETS",
                                items:[]
                            },
                            // {
                            //     key: "customer.enterprise.cashAtBank",
                            //     title: "CASH_AT_BANK",
                            //     type: "amount"
                            // },
                            {
                                key: "customer.enterprise.rawMaterial",
                                title: "RAW_MATERIAL",
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.enterprise.workInProgress",
                                title: "WIP",
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.enterprise.finishedGoods",
                                title: "FINISHED_GOODS",
                                type: "amount",
                                required: true
                            },
                            {
                                key: 'customer.enterpriseAssets',
                                type: 'array',
                                startEmpty: true,
                                title: "ENTERPRICE_ASSETS",
                                items: [
                                    {
                                        key: "customer.enterpriseAssets[].assetType",
                                        title: "ASSET_TYPE",
                                        type: "select",
                                        enumCode: "enterprice_asset_types",
                                        required: true
                                    },
                                    {
                                        key: "customer.enterpriseAssets[].vehicleMakeModel",
                                        title: "VEHICLE_MAKE_MODEL",
                                        type: "string",
                                        condition:"model.customer.enterpriseAssets[arrayIndex].assetType=='Vehicle'"
                                    },
                                    {
                                        key: "customer.enterpriseAssets[].valueOfAsset",
                                        title: "VALUE_OF_THE_ASSET",
                                        type: "amount"
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
                        title: "NO_OF_MALE_EMPLOYEES",
                        //required:true,
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.noOfMaleEmployees",
                        //required:true,
                        title: "NO_OF_FEMALE_EMPLOYEES",
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.avgMonthlySalary",
                        condition:"model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 ",
                        //required:true,
                        title: "AVERAGE_MONTHLY_SALARY",
                        type: "amount"
                    }

                ]
            },
            {
               type:"box",
               title:"MACHINERY",
                items:[
                    {
                      key:"customer.fixedAssetsMachinaries",
                       type:"array",
                       startEmpty: true,
                       title:"MACHINERY_SECTION",
                       items:[
                            {
                                key:"customer.fixedAssetsMachinaries[].machineDescription",
                                title:"MACHINE_DESCRIPTION",
                                required: true,
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].manufacturerName",
                                title:"MANUFACTURER_NAME",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineType",
                                title:"MACHINE_TYPE",
                                required: true,
                                type: "select",
                                enumCode: "collateral_type"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineModel",
                                title:"MACHINE_MODEL",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].serialNumber",
                                title:"SERIAL_NUMBER",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].purchasePrice",
                                title:"PURCHASE_PRICE",
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machinePurchasedYear",
                                title:"MACHINE_PURCHASED_YEAR",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].presentValue",
                                title:"PRESSENT_VALUE",
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineNew",
                                title:"IS_THE_MACHINE_NEW",
                                type: "select",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].fundingSource",
                                title:"FUNDING_SOURCE",
                                type: "select",
                                enumCode: "machinery_funding_source"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineHypothecated",
                                title:"IS_THE_MACHINE_HYPOTHECATED",
                                type: "radios",
                                enumCode: "decisionmaker",
                                onChange: function(modelValue, form, model, formCtrl, event) {
                                    if (modelValue && modelValue.toLowerCase() === 'no')
                                        model.customer.fixedAssetsMachinaries[form.arrayIndex].hypothecatedTo = null;
                                    else if(modelValue && modelValue.toLowerCase() === 'yes')
                                        model.customer.fixedAssetsMachinaries[form.arrayIndex].hypothecatedToUs = null;
                                }
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].hypothecatedTo",
                                title:"HYPOTHECATED_TO",
                                type: "string",
                                condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].hypothecatedToUs",
                                title:"CAN_BE_HYPOTHECATED_TO_US",
                                type: "radios",
                                enumCode: "decisionmaker",
                                condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machinePermanentlyFixedToBuilding",
                                title:"MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineBillsDocId",
                                title:"MACHINE_BILLS",
                                "category":"Loan",
                                "subCategory":"DOC1",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                         ]
                     }
                 ]
            },
            {
                "type": "box",
                "title": "REFERENCES",
                "items": [
                    {
                        key:"customer.verifications",
                        title:"REFERENCES",
                        type: "array", 
                        items:[
                            {
                                key:"customer.verifications[].relationship",
                                title:"REFERENCE_TYPE",
                                type:"select",
                                required:"true",
                                enumCode: "business_reference_type"
                            },
                             {
                                key:"customer.verifications[].businessName",
                                title:"BUSINESS_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].referenceFirstName",
                                title:"CONTACT_PERSON_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"CONTACT_NUMBER",
                                type:"string",
                                
                            },
                            {
                                key:"customer.verifications[].address",
                                type:"textarea"
                            },
                            {
                            type: "fieldset",
                            title: "REFERENCE_CHECK",
                            items: [
                                /*,
                                {
                                    key:"customer.verifications[].remarks",
                                    title:"REMARKS",
                                },*/
                                {
                                    key:"customer.verifications[].knownSince",
                                    required:true
                                },
                                {
                                    key:"customer.verifications[].goodsSold",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                },
                                {
                                    key:"customer.verifications[].goodsBought",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                },
                                {
                                    key:"customer.verifications[].paymentTerms",
                                    type:"select",
                                    "title":"payment_tarms",
                                    enumCode: "payment_terms"
                                },
                                {
                                    key:"customer.verifications[].modeOfPayment",
                                    type:"select",
                                    enumCode: "payment_mode"
                                },
                                {
                                    key:"customer.verifications[].outstandingPayable",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                },
                                {
                                    key:"customer.verifications[].outstandingReceivable",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                },
                                {
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
                            ]
                            }
                         ] 
                    },
                ]
            },
            {
                "type": "actionbox",
                "readonly": true,
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
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
                    irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
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
                //EnrollmentHelper.fixData(reqData);
                Utils.confirm("Update - Are You Sure?", "Customer Profile").then(function() {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('PROFILE', 'Working...');
                    reqData.enrollmentAction = "PROCEED";
                    Enrollment.updateEnrollment(reqData, function (res, headers) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                    }, function (res, headers) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Oops. Some error.', 2000);
                        window.scrollTo(0, 0);
                        PageHelper.showErrors(res);
                    })

                });
            }
        }
    };
}]);
