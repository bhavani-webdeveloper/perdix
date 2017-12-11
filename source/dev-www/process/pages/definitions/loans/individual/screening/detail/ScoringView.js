define({
    pageUID: "loans.individual.screening.detail.ScoringView",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "Scoring", "AuthTokenHelper", "BundleManager"
    ],
    $pageFn: function($log, $q, Enrollment, SchemaResource, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, Scoring, AuthTokenHelper, BundleManager) {

        var branch = SessionStore.getBranch();
        var scoreName;

        var prepareData = function(res, model) {

            model.enterpriseDetails = res[0];
            model.scoreDetails = [res[1], res[2], res[3], res[4]];


            var managementScore = model.scoreDetails[0];
            var res1 =model.scoreDetails[0].sections[0].data;
            model.management_Data=[res1[1],res1[2],res1[4],res1[6],res1[7]];

            var res2=model.scoreDetails[1].data;
            model.business_data=[res2[0],res2[1],res2[3],res2[4],res2[5],res2[8]];
            /*if (_.isArray(managementScore.sections)) {
                var count = managementScore.sections.length;
                var spacePct = 75 / count;

                managementScore.values = [];
                for (var i = 0; i < managementScore.sections.length; i++) managementScore.values[i] = i;
                managementScore.colorPct = spacePct / 5;
                managementScore.valuePct = spacePct * 4 / 5;
            }*/

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


            /* BundleManager.broadcastEvent('psychometScore', model.psychometricScores);*/

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
            // model.pl.household.income = model.houseHoldPL.data[0]['Total Incomes'];
            // model.pl.household.salaryFromBusiness = model.houseHoldPL.data[0]['Salary from business'];
            // model.pl.household.otherIncomeSalaries = model.houseHoldPL.data[0]['Other Income/salaries'];
            // model.pl.household.familyMemberIncomes = model.houseHoldPL.data[0]['Family Member Incomes'];
            // model.pl.household.Expenses = model.houseHoldPL.data[0]['Total Expenses'];
            // model.pl.household.declaredEducationExpense = model.houseHoldPL.data[0]['Expenses Declared or based on the educational expense whichever is higher'];
            // model.pl.household.emiHouseholdLiabilities = model.houseHoldPL.data[0]['EMI\'s of household liabilities'];
            // model.pl.household.netHouseholdIncome = model.houseHoldPL.data[0]['Net Household Income'];

            // if (model.houseHoldPL_CoApplicant && model.houseHoldPL_CoApplicant.active) {
            //     model.pl.householdCoApplicant = {};
            //     model.pl.householdCoApplicant.income = model.houseHoldPL_CoApplicant.data[0]['Total Incomes'];
            //     model.pl.householdCoApplicant.salaryFromBusiness = model.houseHoldPL_CoApplicant.data[0]['Salary from business'];
            //     model.pl.householdCoApplicant.otherIncomeSalaries = model.houseHoldPL_CoApplicant.data[0]['Other Income/salaries'];
            //     model.pl.householdCoApplicant.familyMemberIncomes = model.houseHoldPL_CoApplicant.data[0]['Family Member Incomes'];
            //     model.pl.householdCoApplicant.Expenses = model.houseHoldPL_CoApplicant.data[0]['Total Expenses'];
            //     model.pl.householdCoApplicant.declaredEducationExpense = model.houseHoldPL_CoApplicant.data[0]['Expenses Declared or based on the educational expense whichever is higher'];
            //     model.pl.householdCoApplicant.emiHouseholdLiabilities = model.houseHoldPL_CoApplicant.data[0]['EMI\'s of household liabilities'];
            //     model.pl.householdCoApplicant.netHouseholdIncome = model.houseHoldPL_CoApplicant.data[0]['Net Household Income'];
            // }

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
                if (d.Mitigant && d.Mitigant.length != 00) {
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
                if (d.Mitigant && d.Mitigant.length != 00) {
                    d.ListOfMitigants = d.Mitigant.split("|");
                    for (var j = 0; j < d.ListOfMitigants.length; j++) {
                        model.deviationParameter[model.deviationParameter.length - 1].mitigants.push({
                            mitigantName: d.ListOfMitigants[j]
                        });
                    }

                }
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

            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: "SCORES",
                items: [{
                        type: "section",
                        htmlClass: "row",
                        html: '<div class="col-sm-3"><div class="stat-container" ><dd class="stat-key"> Total Score</dd><dt class="stat-value"> {{ model.ScoreDetails[0].OverallWeightedScore }}</dt></div></div><div class="col-sm-3"><div class="stat-container" ><dd class="stat-key"> Status</dd><dt class="stat-value" ng-class="{\'text-a-green\': model.ScoreDetails[0].OverallPassStatus==\'PASS\', \'text-a-red\': model.ScoreDetails[0].OverallPassStatus==\'FAIL\'}"> {{ model.ScoreDetails[0].OverallPassStatus }}</dt></div></div><div class="clearfix"></div><hr>'
                    }, {
                        type: "section",
                        htmlClass: "row",
                        items: [{
                            type: "section",
                            htmlClass: "col-sm-6",
                            title: model.scoreDetails[0].title,
                            html: '<div ng-init="_score=model.scoreDetails[0]">' +
                                '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{_score.title}} </h3>' +
                                '<table class="table">' +
                                '<colgroup>' +
                                '<col width="50%">' +
                                '<col width="40%">' +
                                '<col width="10%">' +
                                '</colgroup>' +
                                '<tbody>' +
                                '<tr>' +
                                '<th>Parameter Name</th>' +
                                '<th>Actual Value</th>' +
                                '<th>Status </th>'+
                                '</tr>' +
                                '<tr ng-repeat="data in model.management_Data" ng-init="parameterIndex=$index">' +
                                '<td>{{data.Parameter}}</td>' +
                                '<td >{{_score.sections[0].data[parameterIndex].Applicant}}</td>'+
                                '<td > <span class="square-color-box" style="background:{{_score.sections[0].data[parameterIndex].color_hexadecimal}}"> </span></td>' +
                                '</tr>' +
                                '<tr>'+
                                '<td>{{"TOTAL" |translate}}</td><td>({{model.totalScores.data[0][_score.title]}})</td><td></td>'+
                                '</tr>'+
                                '</tbody>' +
                                '</table>' +
                                '</div>'
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "title": "model.scoreDetails[1].title",
                            "html": '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{ model.scoreDetails[1].title }} ({{ model.totalScores.data[0][model.scoreDetails[1].title] }})</h3>' +
                                '<table class="table">' +
                                '<colgroup><col width="50%"><col width="40%"><col width="10%"></colgroup>' +
                                '<tbody>' +
                                '<tr><th>Parameter</th><th>Actual Value</th><th>Status</th></tr>' +
                                '<tr ng-repeat="data in model.business_data">' +
                                '<td>{{ data.Parameter }}</td>' +
                                '<td>{{ data["Actual Value"] }}</td>' +
                                '<td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td>' +
                                '</tr>' +
                                '<tr>'+
                                '<td>{{"TOTAL" |translate}}</td><td>({{model.totalScores.data[0][_score.title]}})</td><td></td>'+
                                '</tr>'+
                                '</tbody>' +
                                '</table>'
                        }]
                    }, {
                        type: "section",
                        htmlClass: "row",
                        items: [{
                            type: "section",
                            htmlClass: "col-sm-6",
                            condition: "model.currentStage!='ScreeningReview'",
                            title: model.scoreDetails[2].title,
                            html: '<h3>{{ model.scoreDetails[2].title }} </h3><table class="table"><colgroup><col width="50%"><col width="40%"><col width="10%"></colgroup>'+
                            '<tbody><tr><th>Parameter</th><th>Actual Value</th><th>Status</th></tr><tr ng-repeat="data in model.scoreDetails[2].data"><td>{{ data.Parameter }}</td><td>{{ data["Actual Value"] }}</td><td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td></tr><tr><td>{{"TOTAL"|translate}}</td><td>({{ model.totalScores.data[0][model.scoreDetails[2].title] }})</td><td></td></tr></tbody></table>'
                        }, {
                            type: "section",
                            htmlClass: "col-sm-6",
                            condition: "model.currentStage!='ScreeningReview'",
                            title: model.scoreDetails[3].title,
                            html: '<h3>{{ model.scoreDetails[3].title }} </h3><table class="table"><colgroup><col width="50%"><col width="40%"><col width="10%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[3].data"><td>{{ data.Parameter }}</td><td>{{ data["Actual Value"] }}</td><td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td></tr><tr><td>{{"TOTAL"|translate}}</td><td>({{ model.totalScores.data[0][model.scoreDetails[3].title] }})</td><td></td></tr></tbody></table>'
                        }]
                    }

                ]
            })
            form.push({
                "type": "box",
                "colClass": "col-sm-12",
                "readonly": true,
                "title": "Existing Customer Loan Status",
                "items": [{
                    "type": "section",
                    "html": '<table class="table table-responsive">' +
                        '<colgroup><col width="15%">' +
                        '<col width="15%"><col width="15%"><col width="15%"><col width="15%"><col width="15%"><col width="10%">' +
                        '</colgroup>' +
                        '<tbody>' +
                        '<tr><th>{{"Category"|translate}}</th><th ng-repeat="i in model.lia_category track by $index">{{i}}</th><th>{{"Current Application"|translate}}</th><th>{{"Status"|translate}}</th></tr>' +
                        '<tr><td>{{"Disbursed Amount"|translate}}</td><td ng-repeat="i in model.lia_disbursed_amount track by $index">{{i}}</td><td>{{"NA"|translate}}</td><td>{{"NA"|translate}}</td></tr>' +
                        '<tr><td>{{"Tenure"|translate}}</td><td ng-repeat="i in model.lia_tenure track by $index">{{i}}</td><td>{{"NA"|translate}}</td><td>{{"NA"|translate}}</td></tr>' +
                        '<tr><td>{{"No. of EMI Paid"|translate}}</td><td ng-repeat="i in model.lia_emiPaid track by $index">{{i}}</td><td>{{"NA"|translate}}</td><td>{{"NA"|translate}}</td></tr>' +
                        '<tr><td>{{"Total Outstanding Amount"|translate}}</td><td ng-repeat="i in model.lia_outstanding track by $index">{{i}}</td><td>{{"NA"|translate}}</td><td>{{"NA"|translate}}</td></tr>' +
                        '<tr><td>{{"Loan Product"|translate}}</td><td ng-repeat="i in model.lia_product track by $index">{{i}}</td><td>{{"NA"|translate}}</td><td>{{"NA"|translate}}</td></tr>' +
                        '</tbody>' +
                        '</table>'
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

                model.currentStage = bundleModel.currentStage;
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
                            /*Event Generation , to be received at Bundle page loanAnalyticsView */
                            BundleManager.pushEvent('scoring-loaded', model._bundlePageObj, res);
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
                "business-loaded": function(bundleModel, pageModel, eventModel) {
                    pageModel.business = eventModel;
                },
                "loan-account-loaded": function(bundleModel, pageModel, eventModel) {
                    pageModel.loanAccount = eventModel.loanAccount;
                },
                "_liability": function(bundleModel, model, params) {
                    model.liabilities = params;
                    model.lia_disbursed_amount = [];
                    model.lia_tenure = [];
                    model.lia_emiPaid = [];
                    model.lia_outstanding = [];
                    model.lia_product = [];
                    model.lia_category = [];

                    for (var i = 0; i < model.liabilities.length; i++) {
                        model.lia_category.push("Loan" + (i + 1));
                        model.lia_disbursed_amount.push(model.liabilities[i].loanAmountInPaisa);
                        model.lia_tenure.push(model.liabilities[i].tenure);
                        model.lia_emiPaid.push(model.liabilities[i].noOfInstalmentPaid);
                        model.lia_outstanding.push(model.liabilities[i].outstandingAmountInPaisa);
                        model.lia_product.push(model.liabilities[i].loanSource);

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