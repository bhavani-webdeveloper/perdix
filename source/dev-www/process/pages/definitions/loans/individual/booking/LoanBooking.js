irf.pageCollection.factory(irf.page("loans.individual.booking.LoanBooking"),
    ["$log", "irfNavigator","IndividualLoan", "SessionStore", "$state", "$stateParams", "SchemaResource", "PageHelper","PagesDefinition", "Enrollment", "Utils","Queries", "$q", "formHelper",
    function ($log, irfNavigator, IndividualLoan, SessionStore, $state, $stateParams, SchemaResource, PageHelper,PagesDefinition, Enrollment, Utils,Queries, $q, formHelper) {

        var branch = SessionStore.getBranch();
        var pendingDisbursementDays;

        Queries.getGlobalSettings("loan.individual.booking.pendingDisbursementDays").then(function(value){
            pendingDisbursementDays = Number(value);
            $log.info("pendingDisbursementDays:" + pendingDisbursementDays);
        },function(err){
            $log.info("pendingDisbursementDays is not available");
        });

        var isCBCheckValid = function (model) {
            var deferred = $q.defer();
            var customerIdList = [model.loanAccount.customerId];
            var validUrns = [];
            var urns = [model.loanAccount.customer.urnNo], invalidUrns = [];

            Queries.getLatestCBCheckDoneDateByCustomerIds(customerIdList).then(function(resp) {
                if(resp && resp.length > 0){
                    for (var i = 0; i < resp.length; i++) {
                        if (moment().diff(moment(resp[i].created_at, SessionStore.getSystemDateFormat()), 'days') <= 
                            Number(SessionStore.getGlobalSetting('cerditBureauValidDays'))) {
                            validUrns.push(urns[customerIdList.indexOf(resp[i].customer_id)]);
                        }
                    }

                    if(validUrns.length === urns.length) {
                        deferred.resolve();
                    } else {
                        invalidUrns = urns.filter(function(urn){  return (validUrns.indexOf(urn) == -1) })
                        deferred.reject({data: {error: "There is no valid CB check for following customers: " + invalidUrns.join(",")+ ". Please do CBCheck and try again." }});
                    }
                } else {
                    deferred.reject({data: {error: "There is no valid CB check for following customers: " + urns.join(",")+ ". Please do CBCheck and try again." }});
                }
            }, function(res) {
                if(res.data) {
                    res.data.error = res.data.errorMsg;
                }
                deferred.reject(res);
            });
            return deferred.promise;
        }

        var doBasicLoanDedupeCheck = function (model) {
            var deferred = $q.defer();

            Queries.getActiveLoansCountByProduct(model.loanAccount.urnNo, model.loanAccount.applicant,
                model.loanAccount.productCode, model.loanAccount.id).then(function(resp) {
                    try {
                        if(resp && Number(resp) > 0) {
                            deferred.reject({data: {error: "The Entity with URN: " + model.loanAccount.urnNo + 
                                " and Applicant URN: " + model.loanAccount.applicant + " is already having an active loan or loan application for the same product " 
                                + model.loanAccount.productCode + "."}});
                        } else {
                            deferred.resolve();
                        }
                    } catch (e) {
                        console.log(e)
                        deferred.reject({data: {error: "Error"}});
                    }

            }, function(res) {
                if(res.data) {
                    res.data.error = res.data.errorMsg;
                }
                deferred.reject(res);
            });
            return deferred.promise;
        }

        var populateDisbursementDate = function(modelValue,form,model){
            if (modelValue){
                modelValue = new Date(modelValue);
                model._currentDisbursement.scheduledDisbursementDate = new Date(modelValue.setDate(modelValue.getDate()+1));
            }
        };

        return {
            "type": "schema-form",
            "title": "CAPTURE_DATES",
            initialize: function (model, form, formCtrl) {
                $log.info("Individual Loan Booking Page got initialized");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                PageHelper.showProgress('load-loan', 'Loading loan account...');
                PagesDefinition.getPageConfig("Page/Engine/loans.individual.booking.LoanInput").then(function(data) {
                    $log.info(data);
                    if (data.showLoanBookingDetails != undefined && data.showLoanBookingDetails !== null && data.showLoanBookingDetails != "") {
                        model.showLoanBookingDetails = data.showLoanBookingDetails;
                        model.BackedDatedDisbursement = data.BackedDatedDisbursement;
                    }
                    //stateParams
                    console.log(model.BackedDatedDisbursement);
                    console.log(model.showLoanBookingDetails);
                    console.log(model.basicLoanDedupe);
                });
                PagesDefinition.getPageConfig("Page/Engine/loans.individual.booking.LoanBooking").then(function(data){
                    if(data.postDatedTransactionNotAllowed && data.postDatedTransactionNotAllowed != '') {
                        model.postDatedTransactionNotAllowed = data.postDatedTransactionNotAllowed;
                    }
                    if(data.basicLoanDedupe) {
                        model.basicLoanDedupe = data.basicLoanDedupe;
                    }
                });
                IndividualLoan.get({id: $stateParams.pageId})
                    .$promise
                    .then(
                        function (res) {

                            $log.info(res);
                            /* DO BASIC VALIDATION */
                            if (res.currentStage!= 'LoanBooking'){
                                PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                return;
                            }

                            if (_.has(res, 'disbursementSchedules') &&
                                _.isArray(res.disbursementSchedules) &&
                                res.disbursementSchedules.length > 0 &&
                                res.numberOfDisbursed < res.disbursementSchedules.length){
                                model._currentDisbursement = res.disbursementSchedules[res.numberOfDisbursed];
                            } else {
                                PageHelper.showProgress('load-loan', 'No disbursement schedules found for the loan', 2000);
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                return;
                            }

                            model.loanAccount = res;
                            var ids = [];
                            var urns = [];
                            if (model.loanAccount.customerId){
                                ids.push(model.loanAccount.customerId);
                            }

                            if (model.loanAccount.applicant){
                                urns.push(model.loanAccount.applicant);
                            }

                            if (model.loanAccount.portfolioInsuranceUrn){
                                urns.push(model.loanAccount.portfolioInsuranceUrn);
                            }

                            Queries.getCustomerBasicDetails({
                                urns: urns,
                                ids: ids
                            }).then(
                                function (resQuery) {
                                    if (_.hasIn(resQuery.urns, model.loanAccount.applicant))
                                        model.loanAccount.applicantName = resQuery.urns[model.loanAccount.applicant].first_name;
                                    
                                    if (_.hasIn(resQuery.urns, model.loanAccount.portfolioInsuranceUrn))
                                        model.loanAccount.portfolioInsuranceCustomerName = resQuery.urns[model.loanAccount.portfolioInsuranceUrn].first_name;
                                   
                                    
                                },
                                function (errQuery) {
                                }
                            );
                            PageHelper.showProgress('load-loan', 'Almost Done...');

                            if(model.loanAccount.collateral.length > 0){
                                for (var i = model.loanAccount.collateral.length - 1; i >= 0; i--) {
                                    if(model.loanAccount.collateral[i].loanToValue != "" && model.loanAccount.collateral[i].loanToValue != null)
                                        model.loanAccount.collateral[i].loanToValue = Number(model.loanAccount.collateral[i].loanToValue);
                                    else
                                        model.loanAccount.collateral[i].loanToValue = 0;
                                }
                            }

                            /* Now load the customer */
                            Enrollment.getCustomerById({id: model.loanAccount.customerId})
                                .$promise
                                .then(
                                    function (res) {
                                        model.loanAccount.customer = res;
                                        PageHelper.showProgress('load-loan', 'Done.', 2000);
                                    }, function (httpRes) {
                                        PageHelper.showProgress('load-loan', "Error while loading customer details", 2000);
                                    }
                                )
                        }, function (httpRes) {
                            PageHelper.showProgress('load-loan', 'Some error while loading the loan details', 2000)
                        }
                    )
            },
            offline: false,
            getOfflineDisplayItem: function (item, index) {
            },
            form: [{
                "type": "box",
                "title": "UPDATE_ACCOUNT", // sample label code
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "type": "date",
                        "required": true,
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                    },
                    {
                        "key": "_currentDisbursement.scheduledDisbursementDate",
                        "title": "SCHEDULED_DISBURSEMENT_DATE",
                        "type": "date",
                        "required": true
                    },
                    {
                        key: "loanAccount.emiPaymentDateRequested",
                        condition : "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        type: "string",
                        title: "EMI_PAYMENT_DATE_REQUESTED",
                        readonly: true
                    },
                    {
                        "key": "loanAccount.firstRepaymentDate",
                        "title": "REPAYMENT_DATE",
                        "type": "date",
                        "required": true
                    }
                ]
            }, {
                "type": "box",
                "title": "LOAN_DETAILS", // sample label code
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    {
                        "key": "loanAccount.partnerCode",
                        "title": "PARTNER_NAME",//add label in translation                        
                        "type": "select",
                        "enumCode":"partner",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.partnerCode",
                        "title": "PARTNER_CODE",                        
                        "readonly": true
                    },                    
                    /*{
                        "key": "loanAccount.loanType",
                        "readonly": true
                    },*/
                    {
                        "key": "loanAccount.frequency",
                        "readonly": true,
                        "type":"select",
                        "enumCode":"loan_product_frequency"
                    },
                    {
                        "key": "loanAccount.customer.firstName",
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.customer.urnNo",
                        "title": "CUSTOMER_URN",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.tenure",
                        "title": "DURATION_IN_MONTHS",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanAmount",
                        "title": "LOAN_AMOUNT",
                        "type":"amount",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanApplicationDate",
                        "readonly": true,
                        "title": "LOAN_APPLICATION_DATE"
                    },
                    {
                        "key": "loanAccount.loanPurpose1",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanPurpose2",
                        "readonly": true,
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    },
                    // {
                    //     "key": "loanAccount.loanPurpose3",
                    //     "readonly": true
                    // },
                     {
                        "key": "loanAccount.branchId",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "title": "BRANCH",
                        "type": "select",
                        "enumCode": "branch_id",
                        "readonly": true,
                    },
                    {
                        "key": "loanAccount.loanCentre.centreId",
                        "title": "CENTRE",
                        "readonly": true,
                        "type":"select",
                    },
                    {
                        "key": "loanAccount.interestRate",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.processingFeePercentage",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.portfolioInsurancePremium",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "title": "INSURANCE",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.commercialCibilCharge",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "title": "CIBIL_CHARGES",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanAmountRequested",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "title": "LOAN_AMOUNT_REQUESTED",
                        "type":"amount",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.securityEmiRequired",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.sanctionDate",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "readonly": true
                    },
                    {
                        "key":"additional.portfolioUrnSelector",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type":"string",
                        "readonly": true                     
                    },
                    {
                        key:"loanAccount.portfolioInsuranceUrn",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "title":"URN_NO",
                        "readonly": true
                    },
                    {
                        key: "loanAccount.portfolioInsuranceCustomerName",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        title: "NAME",
                        readonly: true
                    }
                    /*,
                    {
                        "type": "fieldset",
                        "title": "GUARANTOR_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.guarantors",
                                "type": "array",
                                "add": null,
                                "remove": null,
                                "items": [
                                    {
                                        "key": "loanAccount.guarantors[].guaUrnNo",

                                        "readonly": true
                                    },
                                    {
                                        "key": "loanAccount.guarantors[].guaFirstName",

                                        "readonly": true
                                    }
                                ]
                            }
                        ]
                    }*/,
                    {
                        "type": "fieldset",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija' && model.siteCode != 'IREPDhan'",
                        "notitle": true,
                        "items": [
                            {
                                "key":"loanAccount.collateral",
                                "title":"HYPOTHECATION",
                                "type":"array",
                                "readonly": true,
                                "items":[
                                    {
                                        "key": "loanAccount.collateral[].collateralCategory",
                                        "type": "select",
                                        "enumCode": "hypothecation_type",
                                        "title": "HYPOTHECATION_TYPE"
                                    }, {
                                        "key": "loanAccount.collateral[].collateralType",
                                        "type": "select",
                                        "enumCode": "hypothication_sub_type",
                                        "title": "HYPOTHECATION_SUB_TYPE",
                                        "parentEnumCode": "hypothecation_type",
                                        "parentValueExpr": "model.loanAccount.collateral[arrayIndex].collateralCategory",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].collateralDescription",
                                         "title": "HYPOTHECATION_DESCRIPTION"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].manufacturer"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].quantity",
                                        "onChange": function(value ,form ,model, event){
                                            calculateTotalValue(value, form, model);
                                        }
                                    },
                                    {
                                        "key":"loanAccount.collateral[].modelNo"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].machineOld"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].loanToValue",
                                        "type":"amount",
                                        "title":"PRESENT_VALUE"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].collateralValue",
                                        "type":"amount",
                                        "title":"PURCHASE_PRICE"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].totalValue",
                                        "type":"amount",
                                        "title":"TOTAL_VALUE"
                                    },
                                    // {
                                    //     "key":"loanAccount.collateral[].collateral1FilePath",
                                    //     "type":"file",
                                    //     "title":"DOCUMENT_1"
                                    // },
                                    // {
                                    //     "key":"loanAccount.collateral[].collateral2FilePath",
                                    //     "type":"file",
                                    //     "title":"DOCUMENT_2"
                                    // },
                                    // {
                                    //     "key":"loanAccount.collateral[].collateral3FilePath",
                                    //     "type":"file",
                                    //     "title":"DOCUMENT_3"
                                    // },
                                    // {
                                    //     "key":"loanAccount.collateral[].photoFilePath",
                                    //     "type":"file",
                                    //     "fileType":"image/*",
                                    //     "title":"PHOTO"
                                    // }
                                ]
                            }
                        ]
                    }, 
                    {
                        "type":"fieldset",
                        "title":"COLLATERAL",
                        "notitle": true,
                        "condition": "model.siteCode == 'IREPDhan'",
                        "items":[
                            {
                                "key":"loanAccount.collateral",
                                "title":"COLLATERAL",
                                "type":"array",
                                "readonly": true,
                                "items":[
                                    {
                                        "key":"loanAccount.collateral[].collateralType",
                                        "enumCode": "collateral_type_titledeed",
                                        "type":"select"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].propertyType",
                                        "type":"select",
                                        "enumCode": "collateral_property_type",
                                        "required": true,
                                    },
                                    {
                                        "key":"loanAccount.collateral[].extentOfProperty",
                                        "inputmode": "number",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].extentOfPropertyUnit",
                                        "condition": "model.loanAccount.collateral[arrayIndex].extentOfProperty",
                                        "type": "select",
                                        "enumCode": "property_extent_unit",
                                        "required": true,

                                    },
                                    {
                                        "key":"loanAccount.collateral[].documentType",
                                        "type": "select",
                                        "enumCode": "collateral_document_type",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].documentNumber"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].dateOfRegistration",
                                        "title":"DATE_OF_REGISTRATION",
                                        "type":"date",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].subRegistrar",
                                    },
                                    {
                                        key: "loanAccount.collateral[].subRegistrarPincode",
                                        type: "lov",
                                        "title":"SUB_REGISTRAR_PINCODE",
                                        "inputmode": "number",
                                        autolov: true,
                                        inputMap: {
                                            "subRegistrarPincode": {
                                                key: "loanAccount.collateral[].subRegistrarPincode"
                                            },
                                            "subRegistrarVillage": {
                                                key: "loanAccount.collateral[].subRegistrarVillage"
                                            },
                                            "subRegistrarArea": {
                                                key: "loanAccount.collateral[].subRegistrarArea"
                                            },
                                            "subRegistrarDistrict": {
                                                key: "loanAccount.collateral[].subRegistrarDistrict"
                                            },
                                            "subRegistrarState": {
                                                key: "loanAccount.collateral[].subRegistrarState"
                                            }
                                        },
                                        outputMap: {
                                            "division": "loanAccount.collateral[arrayIndex].subRegistrarArea",
                                            "region": "loanAccount.collateral[arrayIndex].subRegistrarVillage",
                                            "pincode": "loanAccount.collateral[arrayIndex].subRegistrarPincode",
                                            "district": "loanAccount.collateral[arrayIndex].subRegistrarDistrict",
                                            "state": "loanAccount.collateral[arrayIndex].subRegistrarState",
                                        },
                                        searchHelper: formHelper,
                                        initialize: function (inputModel) {
                                            $log.warn('in pincode initialize');
                                            $log.info(inputModel);
                                        },
                                        search: function (inputModel, form, model) {
                                            if (!inputModel.subRegistrarPincode) {
                                                return $q.reject();
                                            }
                                            return Queries.searchPincodes(
                                                inputModel.subRegistrarPincode,
                                                inputModel.subRegistrarDistrict,
                                                inputModel.subRegistrarState,
                                                inputModel.subRegistrarArea,
                                                inputModel.subRegistrarVillage
                                            );
                                        },
                                        getListDisplayItem: function (item, index) {
                                            return [
                                                item.division + ', ' + item.region,
                                                item.pincode,
                                                item.district + ', ' + item.state,
                                            ];
                                        },
                                        onSelect: function (result, model, context) {
                                            $log.info(result);
                                        }
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarArea",
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarVillage",
                                        screenFilter: true
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarDistrict",
                                        screenFilter: true
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarState",
                                        screenFilter: true
                                    },
                                    {
                                        "key":"loanAccount.collateral[].propertyOwner",
                                        "type": "select",
                                        "enumCode": "collateral_property_Owner"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].propertyOwnerName",
                                        "condition": "model.loanAccount.collateral[arrayIndex].propertyOwner == 'Others'",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].relationWithApplicant",
                                        "condition": "model.loanAccount.collateral[arrayIndex].propertyOwner == 'Others'",
                                        "type": "select",
                                        "enumCode":"relation_with_business_owner"
                                    },
                                    {
                                        "type": "fieldset",
                                        "title": "PROPERTY_ADDRESS",
                                        "items": [
                                            {
                                                "key":"loanAccount.collateral[].doorNo",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].surveyNo",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].landmark",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].village",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].mandal",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].district",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].state",
                                            },
                                        ]
                                    }
                            /*,
                            {
                                "key":"loanAccount.collateral[].collateral1FilePath",
                                "type":"file",
                                "title":"DOCUMENT_1"
                            },
                            {
                                "key":"loanAccount.collateral[].collateral2FilePath",
                                "type":"file",
                                "title":"DOCUMENT_2"
                            },
                            {
                                "key":"loanAccount.collateral[].collateral3FilePath",
                                "type":"file",
                                "title":"DOCUMENT_3"
                            },
                            {
                                "key":"loanAccount.collateral[].photoFilePath",
                                "type":"file",
                                "fileType":"image/*",
                                "title":"PHOTO"
                            }*/
                        ]
                    }
                ]
            },
            ]
            },

            {
                "type": "box",
                "title": "INTERNAL_FORE_CLOSURE_DETAILS", 
                "condition": "model.siteCode == 'kinara' && model.loanAccount.linkedAccountNumber",
                "items": [{
                    "key": "loanAccount.linkedAccountNumber",
                    "title":"LINKED_ACCOUNT_NUMBER",
                    "readonly":true
                }, {
                    "key": "loanAccount.transactionType",
                    "title":"TRANSACTION_TYPE",
                    "readonly":true,
                },{
                    "key": "loanAccount.button",
                    "title":"SUBMIT",
                    "type":"button",
                    "onClick": "actions.getPreClosureDetails(model, formCtrl, form, $event)"
                },{
                    "type":"fieldset",
                    "condition":"model.loanAccount.precloseuredetails",
                    "items":[
                    {
                        "key": "loanAccount.precloseurePayOffAmount",
                        "title": "PAYOFF_AMOUNT",
                        "readonly": true
                    }, {
                        "key": "loanAccount.precloseurePayOffAmountWithDue",
                        "title": "PAYOFF_AMOUNT_WITH_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseurePrincipal",
                        "title": "TOTAL_PRINCIPAL_DUE",
                        "readonly": true
                    }, {
                        "key": "loanAccount.precloseureNormalInterest",
                        "title": "TOTAL_INTEREST_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseurePenalInterest",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "readonly": true
                    }, {
                        "key": "loanAccount.precloseureTotalFee",
                        "title": "TOTAL_FEE_DUE",
                        "readonly": true,
                    }
                    ]
                },
                {
                    "type": "fieldset",
                    "title": "WAIVER_DETAILS",
                    "condition": "model.loanAccount.precloseuredetails",
                    "items": [{
                        "key": "loanAccount.disbursementSchedules[0].normalInterestDuePayment",
                        "title": "TOTAL_INTEREST_DUE",
                        "type": "amount",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment,model.loanAccount.precloseureNormalInterest)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].penalInterestDuePayment",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "type": "amount",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].penalInterestDuePayment,model.loanAccount.precloseurePenalInterest)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].feeAmountPayment",
                        "title": "TOTAL_FEE_DUE",
                        "type": "amount",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].feeAmountPayment,model.loanAccount.precloseureTotalFee)"
                    }]
                }
                ]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "button",
                    "title": "BACK",
                    "onClick": "actions.reenter(model, formCtrl, form, $event)"
                },
                {
                    "type": "button",
                    "title": "SEND_BACK",
                    "onClick": "actions.reject(model, formCtrl, form, $event)"
                },
                {
                    "type": "submit",
                    "title": "CONFIRM_LOAN_CREATION"
                }]
            }],
            schema: function () {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function (model, form, formName) {
                    $log.info("submitting");
                    var cbsdate=SessionStore.getCBSDate();
                    if(model._currentDisbursement.scheduledDisbursementDate)
                        var scheduledDisbursementDate = moment(model._currentDisbursement.scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.scheduledDisbursementDate && cbsdate)
                        var BackedDatedDiffDays = scheduledDisbursementDate.diff(cbsdate, "days");
                        var BackedDatedDiffmonth = scheduledDisbursementDate.diff(cbsdate, "month");
                    if(model.loanAccount.sanctionDate)
                        var sanctionDate = moment(model.loanAccount.sanctionDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.customerSignatureDate)
                        var customerSignatureDate = moment(model._currentDisbursement.customerSignatureDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.scheduledDisbursementDate && model.loanAccount.sanctionDate)
                        var diffDays = scheduledDisbursementDate.diff(sanctionDate, "days");
                    if(model.loanAccount.firstRepaymentDate)
                        var firstRepaymentDate = moment(model.loanAccount.firstRepaymentDate,SessionStore.getSystemDateFormat());
                    if (model.loanAccount.firstRepaymentDate){
                        var date = firstRepaymentDate.get("date");
                        if(model.siteCode != 'sambandh' && model.siteCode != 'saija' && model.siteCode != 'witfin' && date != 5 && date != 10 && date != 15){
                            PageHelper.showProgress("loan-create","First repayment date should be 5, 10 or 15",5000);
                            return false;
                        }
                        if(model.siteCode == 'witfin' && date != 6 && date!= 16) {
                            PageHelper.showProgress("loan-create","First repayment date should be 6 or 16",5000);
                            return false;
                        }
                    }

                    var cbsmonth = ((new Date(cbsdate)).getMonth());
                    var dismonth = ((new Date(scheduledDisbursementDate)).getMonth());

                    //$log.info(BackedDatedDiffmonth);

                    if(model.loanAccount.linkedAccountNumber && model.siteCode == 'kinara'){
                        var loanfee = parseInt(model.loanAccount.processingFeeInPaisa / 100) + model.loanAccount.commercialCibilCharge + model.loanAccount.portfolioInsurancePremium + parseInt(model.loanAccount.portfolioInsuranceServiceCharge - model.loanAccount.portfolioInsuranceServiceTax) + model.loanAccount.fee3 + model.loanAccount.fee4 + model.loanAccount.fee5 + model.loanAccount.securityEmi;
                        if (loanfee) {
                            var netdisbursementamount = model.loanAccount.disbursementSchedules[0].disbursementAmount - loanfee;
                        }
                        var linkedaccountoutstanding=(parseInt(model.loanAccount.precloseurePrincipal) +parseInt(model.loanAccount.precloseureNormalInterest)+parseInt(model.loanAccount.precloseurePenalInterest)+parseInt(model.loanAccount.precloseureTotalFee))-(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment+model.loanAccount.disbursementSchedules[0].penalInterestDuePayment+model.loanAccount.disbursementSchedules[0].feeAmountPayment);
                        if(parseInt(netdisbursementamount) < parseInt(linkedaccountoutstanding)){
                            PageHelper.setError({
                                message: "New loan First schedule disbursement amount with fees" + " " +netdisbursementamount+ " "+ "should  be greater then Linked Account Balence with Waiver amount" +"  " + linkedaccountoutstanding
                            });
                           return;
                        }
                    }

                    if(model.siteCode != 'sambandh' && model.siteCode != 'saija'){

                        if(model.postDatedTransactionNotAllowed) {
                            if (customerSignatureDate.diff(cbsdate, "days") <0) {
                                PageHelper.showProgress("loan-create", "Customer signature date should be greater than or equal to system date", 5000);
                                return false;
                            }
                        }

                        if(model.BackedDatedDisbursement && model.BackedDatedDisbursement=="ALL"){
                            if (scheduledDisbursementDate.diff(cbsdate, "days") <0) {
                                PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should be greater than CBS date", 5000);
                                return false;
                            }
                        }

                        if(model.BackedDatedDisbursement && model.BackedDatedDisbursement=="CURRENT_MONTH"){
                            if (scheduledDisbursementDate.diff(cbsdate, "days") <0 && (cbsmonth !== dismonth)) {
                                PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should not be a previous month of CBS date", 5000);
                                return false;
                            }
                        }
                        if (diffDays > pendingDisbursementDays) {
                            PageHelper.showProgress("loan-create", "Difference between Loan sanction date and disbursement date is greater than " + pendingDisbursementDays + " days", 5000);
                            return false;
                        }
                        if (customerSignatureDate.isBefore(sanctionDate)) {
                            PageHelper.showProgress("loan-create", "Customer sign date should be greater than the Loan sanction date", 5000);
                            return false;
                           }
                        if (model.loanAccount.firstRepaymentDate) {
                            if (firstRepaymentDate.diff(scheduledDisbursementDate, "days") <= 0) {
                                PageHelper.showProgress("loan-create", "Repayment date should be greater than sanction date", 5000);
                                return false;
                            }
                        }
                    }
                    
                    if(model.siteCode == 'sambandh' || model.siteCode == 'saija') {
                        if (scheduledDisbursementDate.diff(customerSignatureDate,"days") < 0){
                            PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than or equal to Customer sign date",5000);
                            return false;
                        }
                    }
                    else  {
                        if (scheduledDisbursementDate.diff(customerSignatureDate,"days") <= 0){
                            PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than Customer sign date",5000);
                            return false;
                        }
                    }
                    
                    var validatePromise = [];
                    if(model.siteCode == 'sambandh' && SessionStore.getGlobalSetting('individualLoan.cbCheck.required') == "true" && 
                        model.loanAccount.loanAmount >= Number(SessionStore.getGlobalSetting('individualLoan.cbCheck.thresholdAmount'))) {
                        validatePromise.push(isCBCheckValid(model));
                    }

                    if(model.basicLoanDedupe) {
                        validatePromise.push(doBasicLoanDedupeCheck(model));
                    }

                    $q.all(validatePromise).then(function() {
                        Utils.confirm("Ready to book the loan?")
                        .then(function(){
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].customerSignatureDate = model._currentDisbursement.customerSignatureDate;
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].scheduledDisbursementDate = model._currentDisbursement.scheduledDisbursementDate;

                            var reqData = { 'loanAccount': _.cloneDeep(model.loanAccount), 'loanProcessAction': 'PROCEED'};
                            PageHelper.showProgress('update-loan', 'Working...');
                            return IndividualLoan.update(reqData)
                                .$promise
                                .then(
                                    function(res){
                                        PageHelper.showProgress('update-loan', 'Done', 2000);
                                        // $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                        irfNavigator.goBack();
                                        return;
                                    }, function(httpRes){
                                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                                        PageHelper.showErrors(httpRes);
                                    }
                                )
                        }, function(){
                            $log.info("User selected No");
                        })
                    }, function(httpRes){
                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                        PageHelper.showErrors(httpRes);
                    });
                },
                getPreClosureDetails:function(model,form,formname){
                    PageHelper.showLoader();
                    PageHelper.showProgress('preclosure', 'Getting PreClosure Details', 2000);
                    var reqData={
                        linkedAccountId:model.loanAccount.linkedAccountNumber,
                        valueDate:moment(model._currentDisbursement.scheduledDisbursementDate).format("YYYY-MM-DD")
                    };
                    IndividualLoan.getPreClosureDetails(reqData).$promise.then(function(response){
                        PageHelper.hideLoader();
                        PageHelper.showProgress('preclosure', 'Preclosure loan details are generated', 2000);
                        model.loanAccount.precloseuredetails=true;
                        model.loanAccount.precloseurePayOffAmount=response.part1;
                        model.loanAccount.precloseurePayOffAmountWithDue=response.part2;
                        model.loanAccount.precloseurePrincipal=model.loanAccount.disbursementSchedules[0].linkedAccountTotalPrincipalDue= (response.part3.slice(3)).replace(/\,/g,"");
                        model.loanAccount.precloseureNormalInterest=model.loanAccount.disbursementSchedules[0].linkedAccountNormalInterestDue=(response.part4.slice(3)).replace(/\,/g,"");
                        model.loanAccount.precloseurePenalInterest=model.loanAccount.disbursementSchedules[0].linkedAccountPenalInterestDue=(response.part5.slice(3)).replace(/\,/g,"");
                        model.loanAccount.precloseureTotalFee=model.loanAccount.disbursementSchedules[0].linkedAccountTotalFeeDue=(response.part6.slice(3)).replace(/\,/g,"");
                    },function(error){
                        model.loanAccount.precloseuredetails=false;
                        PageHelper.showProgress('preclosure', 'Error Getting Preclosure loan details', 2000);
                        $log.info(error);
                        PageHelper.hideLoader();
                    });
                },
                validateWaiverAmount: function(amount1,amount2) {
                    PageHelper.clearErrors();
                    amount2= parseInt(amount2);
                    if (amount1> parseInt(amount2)) {
                        PageHelper.clearErrors();
                        PageHelper.setError({
                            message: "Amount should not be greater then" +" " + amount2
                        });
                    }
                },
                reject: function (model, form, formName) {

                    $log.info("rejecting");

                    Utils.confirm("Are you sure you want to send back to Loan Input?")
                        .then(function(){
                            var reqData = { 'loanAccount': _.cloneDeep(model.loanAccount), 'loanProcessAction': 'PROCEED', 'stage':'LoanInitiation'};
                            PageHelper.showProgress('update-loan', 'Working...');
                            return IndividualLoan.update(reqData)
                                .$promise
                                .then(
                                    function(res){
                                        PageHelper.showProgress('update-loan', 'Done', 2000);
                                        // $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                        irfNavigator.goBack();
                                        return;
                                    }, function(httpRes){
                                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                                        PageHelper.showErrors(httpRes);
                                    }
                                )
                        }, function(){
                            $log.info("User selected No");
                        })
                },
                reenter: function (model, formCtrl, form, $event) {
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.booking.PendingQueue',
                        pageId: null
                    });
                }
            }
        };
    }]);
