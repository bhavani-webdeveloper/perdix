irf.pageCollection.directive("irfSimpleSummaryTable", function(){

    return {
        restrict: 'E',
        scope: {  tableData : '=irfTableDef'},
        templateUrl: 'process/pages/templates/simple-summary-table.html',
        controller: 'irfSimpleSummaryTableController'
    }
}).controller("irfSimpleSummaryTableController", ["$scope","$compile","$element", function($scope,$compile,element){

            $scope.getStyleClass = function(column, record){

                var styleClass = [];

                if(record && record.data && angular.isObject(record.data)){

                    if(record.weight === "bold"){
                        styleClass.push('bold');
                    }

                }

                if($scope.getDisplayFormat(column, record) === "currency"){
                    styleClass.push('currency');
                }

                if(column.weight === "bold" && styleClass.indexOf('bold') === -1){
                    styleClass.push('bold');
                }

                return styleClass;
            }

            $scope.getDisplayFormat = function(column, record){

                var displayFormat = column.format;

                if(record && record.data && angular.isObject(record.data)){

                    return (record.overrides && record.overrides.format && angular.isObject(record.overrides.format)) ?
                    (record.overrides.format[column.data] ? record.overrides.format[column.data] : displayFormat) : displayFormat;

                }

                return displayFormat;
            }
            $scope.renderHtml = function(column,record,e){
                $compile(element.contents())($scope);
            }

}]);
irf.pageCollection.directive('renderHtml',function($compile){
    return{
        restrict: 'A',
        replace: true,
        scope:{
            col : '=col',
            record : '=record'
        },
        link:function(scope,ele,attrs){
            if (scope.col.condition){
                var value = scope.$eval(scope.col.condition,scope.record);
                if(value){
                    ele.html(scope.col.data);
                    $compile(ele.contents())(scope);
                }
                
            }
            else{
                ele.html(scope.col.data);
                $compile(ele.contents())(scope);
            }            
        }
    }
})
irf.pageCollection.directive("irfScoringDisplay", function(){

    return {
        restrict: 'E',
        scope: {  scoringData : '=irfScoringData'},
        templateUrl: 'process/pages/templates/irf-scoring-display.html',
        controller: 'irfScoringDisplayController'
    }
}).controller("irfScoringDisplayController", ["$scope", function($scope){
    var _tData = {
        "IndividualScores": [],
        "OtherScores": [],
        "OverAllScore":{}
    };
    var sd = $scope.scoringData.SubscoreDetails;
    var ss = $scope.scoringData.SubscoreScores;
    _tData.OverAllScore = $scope.scoringData.ScoreCalculationDetails;
    _.forOwn(sd, function(v,k){
        var _vsd = {};
        _vsd['name'] = k;
        _vsd['isIndividualScore'] = false;
        _vsd['Score'] = ss[k];
        if ( _.has(v, '__isIndividualScore') && v['__isIndividualScore'] == 'YES') {
            _vsd['isIndividualScore'] = true;
        }
        // Data handling for non individual scores
        if (_vsd['isIndividualScore'] == false){
            _vsd['parameterData'] = v;
            _tData.OtherScores.push(_vsd);
        } else if (_vsd['isIndividualScore'] == true){
            _vsd['customerParameterMapping'] = {};
            _vsd['parameters'] = [];

            var cids = v['CustomerIds'];

            for (var i=0;i<cids.length; i++){
                var _id = cids[i];
                if (!_id)
                    continue;
                _vsd['customerParameterMapping'][_id] = {
                    'Details' : v[_id].CustomerDetails,
                    'Parameters': {}
                };

                _.forEach(v[_id].data, function(pData){
                    _vsd['customerParameterMapping'][_id]['Parameters'][pData['Parameter']] = pData;
                    if (_vsd['parameters'].indexOf(pData['Parameter'])<0){
                        _vsd['parameters'].push(pData['Parameter']);
                    }
                })
            }
            _vsd['customerParameterMapping'] = _.sortBy(_vsd['customerParameterMapping'], [function(o) { return o.Details.Relation; }]);
            _tData.IndividualScores.push(_vsd);
        }
        
    })

    $scope.scoringTableData = _tData;
}]);

irf.pageCollection.directive("irfScoringDisplay", function(){

    return {
        restrict: 'E',
        scope: {  scoringData : '=irfScoringData'},
        templateUrl: 'process/pages/templates/irf-scoring-display.html',
        controller: 'irfScoringDisplayController'
    }
}).controller("irfScoringDisplayController", ["$scope", function($scope){
    var _tData = {
        "IndividualScores": [],
        "OtherScores": [],
        "OverAllScore":{}
    };
    var sd = $scope.scoringData.SubscoreDetails;
    var ss = $scope.scoringData.SubscoreScores;
    _tData.OverAllScore = $scope.scoringData.ScoreCalculationDetails;
    _.forOwn(sd, function(v,k){
        var _vsd = {};
        _vsd['name'] = k;
        _vsd['isIndividualScore'] = false;
        _vsd['Score'] = ss[k];
        if ( _.has(v, '__isIndividualScore') && v['__isIndividualScore'] == 'YES') {
            _vsd['isIndividualScore'] = true;
        }
        // Data handling for non individual scores
        if (_vsd['isIndividualScore'] == false){
            _vsd['parameterData'] = v;
            _tData.OtherScores.push(_vsd);
        } else if (_vsd['isIndividualScore'] == true){
            _vsd['customerParameterMapping'] = {};
            _vsd['parameters'] = [];

            var cids = v['CustomerIds'];

            for (var i=0;i<cids.length; i++){
                var _id = cids[i];
                if (!_id)
                    continue;
                _vsd['customerParameterMapping'][_id] = {
                    'Details' : v[_id].CustomerDetails,
                    'Parameters': {}
                };

                _.forEach(v[_id].data, function(pData){
                    _vsd['customerParameterMapping'][_id]['Parameters'][pData['Parameter']] = pData;
                    if (_vsd['parameters'].indexOf(pData['Parameter'])<0){
                        _vsd['parameters'].push(pData['Parameter']);
                    }
                })
            }
            _vsd['customerParameterMapping'] = _.sortBy(_vsd['customerParameterMapping'], [function(o) { return o.Details.Relation; }]);
            _tData.IndividualScores.push(_vsd);
        }
        
    })

    $scope.scoringTableData = _tData;
}]);


irf.pageCollection.factory(irf.page("loans.individual.screening.Summary"),
["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","Scoring","AuthTokenHelper", "BundleManager","filterFilter",
function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,Scoring,AuthTokenHelper,BundleManager,filterFilter){

    var branch = SessionStore.getBranch();
    var scoreName;

    function removeNullIn(prop, obj) {		
        var pr = obj[prop];		
        if (pr === null || pr === undefined) delete obj[prop];		
        else if (typeof pr === 'object') for (var i in pr) removeNullIn(i, pr);		
    }
    var prepareData = function(res, model) {
        if (res[0].data[0]['Existing Customer'] == 'No') {
            model.existingCustomerStr = "New Customer";
        } else {
            model.existingCustomerStr = "Existing Customer";
        }
        model.enterpriseDetails = res[0];
        model.scoreDetails = [res[1], res[2], res[3], res[4]];
        model.c = res[25].summary;
        model.fullScoringDetails = res[26].data;
        //model.scoreDetails[3].data.push({Parameter:"Hypothecation Status",color_hexadecimal:model.c.status,"Actual Value" :model.c.ActualValue})

        // model.secName = res[0].data[0]['Sector'];
        // model.subSecName = res[0].data[0]['Sub-Sector'];

        var managementScore = model.scoreDetails[0];
        if (_.isArray(managementScore.sections)) {
            var count = managementScore.sections.length;
            var spacePct = 75 / count;

            managementScore.values = [];
            for (var i = 0; i < managementScore.sections.length; i++) managementScore.values[i] = i;
            managementScore.colorPct = spacePct / 5;
            managementScore.valuePct = spacePct * 4 / 5;
        }

        //model.sectorDetails = res[5];
        model.sectorDetails = res[5];
        // model.secData = model.sectorDetails.data[0];

        // model.subSectorDetails = res[6];
        // model.subsecData = model.subSectorDetails.data[0];
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
        model.stockDetails = res[23];
        model.nonMachineryDetails = res[24];
        model.hypothecationType = res[25];

        model.enterpriseDetails.columns = model.enterpriseDetails.columns.concat(model.ratioDetails.columns);
        model.ratioDetails.data[0] = _.omit(model.ratioDetails.data[0],['Average Bank Deposit']);
        model.enterpriseDetails.data[0] = _.omit(model.enterpriseDetails.data[0],['Average Bank Balances']);
   
        var tempRatioDetails=model.ratioDetails.data[0];		    
    //  _.merge(model.enterpriseDetails.data[0],model.ratioDetails.data[0]);
        for (var i in tempRatioDetails) {		
            removeNullIn(i, tempRatioDetails);		
        }		
        _.merge(model.enterpriseDetails.data[0], tempRatioDetails);

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
        model.assetsAndLiabilities.furniture = model.balanceSheet.data[0]['Furniture'];
        model.assetsAndLiabilities.fixture = model.balanceSheet.data[0]['Fixtures'];
        model.assetsAndLiabilities.totalFixedAssets = model.balanceSheet.data[0]['Total fixed assets'];
        model.assetsAndLiabilities.totalLengTermLiabilities = model.balanceSheet.data[0]['Total long-term liabilities'];
        model.assetsAndLiabilities.totalAssets = model.balanceSheet.data[0]['Total Assets'];
        model.assetsAndLiabilities.totalLiabilities = model.balanceSheet.data[0]['Total Liabilities'];

        model.pl  = {
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

        if(model.houseHoldPL && model.houseHoldPL.length){
            for (var i=0; i<model.houseHoldPL.length; i++){
                model.pl.household.push({
                    income : model.houseHoldPL[i].data[0]['Total Incomes'],
                    salaryFromBusiness : model.houseHoldPL[i].data[0]['Salary from business'],
                    otherIncomeSalaries : model.houseHoldPL[i].data[0]['Other Income/salaries'],
                    familyMemberIncomes : model.houseHoldPL[i].data[0]['Family Member Incomes'],
                    Expenses : model.houseHoldPL[i].data[0]['Total Expenses'],
                    declaredEducationExpense : model.houseHoldPL[i].data[0]['Expenses Declared or based on the educational expense whichever is higher'],
                    emiHouseholdLiabilities : model.houseHoldPL[i].data[0]['EMI\'s of household liabilities'],
                    netHouseholdIncome : model.houseHoldPL[i].data[0]['Net Household Income']
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

        // model.workingCapital1 = model.ratioDetails.data[0]['Working Capital 1 - Quick Check'];
        // model.workingCapital2 = model.ratioDetails.data[0]['Working Capital 2'];

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
            if (d.Mitigant && d.Mitigant.length!=0){
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
            if (d.Mitigant && d.Mitigant.length!=0){
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

        model.enterpriseDetailsData = model.enterpriseDetails.data[0];
        model.enterpriseDetailsData["Hypothecation Type"] = model.hypothecationType.data[0]["Hypothecation Type"];

    }; // END OF prepareData()

    var computeScoringData = function(model, scoreName, deferred){
        var api = Scoring.get;
        var params = {
            auth_token: AuthTokenHelper.getAuthData().access_token,
            LoanId: model.cbModel.loanId,
            ScoreName: scoreName,
            isScoringOptimizationEnabled: model.isScoringOptimizationEnabled
        };

        if(model.isScoringV2ApiEnabled){
            api = Scoring.getV2;
            params = {
                auth_token: AuthTokenHelper.getAuthData().access_token,
                LoanId: model.cbModel.loanId,                ScoreName: scoreName,
                isScoringOptimizationEnabled: model.isScoringOptimizationEnabled
            }
        }

        api(params).$promise.then(function(response){
            model.ScoreDetails = response.ScoreDetails;
        }).finally(function(){
            var onSuccessPromise = Scoring.financialSummary({
                loan_id: model.cbModel.loanId, 
                score_name: model.ScoreDetails.ScoreName || scoreName
            }).$promise;
            onSuccessPromise.then(function(res){
                BundleManager.pushEvent('financialSummary', model._bundlePageObj, res);
                prepareData(res, model);
                model.$prepared = true;
                prepareDataDeferred.resolve();
            });

            var p3 = Enrollment.getCustomerById({id:model.cbModel.customerId}).$promise.then(function(res) {
                model.customer = res;
            }, function(httpRes) {
                PageHelper.showErrors(httpRes);
            }).finally(function() {
            });

            $q.all([onSuccessPromise, p3]).finally(function() {
                deferred.resolve();
            });
        });
    }

    var HOUSEHOLD_PL_HTML =
    '<table class="table">'+
        '<colgroup>'+
            '<col width="30%"> <col width="40%"> <col width="30%">'+
        '</colgroup>'+
        '<tbody>'+
            '<tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> <th>{{household.income | irfCurrency}}</th> </tr>'+
            '<tr> <td></td> <td>{{"SALARY_FROM_BUSINESS" | translate}}</td> <td>{{household.salaryFromBusiness | irfCurrency}}</td> </tr>'+
            '<tr> <td></td> <td>{{"OTHER_INCOME_SALARIES" | translate}}</td> <td>{{household.otherIncomeSalaries | irfCurrency}}</td> </tr>'+
            '<tr> <td></td> <td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td> <td>{{household.familyMemberIncomes | irfCurrency}}</td> </tr>'+
            '<tr class="table-sub-header"> <th>{{"EXPENSES" | translate}}</th> <th></th> <th>{{household.Expenses | irfCurrency}}</th> </tr>'+
            '<tr> <td></td> <td>{{"DECLARED_EDUCATIONAL_EXPENSE" | translate}}</td> <td>{{household.declaredEducationExpense | irfCurrency}}</td> </tr>'+
            '<tr> <td></td> <td>{{"EMI_HOUSEHOLD_LIABILITIES" | translate}}</td> <td>{{household.emiHouseholdLiabilities | irfCurrency}}</td> </tr>'+
            '<tr class="table-bottom-summary"> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td> <td></td> <td>{{household.netHouseholdIncome | irfCurrency}}</td> </tr>'+
        '</tbody>'+
    '</table>';

    var prepareForms = function(model) {
        var form = [];

        var bsCounter = 0;
        var bsLeft = [];
        var bsRight = [];
        var bsCounter = 0;
        _.forIn(model.enterpriseDetailsData, function(value, key){
            var item = {
                key: "enterpriseDetailsData." + key,
                title: (key.charAt(0).toUpperCase()+key.slice(1)).replace(/_/g, ' '),
                type: "string",
                readonly: true,
            };

            if (key == "FRO Remarks"){
                item.type = "section";
                item.htmlClass = "row";
                item.html = "<div><label class = 'col-sm-4' style = 'text-align: right;'>FRO Remarks</label><div style = 'font-weight: bold;'  class = 'col-sm-8'>{{model.enterpriseDetailsData['FRO Remarks']}}</div></div>";
            }
            if (bsCounter++ % 2 ==0){
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
        });

        form.push({
            "type": "box",
                "colClass": "col-sm-12 table-box",
                "title": "Business Summary",
                "readonly": true,
                condition: " model.siteCode != 'IREPDhan'",
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
        
        if (model.fullScoringDetails){
            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "Scores - "+ model.fullScoringDetails.ScoreCalculationDetails.ScoreName,
                items: [
                    {
                        "type": "section",
                        "htmlClass": "row",
                        "html":"<irf-scoring-display irf-scoring-data='model.fullScoringDetails' />"
                    }
                ]
            })
        }
        
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

        // for (i in model.psychometricScores) {
            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "Psychometric Scores",
                condition: "model.currentStage != 'ScreeningReview' && model.siteCode != 'IREPDhan'",
                items: [
                    {
                        type: "section",
                        colClass: "col-sm-12",
                        html:
                        // '\
                        // <table class="table">\
                        //     <colgroup>\
                        //         <col width="60%">\
                        //         <col width="20%">\
                        //         <col width="20%">\
                        //     </colgroup>\
                        //     <thead>\
                        //         <tr>\
                        //             <th>Category</th>\
                        //             <th>Score</th>\
                        //         </tr>\
                        //     </thead>\
                        //     <tbody>\
                        //         <tr ng-repeat="rowData in model.psychometricScores['+i+'].data">\
                        //             <td>{{ rowData["Category Name"] }}</td>\
                        //             <td style="background: {{ rowData.color_hexadecimal }}"></td>\
                        //             <td>{{ rowData["Score"] }}</td>\
                        //         </tr>\
                        //     </tbody>\
                        // </table>\
                        // <strong>Total Score </strong> &nbsp; &nbsp; {{ model.psychometricScores['+i+'].summary["Total Score"] }} <br />\
                        // <strong>Test Attempt Time </strong> &nbsp; &nbsp; {{ model.psychometricScores['+i+'].summary["Test Attempt Time"] }} <br />\
                        // <strong>Attempt Language </strong> &nbsp; &nbsp; {{ model.psychometricScores['+i+'].summary["Attempt Language"] }} <br />'
                        '<div ng-init="_scores=model.psychometricScores">'+
    //'<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{_score.title}} ({{model.totalScores.data[0][_score.title]}})</h3>'+
    '<table class="table table-responsive">'+
        // '<colgroup>'+
        //     '<col width="25%">'+
        //     '<col width="{{_score.colorPct}}%" ng-repeat-start="i in _score.values">'+
        //     '<col width="{{_score.valuePct}}%" ng-repeat-end>'+
        // '</colgroup>'+
        '<tbody>'+
            '<tr>'+
                '<th>Parameter Name</th>'+
                '<th>Cut Off Score</th>'+
                '<th colspan="2" ng-repeat="_score in _scores">{{_score.relation_detail}}</th>'+
            '</tr>'+
            '<tr ng-repeat=" (key, value) in _scores[0].data" ng-init="parameterIndex=$index">'+
                '<td >{{key}}</td>'+
                '<td >{{value["Cut Off Score"]}}</td>' +
                '<td ng-repeat-start="_score in _scores"> <span class="square-color-box" style="background:{{_score.data[key].color_hexadecimal}}"> </span></td>'+
               '<td ng-repeat-end>{{_score.data[key].Score}}</td></tr>'+

            '<tr ng-repeat=" (key, value) in _scores[0].summary" ng-init="parameterIndex=$index">'+
                '<td >{{key}}</td>'+
                '<td ></td>' +
                '<td ng-repeat-start="_score in _scores"></td>' +
                '<td ng-repeat-end ng-style = "key === \'Total Score\' ?{\'font-weight\': \'bold\'} : {}"> {{_score.summary[key]}}</td>'+
        '</tbody>'+
    '</table>'+
'</div>'
                    }
                ]
            })
       // }

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

        for (var i=0;i<model.pl.household.length; i++){
            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "Household P&L Statement - " + model.houseHoldPL[i].relation_detail,
                condition: "model.currentStage != 'ScreeningReview'",
                items: [
                    {
                        type: "section",
                        colClass: "col-sm-12",
                        html: '<div ng-init="household = model.pl.household['+ i +']">' + HOUSEHOLD_PL_HTML + '</div>'
                    }
                ]
            });
        }

        // form.push({
        //     type: "box",
        //     colClass: "col-sm-12 table-box",
        //     title: "Household P&L Statement - Applicant",
        //     condition: "model.currentStage != 'ScreeningReview'",
        //     items: [
        //         {
        //             type: "section",
        //             colClass: "col-sm-12",
        //             html: '<div ng-init="household = model.pl.household">' + HOUSEHOLD_PL_HTML + '</div>'
        //         }
        //     ]
        // });

        // if (model.pl.householdCoApplicant) {
        //     form.push({
        //         type: "box",
        //         colClass: "col-sm-12 table-box",
        //         title: "Household P&L Statement - Co-Applicant",
        //         condition: "model.currentStage != 'ScreeningReview'",
        //         items: [
        //             {
        //                 type: "section",
        //                 colClass: "col-sm-12",
        //                 html: '<div ng-init="household = model.pl.householdCoApplicant">' + HOUSEHOLD_PL_HTML + '</div>'
        //             }
        //         ]
        //     });
        // }


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
        '<tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.pl.business.invoice | irfCurrency}}</td> <td>{{model.pl.business.invoicePCT}}</td> </tr>'+
        '<tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.pl.business.cashRevenue | irfCurrency}}</td> <td>{{model.pl.business.cashRevenuePCT}}</td> </tr>'+
        '<tr> <td></td><td>{{"SCRAP_OR_ANY_BUSINESS_INCOME" | translate}}</td><td>{{model.pl.business.scrapIncome | irfCurrency}}</td> <td>{{model.pl.business.scrapIncomePCT }}</td> </tr>'+
        '<tr class="table-sub-header"> <td>{{"TOTAL_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.pl.business.totalBusinessIncome | irfCurrency}}</td> <td></td> </tr>'+
        '<tr> <td></td><td></td><td></td></tr><tr> <td>{{"PURCHASES" | translate}}</td><td></td><td>{{model.pl.business.purchases | irfCurrency}}</td> <td>{{model.pl.business.purchasesPCT }}</td> </tr>'+
        '<tr class="table-sub-header"> <th>{{"GROSS_INCOME" | translate}}</th> <th></th> <th>{{model.pl.business.grossIncome | irfCurrency}}</th> <th></th> </tr>'+
        '<tr> <td>{{"OPEX" | translate}}</td><td></td><td>{{model.pl.business.Opex | irfCurrency}}</td> <td></td> </tr>'+
        '<tr> <td><strong>{{"EBITDA" | translate}}</strong></td><td></td><td><strong>{{model.pl.business.EBITDA | irfCurrency}}</strong></td> <td>{{model.pl.business.EBITDA_PCT }}</td> </tr>'+
        '<tr> <th>{{"EXISTING_LOAN_PAYMENTS" | translate}}</th> <th></th> <th></td> <td></td> </tr>'+
        '<tr> <td></td><td>{{"BUSINESS_LIABILITIES" | translate}}</td><td>{{model.pl.business.businessLiabilities | irfCurrency}}</td> <td></td> </tr>'+
        '<tr> <td>{{"NET_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.pl.business.netBusinessIncome | irfCurrency}}</td> <td>{{model.pl.business.netBusinessIncomePCT }}</td> </tr>'+
        '<tr class="text"> <td><strong>{{"KINARA_EMI" | translate}}</strong></td><td></td><td><strong>{{model.pl.business.kinaraEmi | irfCurrency}}</strong></td> <td>{{model.pl.business.kinaraEmiPCT }}</td> </tr>'+
        '<tr> <td><strong>{{"NET_INCOME" | translate}}</strong></td> <td></td> <td><strong>{{model.pl.business.netIncome | irfCurrency}}</strong></td> <td></td> </tr>'+
        '<tr class="table-bottom-summary"> <td>{{"FINAL_KINARA_EMI" | translate}}</td><td></td><td>{{model.pl.business.finalKinaraEmi | irfCurrency}}</td> <td>{{model.pl.business.finalKinaraEmiPCT }}</td> </tr>'+
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
        '<tr><td>{{"CASH_IN_BANK" | translate}}</td><td>{{model.assetsAndLiabilities.cashInBank | irfCurrency}}</td><td>{{"PAYABLES" | translate}}</td><td>{{model.assetsAndLiabilities.payables | irfCurrency}}</td></tr>'+
        '<tr><td>{{"ACCOUNTS_RECEIVABLES" | translate}}</td><td>{{model.assetsAndLiabilities.accountsReceivable | irfCurrency}}</td><td>{{"SHORT_TERM_DEBTS" | translate}}</td><td>{{model.assetsAndLiabilities.shortTermDebts | irfCurrency}}</td></tr>'+
        '<tr><td>{{"RAW_MATERIAL" | translate}}</td><td>{{model.assetsAndLiabilities.rawMaterial | irfCurrency}}</td><td>{{"CURRENT_PORTION_OF_LONG_TERM_DEBT" | translate}}</td><td>{{model.assetsAndLiabilities.currentPortionOfLongTermDeb | irfCurrency}}</td></tr>'+
        '<tr><td>{{"WORK_IN_PROGRESS" | translate}}</td><td>{{model.assetsAndLiabilities.workInProgress | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FINISHED_GOODS" | translate}}</td><td>{{model.assetsAndLiabilities.finishedGoods | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"TOTAL_CURRENT_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalCurrentAssets | irfCurrency}}</td><td>{{"TOTAL_CURRENT_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalCurrentLiabilities | irfCurrency}}</td></tr>'+
        '<tr class="table-sub-header"><th colspan="2">{{"FIXED_ASSETS" | translate}}</th><th colspan="2">{{"LONG_TERM_LIABILITIES" | translate}}</th></tr><tr><td>{{"MACHINERY" | translate}}</td><td>{{model.assetsAndLiabilities.machinery | irfCurrency}}</td><td>{{"LONGTERMDEBT" | translate}}</td><td>{{model.assetsAndLiabilities.longTermDebt | irfCurrency}}</td></tr>'+
        '<tr><td>{{"LAND" | translate}}</td><td>{{model.assetsAndLiabilities.land | irfCurrency}}</td><td>{{"OWN_CAPITAL" | translate}}</td><td>{{model.assetsAndLiabilities.ownCapital | irfCurrency}}</td></tr><tr><td>{{"BUILDING" | translate}}</td><td>{{model.assetsAndLiabilities.building | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"VEHICLE" | translate}}</td><td>{{model.assetsAndLiabilities.vehicle | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FURNITURE" | translate}}</td><td>{{model.assetsAndLiabilities.furniture | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FIXTURES" | translate}}</td><td>{{model.assetsAndLiabilities.fixture | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"TOTAL_FIXED_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalFixedAssets | irfCurrency}}</td><td>{{"TOTAL_LONG_TERM_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalLengTermLiabilities | irfCurrency}}</td></tr><tr></tr>'+
        '<tr class="table-bottom-summary"><th>{{"TOTAL_ASSETS" | translate}}</th><th>{{model.assetsAndLiabilities.totalAssets | irfCurrency}}</th><th>{{"TOTAL_LIABILITIES" | translate}}</th><th>{{model.assetsAndLiabilities.totalLiabilities | irfCurrency}}</th></tr>'+
    '</tbody>'+
'</table>'
                }
            ]
        });

        var cashFlowDetailsTable = "<irf-simple-summary-table irf-table-def='model.cashFlowDetails'></irf-simple-summary-table>";

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.cashFlowDetails.title,
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: cashFlowDetailsTable
                }
            ]
        });

        var purchaseDetailsTable = "<irf-simple-summary-table irf-table-def = 'model.purchaseDetails'></irf-simple-summary-table>";

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.purchaseDetails.title,
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: purchaseDetailsTable
                }
            ]
        });

        var items = [];
        if (_.isArray(model.liabilitiesSummary.subgroups) && model.liabilitiesSummary.subgroups.length > 0){
            for (var i=0;i<model.liabilitiesSummary.subgroups.length; i++){
                items.push({
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{model.liabilitiesSummary.subgroups[' + i +'].summary["Name"]}} - {{model.liabilitiesSummary.subgroups[' + i +'].summary["Relation"]}}</h3> \
                        <irf-simple-summary-table irf-table-def="model.liabilitiesSummary.subgroups[' + i + ']"></irf-simple-summary-table>\
                        <strong>Total EMI </strong> &nbsp; &nbsp; {{model.liabilitiesSummary.subgroups[' + i +'].summary["Total Monthly Installment"] | irfCurrency}} <br />\
                        <strong>Total Outstanding Loan Amount</strong> &nbsp; &nbsp; {{model.liabilitiesSummary.subgroups[' + i +'].summary["Total Outstanding Loan Amount"] | irfCurrency}}\
                        <hr>\
                        '
                });
            }
        }

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.liabilitiesSummary.title,
            items: items
        });

        var opexDetailsTable = "<irf-simple-summary-table irf-table-def = 'model.opexDetails'></irf-simple-summary-table>";

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.opexDetails.title,
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: opexDetailsTable
                }
            ]
        });

        var machineryDetailsTable = "<irf-simple-summary-table irf-table-def = 'model.machineryDetails'></irf-simple-summary-table>";

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.machineryDetails.title,
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: machineryDetailsTable
                }
            ]
        });

        var stockDetailsTable = "<irf-simple-summary-table irf-table-def = 'model.stockDetails'></irf-simple-summary-table>";

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.stockDetails.title,
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: stockDetailsTable
                }
            ]
        });

        var nonMachineryDetailsTable = "<irf-simple-summary-table irf-table-def = 'model.nonMachineryDetails'></irf-simple-summary-table>";

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.nonMachineryDetails.title,
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: nonMachineryDetailsTable
                }
            ]
        });

        var businessBankStmtSummaryTable = "<irf-simple-summary-table irf-table-def = 'model.businessBankStmtSummary'></irf-simple-summary-table>";

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: model.businessBankStmtSummary.title,
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: businessBankStmtSummaryTable
                }
            ]
        });

        // var personalBankStmtSummaryTable = "<irf-simple-summary-table irf-table-def = 'model.personalBankStmtSummary'></irf-simple-summary-table>";
        // form.push({
        //      type: "box",
        //     colClass: "col-sm-12 table-box",
        //     title: model.personalBankStmtSummary.title,
        //     items: [
        //         {
        //             type: "section",
        //             colClass: "col-sm-12",
        //             html: personalBankStmtSummaryTable
        //         }
        //     ]
        // });

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: "BANK_ACCOUNTS",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<div ng-repeat="bankAccount in model.bankAccountDetails.BankAccounts"><table class="table table-condensed" style="width:50%"><colgroup><col width="40%"><col width="60%"></colgroup><tbody><tr class="table-sub-header"><td>{{ "ACCOUNT_NAME" | translate }}</td><td>{{ bankAccount["Account Holder Name"] }}</td></tr><tr><td> {{ "LOAN_RELATION" | translate }}</td><td>{{ bankAccount["Customer Relation"] }}</td></tr><tr><td>{{ "ACCOUNT_TYPE" | translate }}</td><td>{{ bankAccount["Account Type"] }}</td></tr><tr><td>{{ "BANK_NAME" | translate }}</td><td>{{ bankAccount["Bank Name"] }}</td></tr><tr><td>{{ "ACCOUNT_NUMBER" | translate }}</td><td>{{ bankAccount["Account Number"] }}</td></tr><tr><td>{{ "IFS_CODE" | translate }}</td><td>{{ bankAccount["IFS Code"] }}</td></tr><tr><td>{{ "LIMIT" | translate }}</td><td>{{ bankAccount["Limit"] }}</td></tr><tr><td>{{ "PREFERRED_BANK" | translate }}</td><td>{{ bankAccount["Preffered Bank"] }}</td></tr><tr><td>{{ "OUTSTANDING_BALANCE" | translate }}</td><td>{{ bankAccount["Sanctioned Amount"] }}</td></tr></tbody></table><div class="clearfix"></div><table class="table table-condensed"><colgroup><col width="20%"><col width="20%"><col width="20%"><col width="20%"><col width="20%"></colgroup><thead><tr><th> {{ "MONTH" | translate }}</th><th> {{ "BANK_BALANCE" | translate }}</th><th> {{ "Total Deposits" | translate }}</th><th> {{ "Buyer Deposits" | translate }}</th><th> {{ "EMI_BOUNCED" | translate }}</th><th> {{ "NO_OF_CHEQUE_BOUNCED_SP" | translate }}</th></tr></thead><tbody><tr ng-repeat="bankStatement in bankAccount.BankStatements"><td>{{ bankStatement["Month"] }}</td><td>{{ bankStatement["Balance"] | irfCurrency}}</td><td>{{ bankStatement["Total_Deposit"] | irfCurrency}}</td><td>{{ bankStatement["Deposits"] | irfCurrency}}</td><td>{{ bankStatement["EMI Bounced"] }}</td><td>{{ bankStatement["Non-EMI Cheque Bounced"] }}</td></tr><tr class="top-bar with-bold"><td></td> 	</td>' +
                            '<td>{{ "AVERAGE_BANK_BALANCE" | translate }} ' +
                            '<br /> {{ bankAccount["Average Bank Balance"] | irfCurrency}}' +
                            '</td><td> <br /></td><td>{{ "AVERAGE_BUYER_DEPOSIT" | translate }} <br /> {{ bankAccount["Average Bank Deposit"] | irfCurrency}}</td><td>{{ "TOTAL_EMI_BOUNCED" | translate }} <br /> {{ bankAccount["Total EMI Bounced"] }}</td><td>{{ "TOTAL_CHEQUEU_BOUNCED_NON_EMI" | translate }} <br /> {{ bankAccount["Total Cheque Bounced (Non EMI)"] }}</td></tr></tbody></table> <br/><hr class="dotted"> <br/></div>'
                }
            ]
        });

        form.push({
            type: "box",
            colClass: "col-sm-12 table-box",
            title: "DEVIATION_AND_MITIGATIONS",
            condition: "model.currentStage != 'ScreeningReview' && model.siteCode != 'IREPDhan'",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"><col width="30%"><col width="30"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th><th>Chosen Mitigant</th></tr></thead><tbody><tr ng-repeat="rowData in model.deviationDetails.data"><td>{{ rowData["Parameter"] }}</td><td> <span class="square-color-box" style="background: {{ rowData.color_hexadecimal }}"> </span></td><td>{{ rowData["Deviation"] }}</td><td><ol><li ng-repeat="m in rowData.ListOfMitigants"> {{ m }}</li></ol></td><td><ol><li ng-repeat="m in rowData.ChosenMitigants"> {{ m }}</li></ol></td></tr></tbody></table>'
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

        return form;
    }; // END OF prepareForms()

    var prepareDataDeferred;
    var prepareDataPromise;

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            prepareDataDeferred = $q.defer();
            prepareDataPromise = prepareDataDeferred.promise;
            model.siteCode = SessionStore.getGlobalSetting('siteCode');
            model.currentStage = bundleModel.currentStage;
            model.isScoringV2ApiEnabled = SessionStore.getGlobalSetting('ScoringAPIVersion') == "2";
            model.isScoringOptimizationEnabled = SessionStore.getGlobalSetting('isScoringOptimizationEnabled') == "true";
            model.ScoreDetails = [];
            model.customer = {};
            model.bundleModel = bundleModel;
            model.customer_detail = bundleModel.customer_detail;
            model.loanAccount = bundleModel.loanAccount;
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

            if (bundlePageObj) {
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
            }

            if (_.hasIn(model, 'cbModel')) {
                computeScoringData(model, scoreName, deferred);
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
            "business-customer": function(bundleModel, model, params) {
                model.business = params;
                model.business.centreName = filterFilter(formHelper.enum('centre').data, {
                    value: model.business.centreId
                })[0].name;
            }
        },
        actions: {
            save: function(customerId, CBType, loanAmount, loanPurpose){
                $log.info("Inside submit()");
                $log.warn(model);
            }
        }
    };
}]);
