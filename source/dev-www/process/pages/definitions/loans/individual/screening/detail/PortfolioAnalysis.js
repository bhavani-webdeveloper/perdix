define({
    pageUID: "loans.individual.screening.detail.PortfolioAnalysis",
    pageType: "Engine",
    dependencies: ["$log", "$q", "SchemaResource","PageHelper","Scoring","AuthTokenHelper","Enrollment", "SessionStore","formHelper", "filterFilter", "irfCurrencyFilter", "irfElementsConfig", "Model_ELEM_FC", "BundleManager","$filter","Queries"],
    $pageFn: function ($log, $q, SchemaResource,PageHelper,Scoring, AuthTokenHelper, Enrollment,SessionStore, formHelper, filterFilter, irfCurrencyFilter, irfElementsConfig, Model_ELEM_FC, BundleManager,$filter,Queries) {
        var randomColor = function() {
			return (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') + s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5);
        }
        var self= null;
        return {
            "type": "schema-form",
            "title": "Customer History",
            "subTitle": "",
            initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                self=this;
                model.branchName = '';
                model.centreName = '';
                model.existingCustomerStr='';
                /* form is initialised with ripple loader until we get the data loaded from the event */
                
                self.form = [{
                    "type": "section",
                    "html": '<br><div style="text-align:center">Waiting for Customer History ..<br><br><ripple-loader></ripple-loader></div>'
                }];
                /*--Utility function's for table view --*/
                self.strongRender = function(data, type, full, meta) {
                    return '<strong>'+data+'</strong>';
                }
                self.currencyRightRender = function(data) {
                    if(data && data>=0)
                    return irfElementsConfig.currency.iconHtml+irfCurrencyFilter(data, null, null, "decimal");
                    else if(data && data<0)
                    return '-'+irfElementsConfig.currency.iconHtml+irfCurrencyFilter(Math.abs(data), null, null, "decimal");
                    else return ''
                }
                var deferred = $q.defer();
                model.customerHistory=[];
                var p1 = Queries.getLoanAccountsByUrnAndStage(model.customerUrn, ["Completed"]);
                var promiseArr = [];
                p1.then(function(_res){
                var loanIds = [];
                var res = $filter("orderBy") (_res, ['loanId', 'currentStage']);
                if(res){
                    res=(res.length>3)?(_res.slice(-3)):(res);
                    for (var i=0;i<res.length;i++){
                        (function(i){
                            loanIds.push(res[i].loanId);
                            var promise = Scoring.financialSummarySnapshot({loan_id: res[i].loanId, score_name: "ConsolidatedScore"}).$promise;
                            promiseArr.push(promise);
                            promiseArr[i].then(function(resp){
                            model.customerHistory.push(resp);
                            },function(){
                                $log.info("Failed loading financial summary for loan_id::" + res[i].loanId);
                            });
                        })(i);
                    }
                }
                $q.all(promiseArr).then(function(){

                }).finally(function(){
                    deferred.resolve();
                    BundleManager.pushEvent('customer-history-data', model._bundlePageObj, model.customerHistory);
                })
                },function(){})
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
                model.financialGraphValues={
                    'totalAssetGraphValues' :[],
                    'totalLiabilitiesGraphValues' :[],
                    'netIncomeGraphValues' :[],
                    'ownCapitalGraphValues' :[],
                    'invoiceGraphValues' :[],
                    'cashGraphValues' :[]
                };

                model.customerHistoryFinancials={
                    'tableData': [],
                    'tableRatios':[],
                    'tableData1': [],
                    'tableData2': [],
                    'graphOptions':{'multiBar' :{
                        "chart": {
                            "type": "multiBarChart",
                            "height": 280,
                            "duration": 500,
                            "stacked": false
                        }
                    }},
                    'graphConfig':{
                        'refreshDataOnly':true,
                        'deepWatchData':false
                    },
                    'financialsGraph':{
                        'assetLiabilities':{
                            'title':'Customer\'s Financials - Total Assets and Total Liabilities',
                            'graphData':[{
                                'color':'midnightblue',
                                'key': 'Total Assets',
                                'values':model.financialGraphValues['totalAssetGraphValues']
                            },
                            {
                                'color':'firebrick',
                                'key':'Total Liabilities',
                                'values':model.financialGraphValues['totalLiabilitiesGraphValues']
                            }]
                        },
                        'invoiceCash':{
                            'title':'Customer\'s Financials - Turnover Split(invoice vs cash)',
                            'graphData':[{
                                'color':'midnightblue',
                                'key': 'Invoice',
                                'values': model.financialGraphValues['invoiceGraphValues']
                            },
                            {
                                'color':'firebrick',
                                'key':'Cash',
                                'values':model.financialGraphValues['cashGraphValues']
                            }]
                        },
                        'netIncome':{
                            'title':'Customer\'s Financials - Net Income(after household P&L)',
                            'graphData':[{
                                'color':'firebrick',
                                'key': 'Net Income',
                                'values':model.financialGraphValues['netIncomeGraphValues']
                            }]
                        },
                        'ownCapital':{
                            'title':'Customer\'s Financials - Own Captial',
                            'graphData':[{
                                'color':'midnightblue',
                                'key': 'Own Capital',
                                'values':model.financialGraphValues['ownCapitalGraphValues']
                            }]
                        }
                    }
                };
                /* --Utility function for showing loader till the event loaded - 
                rendering on financial summary atleast not snapshot because they may be empty 
                so possibility that it never get fired*/
                var renderRequiredEvents = ['financial-summary','customer-history-fin-snap'];
                model.renderReady = function(eventName) {
                    renderRequiredEvents.splice(renderRequiredEvents.indexOf(eventName), 1);
	                if (!renderRequiredEvents.length) {
		                self.renderForm();
	                }
                };
                self.renderForm= function(){
                    if(model.existingCustomerStr == "Existing Customer"){
                    self.form=[];
                    self.form= self.formData;
                    } else {
                        self.form=[];
                        self.form = [{
                            "type": "section",
                            "html": '<br><div style="text-align:center">Its a new customer no data will be available..<br><br></div>'
                        }];
                    }
                }
            },
            formData: [
                {
                    "type": "section",
                    "html": `<div class="col-sm-6">
                                <i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">{{model.existingCustomerStr}}</em><br>&nbsp;
                            </div>
                            <div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.branchName}}</strong></div>
                            <div class="col-sm-3">{{'SPOKE'|translate}}: <strong>{{model.centreName}}</strong></div>`               
                },
                {
                    "type": "box",
                    "title": "Customer HistoricaL Financials",
                    "readOnly": true,
                    "colClass": "col-sm-12",
                    "items":[{
                            "type": "tableview",
                            "key": "customerHistoryFinancials.tableData",
                            "transpose" : true,
                            "title": "",
                            "selectable": "false",
                            "editable": "false",
                            "tableConfig":{
                                "searching": false,
                                "paginate": false,
                                "pageLength": 10,
                            },
                            getColumns: function() {
                                return [{
                                    "title": "Category",
                                    "data": "Category",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].Category;
                                        return self.strongRender(data)
                                    }
                                }, 
                                {
                                    "title": "Disbursement Date",
                                    "data": "disbursement_date",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].disbursement_date;
                                        return self.strongRender(data)
                                    }
                                },
                                {
                                    "title": "Monthly Turnover",
                                    "data": "monthly_turnover",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].monthly_turnover;
                                        return self.strongRender(data)
                                    }
                                },
                                {
                                    "title": "Purchases",
                                    "data": "Purchases",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].Purchases;
                                        return self.strongRender(data)
                                    }
                                }, 
                                {
                                    "title": "Opex",
                                    "data": "Opex",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].Opex;
                                        return self.strongRender(data)
                                    }
                                },                                
                                {
                                    "title": "Net business income",
                                    "data": "net_business_income",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].net_business_income;
                                        return self.strongRender(data)
                                    }
                                }, 
                                {
                                    "title": "Net business income pct",
                                    "data": "net_business_income_pct",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].net_business_income_pct;
                                        return data;
                                    }
                                },
                                {
                                    "title": "Business liabilities",
                                    "data": "business_liabilities",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].business_liabilities;
                                        return self.strongRender(data);
                                    }
                                },
                                {
                                    "title": "Net income",
                                    "data": "net_income",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].net_income;
                                        return self.strongRender(data);
                                    }
                                },
                                {
                                    "title": "Kinara emi",
                                    "data": "kinara_emi",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].kinara_emi;
                                        return self.strongRender(data);
                                    }
                                },
                                {
                                    "title": "Kinara emi pct",
                                    "data": "kinara_emi_pct",
                                    render: function(data, type, full, meta) {
                                        
                                        data = full['data'][0].kinara_emi_pct;
                                        return data;
                                    }
                                },                                
                                {
                                    "title": "Total current assets",
                                    "data": "Total_current_assets",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0].Total_current_assets;
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },                                
                                {
                                    "title": "Total fixed assets",
                                    "data": "Total_fixed_assets",
                                    "render": self.strongRender,
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0].Total_fixed_assets;
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },
                                {
                                    "title": "Total Assets",
                                    "data": "Total Assets",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0]['Total Assets'];
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },
                                {
                                    "title": "Total current liabilities",
                                    "data": "Total_current_liabilities",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0]['Total_current_liabilities'];
                                        return self.currencyRightRender(data)
                                    }
                                },                                
                                {
                                    "title": "Total long term liabilities",
                                    "data": "Total_long-term_liabilities",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0]['Total_long-term_liabilities'];
                                        return self.currencyRightRender(data)
                                    }
                                },                               
                                {
                                    "title": "Total Liabilities",
                                    "data": "Total_Liabilities",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0].Total_Liabilities;
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },
                                {
                                    "title": "Own capital",
                                    "data": "Own_capital",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0].Own_capital;
                                        return self.currencyRightRender(data)
                                    }
                                },
                                {
                                    "title": "HypothecationValue:LoanAmount",
                                    "data": "HypothecationValue:LoanAmount",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0]['HypothecationValue:LoanAmount'];
                                        return data
                                    }
                                }
                            ];
                            },
                            getActions: function() {
                                return [];
                            }                            
                        },{
                            "type": "tableview",
                            "key": "customerHistoryFinancials.tableData",
                            "transpose" : true,
                            "title": "Other Data Points(in %)",
                            "selectable": "false",
                            "editable": "false",
                            "tableConfig":{
                                "searching": false,
                                "paginate": false,
                                "pageLength": 10,
                            },
                            getColumns: function() {
                                return [{
                                    "title": "Category",
                                    "data": "Category",
                                    "render": function(data, type, full, meta){
                                        data = full['data'][0].Category;
                                        return self.strongRender(data)
                                    }
                                },
                                {
                                    "title": "DSCR",
                                    "data": "DSCR",
                                    render: function(data, type, full, meta) {
                                        if(full.ratios[0]==undefined)
                                            data= "NA"
                                        else {
                                            data= full.ratios[0]['DSCR'];
                                            if(data==0)
                                                data = "0";
                                            if(data == null)
                                                data = "NA"
                                            
                                        }
                                            return data;
                                    }
                                },
                                {
                                    "title": "DSO",
                                    "data": "DSONonTrading",
                                    render: function(data, type, full, meta) {
                                        if(full.ratios[1]==undefined)
                                            data= "NA"
                                        else {
                                            data = full.ratios[1]['DSONonTrading'];
                                            if(data == 0)
                                                 data = "0"
                                            if(data == null)
                                                data = "NA"

                                        }
                                            
                                            return data;
                                    }
                                },
                                {
                                    "title": "Current Ratio",
                                    "data": "CurrentRatio",
                                    render: function(data, type, full, meta) {
                                        if(full.ratios[2]==undefined)
                                        data= "NA"
                                    else {
                                        data= full.ratios[2]['CurrentRatio'];
                                        if(data == 0)
                                            data = "0"
                                        if(data == null)
                                            data = "NA"
                                    }
                                        
                                        return data;
                                    }
                                },
                                // {
                                //     "title": "Hypothecation Value- Loan Amount",
                                //     "data": "HypothecationValue",
                                //     render: function(data, type, full, meta) {
                                //         if(full.ratios[3]==undefined)
                                //             data= "NA"
                                //         else {
                                //             data= full.ratios[3]['HypothecationValue:LoanAmount'];
                                //                 if(data == 0)
                                //                     data = "0"
                                //                 if(data == null)
                                //                     data = "NA"
                                //     }
                                        
                                //         return data;
                                        
                                //     }
                                // },
                                {
                                    "title": "LUC Status",
                                    "data": "luc_status",
                                    render: function(data, type, full, meta) {
                                        if(full.data[0].luc_status)
                                            data= full.data[0].luc_status;
                                        else
                                            data= "NA";
                                            return data;
                                    }

                                }

                            ];
                            },
                            getActions: function() {
                                return [];
                            }                            
                        },
                        {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "type": "section",
                                "html": `
                                <div class="chart-title"><h4>{{model.customerHistoryFinancials.financialsGraph.invoiceCash.title}}</h4>
                                <div ><style type="text/css">.nvd3-svg{padding-left:15px;}</style>
                                    <nvd3
                                    data="model.customerHistoryFinancials.financialsGraph.invoiceCash.graphData"
                                    options="model.customerHistoryFinancials.graphOptions.multiBar"
                                    config="model.customerHistoryFinancials.graphConfig"
                                    ></nvd3>
                                    </div></div>`
                            }]
                        },
                        {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "type": "section",
                                "html": `
                                <div class="chart-title"><h4>{{model.customerHistoryFinancials.financialsGraph.ownCapital.title}}</h4>                                
                                <div class=""><style type="text/css">.nvd3-svg{padding-left:15px;}</style>
                                    <nvd3
                                    data="model.customerHistoryFinancials.financialsGraph.ownCapital.graphData"
                                    options="model.customerHistoryFinancials.graphOptions.multiBar"
                                    config="model.customerHistoryFinancials.graphConfig"
                                    ></nvd3>
                                    </div></div>`
                            }]
                        },
                        {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "type": "section",
                                "html": `
                                <div class="chart-title"><h4>{{model.customerHistoryFinancials.financialsGraph.netIncome.title}}</h4>
                                <div class=""><style type="text/css">.nvd3-svg{padding-left:15px;}</style>
                                    <nvd3
                                    data="model.customerHistoryFinancials.financialsGraph.netIncome.graphData"
                                    options="model.customerHistoryFinancials.graphOptions.multiBar"
                                    config="model.customerHistoryFinancials.graphConfig"
                                    ></nvd3>
                                    </div></div>`
                            }]
                        },
                        {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "type": "section",
                                "html": `
                                <div class="chart-title"><h4>{{model.customerHistoryFinancials.financialsGraph.assetLiabilities.title}}</h4>
                                <div class=""><style type="text/css">.nvd3-svg{padding-left:15px;}</style>
                                    <nvd3
                                    data="model.customerHistoryFinancials.financialsGraph.assetLiabilities.graphData"
                                    options="model.customerHistoryFinancials.graphOptions.multiBar"
                                    config="model.customerHistoryFinancials.graphConfig"
                                    ></nvd3>
                                    </div></div>`
                            }]
                        }
                    ]
                },
                {
                    "type": "box",
                    "title": "Bank Behaviour",
                    "readOnly": true,
                    "colClass": "col-sm-12",
                    "items":[{
                            "type": "tableview",
                            "key": "customerHistoryFinancials.tableData1",
                            "transpose" : true,
                            "title": "",
                            "selectable": "false",
                            "editable": "false",
                            "tableConfig":{
                                "searching": false,
                                "paginate": false,
                                "pageLength": 10,
                            },
                            getColumns: function() {
                                return [{
                                    "title": "Category",
                                    "data": "Category",
                                    "render": self.strongRender
                                }, 
                                {
                                    "title": "Average Bank Deposits",
                                    "data": "Average_Bank_Deposits",
                                    "render": self.currencyRightRender
                                },
                                {
                                    "title": "Average Bank Balance",
                                    "data": "Average_Bank_Balance",
                                    "render": self.currencyRightRender
                                },
                                {
                                    "title": "# of Cheque Bounces",
                                    "data": "no_of_cheque_bounced"
                                }, 
                                {
                                    "title": "# of KINARA Cheque Bounces",
                                    "data": "no_of_kinara_cheque_bounces"
                                },                                
                                {
                                    "title": "ABB to Kinara EMI",
                                    "data": "ABB_to_Kinara_EMI",
                                    "render": self.currencyRightRender
                                },
                                {
                                    "title": "Average Bank Deposit: Average Revenue",
                                    "data": "Average Bank Deposit : Average Revenue",
                                    "render": self.currencyRightRender
                                }
                            ];
                            },
                            getActions: function() {
                                return [];
                            }                            
                        }
                    ]
                },
                {
                    "type": "box",
                    "title": "Demographic Data Compare",
                    "readOnly": true,
                    "colClass": "col-sm-12",
                    "items":[{
                            "type": "tableview",
                            "key": "customerHistoryFinancials.tableData2",
                            "transpose" : true,
                            "title": "",
                            "selectable": "false",
                            "editable": "false",
                            "tableConfig":{
                                "searching": false,
                                "paginate": false,
                                "pageLength": 10,
                            },
                            getColumns: function() {
                                return [{
                                    "title": "Category",
                                    "data": "Category",
                                    "render": self.strongRender
                                }, 
                                {
                                    "title": "Psychometric Score(For Applicant)",
                                    "data": "PsychometricScore"
                                },
                                {
                                    "title": "Business Premises Status",
                                    "data": "business_premises_status"
                                },
                                {
                                    "title": "Formality of Business",
                                    "data": "formality_of_business"
                                }, 
                                {
                                    "title": "Housing Status",
                                    "data": "housing_status"
                                },                                
                                {
                                    "title": "Years of Business in Current Area",
                                    "data": "years_of_business_in_current_area"
                                }
                            ];
                            },
                            getActions: function() {
                                return [];
                            }                            
                        }
                    ]
                }
            
        ],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions:{},            
            eventListeners: {
                "customer-history-fin-snap": function(bundleModel, model, params){
                    let prepareFinancialData={
                        'tableData':[],
                        'tableRatios':[],
                        'tableData1':[],
                        'tableData2':[],
                        'financialsGraph':{}
                        };
                        var ratios={};
                    if(params){
                       _.forEach(params, function(params){
                            prepareFinancialData['tableData'].push(params[3].tableData);
                            prepareFinancialData['tableRatios'].push(params[3].tableData['ratios']);
                            prepareFinancialData['tableData1'].push(params[4].data[0]);
                            prepareFinancialData['tableData2'].push(params[6].data[0]);


                        });
                    };
                    prepareFinancialData['tableData']=$filter("orderBy") (prepareFinancialData['tableData'], ['loanId']);
                    prepareFinancialData['tableData1']=$filter("orderBy") (prepareFinancialData['tableData1'], ['loanId']);
                    prepareFinancialData['tableData2']=$filter("orderBy") (prepareFinancialData['tableData2'], ['loanId']);
                    //older accounts should not be greater then 3
                    /* if(prepareFinancialData['tableData'].length>3) prepareFinancialData['tableData']=prepareFinancialData['tableData'].slice(-3); */
                    _.forEach(prepareFinancialData['tableData'], function(histData){
                        model.customerHistoryFinancials['tableData'].push(histData);
                        model.financialGraphValues['totalAssetGraphValues'].push({
                            'x' : histData.data[0]['Category'],
	                        'y' : histData['Total Assets'],
	                        'series': 0,
	                        'key' : 'Total Assets'
                        });
                        model.financialGraphValues['totalLiabilitiesGraphValues'].push({
                            'x' : histData.data[0]['Category'],
	                        'y' : histData.data[0]['Total_Liabilities'],
	                        'series' :1,
	                        'key' : 'Total Liabilities'
                        });
                        model.financialGraphValues['netIncomeGraphValues'].push({
                            'x' : histData.data[0]['Category'],
	                        'y' : histData.data[0]['net_income'],
	                        'series' : 0,
	                        'key' : 'Net Income'
                        });
                        model.financialGraphValues['ownCapitalGraphValues'].push({
                            'x' : histData.data[0]['Category'],
                            'y' : histData.data[0]['Own_capital'],
                            'series' : 0,
	                        'key' : 'Own Capital'
                        });
                        model.financialGraphValues['invoiceGraphValues'].push({
                            'x' : histData.data[0]['Category'],
                            'y' : histData.data[0]['Invoice'],
                            'series' : 0,
	                        'key' : 'Own Capital'
                        });
                        model.financialGraphValues['cashGraphValues'].push({
                            'x' : histData.data[0]['Category'],
                            'y' : histData.data[0]['Cash'],
                            'series' : 1,
	                        'key' : 'Own Capital'
                        });

                    });
                    _.forEach(prepareFinancialData['tableRatios'], function(histData){
                        model.customerHistoryFinancials['tableRatios'].push(histData);});
                     _.forEach(prepareFinancialData['tableData1'], function(histData){
                        model.customerHistoryFinancials['tableData1'].push(histData);});
                        _.forEach(prepareFinancialData['tableData2'], function(histData){
                        model.customerHistoryFinancials['tableData2'].push(histData);});
                     model.renderReady('customer-history-fin-snap');
                },                
                "financial-summary": function(bundleModel, model, params){
                    model.branchName=params[0].data[0]['Hub Name'];
                    model.centreName=params[0].data[0]['Spoke Name'];
                    let ExistingCustomer=params[0].data[0]['Existing Customer'];
                    if(ExistingCustomer.toLowerCase() =='yes'){
                        model.existingCustomerStr = "Existing Customer";
                    }
                    else{
                        model.existingCustomerStr = "New Customer"
                    };                    

                    let prepareFinancialData={};
                    let prepareFinancialData1={};
                    let prepareFinancialData2={};
                        if(params){
                            let balancesheet=params[9].data[0];
                            let businessPL=params[8].data[0];
                            prepareFinancialData={
                                'Category': 'Current Application',
                                'disbursement_date':'',
                                'monthly_turnover': businessPL['Total Business Revenue'],
                                'Cash': businessPL['Cash'],
                                'Invoice': businessPL['Invoice'],
                                'Scrap or any business related income': businessPL['Scrap or any business related income'],
                                'Purchases': businessPL['Purchases'],
                                'Opex': businessPL['Opex'],
                                'net_business_income': businessPL['Net Business Income'],
                                'net_business_income_pct':businessPL['Net Business Income pct'],
                                'business_liabilities': businessPL['Business Liabilities'],
                                'net_income': businessPL['Net Income'],
                                'kinara_emi': businessPL['Kinara EMI'],
                                'kinara_emi_pct': businessPL['Kinara EMI pct'],
                                'Total_current_assets': balancesheet['Total current assets'],
                                'Total_fixed_assets': balancesheet['Total fixed assets'],
                                'Total Assets': balancesheet['Total Assets'],
                                'Total_current_liabilities': balancesheet['Total current liabilities'],
                                'Total_long-term_liabilities': balancesheet['Total long-term liabilities'],
                                'Total_Liabilities': balancesheet['Total Liabilities'],
                                'Own_capital': balancesheet['Own capital'],
                                'luc_status': params[13].data[0]['luc_status']?params[13].data[0]['luc_status']:"NA",
                                'HypothecationValue:LoanAmount':(params[13].data[0] && params[13].data[0]['HypothecationValue:LoanAmount'])?params[13].data[0]['HypothecationValue:LoanAmount']:"NA"
                            };
                            var data={
                                "data":[],
                                "ratios":[
                                    {
                                        'DSCR': params[3].data[3]?((params[3].data[3]["Actual Value"])):"NA"
                                    },{
                                        'DSONonTrading':params[3].data[4]?((params[3].data[4]["Actual Value"])):"NA"
                                    },{
                                        'CurrentRatio':(params[13].data[0] && params[13].data[0]['Current Ratio'])?params[13].data[0]['Current Ratio']:"NA"
                                    }
                                ]
                            };
                            data['data'].push(prepareFinancialData);
                            prepareFinancialData1 = {
                                'Category': 'Current Application',
                                'ABB_to_Kinara_EMI': (params[3].data[0]) ? params[3].data[0]['Actual Value'] : null,
                                'Average Bank Deposit : Average Revenue': (params[3].data[1]) ? params[3].data[1]['Actual Value'] : null,
                                'no_of_cheque_bounced': (params[3].data[2]) ? params[3].data[2]['Actual Value'] : null,
                                'Average_Bank_Balance': (params[10].BankAccounts[0])? params[10].BankAccounts[0]['Average Bank Balance'] : null ,
                                'Average_Bank_Deposits': (params[10].BankAccounts[0]) ? params[10].BankAccounts[0]['Average Bank Deposit'] : null,
                                'no_of_kinara_cheque_bounces': (params[3].data[7]) ? params[3].data[7]['Actual Value'] : null

                            };
                            prepareFinancialData2 = {
                                'Category': 'Current Application',
                                'PsychometricScore': (params[1].sections[0].data[7]) ? params[1].sections[0].data[7]['Applicant'] : null,
                                'business_premises_status': (params[2].data[1]) ? params[2].data[1]['Actual Value']: null,
                                'formality_of_business': (params[2].data[4])? params[2].data[4]['Actual Value'] : null,
                                'housing_status': (params[1].sections[0].data[2]) ? params[1].sections[0].data[2]['Applicant'] : null,
                                'years_of_business_in_current_area': (params[2].data[6]) ? params[2].data[6]['Actual Value'] : null

                            };


                        }
                    model.customerHistoryFinancials['tableData'].push(data);
                    model.customerHistoryFinancials['tableData1'].push(prepareFinancialData1);
                    model.customerHistoryFinancials['tableData2'].push(prepareFinancialData2);
                    model.financialGraphValues['totalAssetGraphValues'].push({
                        'x' : prepareFinancialData['Category'],
                        'y' : prepareFinancialData['Total Assets'],
                        'series': 0,
                        'key' : 'Total Assets'
                    });
                    model.financialGraphValues['totalLiabilitiesGraphValues'].push({
                        'x' : prepareFinancialData['Category'],
                        'y' : prepareFinancialData['Total_Liabilities'],
                        'series' :1,
                        'key' : 'Total Liabilities'
                    });
                    model.financialGraphValues['netIncomeGraphValues'].push({
                        'x' : prepareFinancialData['Category'],
                        'y' : prepareFinancialData['net_income'],
                        'series' : 0,
                        'key' : 'Net Income'
                    });
                    model.financialGraphValues['ownCapitalGraphValues'].push({
                        'x' : prepareFinancialData['Category'],
                        'y' : prepareFinancialData['Own_capital'],
                        'series' : 0,
                        'key' : 'Own Capital'
                    })
                    model.financialGraphValues['invoiceGraphValues'].push({
                        'x' : prepareFinancialData['Category'],
                        'y' : prepareFinancialData['Invoice'],
                        'series' : 0,
                        'key' : 'Own Capital'
                    });
                    model.financialGraphValues['cashGraphValues'].push({
                        'x' : prepareFinancialData['Category'],
                        'y' : prepareFinancialData['Cash'],
                        'series' : 1,
                        'key' : 'Own Capital'
                    })
                    model.renderReady('financial-summary');
                }
            },
        }
    }
})
