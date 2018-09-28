define({
    pageUID: "irep.loans.individual.origination.detail.SummaryView",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "Scoring", "AuthTokenHelper", "BundleManager", "filterFilter", "irfCurrencyFilter"
    ],
    $pageFn: function($log, $q, Enrollment, SchemaResource, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, Scoring, AuthTokenHelper, BundleManager, filterFilter, irfCurrencyFilter) {

        var branch = SessionStore.getBranch();
        var scoreName;

        var prepareData = function(res, model) {

            if (res[0].data[0]['Existing Customer'] == 'No') {
                model.existingCustomerStr = "New Customer";
            } else {
                model.existingCustomerStr = "Existing Customer";
            }

            model.enterpriseDetails = res[0];
            model.secName = res[0].data[0]['Sector'];
            model.subSecName = res[0].data[0]['Sub-Sector'];
            model.sectorDetails = res[5];
            model.secData = model.sectorDetails.data[0];

            model.subSectorDetails = res[6];
            model.subsecData = model.subSectorDetails.data[0];
            model.houseHoldPL = res[7].sections;
            model.businessPL = res[8];
            model.balanceSheet = res[9];
            model.bankAccountDetails = res[10];
            model.cashFlowDetails = res[15];
            model.purchaseDetails = res[18];
            model.liabilitiesSummary = res[19];
            model.opexDetails = res[21];
            model._opex = res[21].data;

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
            form.push({
                "type": "section",
                "html": `
<div class="col-sm-6">
<i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">{{model.existingCustomerStr}}</em><br>&nbsp;
</div>
<div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.business.kgfsName}}</strong></div>
<div class="col-sm-3">{{'CENTRE'|translate}}: <strong>{{model.business.centreName}}</strong></div>
`
            })

            form.push({
                "type": "box",
                "overrideType": "default-view",
                "colClass": "col-sm-12 ",
                "title": "Business Summary",
                "readonly": true,
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "business.id",
                            "title": "Entity ID"
                        }, {
                            "key": "customer_detail.applicant.id",
                            "title": "Applicant ID"
                        }, {
                            "key": "customer_detail.coApplicants.id[0]",
                            "title": "Co-Applicant ID"
                        }, {
                            "key": "customer_detail.coApplicants.id[1]",
                            "title": "Co-Applicant ID",
                            "condition": "model.customer_detail.coApplicants.id[1]"
                        }, {
                            "key": "customer_detail.coApplicants.id[2]",
                            "title": "Co-Applicant ID",
                            "condition": "model.customer_detail.coApplicants.id[2]"
                        }, {
                            "key": "customer_detail.coApplicants.id[3]",
                            "title": "Co-Applicant ID",
                            "condition": "model.customer_detail.coApplicants.id[3]"
                        }, {
                            "key": "customer_detail.guarantors.id[0]",
                            "title": "Guarantor ID",
                            "condition": "model.customer_detail.guarantors.id[0]"
                        }, {
                            "key": "customer_detail.guarantors.id[1]",
                            "title": "Guarantor ID",
                            "condition": "model.customer_detail.guarantors.id[1]"
                        }, {
                            "key": "customer_detail.guarantors.id[2]",
                            "title": "Guarantor ID",
                            "condition": "model.customer_detail.guarantors.id[2]"
                        }, {
                            "key": "customer_detail.guarantors.id[3]",
                            "title": "Guarantor ID",
                            "condition": "model.customer_detail.guarantors.id[3]"
                        }, {
                            "key": "business.firstName",
                            "title": "Enterprise Name"
                        }, {
                            "key": "loanAccount.productCategory",
                            "title": "Loan Product"
                        }, {
                            "key": "loanAccount.loanAmountRequested",
                            "title": "Loan Amount Requested",
                            "type": "amount"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.urnNo",
                            "title": "URN"
                        }, {
                            "key": "customer_detail.applicant.urn",
                            "title": "URN"
                        }, {
                            "key": "customer_detail.coApplicants.urn[0]",
                            "title": "URN"
                        }, {
                            "key": "customer_detail.coApplicants.urn[1]",
                            "title": "URN",
                            "condition": "model.customer_detail.coApplicants.id[1]"
                        }, {
                            "key": "customer_detail.coApplicants.urn[2]",
                            "title": "URN",
                            "condition": "model.customer_detail.coApplicants.id[2]"
                        }, {
                            "key": "customer_detail.coApplicants.urn[3]",
                            "title": "URN",
                            "condition": "model.customer_detail.coApplicants.id[3]"
                        }, {
                            "key": "customer_detail.guarantors.urn[0]",
                            "title": "URN",
                            "condition": "model.customer_detail.guarantors.id[0]"
                        }, {
                            "key": "customer_detail.guarantors.urn[1]",
                            "title": "URN",
                            "condition": "model.customer_detail.guarantors.id[1]"
                        }, {
                            "key": "customer_detail.guarantors.urn[2]",
                            "title": "URN",
                            "condition": "model.customer_detail.guarantors.id[2]"
                        }, {
                            "key": "customer_detail.guarantors.urn[3]",
                            "title": "URN",
                            "condition": "model.customer_detail.guarantors.id[3]"
                        }, {
                            "key": "bundleModel.applicant.firstName",
                            "title": "Applicant Name"
                        }, {
                            "key": "loanAccount.tenureRequested",
                            "title": "Tenure of Loan"
                        }, {
                            "key": "loanAccount.expectedInterestRate",
                            "title": "Rate of Interest"
                        }]
                    }]
                }]
            })

            form.push({
                "type": "box",
                "colClass": "col-sm-12",
                "title": "Sector-SubSector Compare",
                "readonly": true,
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "title": "Sector",
                            "key": "secName"
                        }, {
                            "key": "secData['No of total loans']",
                            "title": "Total no. of Loans",
                        }, {
                            "key": "secData['Min Loan Size']",
                            "title": "Minimum Loan Size"
                        }, {
                            "key": "secData['Max Loan Size']",
                            "title": "Maximum Loan Size"
                        }, {
                            "key": "secData['Average Loan Size']",
                            "title": "Average Loan Size",
                            "type": "amount"
                        }, {
                            "key": "secData['No of Loans with cheque bounce']",
                            "title": "No. of loans with cheque bounce"
                        }, {
                            "key": "secData['Average Loan Size of Cheque Bounce accounts']",
                            "title": "Avg loan size of cheque bounce accounts",
                            "type": "amount"
                        }, {
                            "key": "secData['No of loans as NPA']",
                            "title": "No. of loans as NPA"
                        }, {
                            "key": "secData['Average Loan Size of NPA accounts']",
                            "title": "Avg loan size of NPA accounts",
                            "type": "amount"
                        }]

                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "title": "Sub-Sector",
                            "key": "subSecName"
                        }, {
                            "key": "subsecData['No of total loans']",
                            "title": "Total no. of Loans"
                        }, {
                            "key": "subsecData['Min Loan Size']",
                            "title": "Minimum Loan Size"
                        }, {
                            "key": "subsecData['Max Loan Size']",
                            "title": "Maximum Loan Size"
                        }, {
                            "key": "subsecData['Average Loan Size']",
                            "title": "Average Loan Size",
                            "type": "amount"
                        }, {
                            "key": "subsecData['No of Loans with cheque bounce']",
                            "title": "No. of loans with cheque bounce"
                        }, {
                            "key": "subsecData['Average Loan Size of Cheque Bounce accounts']",
                            "title": "Avg loan size of cheque bounce accounts",
                            "type": "amount"
                        }, {
                            "key": "subsecData['No of loans as NPA']",
                            "title": "No. of loans as NPA"
                        }, {
                            "key": "subsecData['Average Loan Size of NPA accounts']",
                            "type": "amount",
                            "title": "Avg loan size of NPA accounts"

                        }]

                    }]
                }]
            })


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
                model.bundleModel = bundleModel;
                model.currentStage = bundleModel.currentStage;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.ScoreDetails = [];
                model.customer = {};

                /*Business Summary*/
                model.customer_detail = bundleModel.customer_detail;
                model.loanAccount = bundleModel.loanAccount;
                var $this = this;
                var deferred = $q.defer();

                scoreName = null;
                switch (model.currentStage) {
                    case "Televerification":
                        scoreName = "RiskScore1";
                        break;
                    case "ApplicationReview":
                        scoreName = "RiskScore2";
                        break;
                    case "Evaluation":
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
                            /* var financialData = [model.ScoreDetails,res];*/
                            BundleManager.pushEvent('financialSummary', model._bundlePageObj, res);
                            prepareData(res, model);
                            model.$prepared = true;
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
                "business-customer": function(bundleModel, model, params) {
                    model.business = params;
                      if (model.business.centreId) {
                        model.business.centreName = filterFilter(formHelper.enum('centre').data, {
                            value: model.business.centreId
                        })[0].name;
                    }
                }
            },
            actions: {
                save: function(customerId, CBType, loanAmount, loanPurpose) {
                    $log.info("Inside submit()");
                    $log.warn(model);
                }
            }
        };
    }
});