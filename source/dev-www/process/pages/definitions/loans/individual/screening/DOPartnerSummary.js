define({
    pageUID: "loans.individual.screening.DOPartnerSummary",
    pageType: "Engine",
    dependencies: ["$log", "$q", "$filter","IndividualLoan", "LoanProducts", "LoanBookingCommons", "Enrollment", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "Scoring", "AuthTokenHelper", "BundleManager"
    ],
    $pageFn: function($log, $q, $filter,IndividualLoan, LoanProducts, LoanBookingCommons, Enrollment, SchemaResource, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, Scoring, AuthTokenHelper, BundleManager) {
        var branch = SessionStore.getBranch();
        var scoreName;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var bankName = SessionStore.getBankName();
        var bankId;
        bankId = $filter('filter')(formHelper.enum("bank").data, {
            name: bankName
        }, true)[0].code;

        var strongRender = function(data, type, full, meta) {
            return '<strong>' + data + '</strong>';
        }

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

        var getSanctionedAmount = function(model) {
            var fee = 0;
            if (model.loanAccount.commercialCibilCharge)
                if (!_.isNaN(model.loanAccount.commercialCibilCharge))
                    fee += model.loanAccount.commercialCibilCharge;
            $log.info(model.loanAccount.commercialCibilCharge);
        };

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

        var prepareData = function(res, model) {

            model.enterpriseDetails = res[0];
            model.scoreDetails = [res[1], res[2], res[3], res[4]];


            var managementScore = model.scoreDetails[0];
            if (_.isArray(managementScore.sections)) {
                var count = managementScore.sections.length;
                var spacePct = 75 / count;

                managementScore.values = [];
                for (var i = 0; i < managementScore.sections.length; i++) managementScore.values[i] = i;
                managementScore.colorPct = spacePct / 5;
                managementScore.valuePct = spacePct * 4 / 5;
            }

            model.sectorDetails = res[5];
            model.subSectorDetails = res[6];
            model.houseHoldPL = res[7].sections;
            model.businessPL = res[8];
            model.balanceSheet = res[9];
            model.bankAccountDetails = res[10];
            model.totalScores = res[11];
            model.deviationDetails = res[12];
            model.deviationParameter = res[12];
            model.ratioDetails = res[13];
            model.psychometricScores = res[14].sections;
            model.cashFlowDetails = res[15];
            model.businessBankStmtSummary = res[16];
            model.personalBankStmtSummary = res[17];
            model.purchaseDetails = res[18];
            model.liabilitiesSummary = res[19];
            model.machineryDetails = res[20];
            model.opexDetails = res[21];

            model.enterpriseDetails.columns = model.enterpriseDetails.columns.concat(model.ratioDetails.columns);
            _.merge(model.enterpriseDetails.data[0], model.ratioDetails.data[0]);

            /* Populate values for Balance Sheet */
            model.assetsAndLiabilities = {};
            model.assetsAndLiabilities.cashInBank = model.balanceSheet.data[0]['Cash in bank'];
            model.assetsAndLiabilities.payables = model.balanceSheet.data[0]['Payables'];
            model.assetsAndLiabilities.accountsReceivable = model.balanceSheet.data[0]['Accounts receivables'];
            model.assetsAndLiabilities.shortTermDebts = model.balanceSheet.data[0]['Short-term debts '];
            model.assetsAndLiabilities.rawMaterial = model.balanceSheet.data[0]['Raw material'];
            model.assetsAndLiabilities.currentPortionOfLongTermDeb = model.balanceSheet.data[0]['Current portion of long-term debt'];
            model.assetsAndLiabilities.workInProgress = model.balanceSheet.data[0]['Work in progress'];
            model.assetsAndLiabilities.finishedGoods = model.balanceSheet.data[0]['Finished goods'];
            model.assetsAndLiabilities.totalCurrentAssets = model.balanceSheet.data[0]['Total current assets'];
            model.assetsAndLiabilities.totalCurrentLiabilities = model.balanceSheet.data[0]['Total current liabilities'];
            model.assetsAndLiabilities.machinery = model.balanceSheet.data[0]['Machinery'];
            model.assetsAndLiabilities.longTermDebt = model.balanceSheet.data[0]['Long-term debt'];
            model.assetsAndLiabilities.land = model.balanceSheet.data[0]['Land'];
            model.assetsAndLiabilities.ownCapital = model.balanceSheet.data[0]['Own capital'];
            model.assetsAndLiabilities.building = model.balanceSheet.data[0]['Building'];
            model.assetsAndLiabilities.vehicle = model.balanceSheet.data[0]['Vehicle'];
            model.assetsAndLiabilities.furnitureAndFixtures = model.balanceSheet.data[0]['Furniture & Fixtures'];
            model.assetsAndLiabilities.totalFixedAssets = model.balanceSheet.data[0]['Total fixed assets'];
            model.assetsAndLiabilities.totalLengTermLiabilities = model.balanceSheet.data[0]['Total long-term liabilities'];
            model.assetsAndLiabilities.totalAssets = model.balanceSheet.data[0]['Total Assets'];
            model.assetsAndLiabilities.totalLiabilities = model.balanceSheet.data[0]['Total Liabilities'];

            model.pl = {
                household: [],
                business: {}
            };
            if (model.houseHoldPL && model.houseHoldPL.length) {
                for (var i = 0; i < model.houseHoldPL.length; i++) {
                    model.pl.household.push({
                        income: model.houseHoldPL[i].data[0]['Total Incomes'],
                        salaryFromBusiness: model.houseHoldPL[i].data[0]['Salary from business'],
                        otherIncomeSalaries: model.houseHoldPL[i].data[0]['Other Income/salaries'],
                        familyMemberIncomes: model.houseHoldPL[i].data[0]['Family Member Incomes'],
                        Expenses: model.houseHoldPL[i].data[0]['Total Expenses'],
                        declaredEducationExpense: model.houseHoldPL[i].data[0]['Expenses Declared or based on the educational expense whichever is higher'],
                        emiHouseholdLiabilities: model.houseHoldPL[i].data[0]['EMI\'s of household liabilities'],
                        netHouseholdIncome: model.houseHoldPL[i].data[0]['Net Household Income']
                    })
                }
            }

            model.pl.business.invoice = model.businessPL.data[0]['Invoice'];
            model.pl.business.invoicePCT = model.businessPL.data[0]['Invoice pct'];
            model.pl.business.cashRevenue = model.businessPL.data[0]['Cash'];
            model.pl.business.cashRevenuePCT = model.businessPL.data[0]['Cash pct'];
            model.pl.business.scrapIncome = model.businessPL.data[0]['Scrap or any business related income'];
            model.pl.business.scrapIncomePCT = model.businessPL.data[0]['Scrap or any business related income pct'];
            model.pl.business.totalBusinessIncome = model.businessPL.data[0]['Total Business Revenue'];
            model.pl.business.purchases = model.businessPL.data[0]['Purchases'];
            model.pl.business.purchasesPCT = model.businessPL.data[0]['Purchases pct'];
            model.pl.business.grossIncome = model.businessPL.data[0]['Gross Income'];
            model.pl.business.Opex = model.businessPL.data[0]['Opex'];
            model.pl.business.EBITDA = model.businessPL.data[0]['EBITDA'];
            model.pl.business.EBITDA_PCT = model.businessPL.data[0]['EBITDA pct'];
            model.pl.business.businessLiabilities = model.businessPL.data[0]['Business Liabilities'];
            model.pl.business.netBusinessIncome = model.businessPL.data[0]['Net Business Income'];
            model.pl.business.netBusinessIncomePCT = model.businessPL.data[0]['Net Business Income pct'];
            model.pl.business.kinaraEmi = model.businessPL.data[0]['Kinara EMI'];
            model.pl.business.kinaraEmiPCT = model.businessPL.data[0]['Kinara EMI pct'];
            model.pl.business.netIncome = model.businessPL.data[0]['Net Income'];
            model.pl.business.finalKinaraEmi = model.businessPL.data[0]['Final Kinara EMI'];
            model.pl.business.finalKinaraEmiPCT = model.businessPL.data[0]['Final Kinara EMI pct'];


            for (var i = 0; i < model.deviationDetails.data.length; i++) {
                var d = model.deviationDetails.data[i];
                if (d.Mitigant && d.Mitigant.length != 0) {
                    if (d.Mitigant && d.Mitigant != null) {
                        d.ListOfMitigants = d.Mitigant.split("|");
                    }

                    if (d.ChosenMitigant && d.ChosenMitigant != null) {
                        d.ChosenMitigants = d.ChosenMitigant.split("|")
                    }

                }
            }

            model.deviationParameter = [];
            for (var i = 0; i < model.deviationDetails.data.length; i++) {
                var d = model.deviationDetails.data[i];
                model.deviationParameter.push(_.cloneDeep(model.deviationDetails.data[i]));
                delete model.deviationParameter[model.deviationParameter.length - 1].ListOfMitigants;
                delete model.deviationParameter[model.deviationParameter.length - 1].Mitigant;
                model.deviationParameter[model.deviationParameter.length - 1].mitigants = [];
                if (d.Mitigant && d.Mitigant.length != 0) {
                    d.ListOfMitigants = d.Mitigant.split("|");
                    for (var j = 0; j < d.ListOfMitigants.length; j++) {
                        model.deviationParameter[model.deviationParameter.length - 1].mitigants.push({
                            mitigantName: d.ListOfMitigants[j]
                        });
                    }

                }
            }


            model.loanSummary={};
            model.loanRemarksSummary=[];
            if (_.hasIn(model, 'loanAccount.id') && _.isNumber(model.loanAccount.id)){
                $log.info('Printing Loan Account');
                IndividualLoan.loanRemarksSummary({id: model.loanAccount.id})
                .$promise
                .then(function (resp){
                    model.loanSummary = resp;
                    if(model.loanSummary && model.loanSummary.length)
                    {
                        for(i=0;i<model.loanSummary.length;i++)
                        {
                            if(model.loanSummary[i].preStage=='LoanInitiation'||model.loanSummary[i].preStage=='LoanBooking'||model.loanSummary[i].preStage=='PendingForPartner')
                            {
                               model.loanRemarksSummary.push(model.loanSummary[i]);
                            }
                        }
                    }
                },function (errResp){

                });
            }

            model.additional = {};
            model.additional = {
                deviations: {
                    deviationParameter: model.deviationParameter,
                    scoreName: scoreName
                }
            };
            BundleManager.pushEvent('deviation-loaded', model._bundlePageObj, model.additional);

            $log.info("Karthik here");
            $log.info(model.additional);

            model.enterpriseDetailsData = model.enterpriseDetails.data[0];

        }; // END OF prepareData()


        var HOUSEHOLD_PL_HTML =
            '<table class="table">' +
            '<colgroup>' +
            '<col width="30%"> <col width="40%"> <col width="30%">' +
            '</colgroup>' +
            '<tbody>' +
            '<tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> <th>{{household.income | irfCurrency}}</th> </tr>' +
            '<tr> <td></td> <td>{{"SALARY_FROM_BUSINESS" | translate}}</td> <td>{{household.salaryFromBusiness | irfCurrency}}</td> </tr>' +
            '<tr> <td></td> <td>{{"OTHER_INCOME_SALARIES" | translate}}</td> <td>{{household.otherIncomeSalaries | irfCurrency}}</td> </tr>' +
            '<tr> <td></td> <td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td> <td>{{household.familyMemberIncomes | irfCurrency}}</td> </tr>' +
            '<tr class="table-sub-header"> <th>{{"EXPENSES" | translate}}</th> <th></th> <th>{{household.Expenses | irfCurrency}}</th> </tr>' +
            '<tr> <td></td> <td>{{"DECLARED_EDUCATIONAL_EXPENSE" | translate}}</td> <td>{{household.declaredEducationExpense | irfCurrency}}</td> </tr>' +
            '<tr> <td></td> <td>{{"EMI_HOUSEHOLD_LIABILITIES" | translate}}</td> <td>{{household.emiHouseholdLiabilities | irfCurrency}}</td> </tr>' +
            '<tr class="table-bottom-summary"> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td> <td></td> <td>{{household.netHouseholdIncome | irfCurrency}}</td> </tr>' +
            '</tbody>' +
            '</table>';

        var prepareForms = function(model) {
            var form = [];

            var bsCounter = 0;
            var bsLeft = [];
            var bsRight = [];
            var bsCounter = 0;
            _.forIn(model.enterpriseDetailsData, function(value, key) {
                var item = {
                    key: "enterpriseDetailsData." + key,
                    title: key,
                    type: "string",
                    readonly: true,
                };

                if (key == "FRO Remarks") {
                    item.type = "section";
                    item.htmlClass = "row";
                    item.html = "<div><label class = 'col-sm-4' style = 'text-align: right;'>FRO Remarks</label><div style = 'font-weight: bold;'  class = 'col-sm-8'>{{model.enterpriseDetailsData['FRO Remarks']}}</div></div>";
                }
                if (bsCounter++ % 2 == 0) {
                    bsLeft.push(item)
                } else {
                    bsRight.push(item)
                }
            });

            $log.info(model);

            form.push({
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "title": "Business Summary",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [ {
                            "key": "customer.firstName",
                            "title": "Enterprise Name"
                        },{
                            "key": "customer_detail.applicant.name",
                            "title": "Applicant Name"
                        },{
                            "key": "customer_detail.coApplicants.name[0]",
                            "title": "Co-Applicant 1"
                        }, {
                            "key": "customer_detail.coApplicants.name[1]",
                            "title": "Co-Applicant 2",
                            "condition": "model.customer_detail.coApplicants.id[1]"
                        }, {
                            "key": "customer_detail.coApplicants.name[2]",
                            "title": "Co-Applicant 3",
                            "condition": "model.customer_detail.coApplicants.id[2]"
                        }, {
                            "key": "customer_detail.coApplicants.name[3]",
                            "title": "Co-Applicant 4",
                            "condition": "model.customer_detail.coApplicants.id[3]"
                        }, {
                            "key": "customer_detail.guarantors.name[0]",
                            "title": "Guarantor 1",
                            "condition": "model.customer_detail.guarantors.id[0]"
                        }, {
                            "key": "customer_detail.guarantors.name[1]",
                            "title": "Guarantor 2",
                            "condition": "model.customer_detail.guarantors.id[1]"
                        }, {
                            "key": "customer_detail.guarantors.name[2]",
                            "title": "Guarantor 3",
                            "condition": "model.customer_detail.guarantors.id[2]"
                        }, {
                            "key": "customer_detail.guarantors.name[3]",
                            "title": "Guarantor 4",
                            "condition": "model.customer_detail.guarantors.id[3]"
                        },]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [
                            {
                                "key": "enterpriseDetailsData.Business Type",
                                "title": "Business Type"
                            }, {
                            "key": "enterpriseDetailsData.Business Activity",
                            "title": "Business Activity"
                        }, {
                            "key": "enterpriseDetailsData.Sector",
                            "title": "Sector"
                        },{
                            "key": "enterpriseDetailsData.Sub-Sector",
                            "title": "Sub-Sector"
                        }]
                    }]
                }]
            });


            form.push({
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "title": "Business Income",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            key: "customer.enterprise.monthlyTurnover",
                            title: "MONTHLY_TURNOVER",
                            required: true,
                            type: "amount"
                        }, {
                            key: "customer.enterprise.monthlyBusinessExpenses",
                            title: "MONTHLY_BUSINESS_EXPENSES",
                            type: "amount"
                        }, {
                            key: "customer.enterprise.avgMonthlyNetIncome",
                            title: "AVERAGE_MONTHLY_NET_INCOME",
                            type: "amount"
                        }, ]
                    }]
                }]
            });

                        var businessBankStmtSummaryTable = "<irf-simple-summary-table irf-table-def = 'model.businessBankStmtSummary'></irf-simple-summary-table>";

            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: model.businessBankStmtSummary.title,
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: businessBankStmtSummaryTable
                }]
            });

            var personalBankStmtSummaryTable = "<irf-simple-summary-table irf-table-def = 'model.personalBankStmtSummary'></irf-simple-summary-table>";
            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: model.personalBankStmtSummary.title,
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: personalBankStmtSummaryTable
                }]
            });

            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "BANK_ACCOUNTS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<div ng-repeat="bankAccount in model.bankAccountDetails.BankAccounts"><table class="table table-condensed" style="width:50%"><colgroup><col width="40%"><col width="60%"></colgroup><tbody><tr class="table-sub-header"><td>{{ "ACCOUNT_NAME" | translate }}</td><td>{{ bankAccount["Account Holder Name"] }}</td></tr><tr><td> {{ "LOAN_RELATION" | translate }}</td><td>{{ bankAccount["Customer Relation"] }}</td></tr><tr><td>{{ "ACCOUNT_TYPE" | translate }}</td><td>{{ bankAccount["Account Type"] }}</td></tr><tr><td>{{ "BANK_NAME" | translate }}</td><td>{{ bankAccount["Bank Name"] }}</td></tr><tr><td>{{ "ACCOUNT_NUMBER" | translate }}</td><td>{{ bankAccount["Account Number"] }}</td></tr><tr><td>{{ "IFS_CODE" | translate }}</td><td>{{ bankAccount["IFS Code"] }}</td></tr><tr><td>{{ "LIMIT" | translate }}</td><td>{{ bankAccount["Limit"] }}</td></tr></tbody></table><div class="clearfix"></div><table class="table table-condensed"><colgroup><col width="20%"><col width="20%"><col width="20%"><col width="20%"><col width="20%"></colgroup><thead><tr><th> {{ "MONTH" | translate }}</th><th> {{ "BANK_BALANCE" | translate }}</th><th> {{ "DEPOSITS" | translate }}</th><th> {{ "EMI_BOUNCED" | translate }}</th><th> {{ "NO_OF_CHEQUE_BOUNCED_SP" | translate }}</th></tr></thead><tbody><tr ng-repeat="bankStatement in bankAccount.BankStatements"><td>{{ bankStatement["Month"] }}</td><td>{{ bankStatement["Balance"] | irfCurrency}}</td><td>{{ bankStatement["Deposits"] | irfCurrency}}</td><td>{{ bankStatement["EMI Bounced"] }}</td><td>{{ bankStatement["Non-EMI Cheque Bounced"] }}</td></tr><tr class="top-bar with-bold"><td></td><td>{{ "AVERAGE_BANK_BALANCE" | translate }} <br /> {{ bankAccount["Average Bank Balance"] | irfCurrency}}</td><td>{{ "AVERAGE_BANK_DEPOSIT" | translate }} <br /> {{ bankAccount["Average Bank Deposit"] | irfCurrency}}</td><td>{{ "TOTAL_EMI_BOUNCED" | translate }} <br /> {{ bankAccount["Total EMI Bounced"] }}</td><td>{{ "TOTAL_CHEQUEU_BOUNCED_NON_EMI" | translate }} <br /> {{ bankAccount["Total Cheque Bounced (Non EMI)"] }}</td></tr></tbody></table> <br/><hr class="dotted"> <br/></div>'
                }]
            });

            var items = [];
            if (_.isArray(model.liabilitiesSummary.subgroups) && model.liabilitiesSummary.subgroups.length > 0) {
                for (var i = 0; i < model.liabilitiesSummary.subgroups.length; i++) {
                    items.push({
                        type: "section",
                        colClass: "col-sm-12",
                        html: '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{model.liabilitiesSummary.subgroups[' + i + '].summary["Name"]}} - {{model.liabilitiesSummary.subgroups[' + i + '].summary["Relation"]}}</h3> \
                        <irf-simple-summary-table irf-table-def="model.liabilitiesSummary.subgroups[' + i + ']"></irf-simple-summary-table>\
                        <strong>Total EMI </strong> &nbsp; &nbsp; {{model.liabilitiesSummary.subgroups[' + i + '].summary["Total Monthly Installment"] | irfCurrency}} <br />\
                        <strong>Total Outstanding Loan Amount</strong> &nbsp; &nbsp; {{model.liabilitiesSummary.subgroups[' + i + '].summary["Total Outstanding Loan Amount"] | irfCurrency}}\
                        <hr>\
                        '
                    });
                }
            }

            var machineryDetailsTable = "<irf-simple-summary-table irf-table-def = 'model.machineryDetails'></irf-simple-summary-table>";

            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: model.machineryDetails.title,
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: machineryDetailsTable
                }]
            });

            form.push({
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
                        "items": [ {
                            "key": "loanAccount.loanAmount",
                            "title": "Loan Amount Recommended",
                            "type": "amount",
                            onChange: function(value, form, model) {
                                computeEMI(model);
                            }
                        },{
                            "key": "loanAccount.interestRate",
                            "title": "Interest Rate",
                            "type": "number",
                            onChange: function(value, form, model) {
                                computeEMI(model);
                            }
                        }, {
                            "key": "loanAccount.tenure",
                            "title": "Duration(months)",
                            onChange: function(value, form, model) {
                                computeEMI(model);
                            }
                        },{
                            "key": "loanAccount.processingFeePercentage",
                            "title": "Processing Fee(in%)"
                        }, {
                            "key": "loanAccount.estimatedEmi",
                            "title": "ESTIMATED_KINARA_EMI",
                            "type": "amount"
                        },{
                            "key": "loanAccount.estimatedEmi",
                            "title": "Expected Security EMI"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [
                            {
                                "key": "loanAccount.productCategory",
                                "title": "Product Type"
                            }, {
                            "key": "loanAccount.loanPurpose1",
                            "title": "Loan Purpose"
                        }, {
                            "key": "loanAccount.loanPurpose2",
                            "title": "Loan SubPurpose"
                        }]
                    }]
                }]
            });

            form.push({
                "type": "box",
                "title": "Post Review Decision",
                "colClass": "col-sm-12",
                "items": [{
                    type: "section",
                    "htmlClass": "row",
                    "items": [{
                        "type": "section",
                        "htmlClass": "col-sm-12",
                        "items": [{
                            type: "tableview",
                            "title": "Previous Remarks",
                            htmlClass: "table-striped",
                            listStyle: "table",
                            key: "loanRemarksSummary",
                            selectable: false,
                            expandable: true,
                            paginate: false,
                            searching: false,
                            getColumns: function() {
                                return [{
                                    title: 'User Name',
                                    data: 'userId'
                                }, {
                                    title: 'Remarks',
                                    data: 'remarks'
                                }, {
                                    title: 'From Stage',
                                    data: 'preStage'
                                }, {
                                    title: 'To Stage',
                                    data: 'postStage'
                                }, {
                                    title: 'Remarks Date',
                                    data: 'createdDate',
                                    render: function(data, type, full, meta) {
                                        return (moment(data).format("DD-MM-YYYY"));
                                    }
                                }]
                            },
                            getActions: function(item) {
                                return [];
                            }
                        }]
                    }]
                }]
            });

            form.push({
                    "type": "box",
                    "title": "POST_REVIEW",
                    "condition": "model.loanAccount.id",
                    "items": [{
                        key: "loanAccount.partnerApprovalStatus",
                        type: "radios",
                        titleMap: {
                            "DECLINE": "REJECT",
                            "ACCEPT": "ACCEPT",
                            "HOLD": "HOLD",
                            "SendBack":"Send Back with Remarks"
                        }
                    }, 
                    {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='SendBack'",
                        items: [{
                                title: "REMARKS",
                                key: "loanAccount.partnerRemarks",
                                required: true
                            },
                            {
                                key: "review.rejectButton",
                                type: "button",
                                title: "SEND_BACK",
                                required: true,
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
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
                    },
                    {
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
            );



            return form;
        }; // END OF prepareForms()

        var prepareDataDeferred;
        var prepareDataPromise;

        return {
            "type": "schema-form",
            "title": "",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                prepareDataDeferred = $q.defer();
                prepareDataPromise = prepareDataDeferred.promise;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.currentStage = "PendingForPartner";
                model.loanAccount = bundleModel.loanAccount;
                model.additional=model.additional||{};
                model.customer_detail = bundleModel.customer_detail;

                BundleManager.pushEvent('loanAccount', model._bundlePageObj, model.loanAccount);




                if (model.loanAccount.portfolioInsuranceUrn == model.loanAccount.applicant) {
                    model.additional.portfolioUrnSelector = "applicant";
                }

                if (model.loanAccount.guarantors && model.loanAccount.guarantors.length > 0 && model.loanAccount.guarantors[0].guaUrnNo == model.loanAccount.portfolioInsuranceUrn) {
                    model.additional.portfolioUrnSelector = "guarantor";
                }

                if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length > 0 && model.loanAccount.coBorrowers[0].coBorrowerUrnNo == model.loanAccount.portfolioInsuranceUrn) {
                    model.additional.portfolioUrnSelector = "coapplicant";
                }

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

                model.ScoreDetails = [];
                model.customer = {};
                var $this = this;
                var deferred = $q.defer();

                scoreName = null;
                switch (model.currentStage) {
                    case "ScreeningReview":
                        scoreName = "RiskScore1";
                        break;
                    case "ApplicationReview":
                        scoreName = "RiskScore2";
                        break;
                    case "FieldAppraisalReview":
                        scoreName = "RiskScore3";
                        break;
                    default:
                        scoreName = "ConsolidatedScore";
                        break;
                }

                if (bundlePageObj) {
                    model._bundlePageObj = _.cloneDeep(bundlePageObj);
                }

                if (_.hasIn(model, 'cbModel')) {
                    Scoring.get({
                        auth_token: AuthTokenHelper.getAuthData().access_token,
                        LoanId: model.cbModel.loanId,
                        ScoreName: scoreName
                    }).$promise.then(function(response) {
                        model.ScoreDetails = response.ScoreDetails;
                    }).finally(function() {
                        var onSuccessPromise = Scoring.financialSummary({
                            loan_id: model.cbModel.loanId,
                            score_name: scoreName
                        }).$promise;
                        onSuccessPromise.then(function(res) {
                            prepareData(res, model);
                            model.$prepared = true;
                            BundleManager.pushEvent('financialSummary', model._bundlePageObj, res);
                            prepareDataDeferred.resolve();
                        });



                        var p3 = Enrollment.getCustomerById({
                            id: model.cbModel.customerId
                        }).$promise.then(function(res) {
                            model.customer = res;
                        }, function(httpRes) {
                            PageHelper.showErrors(httpRes);
                        }).finally(function() {});

                        $q.all([onSuccessPromise, p3]).finally(function() {
                            deferred.resolve();
                        });
                    });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            },
            eventListeners: {},
            form: [{
                type: 'section',
                html: '<br><br><br><center>Loading...</center>'
            }],
            initializeUI: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                PageHelper.showLoader();
                var $this = this;
                if (model.$prepared) {
                    $this.form = prepareForms(model);
                    PageHelper.hideLoader();
                } else {
                    prepareDataPromise.then(function() {
                        $this.form = prepareForms(model);
                        formCtrl.redraw();
                        PageHelper.hideLoader();
                    });
                }
                return $q.resolve();
            },
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
                "business-loaded": function(bundleModel, pageModel, eventModel) {
                    pageModel.business = eventModel;
                },
                "loan-account-loaded": function(bundleModel, pageModel, eventModel) {
                    pageModel.loanAccount = eventModel.loanAccount;
                },
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
        };
    }
})