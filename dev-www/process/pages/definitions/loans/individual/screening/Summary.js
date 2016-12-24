irf.pageCollection.factory(irf.page("loans.individual.screening.Summary"),
["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","Scoring","AuthTokenHelper",
function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,Scoring,AuthTokenHelper){

    var branch = SessionStore.getBranch();

    var prepareForms = function(model, form){

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

        model.pl  = {
            household: {},
            business: {}
        };
        model.pl.household.income = model.houseHoldPL.data[0]['Total Incomes'];
        model.pl.household.salaryFromBusiness = model.houseHoldPL.data[0]['Salary from business'];
        model.pl.household.otherIncomeSalaries = model.houseHoldPL.data[0]['Other Income/salaries'];
        model.pl.household.familyMemberIncomes = model.houseHoldPL.data[0]['Family Member Incomes'];
        model.pl.household.Expenses = model.houseHoldPL.data[0]['Total Expenses'];
        model.pl.household.declaredEducationExpense = model.houseHoldPL.data[0]['Expenses Declared or based on the educational expense whichever is higher'];
        model.pl.household.emiHouseholdLiabilities = model.houseHoldPL.data[0]['EMI\'s of household liabilities'];
        model.pl.household.netHouseholdIncome = model.houseHoldPL.data[0]['Net Household Income'];

        model.pl.business.invoice = model.businessPL.data[0]['Invoice'];
        model.pl.business.cashRevenue = model.businessPL.data[0]['Cash'];
        model.pl.business.scrapIncome = model.businessPL.data[0]['Scrap or any business related income'];
        model.pl.business.totalBusinessIncome = model.businessPL.data[0]['Total Business Revenue'];
        model.pl.business.purchases = model.businessPL.data[0]['Purchases'];
        model.pl.business.grossIncome = model.businessPL.data[0]['Gross Income'];
        model.pl.business.Opex = model.businessPL.data[0]['Opex'];
        model.pl.business.EBITDA = model.businessPL.data[0]['EBITDA'];
        model.pl.business.businessLiabilities = model.businessPL.data[0]['Business Liabilities'];
        model.pl.business.netBusinessIncome = model.businessPL.data[0]['Net Business Income'];
        model.pl.business.kinaraEmi = model.businessPL.data[0]['Kinara EMI'];
        model.pl.business.netIncome = model.businessPL.data[0]['Net Income'];
        model.pl.business.finalKinaraEmi = model.businessPL.data[0]['Final Kinara EMI'];



        
        
        form.push({
            type: "box",
            "colClass": "col-sm-12",
            items: [
                {
                    type: "tableview",
                    key: "enterpriseDetails.data",
                    title: model.enterpriseDetails.title,
                    selectable: false,
                    paginate: false,
                    searching: false,
                    getColumns: function(){
                        return model.enterpriseDetails.columns;
                    }
                }
            ]
        });

        for (i in model.scoreDetails) {
            form.push({
                type: "box",
                "colClass": "col-sm-6",
                items: [
                    {
                        type: "tableview",
                        key: "scoreDetails[" + i + "].data",
                        title: model.scoreDetails[i].title,
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function(){
                            return model.scoreDetails[i].columns;
                        }
                    }
                ]
            });
            // form.push()
        }

        form.push({
            type: "box",
            colClass: "col-sm-12",
            items: [
                {
                    type: "tableview",
                    key: "sectorDetails.data",
                    title: model.sectorDetails.title,
                    selectable: false,
                    paginate: false,
                    searching: false,
                    getColumns: function(){
                        return model.sectorDetails.columns;
                    }
                }
            ]
        });
        
        form.push({
            type: "box",
            colClass: "col-sm-12",
            items: [
                {
                    type: "tableview",
                    key: "subSectorDetails.data",
                    title: model.subSectorDetails.title,
                    selectable: false,
                    paginate: false,
                    searching: false,
                    getColumns: function(){
                        return model.subSectorDetails.columns;
                    }
                }
            ]
        });

        // form.push({
        //     type: "box",
        //     colClass: "col-sm-12",
        //     items: [
        //         {
        //             type: "tableview",
        //             key: "houseHoldPL.data",
        //             title: model.houseHoldPL.title,
        //             selectable: false,
        //             paginate: false,
        //             searching: false,
        //             getColumns: function(){
        //                 return model.houseHoldPL.columns;
        //             }
        //         }
        //     ]
        // })

        // form.push({
        //     type: "box",
        //     colClass: "col-sm-12",
        //     items: [
        //         {
        //             type: "tableview",
        //             key: "businessPL.data",
        //             title: model.businessPL.title,
        //             selectable: false,
        //             paginate: false,
        //             searching: false,
        //             getColumns: function(){
        //                 return model.businessPL.columns;
        //             }
        //         }
        //     ]
        // })
        
        // form.push({
        //     type: "box",
        //     colClass: "col-sm-12",
        //     items: [
        //         {
        //             type: "tableview",
        //             key: "balanceSheet.data",
        //             title: model.balanceSheet.title,
        //             selectable: false,
        //             paginate: false,
        //             searching: false,
        //             getColumns: function(){
        //                 return model.balanceSheet.columns;
        //             }
        //         }
        //     ]
        // })

        form.push({
            type: "box",
            colClass: "col-sm-12",
            title: "HOUSEHOLD_PL",
            condition: "model.currentStage != 'ScreeningReview'",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    // html: "Hello guys. My name is {{ model.assetsAndL}}"
                    "html": '<table class="table table-striped"> <colgroup> <col width="30%"> <col width="40%"> <col width="30%"> </colgroup> <tbody> <tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> <th>{{model.pl.household.income}}</th> </tr><tr> <td></td><td>{{"SALARY_FROM_BUSINESS" | translate}}</td><td>{{model.pl.household.salaryFromBusiness}}</td></tr><tr> <td></td><td>{{"OTHER_INCOME_SALARIES" | translate}}</td><td>{{model.pl.household.otherIncomeSalaries}}</td></tr><tr> <td></td><td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td><td>{{model.pl.household.familyMemberIncomes}}</td></tr><tr class="table-sub-header"> <td>{{"EXPENSES" | translate}}</td><td></td><td>{{model.pl.household.Expenses}}</td></tr><tr> <td></td><td>{{"DECLARED_EDUCATIONAL_EXPENSE" | translate}}</td><td>{{model.pl.household.declaredEducationExpense}}</td></tr><tr> <td></td><td>{{"EMI_HOUSEHOLD_LIABILITIES" | translate}}</td><td>{{model.pl.household.emiHouseholdLiabilities}}</td></tr><tr class="table-bottom-summary"> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td><td></td><td>{{model.pl.household.netHouseholdIncome}}</td></tr></tbody></table>'
                }
            ]
        });
        
        
        form.push({
            type: "box",
            colClass: "col-sm-12",
            title: "BUSINESS_PL",
            condition: "model.currentStage != 'ScreeningReview'",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    // html: "Hello guys. My name is {{ model.assetsAndL}}"
                    "html": '<table class="table table-striped"> <colgroup> <col width="30%"> <col width="40%"> <col width="30%"> </colgroup> <tbody> <tr class="table-sub-header"> <th>{{"REVENUE_TURNOVER" | translate}}</th> <th></th> <th></th> </tr><tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.pl.business.invoice}}</td></tr><tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.pl.business.cashRevenue}}</td></tr><tr> <td></td><td>{{"SCRAP_OR_ANY_BUSINESS_INCOME" | translate}}</td><td>{{model.pl.business.scrapIncome}}</td></tr><tr class="table-sub-header"> <td>{{"TOTAL_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.pl.business.totalBusinessIncome}}</td></tr><tr> <td></td><td></td><td></td></tr><tr> <td>{{"PURCHASES" | translate}}</td><td></td><td>{{model.pl.business.purchases}}</td></tr><tr class="table-sub-header"> <th>{{"GROSS_INCOME" | translate}}</th> <th></th> <th>{{model.pl.business.grossIncome}}</th> </tr><tr> <td>{{"OPEX" | translate}}</td><td></td><td>{{model.pl.business.Opex}}</td></tr><tr> <td>{{"EBITDA" | translate}}</td><td></td><td>{{model.pl.business.EBITDA}}</td></tr><tr> <th>{{"EXISTING_LOAN_PAYMENTS" | translate}}</th> <th></th> <th></td></tr><tr> <td></td><td>{{"BUSINESS_LIABILITIES" | translate}}</td><td>{{model.pl.business.businessLiabilities}}</td></tr><tr> <td>{{"NET_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.pl.business.netBusinessIncome}}</td></tr><tr> <td>{{"KINARA_EMI" | translate}}</td><td></td><td>{{model.pl.business.kinaraEmi}}</td></tr><tr> <th>{{"NET_INCOME" | translate}}</th> <th></th> <th>{{model.pl.business.netIncome}}</th> </tr><tr class="table-bottom-summary"> <td>{{"FINAL_KINARA_EMI" | translate}}</td><td></td><td>{{model.pl.business.finalKinaraEmi}}</td></tr></tbody></table> '
                }
            ]
        });

        form.push({
            type: "box",
            colClass: "col-sm-12",
            title: "BALANCE_SHEET",
            condition: "model.currentStage != 'ScreeningReview'",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    "html": "<style>.table > tbody > tr.table-sub-header{background: #ccc; font-style: italic;}.table > tbody > tr.table-bottom-summary{font-weight: bold; background: #aaa;}</style>"
                },
                {
                    type: "section",
                    colClass: "col-sm-12",
                    "html": '<table class="table table-striped"> <colgroup> <col width="25%"> <col width="25%"> <col width="25%"> <col width="25%"> </colgroup> <thead> <tr> <th colspan="2">Assets</th> <th colspan="2">Liabilities</th> </tr></thead> <tbody> <tr class="table-sub-header"> <th colspan="2">{{"CURRENT_ASSETS" | translate}}</th> <th colspan="2">{{"CURRENT_LIABILITIES" | translate}}</th> </tr><tr> <td>{{"CASH_IN_BANK" | translate}}</td><td>{{model.assetsAndLiabilities.cashInBank}}</td><td>{{"PAYABLES" | translate}}</td><td>{{model.assetsAndLiabilities.payables}}</td></tr><tr> <td>{{"ACCOUNTS_RECEIVABLES" | translate}}</td><td>{{model.assetsAndLiabilities.accountsReceivable}}</td><td>{{"SHORT_TERM_DEBTS" | translate}}</td><td>{{model.assetsAndLiabilities.shortTermDebts}}</td></tr><tr> <td>{{"RAW_MATERIAL" | translate}}</td><td>{{model.assetsAndLiabilities.rawMaterial}}</td><td>{{"CURRENT_PORTION_OF_LONG_TERM_DEBT" | translate}}</td><td>{{model.assetsAndLiabilities.currentPortionOfLongTermDeb}}</td></tr><tr> <td>{{"WORK_IN_PROGRESS" | translate}}</td><td>{{model.assetsAndLiabilities.workInProgress}}</td><td>{{"FINISHED_GOODS" | translate}}</td><td>{{model.assetsAndLiabilities.finishedGoods}}</td></tr><tr> <td>{{"TOTAL_CURRENT_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalCurrentAssets}}</td><td>{{"TOTAL_CURRENT_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalCurrentLiabilities}}</td></tr><tr class="table-sub-header"> <th colspan="2">{{"FIXED_ASSETS" | translate}}</th> <th colspan="2">{{"LONG_TERM_LIABILITIES" | translate}}</th> </tr><tr> <td>{{"MACHINERY" | translate}}</td><td>{{model.assetsAndLiabilities.machinery}}</td><td>{{"LONGTERMDEBT" | translate}}</td><td>{{model.assetsAndLiabilities.longTermDebt}}</td></tr><tr> <td>{{"LAND" | translate}}</td><td>{{model.assetsAndLiabilities.land}}</td><td>{{"OWN_CAPITAL" | translate}}</td><td>{{model.assetsAndLiabilities.ownCapital}}</td></tr><tr> <td>{{"BUILDING" | translate}}</td><td>{{model.assetsAndLiabilities.building}}</td><td></td><td></td></tr><tr> <td>{{"VEHICLE" | translate}}</td><td>{{model.assetsAndLiabilities.vehicle}}</td><td></td><td></td></tr><tr> <td>{{"FURNITURE_AND_FIXING" | translate}}</td><td>{{model.assetsAndLiabilities.furnitureAndFixtures}}</td><td></td><td></td></tr><tr> <td>{{"TOTAL_FIXED_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalFixedAssets}}</td><td>{{"TOTAL_LONG_TERM_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalLengTermLiabilities}}</td></tr><tr> </tr><tr class="table-bottom-summary"> <th>{{"TOTAL_ASSETS" | translate}}</th> <th>{{model.assetsAndLiabilities.totalAssets}}</th> <th>{{"TOTAL_LIABILITIES" | translate}}</th> <th>{{model.assetsAndLiabilities.totalLiabilities}}</th> </tr></tbody></table>'
                }
            ]
        });
        
        form.push({
            type: "box",
            colClass: "col-sm-12",
            items: [
                {
                    type: "tableview",
                    key: "bankStatement.data",
                    title: model.bankStatement.title,
                    selectable: false,
                    paginate: false,
                    searching: false,
                    getColumns: function(){
                        return model.bankStatement.columns;
                    }
                }
            ]
        });

    }

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            model.ScoreDetails = [];
            model.customer = {};
            var $this = this;
            var deferred = $q.defer();
            
            if (_.hasIn(model, 'cbModel')){
                
                var p1 = Scoring.get({
                    auth_token:AuthTokenHelper.getAuthData().access_token,
                    LoanId:model.cbModel.loanId,
                    ScoreName:model.cbModel.scoreName
                },function(httpres){
                    model.ScoreDetails = httpres.ScoreDetails;

                    // this.form.push()
                },function (errResp){

                });

                var p2 = Scoring.financialSummary({loan_id: model.cbModel.loanId})
                    .$promise
                    .then(function(res){
                        model.scoreDetails = [res[1], res[2], res[3], res[4]];
                        model.sectorDetails = res[5];
                        model.subSectorDetails = res[6];
                        model.enterpriseDetails = res[0];
                        model.houseHoldPL = res[7];
                        model.businessPL = res[8];
                        model.balanceSheet = res[9];
                        model.bankStatement = res[10];
                        
                        prepareForms(model, $this.form);
                    })

                var p3 = Enrollment.getCustomerById({id:model.cbModel.customerId})
                    .$promise
                    .then(function(res){
                        model.customer = res;
                    }, function(httpRes){
                        PageHelper.showErrors(httpRes);
                    })
                    .finally(function(){
                        PageHelper.hideLoader();
                    })
                $q.all([p1,p2,p3]).finally(function(){
                    
                    deferred.resolve();
                })
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        },
        eventListeners: {
        },
        
        form: [
            {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "Business Summary",
                "readonly": true,
                "items": [
                    {
                        type: "section",
                        htmlClass: "row",
                        items: [
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                items: [
                                    {
                                        title: "Company Name",
                                        key: "business.firstName"
                                    },
                                    {
                                        title: "CONSTITUTION",
                                        key: "business.enterprise.businessConstitution",
                                        type: "select",
                                        enumCode: "constitution"
                                    },
                                    {
                                        title: "BUSINESS_SECTOR",
                                        key: "business.enterprise.businessSector",
                                        type: "select",
                                        enumCode: "businessSector",
                                        parentEnumCode: "businessType",
                                        parentValueExpr:"model.business.enterprise.businessType",
                                    },
                                    {
                                        key: "business.enterprise.businessSubsector",
                                        title: "BUSINESS_SUBSECTOR",
                                        type: "select",
                                        enumCode: "businessSubSector",
                                        parentEnumCode: "businessSector",
                                        parentValueExpr:"model.business.enterprise.businessSector",
                                    },
                                    {
                                       key: "loanAccount.productCategory",
                                       title:"PRODUCT_TYPE",
                                       condition:"model.currentStage!='Application'"
                                    }
                                ]
                            },
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                items: [
                                    {
                                        key: "business.customerBranchId",
                                        title:"BRANCH_NAME",
                                        type: "select",
                                        enumCode: "branch_id"
                                    },
                                    {
                                        key:"business.centreId",
                                        type:"select",
                                        title:"CENTRE_NAME",
                                        enumCode: "centre",
                                        parentValueExpr:"model.business.customerBranchId",
                                        parentEnumCode:"branch_id",
                                    },
                                    {
                                        key: "business.enterprise.monthlyTurnover",
                                        title: "MONTHLY_TURNOVER",
                                        type: "amount"
                                    },
                                    {
                                        key: "business.enterprise.monthlyBusinessExpenses",
                                        title: "MONTHLY_BUSINESS_EXPENSES",
                                        type: "amount"
                                    },
                                    {
                                        key: "business.enterprise.avgMonthlyNetIncome",
                                        title: "AVERAGE_MONTHLY_NET_INCOME",
                                        type: "amount"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        initializeUI: function(model, form, formCtrl, bundlePageObj, bundleModel) {
            var deferred = $q.defer();

            
            return deferred.promise;
            

            // Business Summary - starts
            var sFieldsLeft = [], sFieldsRight = [];
            // var bsCnt = Math.floor(model.businessSummary.length/2);
            // for (i = 0; i < bsCnt; i++) {
            //     var bs = model.businessSummary[i];
            //     model.businessSummaryFields[bs.key] = bs.value;
            //     sFieldsLeft.push({
            //         title: bs.key,
            //         key: "businessSummaryFields." + bs.key
            //     });
            // }
            // for (i = bsCnt; i < model.businessSummary.length; i++) {
            //     var bs = model.businessSummary[i];
            //     model.businessSummaryFields[bs.key] = bs.value;
            //     sFieldsRight.push({
            //         title: bs.key,
            //         key: "businessSummaryFields." + bs.key
            //     });
            // }
            // var businessSummaryForm = {
            //     type: "box",
            //     title: "Business Summary",
            //     colClass: "col-sm-12",
            //     "readonly": true,
            //     items: [
            //         {
            //             type: "section",
            //             htmlClass: "row",
            //             items: [
            //                 {
            //                     type: "section",
            //                     htmlClass: "col-sm-6",
            //                     items: sFieldsLeft
            //                 },
            //                 {
            //                     type: "section",
            //                     htmlClass: "col-sm-6",
            //                     items: sFieldsRight
            //                 }
            //             ]
            //         }
            //     ]
            // };
            // Business SUmmary - ends

            // Scores - starts
            var scoreForms = [];
            for (i in model.scoreDetails) {
                scoreForms.push({
                    type: "box",
                    items: [
                        {
                            type: "tableview",
                            key: "scoreDetails.data",
                            title: model.scoreDetails[i].title,
                            selectable: false,
                            paginate: false,
                            searching: false,
                            getColumns: function(){
                                return model.scoreDetails[i].columns;
                            }
                        }
                    ]
                });
            }
            // Scores - ends

            // Deviation & Mitigation - starts
            // var deviationForm = {
            //     type: "box",
            //     colClass: "col-sm-12",
            //     items: [
            //         {
            //             type: "tableview",
            //             key: "deviationDetails.data",
            //             title: model.deviationDetails[i].title,
            //             selectable: false,
            //             paginate: false,
            //             searching: false,
            //             getColumns: function(){
            //                 return model.deviationDetails[i].columns;
            //             }
            //         }
            //     ]
            // };
            // Deviation & Mitigation - ends

            // Sector & Sub-sector - starts
            var sectorDetailsForm = {
                type: "box",
                colClass: "col-sm-12",
                items: [
                    {
                        type: "tableview",
                        key: "sectorDetails.data",
                        title: model.sectorDetails.title,
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function(){
                            return model.sectorDetails.columns;
                        }
                    }
                ]
            };

            var subSectorDetailsForm = {
                type: "box",
                colClass: "col-sm-12",
                items: [
                    {
                        type: "tableview",
                        key: "subSectorDetails.data",
                        title: model.subSectorDetails.title,
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function(){
                            return model.subSectorDetails.columns;
                        }
                    }
                ]
            };
            // Sector & Sub-sector - ends

            // Loan recommendations - starts
            // var sectorSubSectorForm = {
            //     type: "box",
            //     colClass: "col-sm-12",
            //     items: [
            //         {
            //             type: "tableview",
            //             key: "sectorSubSectorDetails.data",
            //             title: model.sectorSubSectorDetails[i].title,
            //             selectable: false,
            //             paginate: false,
            //             searching: false,
            //             getColumns: function(){
            //                 return model.sectorSubSectorDetails[i].columns;
            //             }
            //         }
            //     ]
            // };
            // Loan recommendations - ends

            // this.form = [businessSummaryForm];
            // this.form.concat(scoreForms);
            // this.form.push(deviationForm);
            // this.form.push(sectorSubSectorForm);
            // this.form.concat(scoreForms);
            // this.form.push(sectorDetailsForm);
            // this.form.push(subSectorDetailsForm);

            deferred.resolve();
            return deferred.promise;
        },
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        eventListeners: {
            "business-loaded": function(bundleModel, pageModel, eventModel) {
                pageModel.business = eventModel.customer;
            },
            "loan-account-loaded": function(bundleModel, pageModel, eventModel) {
                pageModel.loanAccount = eventModel.loanAccount;
            },
        },
        actions: {
            save: function(customerId, CBType, loanAmount, loanPurpose){
                $log.info("Inside submit()");
                $log.warn(model);
            }
        }

    };
}

]);
