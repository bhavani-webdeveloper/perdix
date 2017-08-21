irf.pageCollection.factory(irf.page("loans.individual.booking.SimpleLoanInput"), ["$log", "LoanProducts","irfNavigator", "LoanBookingCommons", "$filter", "Utils", "PagesDefinition", "$stateParams", "Queries", "IndividualLoan", "PageHelper", "$q", "formHelper", "SimpleLoanInput", "$state", "SessionStore",
    function($log, LoanProducts, irfNavigator, LoanBookingCommons, $filter, Utils, PagesDefinition, $stateParams, Queries, IndividualLoan, PageHelper, $q, formHelper, SimpleLoanInput, $state, SessionStore) {
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var bankName = SessionStore.getBankName();
        var bankId;

        bankId = $filter('filter')(formHelper.enum("bank").data, {
            name: bankName
        }, true)[0].code;

        var showLoanBookingDetails = false;

        var getSanctionedAmount = function(model) {
            var fee = 0;
            if (model.loanAccount.commercialCibilCharge)
                if (!_.isNaN(model.loanAccount.commercialCibilCharge))
                    fee += model.loanAccount.commercialCibilCharge;
            $log.info(model.loanAccount.commercialCibilCharge);
        };

        var validateForm = function(formCtrl) {
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                return false;
            }
            return true;
        };


        var navigateToQueue = function(model) {
            irfNavigator.goBack();

        };

        var populateLoanCustomerRelations = function(model) {
            model.loanAccount.loanCustomerRelations = [];
            model.loanAccount.loanCustomerRelations.push({
                customerId: model.loanAccount.applicantId,
                urn: model.loanAccount.applicant,
                relation: 'Applicant',
                psychometricCompleted: "NO"
            });            
        }

       
        var populateDisbursementDate = function(modelValue, form, model) {
            if (modelValue) {
                modelValue = new Date(modelValue);
                model._currentDisbursement.scheduledDisbursementDate = new Date(modelValue.setDate(modelValue.getDate() + 1));
            }
        };


        try {
            var defaultPartner = formHelper.enum("partner").data[0].value;
        } catch (e) {}

        var populateDisbursementSchedule = function(value, form, model) {
            PageHelper.showProgress("loan-create", "Verify Disbursement Schedules", 5000);
            model.loanAccount.disbursementSchedules = [];
            for (var i = 0; i < value; i++) {
                model.loanAccount.disbursementSchedules.push({
                    trancheNumber: "" + (i + 1),
                    disbursementAmount: 0
                });
            }
            if (value == 1) {
                model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
            }

        }


        var getProductDetails = function(value, model) {
            if (value)
                LoanProducts.getProductData({
                    "productCode": value
                })
                .$promise
                .then(
                    function(res) {
                        try {
                            delete model.additional.product;
                        } catch (err) {
                            console.error(err);
                        }
                        model.additional.product = res;
                        model.additional.product.interestBracket = res.minInterestRate + '% - ' + res.maxInterestRate + '%';
                        model.additional.product.amountBracket = model.additional.product.amountFrom + ' - ' + model.additional.product.amountTo;
                        $log.info(model.additional.product.interestBracket);
                        model.loanAccount.frequency = model.additional.product.frequency;
                        // if (model.additional.product.frequency == 'M')
                        //     model.loanAccount.frequency = 'Monthly';
                        if (model.loanAccount.loanPurpose1 != null) {
                            var purpose1_found = false;
                            Queries.getLoanPurpose1(model.loanAccount.productCode).then(function(resp1) {
                                loanPurpose1List = [];
                                loanPurpose1List = resp1.body;
                                if (loanPurpose1List && loanPurpose1List.length > 0) {
                                    for (var i = loanPurpose1List.length - 1; i >= 0; i--) {
                                        if (model.loanAccount.loanPurpose1 == loanPurpose1List[i].purpose1)
                                            purpose1_found = true;
                                    }
                                    if (!purpose1_found)
                                        model.loanAccount.loanPurpose1 = null;
                                } else
                                    model.loanAccount.loanPurpose1 = null;

                                if (model.loanAccount.loanPurpose2 != null) {
                                    var purpose2_found = false;
                                    Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1).then(function(resp2) {
                                        loanPurpose2List = [];
                                        loanPurpose2List = resp2.body;
                                        if (loanPurpose2List && loanPurpose2List.length > 0) {
                                            for (var i = loanPurpose2List.length - 1; i >= 0; i--) {
                                                if (model.loanAccount.loanPurpose2 == loanPurpose2List[i].purpose2)
                                                    purpose2_found = true;
                                            }
                                            if (!purpose2_found)
                                                model.loanAccount.loanPurpose2 = null;
                                        } else
                                            model.loanAccount.loanPurpose2 = null;
                                    }, function(err) {
                                        $log.info("Error while fetching Loan Purpose 1 by Product");
                                    });
                                }
                            }, function(err) {
                                $log.info("Error while fetching Loan Purpose 1 by Product");
                            });
                        }
                    },
                    function(httpRes) {
                        PageHelper.showProgress('loan-create', 'Failed to load the Product details. Try again.', 4000);
                        PageHelper.showErrors(httpRes);
                        PageHelper.hideLoader();
                    }
                )
        }

        var partnerChange = function(value, model) {
            if (value != 'Kinara') {
                try {
                    delete model.additional.product;
                    model.loanAccount.frequency = null;
                    model.loanAccount.productCode = null;
                } catch (err) {
                    console.error(err);
                }
            }
        }


        return {
            "type": "schema-form",
            "title": "LOAN_INPUT",
            initialize: function(model, form, formCtrl) {
                PageHelper.hideLoader();
                model.loanAccount = model.loanAccount || {};
                model.branchName = SessionStore.getBranch();
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.currentStage = 'LoanInitiation';
                var init = function(model, form, formCtrl) {
                    model.loanAccount = model.loanAccount || {
                        branchId: branchId
                    };
                    model.additional = model.additional || {};
                    model.additional.branchName = branchName;
                    model.loanAccount.bankId = bankId;
                    model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                    model.loanAccount.disbursementSchedules = model.loanAccount.disbursementSchedules || [];
                    model.loanAccount.collateral = model.loanAccount.collateral || [{
                        quantity: 1
                    }];
                    PageHelper.showLoader();
                    Queries.getGlobalSettings("mainPartner").then(function(value) {
                        model.loanAccount.partnerCode = model.loanAccount.partnerCode || value;
                        $log.info("mainPartner:" + model.loanAccount.partnerCode);
                    }, function(err) {
                        $log.info("mainPartner is not available");
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                    //model.loanAccount.partnerCode = model.loanAccount.partnerCode || "Kinara";
                    model.loanAccount.loanCustomerRelations = model.loanAccount.loanCustomerRelations || [];
                    model.loanAccount.coBorrowers = [];
                    model.loanAccount.guarantors = [];
                    model.showLoanBookingDetails = showLoanBookingDetails;

                    PagesDefinition.getPageConfig("Page/Engine/loans.individual.booking.LoanInput").then(function(data) {
                        if (data.stateParams.showLoanBookingDetails != undefined && data.stateParams.showLoanBookingDetails !== null && data.stateParams.showLoanBookingDetails != "") {
                            model.showLoanBookingDetails = data.stateParams.showLoanBookingDetails;
                        }
                        console.log(model.showLoanBookingDetails);
                    });
                    //model.loanAccount.guarantors = [];
                    for (var i = 0; i < model.loanAccount.loanCustomerRelations.length; i++) {
                        if (model.loanAccount.loanCustomerRelations[i].relation === 'APPLICANT' ||
                            model.loanAccount.loanCustomerRelations[i].relation === 'Applicant') {
                            model.loanAccount.applicantId = model.loanAccount.loanCustomerRelations[i].customerId;
                        } else if (model.loanAccount.loanCustomerRelations[i].relation === 'COAPPLICANT' ||
                            model.loanAccount.loanCustomerRelations[i].relation === 'Co-Applicant') {
                            model.loanAccount.coBorrowers.push({
                                coBorrowerUrnNo: model.loanAccount.loanCustomerRelations[i].urn,
                                customerId: model.loanAccount.loanCustomerRelations[i].customerId
                            });
                        } else if (model.loanAccount.loanCustomerRelations[i].relation === 'GUARANTOR' ||
                            model.loanAccount.loanCustomerRelations[i].relation === 'Guarantor') {
                            model.loanAccount.guarantors.push({
                                guaUrnNo: model.loanAccount.loanCustomerRelations[i].urn,
                                customerId: model.loanAccount.loanCustomerRelations[i].customerId
                            });
                        }
                    }

                    model.loanAccount.nominees = model.loanAccount.nominees || [{
                        nomineeFirstName: "",
                        nomineeDoorNo: ""
                    }];
                    if (model.loanAccount.nominees.length == 0)
                        model.loanAccount.nominees = [{
                            nomineeFirstName: "",
                            nomineeDoorNo: ""
                        }];

                    model.loanAccount.loanApplicationDate = model.loanAccount.loanApplicationDate || Utils.getCurrentDate();
                    model.loanAccount.documentTracking = model.loanAccount.documentTracking || "PENDING";
                    model.loanAccount.isRestructure = false;
                    getSanctionedAmount(model);
                    if (model.loanAccount.productCode)
                        getProductDetails(model.loanAccount.productCode, model);

                    LoanBookingCommons.getLoanAccountRelatedCustomersLegacy(model.loanAccount);
                };
                // code for existing loan
                $log.info("Loan Number:::" + $stateParams.pageId);
                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    IndividualLoan.get({
                        id: $stateParams.pageId
                    }).$promise.then(function(resp) {
                        if (resp.currentStage != 'LoanInitiation' && resp.currentStage != 'PendingForPartner') {
                            PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                            $state.go('Page.Engine', {
                                pageName: 'loans.individual.booking.PendingQueue',
                                pageId: null
                            });
                            return;
                        }
                        $log.info("resp");
                        model.loanAccount = resp;
                            var urns = [];                           
                            Queries.getCustomerBasicDetails({
                                "urns": urns
                            }).then(
                                function(resQuery) {
                                    if (!_.isNull(model.loanAccount.applicant)) {
                                        model.loanAccount.applicantName = resQuery.urns[model.loanAccount.applicant].first_name
                                    }
                                   
                                },
                                function(errQuery) {}
                            );
                        model.currentStage = resp.currentStage;
                        model.additional = model.additional || {};

                        if (model.loanAccount.portfolioInsuranceUrn == model.loanAccount.applicant) {
                            model.additional.portfolioUrnSelector = "applicant";
                        }
                        init(model, form, formCtrl); // init call
                    }, function(errResp) {
                        PageHelper.showErrors(errResp);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                } else {
                    init(model, form, formCtrl); // init call
                }

            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return [
                    '{{"ENTITY_NAME"|translate}}: ' + item.customer.firstName + (item.loanAccount.urnNo ? ' <small>{{"URN_NO"|translate}}:' + item.loanAccount.urnNo + '</small>' : ''),
                    '{{"PRODUCT_CODE"|translate}}: ' + item.loanAccount.productCode,
                    '{{"CENTRE_ID"|translate}}: ' + item.loanAccount.loanCentre.centreId
                ]
            },
            form: [{
                "type": "box",
                "title": "LOAN_INPUT",
                "items": [{
                    "type": "fieldset",
                    "title": "BRANCH_DETAILS",
                    "items": [
                        "loanAccount.branchId",
                        "loanAccount.loanCentre.centreId"
                    ]
                }, {
                    "type": "fieldset",
                    "title": "PRODUCT_DETAILS",
                    "items": [
                        "loanAccount.partnerCode",
                        "loanAccount.productCategory",
                        "loanAccount.frequency",
                        "loanAccount.productCode",
                        "loanAccount.tenure"
                    ]
                }, {
                    "type": "fieldset",
                    "title": "ENTITY_DETAILS",
                    "items": [
                        "loanAccount.applicant",
                        "loanAccount.applicantName"
                    ]
                }, {
                    "type": "fieldset",
                    "title": "LOAN_DETAILS",
                    "items": [
                        "loanAccount.loanAmount",
                        "loanAccount.processingFeePercentage",
                        "loanAccount.interestRate",
                        "loanAccount.loanApplicationDate",
                        "loanAccount.loanPurpose1",
                        "loanAccount.loanPurpose2"
                    ]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                "items": [{
                    "type": "fieldset",
                    "title": "INSURANCE_POLICY",
                    "items": [
                        "additional.portfolioUrnSelector",
                        "loanAccount.portfolioInsuranceUrn",
                        "loanAccount.portfolioInsuranceCustomerName",
                    ]
                }, {
                    "type": "fieldset",
                    "title": "REMARKS",
                    "items": [
                        "loanAccount.remarks"
                    ]
                }],
            }, {
                "type": "actionbox",
                "condition": "model.loanAccount.customerId && !model.loanAccount.id",
                "items": [{
                    "type": "button",
                    "icon": "fa fa-circle-o",
                    "title": "SAVE",
                    "onClick": "actions.save(model, formCtrl, form, $event)"
                }]
            }, {
                "type": "actionbox",
                "condition": "model.loanAccount.id",
                "items": [{
                    "type": "button",
                    "icon": "fa fa-circle-o",
                    "title": "SAVE",
                    "onClick": "actions.save(model, formCtrl, form, $event)"
                }, {
                    "type": "button",
                    "title": "PROCEED",
                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                }]
            }],
            schema: function() {
                return $q.resolve(SimpleLoanInput.getSchema());
            },
            actions: {
                save: function(model, formCtrl, form, $event) {
                    $log.info("Inside save()");
                    PageHelper.clearErrors();
                    if (!_.hasIn(model.loanAccount, 'loanAmountRequested') || _.isNull(model.loanAccount.loanAmountRequested)) {
                        model.loanAccount.loanAmountRequested = model.loanAccount.loanAmount;
                    }
                    // if (!preLoanSaveOrProceed(model)) {
                    //     return;
                    // }
                    populateLoanCustomerRelations(model);
                    Utils.confirm("Are You Sure?")
                        .then(
                            function() {
                                var reqData = {
                                    loanAccount: _.cloneDeep(model.loanAccount)
                                };
                                if (!$stateParams.pageId) {
                                    $log.info("hi i am in the if and else no bad");
                                    reqData.loanAccount.currentStage = 'LoanInitiation';
                                    reqData.loanAccount.loanAmountRequested = reqData.loanAccount.loanAmount;
                                    $log.info(reqData.loanAccount.currentStage);
                                }
                                reqData.loanAccount.status = '';
                                reqData.loanProcessAction = "SAVE";
                                //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                                // reqData.remarks = model.review.remarks;
                                reqData.loanAccount.screeningDate = reqData.loanAccount.screeningDate || Utils.getCurrentDate();
                                reqData.loanAccount.psychometricCompleted = reqData.loanAccount.psychometricCompleted || "N";

                                PageHelper.showLoader();

                                var completeLead = false;

                                if (!_.hasIn(reqData.loanAccount, "id")) {
                                    completeLead = true;
                                }
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res) {
                                        model.loanAccount = res.loanAccount;
                                        $state.go("Page.Engine", {
                                            pageName: "loans.individual.booking.SimpleLoanInput",
                                            pageId: model.loanAccount.id
                                        }, {
                                            reload: true
                                        });
                                    }, function(httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes) {
                                        PageHelper.hideLoader();
                                    })
                            }
                        );
                },
                proceed: function(model, form, formName) {
                    $log.info(model);
                    PageHelper.clearErrors();

                    if (!validateForm(form)) {
                        return;
                    }

                    model.loanAccount.psychometricCompleted = model.loanAccount.psychometricCompleted || "N";

                    if (model.additional.product && !_.isNull(model.additional.product.numberOfGuarantors) && model.additional.product.numberOfGuarantors > 0) {
                        if (!_.isArray(model.loanAccount.guarantors) || model.loanAccount.guarantors.length == 0) {
                            PageHelper.showProgress('loan-product-guarantor-required', 'Guarantor is mandatory for the selected product', 5000);
                            return;
                        }
                    }

                    model.loanAccount.loanPurpose3 = model.loanAccount.loanPurpose2;
                    if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length && model.loanAccount.applicant === model.loanAccount.coBorrowers[0].coBorrowerUrnNo) {
                        PageHelper.showProgress("loan-create", "Applicant & Co-applicant cannot be same", 5000);
                        return false;
                    }

                    if (model.loanAccount.guarantors && model.loanAccount.guarantors.length > 0) {
                        for (i = 0; i < model.loanAccount.guarantors.length; i++) {
                            if (!model.loanAccount.guarantors[i].guaUrnNo) {
                                PageHelper.showProgress("loan-create", "Guarantor Urn is not selected", 5000);
                                return false;
                            }
                            if (model.loanAccount.applicant === model.loanAccount.guarantors[i].guaUrnNo) {
                                PageHelper.showProgress("loan-create", "Applicant & Guarantor cannot be same", 5000);
                                return false;
                            }
                            if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length && model.loanAccount.coBorrowers[0].coBorrowerUrnNo === model.loanAccount.guarantors[i].guaUrnNo) {
                                PageHelper.showProgress("loan-create", "Co-Applicant & Guarantor cannot be same", 5000);
                                return false;
                            }
                        }
                    }
                    model.loanAccount.securityEmiRequired = model.loanAccount.securityEmiRequired || 'NO';

                    var trancheTotalAmount = 0;
                    if (model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length) {
                        model.loanAccount.disbursementSchedules[0].customerAccountNumber = model.loanAccount.customerBankAccountNumber;
                        model.loanAccount.disbursementSchedules[0].ifscCode = model.loanAccount.customerBankIfscCode;
                        model.loanAccount.disbursementSchedules[0].customerBankName = model.loanAccount.customerBank;
                        model.loanAccount.disbursementSchedules[0].customerBankBranchName = model.loanAccount.customerBranch;
                        model.loanAccount.disbursementSchedules[0].party = 'CUSTOMER';
                        model.loanAccount.disbursementSchedules[0].customerNameInBank = model.loanAccount.customerNameAsInBank;
                        for (var i = model.loanAccount.disbursementSchedules.length - 1; i >= 0; i--) {
                            model.loanAccount.disbursementSchedules[i].modeOfDisbursement = "CASH";
                            trancheTotalAmount += (model.loanAccount.disbursementSchedules[i].disbursementAmount || 0);
                        }
                    }
                    // if (model.additional.product && model.additional.product.productType != 'OD' && trancheTotalAmount > model.loanAccount.loanAmount) {
                    //     PageHelper.showProgress("loan-create", "Total tranche amount is more than the Loan amount", 5000);
                    //     return false;
                    // }
                    // if (model.additional.product && model.additional.product.productType != 'OD' && trancheTotalAmount < model.loanAccount.loanAmount) {
                    //     PageHelper.showProgress("loan-create", "Total tranche amount should match with the Loan amount", 5000);
                    //     return false;
                    // }
                    // if (model.additional.product && model.additional.product.productType == 'OD' && model.loanAccount.numberOfDisbursements > 1) {
                    //     PageHelper.showProgress("loan-create", "For LOC type product, number of disbursement cannot be more than one during loan booking", 5000);
                    //     return false;
                    // }

                    //Product specific validations
                    if (model.additional.product) {
                        // if (model.additional.product.collateralRequired && model.loanAccount.collateral.length == 0) {
                        //     PageHelper.showProgress("loan-create", "Collateral details are mandatory", 5000);
                        //     return false;
                        // }
                        if (!_.isNaN(model.additional.product.amountFrom) && model.additional.product.amountFrom > 0) {
                            if (model.loanAccount.loanAmount < model.additional.product.amountFrom) {
                                PageHelper.showProgress("loan-create", "Loan Amount requested should be in the range [" + model.additional.product.amountFrom + " - " + model.additional.product.amountTo + "]", 5000);
                                return false;
                            }
                            if (model.loanAccount.loanAmount > model.additional.product.amountTo) {
                                PageHelper.showProgress("loan-create", "Loan Amount requested should be in the range [" + model.additional.product.amountFrom + " - " + model.additional.product.amountTo + "]", 5000);
                                return false;
                            }
                        }
                        if (!_.isNaN(model.additional.product.tenureFrom) && model.additional.product.tenureFrom > 0) {
                            if (model.loanAccount.tenure < model.additional.product.tenureFrom) {
                                PageHelper.showProgress("loan-create", "Loan Tenure requested should be in the range [" + model.additional.product.tenureFrom + " - " + model.additional.product.tenureTo + "]", 5000);
                                return false;
                            }
                            if (model.loanAccount.tenure > model.additional.product.tenureTo) {
                                PageHelper.showProgress("loan-create", "Loan Tenure requested should be in the range [" + model.additional.product.tenureFrom + " - " + model.additional.product.tenureTo + "]", 5000);
                                return false;
                            }
                        }
                        if (!_.isNaN(model.additional.product.minInterestRate) && model.additional.product.minInterestRate > 0) {
                            if (model.loanAccount.interestRate < model.additional.product.minInterestRate) {
                                PageHelper.showProgress("loan-create", "Interest Rate should be in the range [" + model.additional.product.minInterestRate + "% - " + model.additional.product.maxInterestRate + "%]", 5000);
                                return false;
                            }
                            if (model.loanAccount.interestRate > model.additional.product.maxInterestRate) {
                                PageHelper.showProgress("loan-create", "Loan Amount requested should be in the range [" + model.additional.product.minInterestRate + "% - " + model.additional.product.maxInterestRate + "%]", 5000);
                                return false;
                            }
                        }
                    }

                    // BUG FIX DO-customer id going null
                    populateLoanCustomerRelations(model);

                    if (model.loanAccount.portfolioInsuranceUrn != '') {
                        model.loanAccount.portfolioInsurancePremiumCalculated = "Yes";
                    }
                    if (model.loanAccount.currentStage == 'LoanInitiation' && model.loanAccount.partnerCode == 'Kinara' && model.loanAccount.productCode == null) {
                        PageHelper.showProgress("loan-create", "Product Code is mandatory", 5000);
                        return false;
                    }
                    if (model.loanAccount.currentStage == 'PendingForPartner' && model.loanAccount.productCode == null) {
                        PageHelper.showProgress("loan-create", "Product Code is mandatory", 5000);
                        return false;
                    }

                    if (!_.hasIn(model.loanAccount, 'loanAmountRequested') || _.isNull(model.loanAccount.loanAmountRequested)) {
                        model.loanAccount.loanAmountRequested = model.loanAccount.loanAmount;
                    }

                    var reqData = _.cloneDeep(model);
                    // if(reqData.loanAccount.frequency)
                    //     reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                    Utils.confirm("Are You Sure?").then(function() {
                        PageHelper.showLoader();
                        if (!$stateParams.pageId && !model.loanAccount.id) {
                            reqData.loanProcessAction = "SAVE";
                            IndividualLoan.create(reqData, function(resp, headers) {
                                delete resp.$promise;
                                delete resp.$resolved;
                                $log.info(resp);
                                //model.loanAccount.id = resp.loanAccount.id;
                                $log.info("Loan ID Returned on Save:" + model.loanAccount.id);
                                resp.loanProcessAction = "PROCEED";
                                if (resp.loanAccount.currentStage == 'LoanInitiation' && resp.loanAccount.partnerCode == 'Kinara')
                                    resp.stage = 'LoanBooking';

                                if (resp.loanAccount.currentStage == 'PendingForPartner' && resp.loanAccount.partnerCode !== 'DO Partner1-IC') {
                                    resp.stage = 'LoanBooking';
                                    $log.info("printing in if ");
                                    $log.info(model.loanAccount.partnerCode);
                                }
                                //reqData.loanProcessAction="PROCEED";
                                PageHelper.showLoader();
                                IndividualLoan.update(resp, function(resp, headers) {
                                    $log.info(resp);
                                    PageHelper.showProgress("loan-create", "Loan Created", 5000);
                                    irfNavigator.goBack();
                                }, function(errresp) {
                                    $log.info(errresp);
                                    PageHelper.showErrors(errresp);
                                    PageHelper.showProgress("loan-create", "Oops. An Error Occurred", 5000);
                                    model = resp;

                                }).$promise.finally(PageHelper.hideLoader);


                            }, function(errResp) {
                                $log.info(errResp);
                                PageHelper.showErrors(errResp);
                                PageHelper.showProgress("loan-create", "Oops. An Error Occurred", 5000);

                            }).$promise.finally(function() {
                                PageHelper.hideLoader();
                            });
                        } else {
                            reqData.loanProcessAction = "PROCEED";
                            if (model.loanAccount.currentStage == 'LoanInitiation' && model.loanAccount.partnerCode == 'Kinara')
                                reqData.stage = 'LoanBooking';

                            if (model.loanAccount.currentStage == 'PendingForPartner' && model.loanAccount.partnerCode !== 'DO Partner1-IC') {
                                $log.info("printing in else ");
                                $log.info(model.loanAccount.partnerCode);
                                reqData.stage = 'LoanBooking';
                            }
                            IndividualLoan.update(reqData, function(resp, headers) {
                                model.loanAccount.id = resp.loanAccount.id;
                                $log.info("Loan ID Returned on Proceed:" + model.loanAccount.id);
                                PageHelper.showLoader();
                                // $state.go('Page.Engine', {pageName: 'loans.individual.booking.InitiationQueue', pageId: null});
                                return navigateToQueue(model);
                            }, function(errResp) {
                                $log.info(errResp);
                                PageHelper.showErrors(errResp);
                                PageHelper.showProgress("loan-create", "Oops. An Error Occurred", 5000);

                            }).$promise.finally(function() {
                                PageHelper.hideLoader();
                            });
                        }
                    });
                }
            }

        };
    }
]);