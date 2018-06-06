define({
    pageUID: "loans.individual.screening.detail.PortfolioAnalysis",
    pageType: "Engine",
    dependencies: ["$log", "$q", "SchemaResource","PageHelper","Scoring","AuthTokenHelper","Enrollment", "SessionStore","formHelper", "filterFilter", "irfCurrencyFilter", "irfElementsConfig", "Model_ELEM_FC", "BundleManager","$filter"],
    $pageFn: function ($log, $q, SchemaResource,PageHelper,Scoring, AuthTokenHelper, Enrollment,SessionStore, formHelper, filterFilter, irfCurrencyFilter, irfElementsConfig, Model_ELEM_FC, BundleManager,$filter) {
        var randomColor = function() {
			return (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') + s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5);
        }
        var self= null;
        return {
            "type": "schema-form",
            "title": "PORTFOLIO ANALYSIS",
            "subTitle": "",
            initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                self=this;
                model.branchName = '';
                model.centreName = '';
                model.existingCustomerStr='';
                /* form is initialised with ripple loader until we get the data loaded from the event */
                
                self.form = [{
					"type": "section",
					"html": '<br><div style="text-align:center">Waiting for customerHistory ..<br><br><ripple-loader></ripple-loader></div>'
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
                var renderRequiredEvents = ['financial-summary'];
                model.renderReady = function(eventName) {
                    renderRequiredEvents.splice(renderRequiredEvents.indexOf(eventName), 1);
	                if (!renderRequiredEvents.length) {
		                self.renderForm();
	                }
                };
                self.renderForm= function(){
                    self.form=[];
                    self.form= self.formData;
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
                    "title": "CUST_HIST_FINANCIALS",
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
                                    "render": self.strongRender
                                }, 
                                {
                                    "title": "disbursement_date",
                                    "data": "disbursement_date"
                                },
                                {
                                    "title": "monthly_turnover",
                                    "data": "monthly_turnover"
                                },
                                {
                                    "title": "Purchases",
                                    "data": "Purchases",
                                    "render": self.currencyRightRender
                                }, 
                                {
                                    "title": "Opex",
                                    "data": "Opex",
                                    "render": self.currencyRightRender
                                },                                
                                {
                                    "title": "net_business_income",
                                    "data": "net_business_income",
                                    "render": self.currencyRightRender
                                }, 
                                {
                                    "title": "net_business_income_pct",
                                    "data": "net_business_income_pct"
                                },
                                {
                                    "title": "business_liabilities",
                                    "data": "business_liabilities",
                                    "render": self.currencyRightRender
                                },
                                {
                                    "title": "net_income",
                                    "data": "net_income",
                                    "render": self.currencyRightRender
                                },
                                {
                                    "title": "kinara_emi",
                                    "data": "kinara_emi",
                                    "render": self.currencyRightRender
                                },
                                {
                                    "title": "kinara_emi_pct",
                                    "data": "kinara_emi_pct"
                                },                                
                                {
                                    "title": "Total_current_assets",
                                    "data": "Total_current_assets",
                                    "render": function(data, type, full, meta){
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },                                
                                {
                                    "title": "Total_fixed_assets",
                                    "data": "Total_fixed_assets",
                                    "render": self.strongRender,
                                    "render": function(data, type, full, meta){
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },
                                {
                                    "title": "Total Assets",
                                    "data": "Total Assets",
                                    "render": function(data, type, full, meta){
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },
                                {
                                    "title": "Total_current_liabilities",
                                    "data": "Total_current_liabilities",
                                    "render": self.currencyRightRender
                                },                                
                                {
                                    "title": "Total_long-term_liabilities",
                                    "data": "Total_long-term_liabilities",
                                    "render": self.currencyRightRender
                                },                               
                                {
                                    "title": "Total_Liabilities",
                                    "data": "Total_Liabilities",
                                    "render": function(data, type, full, meta){
                                        return '<strong>'+self.currencyRightRender(data)+'</strong>';
                                    }
                                },
                                {
                                    "title": "Own_capital",
                                    "data": "Own_capital",
                                    "render": self.currencyRightRender
                                },
                                {
                                    "title": "Other Data Points",
                                    "data": ""
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
                                <div class="">
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
                                <div class="">
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
                                <div class="">
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
                                <div class="">
                                    <nvd3
                                    data="model.customerHistoryFinancials.financialsGraph.assetLiabilities.graphData"
                                    options="model.customerHistoryFinancials.graphOptions.multiBar"
                                    config="model.customerHistoryFinancials.graphConfig"
                                    ></nvd3>
                                    </div></div>`
                            }]
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
                        'financialsGraph':{}
                        };
                    if(params){
                       _.forEach(params, function(params){
                            prepareFinancialData['tableData'].push(params[3].tableData[0]);
                        });
                    };
                    prepareFinancialData['tableData']=$filter("orderBy") (prepareFinancialData['tableData'], ['loanId']);
                    //older accounts should not be greater then 3
                    /* if(prepareFinancialData['tableData'].length>3) prepareFinancialData['tableData']=prepareFinancialData['tableData'].slice(-3); */
                    _.forEach(prepareFinancialData['tableData'], function(histData){
                        model.customerHistoryFinancials['tableData'].push(histData);
                        model.financialGraphValues['totalAssetGraphValues'].push({
                            'x' : histData['Category'],
	                        'y' : histData['Total Assets'],
	                        'series': 0,
	                        'key' : 'Total Assets'
                        });
                        model.financialGraphValues['totalLiabilitiesGraphValues'].push({
                            'x' : histData['Category'],
	                        'y' : histData['Total_Liabilities'],
	                        'series' :1,
	                        'key' : 'Total Liabilities'
                        });
                        model.financialGraphValues['netIncomeGraphValues'].push({
                            'x' : histData['Category'],
	                        'y' : histData['net_income'],
	                        'series' : 0,
	                        'key' : 'Net Income'
                        });
                        model.financialGraphValues['ownCapitalGraphValues'].push({
                            'x' : histData['Category'],
                            'y' : histData['Own_capital'],
                            'series' : 0,
	                        'key' : 'Own Capital'
                        });
                        model.financialGraphValues['invoiceGraphValues'].push({
                            'x' : histData['Category'],
                            'y' : histData['Invoice'],
                            'series' : 0,
	                        'key' : 'Own Capital'
                        });
                        model.financialGraphValues['cashGraphValues'].push({
                            'x' : histData['Category'],
                            'y' : histData['Cash'],
                            'series' : 1,
	                        'key' : 'Own Capital'
                        })

                    });
                     /* model.renderReady('customer-history-fin-snap'); */
                },                
                "financial-summary": function(bundleModel, model, params){
                    model.branchName=params[0].data[0]['Hub Name'];
                    model.centreName=params[0].data[0]['Spoke Name'];
                    let ExistingCustomer=params[0].data[0]['Existing Customer'];
                    if(ExistingCustomer.toLowerCase() =='yes'){
                        model.existingCustomerStr = "Existing Customer"
                    }
                    else{
                        model.existingCustomerStr = "New Customer"
                    };

                    let prepareFinancialData={};
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
                                'Own_capital': balancesheet['Own capital']
                            }
                        }
                    model.customerHistoryFinancials['tableData'].push(prepareFinancialData);
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
