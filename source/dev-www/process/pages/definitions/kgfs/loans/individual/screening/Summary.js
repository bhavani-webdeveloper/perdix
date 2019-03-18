irf.pageCollection.directive("irfSimpleSummaryTable", function(){

    return {

        restrict: 'E',
        scope: {  tableData : '=irfTableDef'},
        templateUrl: 'process/pages/templates/simple-summary-table.html',
        controller: 'irfSimpleSummaryTableController'
    }
}).controller("irfSimpleSummaryTableController", ["$scope", function($scope){

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

}]);


define({
    "pageUID": "kgfs.loans.individual.screening.Summary",
    "pageType": "Engine",
    "dependencies": ["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","Scoring","AuthTokenHelper", "BundleManager","Misc"],
    $pageFn: function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,Scoring,AuthTokenHelper,BundleManager,Misc){

    var branch = SessionStore.getBranch();
    var scoreName;

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
        model.liabilitiesSummary = res[19];

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

        model.cams = {};
        model.cams.requestedLoanAmount = model.enterpriseDetails.data[0]['Loan Amount Requested'];
        // model.cams.freqency=model.enterpriseDetails.data[0]['frequency']
        model.cams.freqency= 'Monthly';
        model.cams.tenure = model.enterpriseDetails.data[0]['Tenure'];
        model.cams.estimatedEmi = model.enterpriseDetails.data[0]['EstimateEmi'];
        model.cams.sanctionedLoanAmount = model.enterpriseDetails.data[0]['Tin'];
        model.cams.totalMonthlySurplus = model.enterpriseDetails.data[0]['Avgrage Daily Sale Amount'];
        model.cams.debtServiceRatio = model.enterpriseDetails.data[0]['Owner Salary'];
        model.cams.emiEligibleAsPerNetBusinessSurplus = model.enterpriseDetails.data[0]['Net Business Income'];
        //model.cams.debtServiceRatio = model.enterpriseDetails.data[0]['EstimateEmi'];
        model.cams.finalEmiEligible = model.enterpriseDetails.data[0]['Working Days In Month'];
        model.cams.actualEMiOffered = model.enterpriseDetails.data[0]['Co-Owner Salary'];
        model.cams.loanAmountEligible = model.enterpriseDetails.data[0]['Employee Salary'];
       // model.cams.sanctionedLoanAmount = model.enterpriseDetails.data[0]['Tin'];


        model.pl  = {
            household: [],
            business: {}
        };

        if(model.houseHoldPL && model.houseHoldPL.length){
            for (var i=0; i<model.houseHoldPL.length; i++){
                var relationDetails = (model.houseHoldPL[i].relation_detail).split(" - ");
                if(relationDetails[0] === "Applicant"){
                    model.pl.household.push({
                        income : model.houseHoldPL[i].data[0]['Total Incomes'],
                        salaryFromBusiness : model.houseHoldPL[i].data[0]['Salary from business'],
                        otherIncomeSalaries : model.houseHoldPL[i].data[0]['Other Income/salaries'],
                        familyMemberIncomes : model.houseHoldPL[i].data[0]['Family Member Incomes'],
                        Expenses : model.houseHoldPL[i].data[0]['Total Expenses'],
                        declaredEducationExpense : model.houseHoldPL[i].data[0]['Expenses Declared or based on the educational expense whichever is higher'],
                        emiHouseholdLiabilities : model.houseHoldPL[i].data[0]['EMI\'s of household liabilities'],
                        netHouseholdIncome : model.houseHoldPL[i].data[0]['Net Household Income'],
                        relationDetails: model.houseHoldPL[i]['relation_detail']
                    })
                }
               
            }
        }

        model.pl.business.otherBusinessIncome = model.businessPL.data[0]['Other Business Income'];
        model.pl.business.purchase = model.businessPL.data[0]['Purchases'];
        model.pl.business.businessLiabilities = model.businessPL.data[0]['Business Liabilities'];
        model.pl.business.netBusinessIncome = model.businessPL.data[0]['Net Business Income'];
        model.pl.business.kgfsEMi = model.businessPL.data[0]['Kinara EMI'];
        model.pl.business.netIncome = model.businessPL.data[0]['Net Income'];
        model.pl.business.finalKgfsEmi = model.businessPL.data[0]['Final Kinara EMI'];

        model.additional = {};

        $log.info("Karthik here");
        $log.info(model.additional);
        model.enterpriseDetailsData = {};
        model.enterpriseDetailsData['Company Name'] = model.enterpriseDetails.data[0]['Company Name'];
        model.enterpriseDetailsData['Business Constitution'] = model.enterpriseDetails.data[0]['Business Constitution'];
        model.enterpriseDetailsData['Business Activity'] = model.enterpriseDetails.data[0]['Business Activity'];
        model.enterpriseDetailsData['Business Type'] = model.enterpriseDetails.data[0]['Business Type'];
        model.enterpriseDetailsData['Sector'] = model.enterpriseDetails.data[0]['Sector'];
        model.enterpriseDetailsData['Loan Product'] = model.enterpriseDetails.data[0]['Loan Product'];
        model.enterpriseDetailsData['Monthly Turnover'] = model.enterpriseDetails.data[0]['Monthly Turnover'];
        model.enterpriseDetailsData['Wealth Manager Name'] = model.enterpriseDetails.data[0]['Wealth Manager Name'];
        model.enterpriseDetailsData['Loan Amount Requested'] = model.enterpriseDetails.data[0]['Loan Amount Requested'];
        model.enterpriseDetailsData['Interest'] = model.enterpriseDetails.data[0]['Interest'];
        model.enterpriseDetailsData['Existing Loan Repayments'] = model.enterpriseDetails.data[0]['Existing Loan Repayments'];
        model.enterpriseDetailsData['Tenure'] = model.enterpriseDetails.data[0]['Tenure'];
        model.enterpriseDetailsData['Avg Monthly Net Income'] = model.enterpriseDetails.data[0]['Avg Monthly Net Income'];
        model.enterpriseDetailsData['Average_Bank_Balance'] = model.enterpriseDetails.data[0]['Average_Bank_Balance'];
        model.enterpriseDetailsData['Average Bank Deposit'] = model.enterpriseDetails.data[0]['Average Bank Deposit'];
        



    }; // END OF prepareData()


    var HOUSEHOLD_PL_HTML =
    '<table class="table">'+
        '<colgroup>'+
            '<col width="30%"> <col width="70%">'+
        '</colgroup>'+
        '<tbody>'+
            '<tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> </tr>'+
            '<tr> <td>{{"OTHER_INCOME_SALARIES" | translate}}</td> <td>{{household.otherIncomeSalaries | irfCurrency}}</td> </tr>'+
            '<tr> <td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td> <td>{{household.familyMemberIncomes | irfCurrency}}</td> </tr>'+
            '<tr class="table-sub-header"> <th>{{"EXPENSES" | translate}}</th> <th></th></tr>'+
            '<tr> <td>{{"HOUSEHOLD_EXPENSE" | translate}}</td> <td></td> </tr>'+
            '<tr> <td>{{"EMI_EXPENSES" | translate}}</td> <td></td> </tr>'+
            '<tr> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td> <td> {{household.netHouseholdIncome}}</td> </tr>'+
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
                title: key,
                type: "string",
                readonly: true,
            };

            // if (key == "FRO Remarks"){
            //     item.type = "section";
            //     item.htmlClass = "row";
            //     item.html = "<div><label class = 'col-sm-4' style = 'text-align: right;'>FRO Remarks</label><div style = 'font-weight: bold;'  class = 'col-sm-8'>{{model.enterpriseDetailsData['FRO Remarks']}}</div></div>";
            // }
            if (bsCounter++ % 2 ==0){
                bsLeft.push(item)
            } else {
                bsRight.push(item)
            }
        });

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



        form.push({
            type: "box",
            colClass: "col-sm-12 table-box",
            "condition": "(model.currentStage !='Screening' && model.currentStage !='MELApplication' && model.currentStage !='Application') && ('model.loanProcess.loanAccount.productCategory' === 'MEL')",
            title: "CAMS_SUMMARY",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html:
'<table class="table">'+
    '<colgroup>'+
        '<col width="33%"> <col width="33%"><col width="33%">'+
    '</colgroup>'+
    '<tbody>'+
        '<tr class="table-sub-header"> <th></th> <th>{{"REQUESTED_BY_APPLICANT" | translate}}</th><th>{{"RECOMMENDED_BY_LOAN_OFFICER" | translate}}</th> </tr>'+
        '<tr> <td>{{"LOAN_AMOUNT" | translate}}</td><td>{{model.cams.requestedLoanAmount}}</td> <td>{{model.cams.sanctionedLoanAmount}}</td> </tr>'+
        '<tr> <td>{{"FREQUENCY" | translate}}</td><td>{{ model.cams.freqency}}</td> <td>{{ model.cams.freqency}}</td> </tr>'+
        '<tr> <td>{{"TERM" | translate}}</td><td>{{ model.cams.tenure}}</td> <td>{{ model.cams.tenure}}</td> </tr>'+
        '<tr> <td>{{"INSTALLMENT" | translate}}</td><td>{{model.cams.estimatedEmi}}</td><td></td></tr>'+
        '<tr class="table-sub-header"><th colspan="12">{{"ELIGIBILITY_CALCULATOR" | translate}}</th></tr>'+
        '<tr><td>{{"TOTAL_MONTHLY_SURPLUS" | translate}}</td><td>{{model.cams.totalMonthlySurplus}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"DEBT_SERVICE_RATIO" | translate}}</td><td>{{model.cams.debtServiceRatio}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"EMI_ELIGIBLE_AS_PER_NET_BUSINESS_SURPLUS" | translate}}</td><td>{{model.cams.emiEligibleAsPerNetBusinessSurplus}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"AFFORDABLE_EMI_AS_STATED_BY_CUSTOMER" | translate}}</td><td>{{model.cams.estimatedEmi}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FINAL_EMI_ELIGIBILITY" | translate}}</td><td>{{model.cams.finalEmiEligible}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"ACTUAL_EMI_OFFERED_TO_BORRWER" | translate}}</td><td>{{model.cams.actualEMiOffered}}</td><td></td><td></td></tr>'+
        '<tr> <td>{{"FINAL_LOAN_AMOUNT_SANCTIONED" | translate}}</td><td>{{model.cams.sanctionedLoanAmount}}</td><td></td></tr>'+
    '</tbody>'+
'</table>'
                }
            ]
        });

        
        for (var i=0;i<model.pl.household.length; i++){
            form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "Household P&L Statement - " + model.pl.household[i].relationDetails,
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
        // model.pl.business.otherBusinessIncome = model.businessPL.data[0]['Other Business Income'];
        // model.pl.business.purchase = model.businessPL.data[0]['Purchases'];
        // model.pl.business.businessLiabilities = model.businessPL.data[0]['Business Liabilities'];
        // model.pl.business.netBusinessIncome = model.businessPL.data[0]['Net Business Income'];
        // model.pl.business.kgfsEMi = model.businessPL.data[0]['Kinara EMI'];
        // model.pl.business.netIncome = model.businessPL.data[0]['Net Income'];
        // model.pl.business.finalKgfsEmi = model.businessPL.data[0]['Final Kinara EMI']

        form.push({
            type: "box",
            colClass: "col-sm-12 table-box",
            title: "BUSINESS_PL",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html:
'<table class="table">'+
    '<colgroup>'+
        '<col width="30%"> <col width="70%">'+
    '</colgroup>'+
    '<tbody>'+
        '<tr class="table-sub-header"> <th>{{"REVENUE_TURNOVER" | translate}}</th> <th></th></tr>'+
        '<tr> <td>{{"INCOME_FROM_BUSINESS" | translate}}</td><td></td> </tr>'+
        '<tr> <td>{{"OTHER_BUSINESS_INCOME" | translate}}</td><td>{{model.pl.business.otherBusinessIncome}}</td> </tr>'+
        '<tr > <td><strong>{{"TOTAL_BUSINESS_INCOME" | translate}}<strong></td><td><strong>{{model.pl.business.totalBusinessIncome | irfCurrency}}<strong></td></tr>'+
        '<tr> <td>{{"PURCHASES" | translate}}</td><td>{{model.pl.business.purchases }}</td></tr>'+
        '<tr> <td>{{"OTHER_BUSINESS_EXPENSE" | translate}}</td><td>{{}}</td></tr>'+
        '<tr class="table-sub-header"> <th>{{"EXISTING_LOAN_PAYMENTS" | translate}}</th> <th></th> </tr>'+
        '<tr> <td>{{"BUSINESS_LIABILITIES" | translate}}</td><td>{{model.pl.business.businessLiabilities | irfCurrency}}</td> </tr>'+
        '<tr> <td>{{"NET_BUSINESS_INCOME" | translate}}</td><td>{{model.pl.business.netBusinessIncome | irfCurrency}}</td></tr>'+
        '<tr> <td><strong>{{"KGFS_EMI" | translate}}</strong></td><td><strong>{{model.pl.business.kgfsEmi | irfCurrency}}</strong></td></tr>'+
        '<tr> <td><strong>{{"NET_INCOME" | translate}}</strong></td><td><strong>{{model.pl.business.netIncome | irfCurrency}}</strong></td></tr>'+
        '<tr class="table-bottom-summary"><td><strong>Final KGFS EMI</strong></td><td>{{model.pl.business.finalKgfsEmi | irfCurrency}}</td></tr>'+
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
        '<tr><th colspan="2">Assets</th></tr>'+
    '</thead>'+
    '<tbody>'+
        '<tr class="table-sub-header"><th colspan="4">{{"CURRENT_ASSETS" | translate}}</th></tr>'+
        '<tr><td>{{"CASH_IN_BANK" | translate}}</td><td>{{model.assetsAndLiabilities.cashInBank | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"ACCOUNTS_RECEIVABLES" | translate}}</td><td>{{model.assetsAndLiabilities.accountsReceivable | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"RAW_MATERIAL" | translate}}</td><td>{{model.assetsAndLiabilities.rawMaterial | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"WORK_IN_PROGRESS" | translate}}</td><td>{{model.assetsAndLiabilities.workInProgress | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FINISHED_GOODS" | translate}}</td><td>{{model.assetsAndLiabilities.finishedGoods | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"TOTAL_CURRENT_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalCurrentAssets | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr class="table-sub-header"><th colspan="4">{{"FIXED_ASSETS" | translate}}</th></tr>'+
        '<tr><td>{{"MACHINERY" | translate}}</td><td>{{model.assetsAndLiabilities.machinery | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"LAND" | translate}}</td><td>{{model.assetsAndLiabilities.land | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"BUILDING" | translate}}</td><td>{{model.assetsAndLiabilities.building | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"VEHICLE" | translate}}</td><td>{{model.assetsAndLiabilities.vehicle | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"FURNITURE_AND_FIXING" | translate}}</td><td>{{model.assetsAndLiabilities.furnitureAndFixtures | irfCurrency}}</td><td></td><td></td></tr>'+
        '<tr><td>{{"TOTAL_FIXED_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalFixedAssets | irfCurrency}}</td><td></td><td></td></tr><tr></tr>'+
        '<tr class="table-bottom-summary"><th>{{"TOTAL_ASSETS" | translate}}</th><th>{{model.assetsAndLiabilities.totalAssets | irfCurrency}}</th><th></th><th></th></tr>'+
    '</tbody>'+
'</table>'
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

        form.push({
             type: "box",
            colClass: "col-sm-12 table-box",
            title: "BANK_ACCOUNTS",
            items: [
                {
                    type: "section",
                    colClass: "col-sm-12",
                    html: '<div ng-repeat="bankAccount in model.bankAccountDetails.BankAccounts"><table class="table table-condensed" style="width:50%"><colgroup><col width="40%"><col width="60%"></colgroup><tbody><tr class="table-sub-header"><td>{{ "ACCOUNT_NAME" | translate }}</td><td>{{ bankAccount["Account Holder Name"] }}</td></tr><tr><td> {{ "LOAN_RELATION" | translate }}</td><td>{{ bankAccount["Customer Relation"] }}</td></tr><tr><td>{{ "ACCOUNT_TYPE" | translate }}</td><td>{{ bankAccount["Account Type"] }}</td></tr><tr><td>{{ "BANK_NAME" | translate }}</td><td>{{ bankAccount["Bank Name"] }}</td></tr><tr><td>{{ "ACCOUNT_NUMBER" | translate }}</td><td>{{ bankAccount["Account Number"] }}</td></tr><tr><td>{{ "IFS_CODE" | translate }}</td><td>{{ bankAccount["IFS Code"] }}</td></tr><tr><td>{{ "LIMIT" | translate }}</td><td>{{ bankAccount["Limit"] }}</td></tr></tbody></table><div class="clearfix"></div><table class="table table-condensed"><colgroup><col width="20%"><col width="20%"><col width="20%"><col width="20%"><col width="20%"></colgroup><thead><tr><th> {{ "MONTH" | translate }}</th><th> {{ "BANK_BALANCE" | translate }}</th><th> {{ "DEPOSITS" | translate }}</th><th> {{ "EMI_BOUNCED" | translate }}</th><th> {{ "NO_OF_CHEQUE_BOUNCED_SP" | translate }}</th></tr></thead><tbody><tr ng-repeat="bankStatement in bankAccount.BankStatements"><td>{{ bankStatement["Month"] }}</td><td>{{ bankStatement["Balance"] | irfCurrency}}</td><td>{{ bankStatement["Deposits"] | irfCurrency}}</td><td>{{ bankStatement["EMI Bounced"] }}</td><td>{{ bankStatement["Non-EMI Cheque Bounced"] }}</td></tr><tr class="top-bar with-bold"><td></td><td>{{ "AVERAGE_BANK_BALANCE" | translate }} <br /> {{ bankAccount["Average Bank Balance"] | irfCurrency}}</td><td>{{ "AVERAGE_BANK_DEPOSIT" | translate }} <br /> {{ bankAccount["Average Bank Deposit"] | irfCurrency}}</td><td>{{ "TOTAL_EMI_BOUNCED" | translate }} <br /> {{ bankAccount["Total EMI Bounced"] }}</td><td>{{ "TOTAL_CHEQUEU_BOUNCED_NON_EMI" | translate }} <br /> {{ bankAccount["Total Cheque Bounced (Non EMI)"] }}</td></tr></tbody></table> <br/><hr class="dotted"> <br/></div>'
                }
            ]
        });

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

            model.currentStage = bundleModel.currentStage;
            model.ScoreDetails = [];
            model.customer = {};
            var $this = this;
            var deferred = $q.defer();

            scoreName = 'RiskScore2';


            if (bundlePageObj) {
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
            }

            if (_.hasIn(model, 'cbModel')) {
                Scoring.get({
                    auth_token: AuthTokenHelper.getAuthData().access_token,
                    LoanId: model.cbModel.loanId,
                    ScoreName: scoreName
                }).$promise.then(function(response){
                    model.ScoreDetails = response.ScoreDetails;
                }).finally(function(){
                    var onSuccessPromise = Misc.getSummary({loan_id: model.cbModel.loanId, score_name: scoreName}).$promise;
                    onSuccessPromise.then(function(res){
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
            save: function(customerId, CBType, loanAmount, loanPurpose){
                $log.info("Inside submit()");
                $log.warn(model);
            }
        }
    };
}
});
