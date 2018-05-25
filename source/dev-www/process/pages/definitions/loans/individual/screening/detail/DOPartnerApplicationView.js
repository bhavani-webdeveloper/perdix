define({
    pageUID: "loans.individual.screening.detail.DOPartnerApplicationView",
    pageType: "Engine",
    dependencies: ["$log", "$state","LoanBookingCommons", "Enrollment", "IndividualLoan", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils","LoanProducts", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "SchemaResource", "LoanProcess", "irfCurrencyFilter", "irfElementsConfig"
    ],
    $pageFn: function($log, $state,LoanBookingCommons, Enrollment, IndividualLoan, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
        PageHelper, Utils,LoanProducts, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource, SchemaResource, LoanProcess, irfCurrencyFilter, irfElementsConfig) {
        var strongRender = function(data, type, full, meta) {
            return '<strong>' + data + '</strong>';
        }

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var bankName = SessionStore.getBankName();
        var bankId;
        bankId = $filter('filter')(formHelper.enum("bank").data, {name:bankName}, true)[0].code;

        var currencyRightRender = function(data) {
            if (data < 0)
                return '-' + irfElementsConfig.currency.iconHtml + irfCurrencyFilter(Math.abs(data), null, null, "decimal");

            return irfElementsConfig.currency.iconHtml + irfCurrencyFilter(data, null, null, "decimal");
        }
        var navigateToQueue = function(model) {
            // Considering this as the success callback
            // Deleting offline record on success submission
            BundleManager.deleteOffline().then(function() {
                PageHelper.showProgress("loan-offline", "Offline record cleared", 5000);
            });
            if (model.currentStage == 'Screening')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.ScreeningQueue',
                    pageId: null
                });
            if (model.currentStage == 'Dedupe')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.DedupeQueue',
                    pageId: null
                });
            if (model.currentStage == 'ScreeningReview')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.ScreeningReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'Application')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.ApplicationQueue',
                    pageId: null
                });
            if (model.currentStage == 'ApplicationReview')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.ApplicationReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'FieldAppraisal')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.FieldAppraisalQueue',
                    pageId: null
                });
            if (model.currentStage == 'FieldAppraisalReview')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.FieldAppraisalReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'CreditCommitteeReview')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.CreditCommitteeReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'CentralRiskReview')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.CentralRiskReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'ZonalRiskReview')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.ZonalRiskReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'Sanction')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.screening.LoanSanctionQueue',
                    pageId: null
                });
            if (model.currentStage == 'PendingForPartner')
                $state.go('Page.Engine', {
                    pageName: 'loans.individual.booking.PendingForPartnerQueue',
                    pageId: null
            });
            
            if (model.currentStage == 'Rejected')
                $state.go('Page.LoanOriginationDashboard', null);
        }

        var getStageNameByStageCode = function(stageCode) {
            var stageName = $filter('translate')(stageCode) || stageCode;
            return stageName;
        };

        var getSanctionedAmount = function(model){
            var fee = 0;
            if(model.loanAccount.commercialCibilCharge)
                if(!_.isNaN(model.loanAccount.commercialCibilCharge))
                    fee+=model.loanAccount.commercialCibilCharge;
            $log.info(model.loanAccount.commercialCibilCharge);
        };

         var getProductDetails=function (value,model){
            if (value)
                LoanProducts.getProductData({"productCode":value})
                .$promise
                .then(
                    function(res){
                        try
                        {
                            delete model.additional.product;
                        }
                        catch(err){
                            console.error(err);
                        }
                        model.additional.product = res;
                        model.additional.product.interestBracket = res.minInterestRate + '% - ' + res.maxInterestRate + '%';
                        model.additional.product.amountBracket = model.additional.product.amountFrom + ' - ' + model.additional.product.amountTo;
                        $log.info(model.additional.product.interestBracket);
                        model.loanAccount.frequency = model.additional.product.frequency;
                        // if (model.additional.product.frequency == 'M')
                        //     model.loanAccount.frequency = 'Monthly';
                        if(model.loanAccount.loanPurpose1!=null){
                            var purpose1_found = false;
                            Queries.getLoanPurpose1(model.loanAccount.productCode).then(function(resp1){
                                loanPurpose1List = [];
                                loanPurpose1List = resp1.body;
                                if(loanPurpose1List && loanPurpose1List.length>0){
                                    for (var i = loanPurpose1List.length - 1; i >= 0; i--) {
                                        if(model.loanAccount.loanPurpose1 == loanPurpose1List[i].purpose1)
                                            purpose1_found = true;
                                    }
                                    if(!purpose1_found)
                                        model.loanAccount.loanPurpose1 = null;
                                }
                                else
                                    model.loanAccount.loanPurpose1 = null;

                                if(model.loanAccount.loanPurpose2!=null){
                                    var purpose2_found = false;
                                    Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1).then(function(resp2){
                                        loanPurpose2List = [];
                                        loanPurpose2List = resp2.body;
                                        if(loanPurpose2List && loanPurpose2List.length>0){
                                            for (var i = loanPurpose2List.length - 1; i >= 0; i--) {
                                                if(model.loanAccount.loanPurpose2 == loanPurpose2List[i].purpose2)
                                                    purpose2_found = true;
                                            }
                                            if(!purpose2_found)
                                                model.loanAccount.loanPurpose2 = null;
                                        }
                                        else
                                            model.loanAccount.loanPurpose2 = null;
                                    },function(err){
                                        $log.info("Error while fetching Loan Purpose 1 by Product");
                                    });
                                }
                            },function(err){
                                $log.info("Error while fetching Loan Purpose 1 by Product");
                            });
                        }
                    },
                    function(httpRes){
                        PageHelper.showProgress('loan-create', 'Failed to load the Product details. Try again.', 4000);
                        PageHelper.showErrors(httpRes);
                        PageHelper.hideLoader();
                    }
                )
        }

        var partnerChange=function (value,model){
            if (value != 'Kinara')
            {
                try
                {
                    delete model.additional.product;
                    model.loanAccount.frequency = null;
                    model.loanAccount.productCode = null;
                }
                catch(err){
                    console.error(err);
                }
            }
        }

        var preLoanSaveOrProceed = function(model) {
            var loanAccount = model.loanAccount;

            if (_.hasIn(loanAccount, 'status') && loanAccount.status == 'HOLD') {
                loanAccount.status = null;
            }

            if (_.hasIn(loanAccount, 'guarantors') && _.isArray(loanAccount.guarantors)) {
                for (var i = 0; i < loanAccount.guarantors.length; i++) {
                    var guarantor = loanAccount.guarantors[i];
                    if (!_.hasIn(guarantor, 'guaUrnNo') || _.isNull(guarantor, 'guaUrnNo')) {
                        PageHelper.showProgress("pre-save-validation", "All guarantors should complete the enrolment before proceed", 5000);
                        return false;
                    }

                }
            }

            if (_.hasIn(loanAccount, 'collateral') && _.isArray(loanAccount.collateral)) {
                _.forEach(loanAccount.collateral, function(collateral) {
                    if (!_.hasIn(collateral, "id") || _.isNull(collateral.id)) {
                        /* ITS A NEW COLLATERAL ADDED */
                        collateral.quantity = collateral.quantity || 1;
                        collateral.loanToValue = collateral.collateralValue;
                        collateral.totalValue = collateral.loanToValue * collateral.quantity;
                    }
                })
            }
            // Psychometric Required for applicants & co-applicants
            if (_.isArray(loanAccount.loanCustomerRelations)) {
                var psychometricIncomplete = false;
                var enterpriseCustomerRelations = model.customer.enterpriseCustomerRelations;
                for (i in loanAccount.loanCustomerRelations) {
                    if (loanAccount.loanCustomerRelations[i].relation == 'Applicant') {
                        loanAccount.loanCustomerRelations[i].psychometricRequired = 'YES';
                    } else if (loanAccount.loanCustomerRelations[i].relation == 'Co-Applicant') {
                        if (_.isArray(enterpriseCustomerRelations)) {
                            var psychometricRequiredUpdated = false;
                            for (j in enterpriseCustomerRelations) {
                                if (enterpriseCustomerRelations[j].linkedToCustomerId == loanAccount.loanCustomerRelations[i].customerId && _.lowerCase(enterpriseCustomerRelations[j].businessInvolvement) == 'full time') {
                                    loanAccount.loanCustomerRelations[i].psychometricRequired = 'YES';
                                    psychometricRequiredUpdated = true;
                                }
                            }
                            if (!psychometricRequiredUpdated) {
                                loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                            }
                        } else {
                            loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                        }
                    } else {
                        loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                    }
                    if (!loanAccount.loanCustomerRelations[i].psychometricCompleted) {
                        loanAccount.loanCustomerRelations[i].psychometricCompleted = 'NO';
                    }
                    if (loanAccount.loanCustomerRelations[i].psychometricRequired == 'YES' && loanAccount.loanCustomerRelations[i].psychometricCompleted == 'NO') {
                        psychometricIncomplete = true;
                    }
                }
                if (psychometricIncomplete) {
                    loanAccount.psychometricCompleted = 'N';
                }
            }

            return true;
        }

        var validateCibilHighmark = function(model) {
            var cibilMandatory = (_.hasIn(model.cibilHighmarkMandatorySettings, "cibilMandatory") && _.isString(model.cibilHighmarkMandatorySettings.cibilMandatory) && model.cibilHighmarkMandatorySettings.cibilMandatory == 'N') ? "N" : "Y";
            var highmarkMandatory = (_.hasIn(model.cibilHighmarkMandatorySettings, "highmarkMandatory") && _.isString(model.cibilHighmarkMandatorySettings.highmarkMandatory) && model.cibilHighmarkMandatorySettings.highmarkMandatory == 'N') ? "N" : "Y";

            if (model.loanAccount && model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length > 0) {
                for (i = 0; i < model.loanAccount.loanCustomerRelations.length; i++) {

                    if ((highmarkMandatory == 'Y' && !model.loanAccount.loanCustomerRelations[i].highmarkCompleted)) {
                        PageHelper.showProgress("pre-save-validation", "Highmark not completed.", 5000);
                        return false;
                    }

                    if ((cibilMandatory == 'Y' && !model.loanAccount.loanCustomerRelations[i].cibilCompleted)) {
                        PageHelper.showProgress("pre-save-validation", "CIBIL not completed", 5000);
                        return false;
                    }

                }
            }
            return true;
        }

        var computeEMI = function(model) {

            // Get the user's input from the form. Assume it is all valid.
            // Convert interest from a percentage to a decimal, and convert from
            // an annual rate to a monthly rate. Convert payment period in years
            // to the number of monthly payments.

            if (model.loanAccount.loanAmount == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenure == '')
                return;

            var principal = model.loanAccount.loanAmount;
            var interest = model.loanAccount.interestRate / 100 / 12;
            var payments;
            if (model.loanAccount.frequencyRequested == 'Yearly')
                payments = model.loanAccount.tenure * 12;
            else if (model.loanAccount.frequencyRequested == 'Monthly')
                payments = model.loanAccount.tenure;

            // Now compute the monthly payment figure, using esoteric math.
            var x = Math.pow(1 + interest, payments);
            var monthly = (principal * x * interest) / (x - 1);

            // Check that the result is a finite number. If so, display the results.
            if (!isNaN(monthly) &&
                (monthly != Number.POSITIVE_INFINITY) &&
                (monthly != Number.NEGATIVE_INFINITY)) {

                model.loanAccount.estimatedEmi = round(monthly);
                //document.loandata.total.value = round(monthly * payments);
                //document.loandata.totalinterest.value = round((monthly * payments) - principal);
            }
            // Otherwise, the user's input was probably invalid, so don't
            // display anything.
            else {
                model.loanAccount.estimatedEmi = "";
                //document.loandata.total.value = "";
                //document.loandata.totalinterest.value = "";
            }

        };

        // This simple method rounds a number to two decimal places.
        function round(x) {
            return Math.ceil(x);
        }

        function init(model, form, formCtrl) {
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
            model.loanAccount.partnerCode = model.loanAccount.partnerCode || "Kinara";

            model.loanAccount.loanCustomerRelations = model.loanAccount.loanCustomerRelations || [];
            model.loanAccount.coBorrowers = [];
            model.loanAccount.guarantors = [];
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
            // model.loanAccount.commercialCibilCharge = 750; //Hard coded. This value to be changed to pickup from global_settings table
            model.loanAccount.documentTracking = model.loanAccount.documentTracking || "PENDING";
            model.loanAccount.isRestructure = false;
            getSanctionedAmount(model);
            $log.info(model);
            if (model.loanAccount.productCode)
                getProductDetails(model.loanAccount.productCode, model);

            LoanBookingCommons.getLoanAccountRelatedCustomersLegacy(model.loanAccount);
        };


        return {
            "type": "schema-form",
            "title": "LOAN_RECOMMENDATION",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.bundleModel = bundleModel;
                model.loanAccount = bundleModel.loanAccount;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.review = model.review || {};
                model.temp = model.temp || {}
                BundleManager.pushEvent('loanAccount', model._bundlePageObj, model.loanAccount);
                model.mitigantsChanged = 0;
                model.loanMitigants = model.loanAccount.loanMitigants;
                model.currentStage = model.loanAccount.currentStage;

                model.additional = model.additional || {};

                if (model.loanAccount.portfolioInsuranceUrn == model.loanAccount.applicant) {
                    model.additional.portfolioUrnSelector = "applicant";
                }

                if (model.loanAccount.guarantors && model.loanAccount.guarantors.length > 0 && model.loanAccount.guarantors[0].guaUrnNo == model.loanAccount.portfolioInsuranceUrn) {
                    model.additional.portfolioUrnSelector = "guarantor";
                }

                if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length > 0 && model.loanAccount.coBorrowers[0].coBorrowerUrnNo == model.loanAccount.portfolioInsuranceUrn) {
                    model.additional.portfolioUrnSelector = "coapplicant";
                }

                init(model, form, formCtrl);

                /*Asset details*/
                if (model.loanAccount.collateral.length != 0) {
                    model.asset_details = [];
                    for (i in model.loanAccount.collateral) {
                        model.asset_details.push({
                            "collateralDescription": model.loanAccount.collateral[i].collateralDescription,
                            "collateralValue": model.loanAccount.collateral[i].collateralValue,
                            "expectedIncome": model.loanAccount.collateral[i].expectedIncome,
                            "collateralType": model.loanAccount.collateral[i].collateralType,
                            "manufacturer": model.loanAccount.collateral[i].manufacturer,
                            "modelNo": model.loanAccount.collateral[i].modelNo,
                            "serialNo": model.loanAccount.collateral[i].serialNo,
                            "expectedPurchaseDate": model.loanAccount.collateral[i].expectedPurchaseDate,
                            "machineAttachedToBuilding": model.loanAccount.collateral[i].machineAttachedToBuilding,
                            "hypothecatedToBank": model.loanAccount.collateral[i].hypothecatedToBank,
                            "electricityAvailable": model.loanAccount.collateral[i].electricityAvailable,
                            "spaceAvailable": model.loanAccount.collateral[i].spaceAvailable
                        });
                    }
                }
                Enrollment.getCustomerById({
                    id: model.customerId
                }).$promise.then(function(res) {
                    model.customer = res;
                });

            },
            form: [{
                    "type": "section",
                    "html": '<div class="col-xs-12">' +
                        '<div class="box no-border">' +
                        '<div class="box-body" style="padding-right: 0">' +
                        '<sf-decorator ng-repeat="item in form.items" form="item" class="ng-scope"></sf-decorator></div></div></div>',
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "readonly": true,
                        "items": [{
                            key: "loanAccount.linkedAccountNumber",
                            title: "LINKED_ACCOUNT_NUMBER",
                            type: "lov",
                            autolov: true,
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                return LoanProcess.viewLoanaccount({
                                    urn: model.customer.urnNo
                                }).$promise;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.accountId,
                                    item.glSubHead,
                                    item.amount,
                                    item.npa
                                ];
                            },
                            onSelect: function(valueObj, model, context) {
                                model.loanAccount.npa = valueObj.npa;
                                model.loanAccount.linkedAccountNumber = valueObj.accountId;
                            }
                        }, {
                            key: "loanAccount.npa",
                            title: "IS_NPA"
                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Preliminary Loan Information",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.loanPurpose1",
                                "title": "Loan Purpose"
                            }, {
                                "key": "loanAccount.loanPurpose2",
                                "title": "Loan SubPurpose"
                            }, {
                                "key": "loanAccount.loanAmountRequested",
                                "title": "Loan Amount Requested",
                                "type": "amount"
                            }, {
                                "key": "loanAccount.emiPaymentDateRequested",
                                "title": "Requested EMI Payment Date"
                            }, {
                                "key": "loanAccount.expectedPortfolioInsurancePremium",
                                "title": "Expected Portfolio Insurance Premium",
                                "type": "amount"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.frequencyRequested",
                                "title": "Requested Frequency",
                            }, {
                                "key": "loanAccount.tenureRequested",
                                "title": "Requested Tenure"
                                /*,
                                                            "type": "number"*/
                            }, {
                                "key": "loanAccount.expectedInterestRate",
                                "title": "Expected Interest Rate",
                            }, {
                                "key": "loanAccount.estimatedEmi",
                                "title": "EXPECTED_KINARA_EMI",
                                "type": "amount"
                            }, {
                                "key": "loanAccount.emiRequested",
                                "title": "Requested EMI",
                                "type": "amount"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Additional Loan Information",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.estimatedDateOfCompletion",
                                "title": "Estimated Date Of Completion"
                            }, {
                                "key": "loanAccount.productCategory",
                                "title": "Product Type"
                            }, {
                                "key": "loanAccount.customerSignDateExpected",
                                "title": "Expected customer sign date"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.proposedHires",
                                "title": "Proposed Hires",
                                "type": "number"
                            }, {
                                "key": "loanAccount.percentageIncreasedIncome",
                                "title": "% of Increased Income",
                                "type": "number"
                            }, {
                                "key": "loanAccount.percentageInterestSaved",
                                "title": "% of Interest Saved",
                                "type": "number"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Deductions From Loan Amount",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.expectedProcessingFeePercentage",
                                "title": "Expected Processing Fee(in%)",
                                "type": "number"
                            }, {
                                "key": "loanAccount.expectedCommercialCibilCharge",
                                "title": "Expected CIBIL Charges",
                                "type": "amount"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.estimatedEmi",
                                "title": "Expected Security EMI(in Rs.)",
                                "type": "amount"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Asset Purchase Details",
                    /*
                                        "condition":"model.loanAccount.loanPurpose1==model.asset_Details.Assetpurchase"*/
                    "condition": "model.loanAccount.collateral.length!=0",
                    "items": [{
                        "type": "tableview",
                        "key": "asset_details",
                        "notitle": true,
                        "transpose": true,
                        getColumns: function() {
                            return [{
                                "title": "Machine",
                                "data": "collateralDescription",
                                "render": strongRender
                            }, {
                                "title": "Purchase Price",
                                "data": "collateralValue",
                                "className": "text-right",
                                "render": currencyRightRender
                            }, {
                                "data": "expectedIncome",
                                "title": "Expected Income",
                                "className": "text-right",
                                "render": currencyRightRender
                            }, {
                                "data": "collateralType",
                                "title": "Machine Type"
                            }, {
                                "data": "manufacturer",
                                "title": "Manufacturer Name"
                            }, {
                                "data": "modelNo",
                                "title": "Machine Model"
                            }, {
                                "data": "serialNo",
                                "title": "Serial No"
                            }, {
                                "data": "expectedPurchaseDate",
                                "title": "Expected Purchase Date"
                            }, {
                                "data": "machineAttachedToBuilding",
                                "title": "Machine Permanently Fixed To Building"
                            }, {
                                "data": "hypothecatedToBank",
                                "title": "HYPOTHECATED_TO_KINARA"
                            }, {
                                "data": "electricityAvailable",
                                "title": "Electricity Available"
                            }, {
                                "data": "spaceAvailable",
                                "title": "Space Available"
                            }, ];
                        }
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Nominee Details",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.nominees[0].nomineeFirstName",
                                "title": "Name"
                            }, {
                                "key": "loanAccount.nominees[0].nomineeGender",
                                "title": "Gender"
                            }, {
                                "key": "loanAccount.nominees[0].nomineeDOB",
                                "title": "Date Of Birth"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.nominees[0].nomineeRelationship",
                                "title": "Relationship To Insured"
                            }, {
                                "key": "",
                                "title": "Address"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "DEVIATION_AND_MITIGATIONS",
                    "condition": "model.currentStage != 'ScreeningReview'",
                    "items": [{
                        "type": "section",
                        "colClass": "col-sm-12",
                        "html": '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th></tr></thead><tbody>' +
                            '<tr ng-repeat="item in model.deviationDetails">' +
                            '<td>{{ item["parameter"] }}</td>' +
                            '<td> <span class="square-color-box" style="background: {{ item.color_hexadecimal }}"> </span></td>' +
                            '<td>{{ item["deviation"] }}</td>' +
                            '<td><ul class="list-unstyled">' +
                            '<li ng-repeat="m in item.mitigants " id="{{m.mitigant}}">' +
                            '<input type="checkbox"  ng-model="m.selected" ng-checked="m.selected"> {{ m.mitigant }}' +
                            // '<input type="checkbox"  ng-model="m.selected" ng-change="model.updateChosenMitigant(m.selected,m)"> {{ m.mitigant }}' +
                            '</li></ul></td></tr></tbody></table>'

                    }]
                }, {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "LOAN_DOCUMENTS",
                    "readonly": true,
                    "condition": "model.currentStage !== 'loanView'",
                    "items": [{
                        "type": "array",
                        "key": "loanAccount.loanDocuments",
                        "view": "fixed",
                        "startEmpty": true,
                        "title": "LOAN_DOCUMENT",
                        "titleExpr": "model.loanAccount.loanDocuments[arrayIndex].document",
                        "items": [{
                                "key": "loanAccount.loanDocuments[].document",
                                "title": "DOCUMENT_NAME",
                                "type": "string",
                                "required": true
                            }, {
                                title: "Upload",
                                key: "loanAccount.loanDocuments[].documentId",
                                "required": true,
                                type: "file",
                                fileType: "application/pdf",
                                category: "Loan",
                                subCategory: "DOC1",
                                using: "scanner"
                            }
                            // ,
                            // {
                            //     "key": "loanDocuments.newLoanDocuments[].documentStatus",
                            //     "type": "string"
                            // }
                        ]
                    }]

                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "Loan Recommendation",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "",
                                "title": "Current Exposure",
                                "type": "amount"
                            }, {
                                "key": "loanAccount.loanAmount",
                                "title": "Loan Amount Recommended",
                                "type": "amount",
                                onChange: function(value, form, model) {
                                    computeEMI(model);
                                }
                            }, {
                                "key": "loanAccount.tenure",
                                "title": "Duration(months)"
                                    /*,
                                                                "type": "number"*/
                                    ,
                                onChange: function(value, form, model) {
                                    computeEMI(model);
                                }
                            }, {
                                "key": "loanAccount.interestRate",
                                "title": "Interest Rate",
                                "type": "number",
                                onChange: function(value, form, model) {
                                    computeEMI(model);
                                }
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.estimatedEmi",
                                "title": "ESTIMATED_KINARA_EMI",
                                "type": "amount"
                            }, {
                                "key": "loanAccount.processingFeePercentage",
                                "title": "Processing Fee(in%)"
                            }, {
                                "key": "loanAccount.estimatedEmi",
                                "title": "Expected Security EMI"
                            }, {
                                "key": "loanAccount.commercialCibilCharge",
                                "title": "CIBIL Charges",
                                "type": "amount"
                            }]
                        }]
                    }]
                },

                {
                    "type": "box",
                    "title": "POST_REVIEW",
                    "condition": "model.loanAccount.id",
                    "items": [{
                        key: "loanAccount.partnerApprovalStatus",
                        type: "radios",
                        titleMap: {
                            "DECLINE": "DECLINE",
                            "ACCEPT": "ACCEPT",
                            "HOLD": "HOLD"
                        }
                    }, {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='DECLINE'",
                        items: [{
                                title: "REMARKS",
                                key: "loanAccount.partnerRemarks",
                                required: true
                            },
                            /*{
                                key: "loanAccount.rejectReason",
                                type: "select",
                                title: "REJECT_REASON",
                                titleMap: {
                                "LoanInitiation": "LoanInitiation"
                            },
                            },*/
                            {
                                key: "review.rejectButton",
                                type: "button",
                                title: "REJECT",
                                required: true,
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }
                        ]
                    }, {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='HOLD'",
                        items: [{
                            title: "REMARKS",
                            key: "loanAccount.partnerRemarks",
                            type: "textarea",
                            required: true
                        }, {
                            key: "review.holdButton",
                            type: "button",
                            title: "HOLD",
                            required: true,
                            onClick: "actions.holdButton(model, formCtrl, form, $event)"
                        }]
                    }, {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='SEND_BACK'",
                        items: [{
                            title: "REMARKS",
                            key: "loanAccount.partnerRemarks",
                            required: true
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            condition: "model.currentStage == 'IfmrDO'",
                            required: true,
                            titleMap: {
                                "PendingForPartner": "PendingForPartner"
                            },
                        }, {
                            key: "review.sendBackButton",
                            type: "button",
                            title: "SEND_BACK",
                            onClick: "actions.sendBack(model, formCtrl, form, $event)"
                        }]
                    }, {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='ACCEPT'",
                        items: [{
                            title: "REMARKS",
                            key: "loanAccount.partnerRemarks",
                            required: true
                        }, {
                            key: "review.proceedButton",
                            type: "button",
                            title: "PROCEED",
                            onClick: "actions.proceed(model, formCtrl, form, $event)"
                        }]
                    }]
                }
            ],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
                "financial-summary": function(bundleModel, model, params) {
                    model._scores = params;
                    model._deviationDetails = model._scores[12].data;

                    model.deviationDetails = [];
                    var allMitigants = {};
                    model.allMitigants = allMitigants;
                    for (i in model._deviationDetails) {
                        var item = model._deviationDetails[i];
                        var mitigants = item.Mitigant.split('|');
                        for (j in mitigants) {
                            allMitigants[mitigants[j]] = {
                                mitigant: mitigants[j],
                                parameter: item.Parameter,
                                score: item.ParameterScore,
                                selected: false
                            };
                            mitigants[j] = allMitigants[mitigants[j]];
                        }
                        if (item.ChosenMitigant && item.ChosenMitigant != null) {
                            var chosenMitigants = item.ChosenMitigant.split('|');
                            for (j in chosenMitigants) {
                                allMitigants[chosenMitigants[j]].selected = true;
                            }
                        }
                        model.deviationDetails.push({
                            parameter: item.Parameter,
                            score: item.ParameterScore,
                            deviation: item.Deviation,
                            mitigants: mitigants,
                            color_english: item.color_english,
                            color_hexadecimal: item.color_hexadecimal
                        });
                    }

                    model.additional = {};
                }
            },
            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.loanAccount.urnNo) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('LoanInput-save', 'urnNo is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                reject: function(model, formCtrl, form, $event) {
                    $log.info("Inside reject()");
                    /* if (!validateForm(formCtrl)){
                         return;
                     }*/
                    Utils.confirm("Are You Sure?").then(function() {

                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "LoanInitiation";
                        if (reqData.loanAccount.frequency)
                            reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                        reqData.remarks = model.loanAccount.partnerRemarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                    })
                },
                viewLoan: function(model, formCtrl, form, $event) {
                    Utils.confirm("Save the data before proceed").then(function() {
                        $log.info("Inside ViewLoan()");
                        irfNavigator.go({
                            state: "Page.Bundle",
                            pageName: "loans.individual.screening.LoanView",
                            pageId: model.loanAccount.id
                        }, {
                            state: "Page.Engine",
                            pageName: "loans.individual.booking.PendingForPartner",
                            pageId: model.loanAccount.id
                        });
                    });
                },
                holdButton: function(model, formCtrl, form, $event) {
                    $log.info("Inside save()");
                    Utils.confirm("Are You Sure?")
                        .then(
                            function() {
                                var reqData = {
                                    loanAccount: _.cloneDeep(model.loanAccount)
                                };
                                reqData.loanAccount.status = 'HOLD';
                                reqData.loanProcessAction = "SAVE";
                                if (reqData.loanAccount.frequency)
                                    reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                                reqData.remarks = model.loanAccount.partnerRemarks;
                                PageHelper.showLoader();
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res) {
                                        return navigateToQueue(model);
                                    }, function(httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes) {
                                        PageHelper.hideLoader();
                                    })
                            }
                        );
                },
                sendBack: function(model, formCtrl, form, $event) {
                    $log.info("Inside sendBack()");
                    Utils.confirm("Are You Sure?").then(function() {
                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.remarks = model.review.remarks;
                        if (reqData.loanAccount.frequency)
                            reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                    })

                },
                save: function(model, formCtrl, form, $event) {
                    $log.info("Inside save()");
                    PageHelper.clearErrors();

                    /* TODO Call save service for the loan */

                    Utils.confirm("Are You Sure?")
                        .then(
                            function() {
                                populateLoanCustomerRelations(model);
                                var reqData = {
                                    loanAccount: _.cloneDeep(model.loanAccount)
                                };
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
                                            pageName: "loans.individual.booking.LoanInput",
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

                    var reqData = _.cloneDeep(model);
                    // if(reqData.loanAccount.frequency)
                    //     reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                    Utils.confirm("Are You Sure?").then(function() {
                        PageHelper.showLoader();
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = 'LoanBooking';
                        IndividualLoan.update(reqData, function(resp, headers) {
                            model.loanAccount.id = resp.loanAccount.id;
                            $log.info("Done.");
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
                    });
                }
            }
        }
    }
})