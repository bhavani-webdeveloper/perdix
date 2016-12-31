irf.pageCollection.factory(irf.page("loans.individual.screening.Summary"),
["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","Scoring","AuthTokenHelper", "BundleManager",
function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,Scoring,AuthTokenHelper,BundleManager){

    var HOUSEHOLD_PL_HTML = 
'<table class="table">'+
    '<colgroup>'+
        '<col width="30%"> <col width="40%"> <col width="30%">'+
    '</colgroup>'+
    '<tbody>'+
        '<tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> <th>{{household.income}}</th> </tr>'+
        '<tr> <td></td> <td>{{"SALARY_FROM_BUSINESS" | translate}}</td> <td>{{household.salaryFromBusiness}}</td> </tr>'+
        '<tr> <td></td> <td>{{"OTHER_INCOME_SALARIES" | translate}}</td> <td>{{household.otherIncomeSalaries}}</td> </tr>'+
        '<tr> <td></td> <td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td> <td>{{household.familyMemberIncomes}}</td> </tr>'+
        '<tr class="table-sub-header"> <th>{{"EXPENSES" | translate}}</th> <th></th> <th>{{household.Expenses}}</th> </tr>'+
        '<tr> <td></td> <td>{{"DECLARED_EDUCATIONAL_EXPENSE" | translate}}</td> <td>{{household.declaredEducationExpense}}</td> </tr>'+
        '<tr> <td></td> <td>{{"EMI_HOUSEHOLD_LIABILITIES" | translate}}</td> <td>{{household.emiHouseholdLiabilities}}</td> </tr>'+
        '<tr class="table-bottom-summary"> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td> <td></td> <td>{{household.netHouseholdIncome}}</td> </tr>'+
    '</tbody>'+
'</table>';

    var branch = SessionStore.getBranch();
    var scoreName;

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

        if (model.houseHoldPL_CoApplicant && model.houseHoldPL_CoApplicant.active) {
            model.pl.householdCoApplicant = {};
            model.pl.householdCoApplicant.income = model.houseHoldPL_CoApplicant.data[0]['Total Incomes'];
            model.pl.householdCoApplicant.salaryFromBusiness = model.houseHoldPL_CoApplicant.data[0]['Salary from business'];
            model.pl.householdCoApplicant.otherIncomeSalaries = model.houseHoldPL_CoApplicant.data[0]['Other Income/salaries'];
            model.pl.householdCoApplicant.familyMemberIncomes = model.houseHoldPL_CoApplicant.data[0]['Family Member Incomes'];
            model.pl.householdCoApplicant.Expenses = model.houseHoldPL_CoApplicant.data[0]['Total Expenses'];
            model.pl.householdCoApplicant.declaredEducationExpense = model.houseHoldPL_CoApplicant.data[0]['Expenses Declared or based on the educational expense whichever is higher'];
            model.pl.householdCoApplicant.emiHouseholdLiabilities = model.houseHoldPL_CoApplicant.data[0]['EMI\'s of household liabilities'];
            model.pl.householdCoApplicant.netHouseholdIncome = model.houseHoldPL_CoApplicant.data[0]['Net Household Income'];
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

        /* Scoring Sections */

        /* Populate seperate scoring section for ScreeningReview screen */
        // model.screeningScoreDetails = {
        //     columns: [
        //         {
        //             "title": "Parameter",
        //             "data": "Parameter"
        //         },
        //         {
        //             "title": "Actual Value",
        //             "data": "Actual Value"
        //         },
        //         {
        //             "title": "ParameterScore",
        //             "data": "ParameterScore"
        //         }
        //     ],
        //     data: []
        // };
        // // debugger;
        // if (_.hasIn(model.scoreDetails[0], "data") && _.isArray(model.scoreDetails[0].data) && model.scoreDetails[0].data.length > 0) {
        //     var score1Data = _.cloneDeep(model.scoreDetails[0].data, true);
        //     _.forEach(score1Data, function(data){
        //         data["Actual Value"] = data["Applicant"];
        //         delete data.Applicant;
        //         delete data["Co-Applicant"];
        //     });

        //     model.screeningScoreDetails.data = _.concat(model.screeningScoreDetails.data, score1Data);
        // }
        // if (_.hasIn(model.scoreDetails[1], "data") && _.isArray(model.scoreDetails[1].data) && model.scoreDetails[1].data.length > 0) {
        //     model.screeningScoreDetails.data = _.concat(model.screeningScoreDetails.data, model.scoreDetails[1].data);
        // }

        // debugger;


        for (var i=0;i< model.deviationDetails.data.length; i++){
            var d = model.deviationDetails.data[i];
            if (d.Mitigant && d.Mitigant.length!=00){
                if (d.Mitigant && d.Mitigant!=null){
                    d.ListOfMitigants = d.Mitigant.split("|");
                }
                
                if (d.ChosenMitigant && d.ChosenMitigant!=null){
                    d.ChosenMitigants = d.ChosenMitigant.split("|")
                }
                
            }
        }

        model.deviationParameter = [];
        for (var i=0;i< model.deviationDetails.data.length; i++){
            var d = model.deviationDetails.data[i];
            model.deviationParameter.push(_.cloneDeep(model.deviationDetails.data[i]));
            delete model.deviationParameter[model.deviationParameter.length-1].ListOfMitigants;
            delete model.deviationParameter[model.deviationParameter.length-1].Mitigant;
            model.deviationParameter[model.deviationParameter.length-1].mitigants = [];
            if (d.Mitigant && d.Mitigant.length!=00){
                d.ListOfMitigants = d.Mitigant.split("|");
                for (var j =0; j < d.ListOfMitigants.length; j++) {
                    model.deviationParameter[model.deviationParameter.length-1].mitigants.push({mitigantName:d.ListOfMitigants[j]});
                }
                
            }
        }
        model.additional = {};
        model.additional = {deviations:{deviationParameter: model.deviationParameter,scoreName:scoreName}};
        BundleManager.pushEvent('deviation-loaded', model._bundlePageObj, model.additional);

        $log.info("Karthik here");
        $log.info(model.additional);

        

        var bsLeft = [];
        var bsRight = [];
        model.enterpriseDetailsData = model.enterpriseDetails.data[0];

        var bsCounter = 0;
        _.forIn(model.enterpriseDetailsData, function(value, key){
            if (bsCounter++ % 2 ==0){
                bsLeft.push({
                    key: "enterpriseDetailsData." + key,
                    title: key,
                    type: "string",
                    readonly: true,
                })
            } else {
                bsRight.push({
                    key: "enterpriseDetailsData." + key,
                    title: key,
                    type: "string",
                    readonly: true
                })
            }
        })

        form.push({
            "type": "box",
                "colClass": "col-sm-12 table-box",
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
                                items: bsLeft
                            },
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                items: bsRight
                            }
                        ]
                    }
                ]
        })

        // form.push({
        //     "type": "box",
        //     "colClass": "col-sm-12",
        //     "title": "SCORING_DETAILS",
        //     "condition": "model.currentStage=='ScreeningReview'",
        //     "items": [
        //         {
        //             type:"tableview",
        //             key:"ScoreDetails[0].Parameters",
        //             // title:"SCORING_DETAILS",
        //             selectable: false,
        //             paginate: false,
        //             searching: false,
        //             getColumns: function(){
        //                 return [{
        //                     title: 'PARAMETER',
        //                     data: 'ParameterName'
        //                 }, {
        //                     title: 'VALUE',
        //                     data: 'UserInput'
        //                 }, {
        //                     title: 'SCORE',
        //                     data: 'ParamterScore'
        //                 },{
        //                     title: 'RESULT',
        //                     data: 'ParameterPassStatus'
        //                 }]
        //             }
        //         },
        //         {
        //             type:"fieldset",
        //             title:"",
        //             items:[
        //                 {
        //                     "key":"ScoreDetails[0].OverallWeightedScore",
        //                     "title":"TOTAL_SCREENING_SCORE",
        //                     readonly:true
        //                 },
        //                 {
        //                     "key":"ScoreDetails[0].OverallPassStatus",
        //                     "title":"OVERALL_PASS_STATUS",
        //                     readonly:true
        //                 }
        //             ]
        //         }
        //     ]
        // });
        
        form.push({
            type: "box",
            colClass: "col-sm-12 table-box",
            title: "SCORES",
            items: [
                {
                    type: "section",
                    htmlClass: "row",
                    html: '<div class="col-sm-3"><div class="stat-container" ><dd class="stat-key"> Total Score</dd><dt class="stat-value"> {{ model.ScoreDetails[0].OverallWeightedScore }}</dt></div></div><div class="col-sm-3"><div class="stat-container" ><dd class="stat-key"> Status</dd><dt class="stat-value" ng-class="{\'text-a-green\': model.ScoreDetails[0].OverallPassStatus==\'PASS\', \'text-a-red\': model.ScoreDetails[0].OverallPassStatus==\'FAIL\'}"> {{ model.ScoreDetails[0].OverallPassStatus }}</dt></div></div><div class="clearfix"></div><hr>'
                },
                {
                    type: "section",
                    htmlClass: "row",
                    items: [
                        {
                            type: "section",
                            htmlClass: "col-sm-6",
                            title: model.scoreDetails[0].title,
                            html: '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{model.scoreDetails[0].title}}({{model.totalScores.data[0][model.scoreDetails[0].title]}})</h3><table class="table"> <colgroup> <col width="50%"> <col width="10%"> <col width="40%"> </colgroup> <tbody> <tr> <th>Parameter Name</th> <th></th> <th>Actual Value</th> </tr><tr data-ng-repeat="data in model.scoreDetails[0].data"> <td>{{data["Parameter"]}}</td><td><span data-ng-if="data.ParameterScore >=0.0 && data.ParameterScore < 1.99 "> <span class="square-color-box bg-a-red"></span> </span> <span data-ng-if="data.ParameterScore >=2.0 && data.ParameterScore < 3.99 "> <span class="square-color-box bg-a-yellow"></span> </span> <span data-ng-if="data.ParameterScore >=4.0 && data.ParameterScore <=5.0 "> <span class="square-color-box bg-a-green"></span> </span></td><td>{{data.Applicant}}</td></tr></tbody></table>'
                        },
                        {
                            type: "section",
                            htmlClass: "col-sm-6",
                            title: model.scoreDetails[1].title,
                            html: '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{ model.scoreDetails[1].title }} ({{ model.totalScores.data[0][model.scoreDetails[1].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[1].data"><td>{{ data.Parameter }}</td><td> <span data-ng-if="data.ParameterScore >= 0.0 && data.ParameterScore < 1.99 "> <span class="square-color-box bg-a-red"></span> </span> <span data-ng-if="data.ParameterScore >= 2.0 && data.ParameterScore < 3.99 "> <span class="square-color-box bg-a-yellow"></span> </span> <span data-ng-if="data.ParameterScore >= 4.0 && data.ParameterScore <= 5.0 "> <span class="square-color-box bg-a-green"></span> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                        }
                    ]
                },
                {
                    type: "section",
                    htmlClass: "row",
                    items: [
                        {
                            type: "section",
                            htmlClass: "col-sm-6",
                            condition: "model.currentStage!='ScreeningReview'",
                            title: model.scoreDetails[2].title,
                            html: '<h3>{{ model.scoreDetails[2].title }} ({{ model.totalScores.data[0][model.scoreDetails[2].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[2].data"><td>{{ data.Parameter }}</td><td> <span data-ng-if="data.ParameterScore >= 0.0 && data.ParameterScore < 1.99 "> <span class="square-color-box bg-a-red"></span> </span> <span data-ng-if="data.ParameterScore >= 2.0 && data.ParameterScore < 3.99 "> <span class="square-color-box bg-a-yellow"></span> </span> <span data-ng-if="data.ParameterScore >= 4.0 && data.ParameterScore <= 5.0 "> <span class="square-color-box bg-a-green"></span> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                        },
                        {
                            type: "section",
                            htmlClass: "col-sm-6",
                            condition: "model.currentStage!='ScreeningReview'",
                            title: model.scoreDetails[3].title,
                            html: '<h3>{{ model.scoreDetails[3].title }} ({{ model.totalScores.data[0][model.scoreDetails[3].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[3].data"><td>{{ data.Parameter }}</td><td> <span data-ng-if="data.ParameterScore >= 0.0 && data.ParameterScore < 1.99 "> <span class="square-color-box bg-a-red"></span> </span> <span data-ng-if="data.ParameterScore >= 2.0 && data.ParameterScore < 3.99 "> <span class="square-color-box bg-a-yellow"></span> </span> <span data-ng-if="data.ParameterScore >= 4.0 && data.ParameterScore <= 5.0 "> <span class="square-color-box bg-a-green"></span> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                        }
                    ]
                }
                
            ]
        })

        // for (i in model.scoreDetails) {
        //     (function(i){
        //         form.push({
        //             type: "box",
        //             "colClass": "col-sm-6",
        //             title: model.scoreDetails[i].title + " (" + model.totalScores.data[0][model.scoreDetails[i].title] + ")",
        //             condition: "model.currentStage!='ScreeningReview'",
        //             items: [
        //                 {
        //                     type: "tableview",
        //                     key: "scoreDetails[" + i + "].data",
        //                     title: model.scoreDetails[i].title,
        //                     selectable: false,
        //                     paginate: false,
        //                     searching: false,
        //                     getColumns: function(){
        //                         return model.scoreDetails[i].columns;
        //                     }
        //                 }
        //             ]
        //         });
        //     })(i)
            
        //     // form.push()
        // }

        form.push({
            type: "box",
            colClass: "col-sm-12",
            condition: "model.currentStage!='ScreeningReview'",
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
            condition: "model.currentStage!='ScreeningReview'",
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
            colClass: "col-sm-12 table-box",
            title: "Household P&L Statement - Applicant",
            condition: "model.currentStage != 'ScreeningReview'",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<div ng-init="household = model.pl.household">' + HOUSEHOLD_PL_HTML + '</div>'
                }
            ]
        });
        
        if (model.pl.householdCoApplicant) {
            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "Household P&L Statement - Co-Applicant",
                condition: "model.currentStage != 'ScreeningReview'",
                items: [
                    {
                        type: "section",
                        colClass: "col-sm-12",
                        html: '<div ng-init="household = model.pl.householdCoApplicant">' + HOUSEHOLD_PL_HTML + '</div>'
                    }
                ]
            });
        }
        
        
        form.push({
            type: "box",
            colClass: "col-sm-12 table-box",
            title: "BUSINESS_PL",
            condition: "model.currentStage != 'ScreeningReview'",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html:
'<table class="table">'+
    '<colgroup>'+
        '<col width="30%"> <col width="40%"> <col width="30%"> <col width="10%">'+
    '</colgroup>'+
    '<tbody>'+
        '<tr class="table-sub-header"> <th>{{"REVENUE_TURNOVER" | translate}}</th> <th></th> <th></th> <th></th> </tr>'+
        '<tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.pl.business.invoice}}</td> <td>{{model.pl.business.invoicePCT}}</td> </tr>'+
        '<tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.pl.business.cashRevenue}}</td> <td>{{model.pl.business.cashRevenuePCT}}</td> </tr>'+
        '<tr> <td></td><td>{{"SCRAP_OR_ANY_BUSINESS_INCOME" | translate}}</td><td>{{model.pl.business.scrapIncome}}</td> <td>{{model.pl.business.scrapIncomePCT}}</td> </tr>'+
        '<tr class="table-sub-header"> <td>{{"TOTAL_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.pl.business.totalBusinessIncome}}</td> <td></td> </tr>'+
        '<tr> <td></td><td></td><td></td></tr><tr> <td>{{"PURCHASES" | translate}}</td><td></td><td>{{model.pl.business.purchases}}</td> <td>{{model.pl.business.purchasesPCT}}</td> </tr>'+
        '<tr class="table-sub-header"> <th>{{"GROSS_INCOME" | translate}}</th> <th></th> <th>{{model.pl.business.grossIncome}}</th> <th></th> </tr>'+
        '<tr> <td>{{"OPEX" | translate}}</td><td></td><td>{{model.pl.business.Opex}}</td> <td></td> </tr>'+
        '<tr> <td>{{"EBITDA" | translate}}</td><td></td><td>{{model.pl.business.EBITDA}}</td> <td>{{model.pl.business.EBITDA_PCT}}</td> </tr>'+
        '<tr> <th>{{"EXISTING_LOAN_PAYMENTS" | translate}}</th> <th></th> <th></td> <td></td> </tr>'+
        '<tr> <td></td><td>{{"BUSINESS_LIABILITIES" | translate}}</td><td>{{model.pl.business.businessLiabilities}}</td> <td></td> </tr>'+
        '<tr> <td>{{"NET_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.pl.business.netBusinessIncome}}</td> <td>{{model.pl.business.netBusinessIncomePCT}}</td> </tr>'+
        '<tr> <td>{{"KINARA_EMI" | translate}}</td><td></td><td>{{model.pl.business.kinaraEmi}}</td> <td>{{model.pl.business.kinaraEmiPCT}}</td> </tr>'+
        '<tr> <td>{{"NET_INCOME" | translate}}</td> <td></td> <td>{{model.pl.business.netIncome}}</td> <td></td> </tr>'+
        '<tr class="table-bottom-summary"> <td>Final Kinara EMI</td><td></td><td>{{model.pl.business.finalKinaraEmi}}</td> <td>{{model.pl.business.finalKinaraEmiPCT}}</td> </tr>'+
    '</tbody>'+
'</table>'
                }
            ]
        });

        form.push({
            type: "box",
            colClass: "col-sm-12 table-box",
            title: "BALANCE_SHEET",
            condition: "model.currentStage != 'ScreeningReview'",
            items: [
               
                {
                    type: "section",
                    colClass: "col-sm-12",
                    "html":
'<table class="table table-striped">'+
    '<colgroup><col width="25%">'+
        '<col width="25%"><col width="25%"><col width="25%">'+
    '</colgroup>'+
    '<thead>'+
        '<tr><th colspan="2">Assets</th><th colspan="2">Liabilities</th></tr>'+
    '</thead>'+
    '<tbody>'+
        '<tr class="table-sub-header"><th colspan="2">{{"CURRENT_ASSETS" | translate}}</th><th colspan="2">{{"CURRENT_LIABILITIES" | translate}}</th></tr>'+
        '<tr><td>{{"CASH_IN_BANK" | translate}}</td><td>{{model.assetsAndLiabilities.cashInBank}}</td><td>{{"PAYABLES" | translate}}</td><td>{{model.assetsAndLiabilities.payables}}</td></tr>'+
        '<tr><td>{{"ACCOUNTS_RECEIVABLES" | translate}}</td><td>{{model.assetsAndLiabilities.accountsReceivable}}</td><td>{{"SHORT_TERM_DEBTS" | translate}}</td><td>{{model.assetsAndLiabilities.shortTermDebts}}</td></tr>'+
        '<tr><td>{{"RAW_MATERIAL" | translate}}</td><td>{{model.assetsAndLiabilities.rawMaterial}}</td><td>{{"CURRENT_PORTION_OF_LONG_TERM_DEBT" | translate}}</td><td>{{model.assetsAndLiabilities.currentPortionOfLongTermDeb}}</td></tr>'+
        '<tr><td>{{"WORK_IN_PROGRESS" | translate}}</td><td>{{model.assetsAndLiabilities.workInProgress}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FINISHED_GOODS" | translate}}</td><td>{{model.assetsAndLiabilities.finishedGoods}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"TOTAL_CURRENT_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalCurrentAssets}}</td><td>{{"TOTAL_CURRENT_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalCurrentLiabilities}}</td></tr>'+
        '<tr class="table-sub-header"><th colspan="2">{{"FIXED_ASSETS" | translate}}</th><th colspan="2">{{"LONG_TERM_LIABILITIES" | translate}}</th></tr><tr><td>{{"MACHINERY" | translate}}</td><td>{{model.assetsAndLiabilities.machinery}}</td><td>{{"LONGTERMDEBT" | translate}}</td><td>{{model.assetsAndLiabilities.longTermDebt}}</td></tr>'+
        '<tr><td>{{"LAND" | translate}}</td><td>{{model.assetsAndLiabilities.land}}</td><td>{{"OWN_CAPITAL" | translate}}</td><td>{{model.assetsAndLiabilities.ownCapital}}</td></tr><tr><td>{{"BUILDING" | translate}}</td><td>{{model.assetsAndLiabilities.building}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"VEHICLE" | translate}}</td><td>{{model.assetsAndLiabilities.vehicle}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FURNITURE_AND_FIXING" | translate}}</td><td>{{model.assetsAndLiabilities.furnitureAndFixtures}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"TOTAL_FIXED_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalFixedAssets}}</td><td>{{"TOTAL_LONG_TERM_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalLengTermLiabilities}}</td></tr><tr></tr>'+
        '<tr class="table-bottom-summary"><th>{{"TOTAL_ASSETS" | translate}}</th><th>{{model.assetsAndLiabilities.totalAssets}}</th><th>{{"TOTAL_LIABILITIES" | translate}}</th><th>{{model.assetsAndLiabilities.totalLiabilities}}</th></tr>'+
    '</tbody>'+
'</table>'
                }
            ]
        });

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: "BANK_ACCOUNTS",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<div ng-repeat="bankAccount in model.bankAccountDetails.BankAccounts"><table class="table table-condensed" style="width:50%"><colgroup><col width="40%"><col width="60%"></colgroup><tbody><tr class="table-sub-header"><td>{{ "ACCOUNT_NAME" | translate }}</td><td>{{ bankAccount["Account Holder Name"] }}</td></tr><tr><td> {{ "LOAN_RELATION" | translate }}</td><td>{{ bankAccount["Customer Relation"] }}</td></tr><tr><td>{{ "ACCOUNT_TYPE" | translate }}</td><td>{{ bankAccount["Account Type"] }}</td></tr><tr><td>{{ "BANK_NAME" | translate }}</td><td>{{ bankAccount["Bank Name"] }}</td></tr><tr><td>{{ "IFS_CODE" | translate }}</td><td>{{ bankAccount["IFS Code"] }}</td></tr><tr><td>{{ "LIMIT" | translate }}</td><td>{{ bankAccount["Limit"] }}</td></tr></tbody></table><div class="clearfix"></div><table class="table table-condensed"><colgroup><col width="20%"><col width="20%"><col width="20%"><col width="20%"><col width="20%"></colgroup><thead><tr><th> {{ "MONTH" | translate }}</th><th> {{ "BANK_BALANCE" | translate }}</th><th> {{ "DEPOSITS" | translate }}</th><th> {{ "EMI_BOUNCED" | translate }}</th><th> {{ "NON_EMI_BOUNCED" | translate }}</th></tr></thead><tbody><tr ng-repeat="bankStatement in bankAccount.BankStatements"><td>{{ bankStatement["Month"] }}</td><td>{{ bankStatement["Balance"] | currency : "" : 2 }}</td><td>{{ bankStatement["Deposits"] | currency : "" : 2 }}</td><td>{{ bankStatement["EMI Bounced"] }}</td><td>{{ bankStatement["Non-EMI Cheque Bounced"] }}</td></tr><tr class="top-bar with-bold"><td></td><td>{{ "AVERAGE_BANK_BALANCE" | translate }} <br /> {{ bankAccount["Average Bank Balance"] | currency : "" : 2 }}</td><td>{{ "AVERAGE_BANK_DEPOSIT" | translate }} <br /> {{ bankAccount["Average Bank Deposit"] | currency : "" : 2 }}</td><td>{{ "TOTAL_EMI_BOUNCED" | translate }} <br /> {{ bankAccount["Total EMI Bounced"] }}</td><td>{{ "TOTAL_CHEQUEU_BOUNCED_NON_EMI" | translate }} <br /> {{ bankAccount["Total Cheque Bounced (Non EMI)"] }}</td></tr></tbody></table> <br/><hr class="dotted"> <br/></div>'
                }
            ]
        });

        form.push({
            type: "box",
            colClass: "col-sm-12 table-box",
            title: "DEVIATION_AND_MITIGATIONS",
            condition: "model.currentStage != 'ScreeningReview'",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"><col width="30%"><col width="30"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th><th>Chosen Mitigant</th></tr></thead><tbody><tr ng-repeat="rowData in model.deviationDetails.data"><td>{{ rowData["Parameter"] }}</td><td><span data-ng-if="rowData.ParameterScore >= 0.0 && rowData.ParameterScore < 1.99 "> <span class="square-color-box bg-a-red"></span> </span> <span data-ng-if="rowData.ParameterScore >= 2.0 && rowData.ParameterScore < 3.99 "> <span class="square-color-box bg-a-yellow"></span> </span> <span data-ng-if="rowData.ParameterScore >= 4.0 && rowData.ParameterScore <= 5.0 "> <span class="square-color-box bg-a-green"></span> </span></td><td>{{ rowData["Deviation"] }}</td><td><ol><li ng-repeat="m in rowData.ListOfMitigants"> {{ m }}</li></ol></td><td><ol><li ng-repeat="m in rowData.ChosenMitigants"> {{ m }}</li></ol></td></tr></tbody></table>'
                }
            ]
        });

        // form.push({
        //     type: "box",
        //     colClass: "col-sm-12 table-box",
        //     title: "BUSINESS_SUMMARY",
        //     condition: "model.currentStage != 'ScreeningReview'",
        //     items: [
        //         {
        //             type: "section",
        //             colClass: "col-sm-12",
        //             html: '<table class="table"><colgroup><col width="50%"><col width="50%"></colgroup><tbody><tr><td><table class="table"><colgroup><col width="50%"><col width="50%"></colgroup><tbody><tr><th></th><th></th></tr><tr ng-repeat="(key, value) in model.enterpriseDetails.data[0] track by $index" ng-if="$index%2==0"><td> {{ key }}</td><td> {{ value }}</td></tr></tbody></table></td><td><table class="table"><colgroup><col width="50%"><col width="50%"></colgroup><tbody><tr><th></th><th></th></tr><tr ng-repeat="(key, value) in model.enterpriseDetails.data[0] track by $index" ng-if="$index%2==1"><td> {{ key }}</td><td> {{ value }}</td></tr></tbody></table></td></tr></tbody></table>'
        //         }
        //     ]
        // })
        
        // form.push({
        //     type: "box",
        //     colClass: "col-sm-12",
        //     items: [
        //         {
        //             type: "tableview",
        //             key: "bankStatement.data",
        //             title: model.bankStatement.title,
        //             selectable: false,
        //             paginate: false,
        //             searching: false,
        //             getColumns: function(){
        //                 return model.bankStatement.columns;
        //             }
        //         }
        //     ]
        // });

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

            scoreName = null;
            switch(model.currentStage){
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

            if (bundlePageObj){
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
            }
            
            if (_.hasIn(model, 'cbModel')){
                
                var p1 = Scoring.get({
                    auth_token: AuthTokenHelper.getAuthData().access_token,
                    LoanId: model.cbModel.loanId,
                    ScoreName: scoreName
                })
                .$promise
                .then(function(response){
                    model.ScoreDetails = response.ScoreDetails;
                })
                .finally(function(){
                    var onSuccessPromise = Scoring.financialSummary({loan_id: model.cbModel.loanId, score_name: scoreName})
                        .$promise;
                    onSuccessPromise
                        .then(function(res){
                            model.enterpriseDetails = res[0];
                            model.scoreDetails = [res[1], res[2], res[3], res[4]];
                            model.sectorDetails = res[5];
                            model.subSectorDetails = res[6];
                            model.houseHoldPL = res[7];
                            model.businessPL = res[8];
                            model.balanceSheet = res[9];
                            model.bankAccountDetails = res[10];
                            model.totalScores = res[11];
                            model.deviationDetails = res[12];
                            model.deviationParameter = res[12];
                            model.ratioDetails = res[13];
                            model.houseHoldPL_CoApplicant = res[14];

                            model.enterpriseDetails.columns = model.enterpriseDetails.columns.concat(model.ratioDetails.columns);
                            _.merge(model.enterpriseDetails.data[0], model.ratioDetails.data[0]);
                            prepareForms(model, $this.form);
                        })
                    return onSuccessPromise;
                })
                ;

                // var p2 = Scoring.financialSummary({loan_id: model.cbModel.loanId})
                //     .$promise
                //     .then(function(res){
                //         model.scoreDetails = [res[1], res[2], res[3], res[4]];
                //         model.sectorDetails = res[5];
                //         model.subSectorDetails = res[6];
                //         model.enterpriseDetails = res[0];
                //         model.houseHoldPL = res[7];
                //         model.businessPL = res[8];
                //         model.balanceSheet = res[9];
                //         model.bankStatement = res[10];
                        
                //         prepareForms(model, $this.form);
                //     })

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
                $q.all([p1,p3]).finally(function(){
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
