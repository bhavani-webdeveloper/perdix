irf.pageCollection.factory(irf.page("loans.individual.misc.BalanceSheetHistory"),
["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",'SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","Scoring","AuthTokenHelper", "BundleManager", "IndividualLoan",
function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,Scoring,AuthTokenHelper,BundleManager, IndividualLoan){

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            var deferred = $q.defer();
            model.businessPLs = [];
            model.loanRepaymentHistory = [];
            var keybasicLoanInfo = ['Loan Account Number', 'Operational Status', 'Product', 'Loan Amount', 'Frequency', 'Tenure', '# Tranche', 'EMI', 'Normal Interest Rate'];
            var p1 = IndividualLoan.search({
                stage: "Completed",
                urn: model.customerUrn
            }).$promise;

            var promiseArr = [p1];



            p1.then(function(res){
                var loanIds = [];
                for (var i=0;i<res.body.length;i++){
                    (function(i){
                        loanIds.push(res.body[i].loanId);
                        var promise = Scoring.financialSummarySnapshot({loan_id: res.body[i].loanId, score_name: "ConsolidatedScore"}).$promise;
                        promise.then(function(resp){
                            var bpl = resp[8];
                            bpl.title = "Profit & Loss - " + res.body[i].accountNumber;
                            var businessPL = {};
                            var loanRepaymentHistory = {"basicLoanInfo": {}, loanOverview: {}};
                            businessPL.invoice = bpl.data[0]['Invoice'];
                            businessPL.invoicePCT = bpl.data[0]['Invoice pct'];
                            businessPL.cashRevenue = bpl.data[0]['Cash'];
                            businessPL.cashRevenuePCT = bpl.data[0]['Cash pct'];
                            businessPL.scrapIncome = bpl.data[0]['Scrap or any business related income'];
                            businessPL.scrapIncomePCT = bpl.data[0]['Scrap or any business related income pct'];
                            businessPL.totalBusinessIncome = bpl.data[0]['Total Business Revenue'];
                            businessPL.purchases = bpl.data[0]['Purchases'];
                            businessPL.purchasesPCT = bpl.data[0]['Purchases pct'];
                            businessPL.grossIncome = bpl.data[0]['Gross Income'];
                            businessPL.Opex = bpl.data[0]['Opex'];
                            businessPL.EBITDA = bpl.data[0]['EBITDA'];
                            businessPL.EBITDA_PCT = bpl.data[0]['EBITDA pct'];
                            businessPL.businessLiabilities = bpl.data[0]['Business Liabilities'];
                            businessPL.netBusinessIncome = bpl.data[0]['Net Business Income'];
                            businessPL.netBusinessIncomePCT = bpl.data[0]['Net Business Income pct'];
                            businessPL.kinaraEmi = bpl.data[0]['Kinara EMI'];
                            businessPL.kinaraEmiPCT = bpl.data[0]['Kinara EMI pct'];
                            businessPL.netIncome = bpl.data[0]['Net Income'];
                            businessPL.finalKinaraEmi = bpl.data[0]['Final Kinara EMI'];
                            businessPL.finalKinaraEmiPCT = bpl.data[0]['Final Kinara EMI pct'];
                            businessPL.accountNumber = res.body[i].accountNumber;

                            if(resp.length >= 16 && resp[15] ){
                                var columns = resp[15].columns;
                                for(var len = 0 ; len < resp[15].columns.length; len++ ){
                                    if(keybasicLoanInfo.indexOf(columns[len].data) > -1){
                                        loanRepaymentHistory.basicLoanInfo[columns[len].data] = resp[15].data[0][columns[len].data];
                                    } else{
                                        loanRepaymentHistory.loanOverview[columns[len].data] = resp[15].data[0][columns[len].data];
                                    }                                
                                }
                            }
                            
                            model.businessPLs.push(businessPL);
                            model.loanRepaymentHistory.push(loanRepaymentHistory);
                        }, function(){
                            $log.info("Failed loading financial summary for loan_id::" + res.body[i].loanId);
                        })
                        promiseArr.push(promise);
                    })(i)
                    
                }

                var bsLeft = [], bsRight = [];
                repaymentHistoryForm = {
                        type: "box",
                        colClass: "col-sm-12 table-box",
                        title: "HISTORICAL_LOAN_REPAY_SUMMARY",
                        items: [ {
                                type: "array",
                                key: "loanRepaymentHistory",
                                //condition: 'model.loanRepaymentHistory.length > 0',
                                startEmpty: true,
                                view: "fixed",
                                add: null,
                                remove: null,
                                titleExpr: "'Account #' + model.loanRepaymentHistory[arrayIndex].basicLoanInfo['Loan Account Number']",
                                items:[
                                    {
                                        type: "section",
                                        htmlClass: 'row',
                                        items: [
                                            {
                                                type: "box",
                                                title: "Basic Loan Information",
                                                htmlClass: "col-sm-6",
                                                items: bsLeft
                                            },
                                            {
                                                type: "box",
                                                title: "Loan Overview",
                                                htmlClass: "col-sm-6",
                                                items: bsRight
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                };

                form.splice(1, 0, repaymentHistoryForm);

                $q.all(promiseArr).then(function(){

                    if(model.loanRepaymentHistory.length > 0){

                        angular.forEach(model.loanRepaymentHistory[0].basicLoanInfo, function(value, key){
                            var item = {
                                key: "loanRepaymentHistory[0].basicLoanInfo." + key,
                                title: key,
                                type: "string",
                                readonly: true,
                            };
                            bsLeft.push(item);
                        });
                        angular.forEach(model.loanRepaymentHistory[0].loanOverview, function(value, key){
                            var item = {
                                key: "loanRepaymentHistory[0].loanOverview." + key,
                                title: key,
                                type: "string",
                                readonly: true,
                            };
                            bsRight.push(item);
                        });
                    }

                }).finally(function(){
                    deferred.resolve();
                })

            }, function(){});

            return deferred.promise;
            // return $q.resolve();
        },
        eventListeners: {},
        form: [
            {
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "BUSINESS P&L",
                items: [
                    {
                        type: "array",
                        key: "businessPLs",
                        startEmpty: true,
                        view: "fixed",
                        add: null,
                        remove: null,
                        titleExpr: "'Account #' + model.businessPLs[arrayIndex].accountNumber",
                        items:[
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
        '<tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.businessPLs[arrayIndex].invoice}}</td> <td>{{model.businessPLs[arrayIndex].invoicePCT}}</td> </tr>'+
        '<tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.businessPLs[arrayIndex].cashRevenue | currency : "" : 2 }}</td> <td>{{model.businessPLs[arrayIndex].cashRevenuePCT}}</td> </tr>'+
        '<tr> <td></td><td>{{"SCRAP_OR_ANY_BUSINESS_INCOME" | translate}}</td><td>{{model.businessPLs[arrayIndex].scrapIncome | currency : "" : 2 }}</td> <td>{{model.businessPLs[arrayIndex].scrapIncomePCT}}</td> </tr>'+
        '<tr class="table-sub-header"> <td>{{"TOTAL_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.businessPLs[arrayIndex].totalBusinessIncome  | currency : "" : 2 }}</td> <td></td> </tr>'+
        '<tr> <td></td><td></td><td></td></tr><tr> <td>{{"PURCHASES" | translate}}</td><td></td><td>{{model.businessPLs[arrayIndex].purchases | currency : "" : 2 }}</td> <td>{{model.businessPLs[arrayIndex].purchasesPCT}}</td> </tr>'+
        '<tr class="table-sub-header"> <th>{{"GROSS_INCOME" | translate}}</th> <th></th> <th>{{model.businessPLs[arrayIndex].grossIncome | currency : "" : 2 }}</th> <th></th> </tr>'+
        '<tr> <td>{{"OPEX" | translate}}</td><td></td><td>{{model.businessPLs[arrayIndex].Opex | currency : "" : 2 }}</td> <td></td> </tr>'+
        '<tr> <td>{{"EBITDA" | translate}}</td><td></td><td>{{model.businessPLs[arrayIndex].EBITDA | currency : "" : 2 }}</td> <td>{{model.businessPLs[arrayIndex].EBITDA_PCT}}</td> </tr>'+
        '<tr> <th>{{"EXISTING_LOAN_PAYMENTS" | translate}}</th> <th></th> <th></td> <td></td> </tr>'+
        '<tr> <td></td><td>{{"BUSINESS_LIABILITIES" | translate}}</td><td>{{model.businessPLs[arrayIndex].businessLiabilities | currency : "" : 2 }}</td> <td></td> </tr>'+
        '<tr> <td>{{"NET_BUSINESS_INCOME" | translate}}</td><td></td><td>{{model.businessPLs[arrayIndex].netBusinessIncome | currency : "" : 2 }}</td> <td>{{model.businessPLs[arrayIndex].netBusinessIncomePCT}}</td> </tr>'+
        '<tr> <td>{{"KINARA_EMI" | translate}}</td><td></td><td>{{model.businessPLs[arrayIndex].kinaraEmi | currency : "" : 2 }}</td> <td>{{model.businessPLs[arrayIndex].kinaraEmiPCT}}</td> </tr>'+
        '<tr> <td>{{"NET_INCOME" | translate}}</td> <td></td> <td>{{model.businessPLs[arrayIndex].netIncome | currency : "" : 2 }}</td> <td></td> </tr>'+
        '<tr class="table-bottom-summary"> <td>Final Kinara EMI</td><td></td><td>{{model.businessPLs[arrayIndex].finalKinaraEmi | currency : "" : 2 }}</td> <td>{{model.businessPLs[arrayIndex].finalKinaraEmiPCT}}</td> </tr>'+
    '</tbody>'+
'</table>'
                            }
                        ]
                    }       
                ]
            },
            

        ],
        initializeUI: function(model, form, formCtrl, bundlePageObj, bundleModel) {
            return $q.resolve();
        },
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {

        }
    }
    
}]);
