define({
	pageUID: "irep.loans.individual.origination.detail.EnterpriseFinancialView",
	pageType: "Engine",
	dependencies: ["$log", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter", "irfElementsConfig", "Model_ELEM_FC"],
	$pageFn: function($log, Enrollment, formHelper, filterFilter, irfCurrencyFilter, irfElementsConfig, Model_ELEM_FC) {
		var randomColor = function() {
			return (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') + s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5);
		}
		var self = null;
		return {
			"type": "schema-form",
			"title": "ENTERPRISE_FINANCIAL_VIEW",
			"subTitle": "",
			initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {

				model.business = model.enrolmentProcess.customer;

				model.UIUDF = {
                    'sales_information': {},
                    'loan_utilisation': {},
                    'enterprise_monthly_sales': {},
                };

                model.loanAccount = bundleModel.loanAccount;

                model.UIUDF.loan_utilisation = model.loanAccount.loanUtilisationDetail;
                if(model.loanAccount.loanUtilisationDetail.length>0) {
                	var loanUtilisationTotalPercentage = _.sumBy(model.loanAccount.loanUtilisationDetail, function(utitlization) {
                		return parseInt(utitlization.fundAllocationPercentage);
                	})
                	model.UIUDF.loan_utilisation.push({
                		"utilisationType": "Total",
                		"fundAllocationPercentage": loanUtilisationTotalPercentage,
                		"consumptionDetails":""	
                	})
                }

				model.bundlePageObj = bundlePageObj;
				model.bundleModel = bundleModel;
				self = this;

				self.form = [{
					"type": "section",
					"html": '<br><div style="text-align:center">Waiting for summary..<br><br><ripple-loader></ripple-loader></div>'
				}];

				self.renderForm = function() {
					var currencyRightRender = function(data) {
						if(data<0)
						return '-'+irfElementsConfig.currency.iconHtml+irfCurrencyFilter(Math.abs(data), null, null, "decimal");

					return irfElementsConfig.currency.iconHtml+irfCurrencyFilter(data, null, null, "decimal");

					}
					var currencyRightNullRender = function(data) {
						if (data)
							return currencyRightRender(data);
						return '';
					}
					var configRenderer = function(col) {
						return function(data, type, full, meta) {
							if (full.$config && full.$config[col] && full.$config[col].className) {
								return '<div class="'+full.$config[col].className+'">'+data+'</div>'
							} else {
								return data
							}
						}
					}
					var strongRender = function(data, type, full, meta) {
						return '<strong>'+data+'</strong>';
					}
					var zeroRender = function(data, type, full, meta) {
						return data? data: '0';
					}
					var buyerDetailsColumns = [{
						"title": "Buyer",
						"data": "buyer",
						render: strongRender
					}];
					_.forOwn(model.summary.cashFlowDetails.buyerSummary.tableData[0], function(v, k) {
						if (k != "buyer" && k != "percentage") {
							buyerDetailsColumns.push({
								"title": _.capitalize(k),
								"data": k,
								"className": "text-right",
								"render": currencyRightRender
							});
						}
					})

					var bankAccountTableForm = [];
					bankAccountTableForm.push({
						"type": "tableview",
						"key": "business.customerBankAccounts",
						"notitle": true,
						"transpose": true,
						getColumns: function() {
							return [{
								"title": "Bank Name",
								"data": "customerBankName",
								"render": strongRender
							}, {
								"title": "Branch Name",
								"data": "customerBankBranchName"
							}, {
								"title": "IFS Code",
								"data": "ifscCode"
							}, {
								"title": "Account Holder Name",
								"data": "customerNameAsInBank"
							}, {
								"title": "Account Number",
								"data": "accountNumber"
							}, {
								"title": "Account Type",
								"data": "accountType"
							}, {
								"title": "Banking Since",
								"data": "bankingSince"
							}, {
								"title": "Net Banking Available",
								"data": "netBankingAvailable"
							}, {
								"title": "Limit",
								"data": "limit",
								"className": "text-right",
								"render": currencyRightRender
							}];
						}
					});
					for (i in model.business.customerBankAccounts) {
						var acc = model.business.customerBankAccounts[i];
						var statementForm = {
							"type": "tableview",
							"key": "business.customerBankAccounts["+i+"].bankStatements",
							"title": acc.customerBankName + ' - ' + acc.accountNumber,
							"transpose": true,
							getColumns: function() {
								return [{
									"title": " ",
									"data": "startMonth",
									"render": function(data, type, full, meta) {
										if (data != "Average")
											data = moment(data, 'YYYY-MM-DD').format('MMM, YYYY');
										return strongRender(data);
									}
								}, {
									"title": "Total Deposit",
									"data": "totalDeposits",
									"className": "text-right",
									render: function(data, type, full, meta){
										if(full.startMonth == "Average"){
											if(full.averageDeposits<0) return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(full.averageDeposits), null, null, "decimal") ;
											return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(full.averageDeposits, null, null, "decimal") ;
											}
										if(data<0)	
										return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
										return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
												
									}
								}, {
									"title": "Total Balance",
									"data": "balanceAsOn15th",
									"className": "text-right",
									"render": function(data, type, full, meta) {
				                       
				                       if(full.startMonth == "Average"){
				                       	/*var avgBal1=full.averageDeposits - full.averageWithdrawals;*/
				                       	if(full.Avgbalnceon15<0)
				                       	return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(full.Avgbalnceon15), null, null, "decimal") ;
									return irfElementsConfig.currency.iconHtml+ ''+ irfCurrencyFilter(full.Avgbalnceon15, null, null, "decimal") ;
									
				                       }


										/*var avgBal=full.totalDeposits - data;*/
										if(data<0)
										return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
									return irfElementsConfig.currency.iconHtml+ ''+ irfCurrencyFilter(data, null, null, "decimal") ;
									
									}
								}, {
									"title": "No of EMI Bounces",
									"data": "noOfEmiChequeBounced",
									"className": "text-right",
									render: function(data, type, full, meta){
										if(full.startMonth == "Average"){
											return ""
										}
										return data? data: '0';;
									}
								}, {
									"title": "No of non EMI Bounces",
									"data": "noOfChequeBounced",
									"className": "text-right",
									render: function(data, type, full, meta){
										if(full.startMonth == "Average"){
											return ""
										}
										return data? data: '0';;
									}
								}, {
									"title": "OPENING_BALANCE",
									"data": "openingBalance",
									"className": "text-right",
									render: function(data, type, full, meta){
										if(full.startMonth == "Average"){
											if(full.averageOpeningBalance<0) return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(full.averageOpeningBalance), null, null, "decimal") ;
											return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(full.averageOpeningBalance, null, null, "decimal") ;
											}
										if(data<0)	
										return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
										return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
									}
								}, {
									"title": "CLOSING_BALANCE",
									"data": "closingBalance",
									"className": "text-right",
									render: function(data, type, full, meta){
										if(full.startMonth == "Average"){
											if(full.averageClosingBalance<0) return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(full.averageClosingBalance), null, null, "decimal") ;
											return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(full.averageClosingBalance, null, null, "decimal") ;
											}
										if(data<0)	
										return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
										return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
									}
								}, {
									"title": "EMI_AMOUNT_DEDUCTED",
									"data": "amountOfEmiDeducted",
									"className": "text-right",
									render: function(data, type, full, meta){
										if(full.startMonth == "Average"){
											if(full.averageEMIAmountDeducted<0) return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(full.averageEMIAmountDeducted), null, null, "decimal") ;
											return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(full.averageEMIAmountDeducted, null, null, "decimal") ;
											}
										if(data<0)	
										return '-'+ irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
										return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(Math.abs(data), null, null, "decimal") ;
									}
								}, {
									"title": "Bank Statement",
									"data": "bankStatementPhoto",
									"className": "text-center",
									"render": function(data, type, full, meta) {
										var url = [];
										url.push(Model_ELEM_FC.fileStreamUrl + "/" + data);
				                        return data ?'<a href="' + url[0]+ '" style="cursor:pointer">Download</a>': '';
				                                                }
								}];
							}
						};
						bankAccountTableForm.push(statementForm);
					}
					bankAccountTableForm.push({
						"type": "section",
						"htmlClass": "row",
						"items": [{
							"type": "section",
							"htmlClass": "col-sm-8",
							"items": [{
								"type": "section",
								"html": `
				<div class="">
				<nvd3
					data="model.business.summary.bankStatement.average.graphData"
					options="model.business.summary.bankStatement.average.graphOptions"
					config="{refreshDataOnly:true, deepWatchData: false}"
				></nvd3>
				</div>`
							}]
						}, {
							"type": "section",
							"htmlClass": "col-sm-4",
							"items": [{
								"type": "section",
								"html": `
				<div class="">
				<nvd3
					data="model.business.summary.bankStatement.bounces.graphData"
					options="model.business.summary.bankStatement.bounces.graphOptions"
					config="{refreshDataOnly:true, deepWatchData: false}"
				></nvd3>
				</div>`
							}]
						}]
					});

					self.form = [{
						"type": "section",
						"html": `
				<div class="col-sm-6"><i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">{{model.existingCustomerStr}}</em><br>&nbsp;</div>
				<div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.business.kgfsName}}</strong></div>
				<div class="col-sm-3">{{'CENTRE'|translate}}: <strong>{{model.business.centreName}}</strong></div>
				`
					}, {
						"type": "box",
						"overrideType": "default-view",
						"readonly": true,
						"title": "Cash Flow Summary",
						"colClass": "col-sm-12",
						"items": [{
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title}}</h4>',
							"title": "Invoice vs Cash vs Kaccha"
						}, {
							"type": "tableview",
							"key": "summary.cashFlowDetails.invoiceCash.tableData",
							"notitle": true,
							"transpose": true,
							getColumns: function() {
								return [{
									"title": "Month",
									"data": "month",
									render: strongRender
								}, {
									"title": "Invoice",
									"data": "invoice",
									"className": "text-right",
									"render": currencyRightRender
								}, {
									"title": "Cash",
									"data": "cash",
									"className": "text-right",
									"render": currencyRightRender
								}, {
									"title": "Kaccha",
									"data": "kaccha",
									"className": "text-right",
									"render": currencyRightRender
								},{
									"title": "Total",
									"data": "total",
									"className": "text-right",
									"render": currencyRightRender
								}];
							}
						}, {
							"type": "section",
							"html": `
				<div class="">
					<nvd3
						data="model.summary.cashFlowDetails.invoiceCash.graphData"
						options="model.summary.cashFlowDetails.invoiceCash.graphOptions"
						config="{refreshDataOnly:true, deepWatchData: false}"
					></nvd3>
				</div>`
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:10px -10px 5px;background-color:skyblue">{{form.title}}</h4>',
							"title": "Buyer Summary"
						}, {
							"type": "grid",
							"orientation": "horizontal",
							"items": [{
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"type": "tableview",
									"key": "summary.cashFlowDetails.buyerSummary.tableData",
									"notitle": true,
									"tableConfig": {
										"ordering": false,
										"searching": false,
										"paginate": false,
										"pageLength": 10,
										"responsive": false
									},
									getColumns: function() {
										return [{
											"title": "Buyer",
											"data": "buyer"
										}, {
											"title": "Amount",
											"data": "average",
											"className": "text-right",
											"render": currencyRightRender
										}, {
											"title": "Percentage of Total",
											"data": "percentage",
											"className": "text-right",
											"render": function(data, type, full, meta) {
												if (full.buyer == "Total")
													data = 100;
												return data.toFixed(2) + '%';
											}
										}];
									}
								}]
							}, {
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"type": "section",
									"html": `
				<div class="">
				<nvd3
					data="model.summary.cashFlowDetails.buyerSummary.graphData"
					options="model.summary.cashFlowDetails.buyerSummary.graphOptions"
					config="{refreshDataOnly:true, deepWatchData: false}"
				></nvd3>
				</div>`
								}]
							}]
						}, {
							"type": "expandablesection",
							"items": [{
								"type": "tableview",
								"key": "summary.cashFlowDetails.buyerDetails.tableData",
								"notitle": true,
								"tableConfig": {
									"ordering": false,
									"searching": false,
									"paginate": false,
									"pageLength": 10,
									"responsive": false
								},
								getColumns: function() {
									return buyerDetailsColumns;
								}
							}, {
								"type": "section",
								"html": `
				<div class="">
				<nvd3
					data="model.summary.cashFlowDetails.buyerDetails.graphData"
					options="model.summary.cashFlowDetails.buyerDetails.graphOptions"
					config="{refreshDataOnly:true, deepWatchData: false}"
				></nvd3>
				</div>`
							}]
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:10px -10px 5px;background-color:lightblue">{{form.title}}</h4>',
							"title": "Sales information : Daily"
						}, {
							"type": "grid",
							"orientation": "horizontal",
							"items": [{
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"key": "business.enterprise.avgDailySaleAmount",
									"title": "AVERAGE_DAILY_SALE_AMT",
									"type": "amount"
								}, {
									"key": "UIUDF.sales_information.avgMonthSaleAmount",
									"title": "Average Monthly Balance",
									"type": "amount"
								}]
							}, {
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"key": "business.enterprise.workingDaysInMonth",
									"title": "WORKING_DAYS_COUNT",
									"type": "number"
								}]
							}]
						}, {
							"type": "section",
							"html": '<div style="clear:both;padding:10px 0 5px"></div>'
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:10px -10px 5px;background-color:skyblue">{{form.title}}</h4>',
							"title": "Sales information : Seasonal Sales"
						}, {
							"type": "grid",
							"orientation": "horizontal",
							"items": [{
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"type": "tableview",
									"key": "UIUDF.enterprise_monthly_sales",
									"notitle": true,
									"tableConfig": {
										"ordering": false,
										"searching": false,
										"paginate": false,
										"pageLength": 10,
										"responsive": false
									},
									getColumns: function() {
										return [{
											"title": "Month",
											"data": "month",
											"render": function(data, type, full, meta) {
												if(data !="Average Monthly sales")
												data = moment(data, 'YYYY-MM-DD').format('MMM, YYYY');
												return strongRender(data);
											}
										}, {
											"title": "Total Sales",
											"data": "totalSales",
											"className": "text-right",
											"render": currencyRightRender
										}, {
											"title": "Season Type",
											"data": "seasonType"
										}];
									}
								}]
							}]
						}, {
							"type": "section",
							"html": '<div style="clear:both;padding:10px 0 5px"></div>'
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:10px -10px 5px;background-color:lightblue">{{form.title}}</h4>',
							"title": "Margin Details"
						}, {
							"type": "grid",
							"orientation": "horizontal",
							"items": [{
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"key": "business.enterprise.grossMarginPercentage",
									"title": "GROSS_MARGIN_PERCT",
									"className": "text-right"
								}]
							}, {
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"key": "business.enterprise.netMarginPercentage",
									"title": "NET_MARGIN_PRCT",
									"className": "text-right"
								}]
							}]
						}, {
							"type": "section",
							"html": '<div style="clear:both;padding:10px 0 5px"></div>'
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:0 -10px 5px;background-color:powderblue">{{form.title}}</h4>',
							"title": "Purchase information : Invoice Vs Cash Vs Kaccha"
						}, {
							"type": "tableview",
							"key": "summary.cashFlowDetails.purchaseDetails.tableData",
							"notitle": true,
							"transpose": true,
							getColumns: function() {
								return [{
									"title": "Month",
									"data": "month",
									render: strongRender
								}, {
									"title": "Invoice",
									"data": "invoice",
									"className": "text-right",
									"render": currencyRightRender
								}, {
									"title": "Cash",
									"data": "cash",
									"className": "text-right",
									"render": currencyRightRender
								}, {
									"title": "Kaccha",
									"data": "kaccha",
									"className": "text-right",
									"render": currencyRightRender
								},{
									"title": "Total",
									"data": "total",
									"className": "text-right",
									"render": currencyRightRender
								}];
							}
						}, {
							"type": "section",
							"html": '<table class="table"><colgroup><col width="10%"><col width="40%"></colgroup><tbody><tr ng-style = "{\'font-weight\': \'bold\'}"><td>Average Monthly Sales</td><td>{{model.averageMonthlySales | irfCurrency}}</td></tr></tbody></table>'
						}, {
							"type": "section",
							"html": `
				<div class="">
					<nvd3
						data="model.summary.cashFlowDetails.purchaseDetails.graphData"
						options="model.summary.cashFlowDetails.purchaseDetails.graphOptions"
						config="{refreshDataOnly:true, deepWatchData: false}"
					></nvd3>
				</div>`
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:10px -10px 5px;background-color:skyblue">{{form.title}}</h4>',
							"title": "Seller Summary"
						}, {
							"type": "grid",
							"orientation": "horizontal",
							"items": [{
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"type": "tableview",
									"key": "sellerSummary",
									"notitle": true,
									"tableConfig": {
										"ordering": false,
										"searching": false,
										"paginate": false,
										"pageLength": 10,
										"responsive": false
									},
									getColumns: function() {
										return [{
											"title": "Seller",
											"data": "Seller"
										}, {
											"title": "Amount",
											"data": "Amount",
											"className": "text-right",
											"render": function(data, type, full, meta){
												if(full.Seller == "Total")
													return "";	
												return irfElementsConfig.currency.iconHtml+ irfCurrencyFilter(data, null, null, "decimal") ;
											}
										}, {
											"title": "Frequency",
											"data": "Frequency"
										}, {
											"title": "Converted Monthly Value",
											"data": "ConvertedMonthlyValue",
											"className": "text-right",
											"render": currencyRightRender
										}];
									}
								}]
							}]
						}, {
							"type": "section",
							"html": '<table class="table"><colgroup><col width="10%"><col width="40%"></colgroup><tbody><tr ng-style = "{\'font-weight\': \'bold\'}"><td>Overall Monthly Purchase Average</td><td>{{((model.sellerMonthlyValue+model.averageMonthlySales)/2) | irfCurrency}}</td></tr></tbody></table>'
						}, {
							"type": "section",
							"html": '<div style="clear:both;padding:10px 0 5px"></div>'
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:10px -10px 5px;background-color:skyblue">{{form.title}}</h4>',
							"title": "Proposed Loan Utilization"
						}, {
							"type": "grid",
							"orientation": "horizontal",
							"items": [{
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"type": "tableview",
									"key": "UIUDF.loan_utilisation",
									"notitle": true,
									"tableConfig": {
										"ordering": false,
										"searching": false,
										"paginate": false,
										"pageLength": 10,
										"responsive": false
									},
									getColumns: function() {
										return [{
											"title": "Utilization type",
											"data": "utilisationType"
										}, {
											"title": "% of fund allocation",
											"data": "fundAllocationPercentage",
											"className": "text-right",
											render: function(data, type, full, meta){
												return data + " %";
											}
										}, {
											"title": "Details of consumption plan",
											"data": "consumptionDetails"
										}];
									}
								}]
							}]
						}, {
							"type": "section",
							"html": '<div style="clear:both;padding:10px 0 5px"></div>'
						}, {
							"type": "section",
							"html": '<h4 style="padding:5px 10px;margin:10px -10px 5px;background-color:lightblue">{{form.title}}</h4>',
							"title": "Bank Statement Summary"
						}, {
							"type": "grid",
							"orientation": "horizontal",
							"items": [{
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"key": "business.summary.bankStatement.averageMonthlyDeposit",
									"title": "Average Monthly Deposit",
									"type": "amount"
								}, {
									"key": "business.summary.bankStatement.averageMonthlyWithdrawal",
									"title": "Average Monthly Withdrawl",
									"type": "amount"
								}, {
									"key": "business.summary.bankStatement.averageMonthlyBalance",
									"title": "Average Monthly Balance",
									"type": "amount"
								}]
							}, {
								"type": "grid",
								"orientation": "vertical",
								"items": [{
									"key": "business.summary.bankStatement.totalAccounts",
									"title": "Total no of Accounts",
									"type": "number"
								}, {
									"key": "business.summary.bankStatement.totalChequeBounces",
									"title": "Total no of Cheque Bounces",
									"type": "number"
								}, {
									"key": "business.summary.bankStatement.totalEMIBounces",
									"title": "Total no EMI Bounces",
									"type": "number"
								}]
							}]
						}, {
							"type": "expandablesection",
							"items": bankAccountTableForm
						}]
					}, {
	                    "type": "box",
	                    "readonly": true,
	                    "colClass": "col-sm-12",
	                    "overrideType": "default-view",
	                    "title": "HOUSEHOLD_LIABILITIES",
	                    "condition": "model.liabilities.length !=0",
	                    "items": [{
	                        "type": "grid",
	                        "orientation": "horizontal",
	                        "items": [{
	                            "type": "grid",
	                            "orientation": "vertical",
	                            "items": [{
	                                "key": "active_accounts",
	                                "title": "No of Active Loans",
	                                "type": "number"
	                            }, {
	                                "key": "monthly_installment",
	                                "title": "Total Monthly Instalments",
	                                "type": "amount"
	                            }, {
	                                "key": "outstanding_bal",
	                                "title": "OUTSTANDING_AMOUNT",
	                                "type": "amount"
	                            }]

	                        }]
	                    }, {
	                        "type": "expandablesection",
	                        "items": [{
	                            "type": "tableview",
	                            "key": "liabilities",
	                            "notitle": true,
	                            "transpose": true,
	                            "selectable": false,
	                            "editable": false,
	                            "tableConfig": {
	                                "searching": false,
	                                "paginate": false,
	                                "pageLength": 10,
	                            },
	                            getColumns: function() {
	                                return [ {
	                                    "title": "loan_source",
	                                    "data": "loanSource",
	                                    render: function(data, type, full, meta) {
	                                        return full['Loan Source']
	                                    }
	                                }, {
	                                    "title": "loan Amount",
	                                    "data": "loanAmount",
	                                    render: function(data, type, full, meta) {
	                                        return irfCurrencyFilter(full['Loan Amount'])
	                                    }
	                                }, {
	                                    "title": "Installment Amount",
	                                    "data": "installmentAmountInPaisa",
	                                    render: function(data, type, full, meta) {
	                                        return irfCurrencyFilter(full['Installment Amount'])
	                                    }
	                                }, {
	                                    "data": "outstandingAmountInPaisa",
	                                    "title": "OUTSTANDING_AMOUNT",
	                                    render: function(data, type, full, meta) {
	                                        return irfCurrencyFilter(full['Outstanding Amount'])
	                                    }
	                                }, {
	                                    "title": "Loan Purpose",
	                                    "data": "Purpose",
	                                    render: function(data, type, full, meta) {
	                                        return full['Purpose']
	                                    }

	                                }, {
	                                    "title": "START_DATE",
	                                    "data": "startDate",
	                                    render: function(data, type, full, meta) {
	                                        return full['Start Date']
	                                    }
	                                }, {
	                                    "title": "MATURITY_DATE",
	                                    "data": "maturityDate",
	                                    render: function(data, type, full, meta) {
	                                        return full['Maturity Date']
	                                    }
	                                }, {
	                                    "title": "NO_OF_INSTALLMENT_PAID",
	                                    "data": "noOfInstalmentPaid",
	                                    render: function(data, type, full, meta) {
	                                        return full['No of Installment Paid']
	                                    }

	                                }, {
	                                    "title": "Frequency of Installments",
	                                    "data": "Frequency",
	                                    render: function(data, type, full, meta) {
	                                        return full['Frequency']
	                                    }
	                                }, {
	                                    "data": "",
	                                    "title": "INTEREST_ONLY",
	                                    render: function(data, type, full, meta) {
	                                        return full['Interest Only']
	                                    }
	                                }, {
	                                    "data": "interestRate",
	                                    "title": "RATE_OF_INTEREST",
	                                    render: function(data, type, full, meta) {
	                                        return full['Rate of Interest']
	                                    }
	                                }];
	                            },
	                            getActions: function() {
	                                return [];
	                            }
	                        }]
	                    }]
	                }, {

				        "type": "box",
				        "colClass": "col-sm-12",
				        "title": "Operating Expenses",
				        "condition": "model.currentStage!='ScreeningReview'",
				        "items": [{
				            "type": "section",
				            "html": '<table class="table"><colgroup><col width="40%"><col width="40%"><col width="20%"></colgroup><tbody><tr ng-style = "{\'font-weight\': \'bold\'}"><td>Expenditure Source</td><td>Monthly Expense</td><td>% of Avg Monthly Revenue</td></tr><tr ng-repeat="items in model._opex"><td>{{items["Expenditure Source"]}}</td><td>{{(items["Monthly Expense"]!="")?(items["Monthly Expense"]!=null?(items["Monthly Expense"] | irfCurrency):""):""}}</td><td>{{(items["% of Avg Monthly Revenue"]!="")?((items["% of Avg Monthly Revenue"]!=null)?((items["% of Avg Monthly Revenue"] | number : 2) + "%"):""):""}}</td></tr></tbody></table>'
				        }]
					}, {
						"type": "box",
						"title": "Profit and Loss",
						"colClass": "col-sm-12",
						"condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf7",
						"items": [{
							"type": "tableview",
							"key": "summary.profitLoss.summary.tableData",
							"notitle": true,
							"tableConfig": {
								"ordering": false,
								"searching": false,
								"paginate": false,
								"pageLength": 10,
								"responsive": false
							},
							getColumns: function() {
								return [{
									"title": " ",
									"data": "title",
									render: strongRender
								}, {
									"title": "Amount",
									"data": "amount",
									"className": "text-right"
								}, {
									"title": "Total",
									"data": "total",
									"className": "text-right",
									"render": currencyRightRender
								}, {
									"title": " ",
									"data": "percentage",
									"className": "text-right"
								}, {
									"title": " ",
									"data": "description"
								}];
							}
						}, {
							"type": "expandablesection",
							"items": [{
								"type": "tableview",
								"key": "summary.profitLoss.details.tableData",
								"notitle": true,
								"tableConfig": {
									"ordering": false,
									"searching": false,
									"paginate": false,
									"pageLength": 10,
									"responsive": false
								},
								getColumns: function() {
									return [{
										"title": " ",
										"data": "title",
										render: configRenderer("title")
									}, {
										"title": "Amount",
										"data": "amount",
										"className": "text-right",
										"render": currencyRightNullRender
									}, {
										"title": "Total",
										"data": "total",
										"className": "text-right",
										"render": currencyRightNullRender
									}, {
										"title": " ",
										"data": "percentage",
										"className": "text-right"
									}, {
										"title": " ",
										"data": "description"
									}];
								}
							}]
						}]
					}, {
						"type": "box",
						"colClass": "col-sm-12",
						"notitle": true,
						"title": "Balance Sheet",
						"condition": "model.currentStage != 'ScreeningReview'",
						"items": [{
							"type": "section",
							"colClass": "col-sm-12",
							"html": '<table class="table table-responsive">' +
								'<colgroup><col width="25%">' +
								'<col width="25%"><col width="25%"><col width="25%">' +
								'</colgroup>' +
								'<thead>' +
								'<tr><th colspan="2">Assets</th><th colspan="2">Liabilities</th></tr>' +
								'</thead>' +
								'<tbody>' +
								'<tr class="table-sub-header"><th colspan="2">{{"CURRENT_ASSETS" | translate}}</th><th colspan="2">{{"CURRENT_LIABILITIES" | translate}}</th></tr>' +
								'<tr><td>{{"CASH" | translate}}</td><td>{{model.assetsAndLiabilities.cashInBank | irfCurrency}}</td><td>{{"PAYABLES" | translate}}</td><td>{{model.assetsAndLiabilities.payables | irfCurrency}}</td></tr>' +
								'<tr><td>{{"ACCOUNTS_RECEIVABLES" | translate}}</td><td>{{model.assetsAndLiabilities.accountsReceivable | irfCurrency}}</td><td>{{"SHORT_TERM_DEBTS" | translate}}</td><td>{{model.assetsAndLiabilities.shortTermDebts | irfCurrency}}</td></tr>' +
								'<tr><td>{{"RAW_MATERIAL" | translate}}</td><td>{{model.assetsAndLiabilities.rawMaterial | irfCurrency}}</td><td>{{"CURRENT_PORTION_OF_LONG_TERM_DEBT" | translate}}</td><td>{{model.assetsAndLiabilities.currentPortionOfLongTermDeb | irfCurrency}}</td></tr>' +
								'<tr><td>{{"WORK_IN_PROGRESS" | translate}}</td><td>{{model.assetsAndLiabilities.workInProgress | irfCurrency}}</td><td></td><td></td></tr>' +
								'<tr><td>{{"FINISHED_GOODS" | translate}}</td><td>{{model.assetsAndLiabilities.finishedGoods | irfCurrency}}</td><td></td><td></td></tr>' +
								'<trclass="table-sub-header"><th>{{"TOTAL_CURRENT_ASSETS" | translate}}</th><th>{{model.assetsAndLiabilities.totalCurrentAssets | irfCurrency}}</th><th>{{"TOTAL_CURRENT_LIABILITIES" | translate}}</th><th>{{model.assetsAndLiabilities.totalCurrentLiabilities | irfCurrency}}</th></tr>' +
								'<tr ><td >{{"FIXED_ASSETS" | translate}}</td><td></td><td >{{"LONG_TERM_LIABILITIES" | translate}}</td><td></td></tr><tr><td>{{"MACHINERY" | translate}}</td><td>{{model.assetsAndLiabilities.machinery | irfCurrency}}</td><td>{{"LONGTERMDEBT" | translate}}</td><td>{{model.assetsAndLiabilities.longTermDebt | irfCurrency}}</td></tr>' +
								'<tr><td>{{"LAND" | translate}}</td><td>{{model.assetsAndLiabilities.land | irfCurrency}}</td><td>{{"OWN_CAPITAL" | translate}}</td><td>{{model.assetsAndLiabilities.ownCapital | irfCurrency}}</td></tr><tr><td>{{"BUILDING" | translate}}</td><td>{{model.assetsAndLiabilities.building | irfCurrency}}</td><td></td><td></td></tr>' +
								'<tr><td>{{"VEHICLE" | translate}}</td><td>{{model.assetsAndLiabilities.vehicle | irfCurrency}}</td><td></td><td></td></tr>' +
								'<tr><td>{{"FURNITURE_AND_FIXING" | translate}}</td><td>{{model.assetsAndLiabilities.furnitureAndFixtures | irfCurrency}}</td><td></td><td></td></tr>' +
								'<tr><td>{{"TOTAL_FIXED_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalFixedAssets | irfCurrency}}</td><td>{{"TOTAL_LONG_TERM_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalLengTermLiabilities | irfCurrency}}</td></tr><tr></tr>' +
								'<tr class="table-bottom-summary"><th>{{"TOTAL_ASSETS" | translate}}</th><th>{{model.assetsAndLiabilities.totalAssets | irfCurrency}}</th><th>{{"TOTAL_LIABILITIES" | translate}}</th><th>{{model.assetsAndLiabilities.totalLiabilities | irfCurrency}}</th></tr>' +
								'</tbody>' +
								'</table>'
						}]
					}];
				};

				self.renderRequiredEvents = ["financial-summary", "business-customer"];
				self.renderReady = function(eventName) {
					self.renderRequiredEvents.splice(self.renderRequiredEvents.indexOf(eventName), 1);
					if (!self.renderRequiredEvents.length) {
						self.renderForm();
					}
				};
			},
			form: [],
			schema: function() {
				return Enrollment.getSchema().$promise;
			},
			eventListeners: {
				"financial-summary": function(bundleModel, model, params) {	
					model.sellerSummary = params[22].data;
					if(model.sellerSummary.length > 0) {						
						model.sellerMonthlyValue = _.sumBy(model.sellerSummary, function(seller) {
							return parseInt(seller.ConvertedMonthlyValue);
						});
						model.sellerSummary.push({
							"Seller": "Total",
							"Amount": 0,
							"Frequency": "",
							"ConvertedMonthlyValue": model.sellerMonthlyValue,
						});
					}					
					model.liability = params[19].subgroups;

					model.liabilities = 0;
                    model.active_accounts = 0;
                    model.monthly_installment = 0;
                    model.outstanding_bal = 0;
					var liability = _.find(model.liability, function(liab){
                        return liab.summary["Customer ID"] == model.business.id;
                    });

					if(liability.length>0) {						
						model.liabilities = liability.data;
	                    model.active_accounts = model.liabilities.length;
	                    model.monthly_installment = liability.summary["Total Monthly Installment"];
	                    model.outstanding_bal = liability.summary["Total Outstanding Loan Amount"];
					}

					model.UIUDF.sales_information.avgMonthSaleAmount = model.business.enterprise.avgDailySaleAmount * model.business.enterprise.workingDaysInMonth
					model.UIUDF.enterprise_monthly_sales = model.business.enterpriseMonthlySales;

					if(model.business.enterpriseMonthlySales.length>0) {
						var averageMontlySales = 0;
						_.forEach(model.business.enterpriseMonthlySales, function(value) {
							averageMontlySales += parseInt(value.totalSales);
						});

						averageMontlySales = averageMontlySales/model.business.enterpriseMonthlySales.length;
						model.UIUDF.enterprise_monthly_sales.push({
							"month":"Average Monthly sales",
							"totalSales": averageMontlySales,
							"seasonType":""
						});
					}
					
					/*Existing or new customer*/
					if (params[0].data[0]['Existing Customer'] == 'No') {
                        model.existingCustomerStr = "New Customer";
                    } else {
                        model.existingCustomerStr = "Existing Customer";
                    }

                   /*Operational expenditure calculation*/
					model._opex = params[21].data;
					var cfd = params[15];
					var invoiceCashTableData = [];
					var invoiceCashGraphData = [{
						"key": "Invoice",
						"color": "midnightblue",
						"values": []
					}, {
						"key": "Cash",
						"color": "firebrick",
						"values": []
					}, {
						"key": "kaccha",
						"color": "limegreen",
						"values": []
					}];
					for (i = 0; i < cfd.data.length - 1; i++) {
						var d = cfd.data[i];
						var x = {};
						if (_.isObject(d.data)) {
							if (d.data["Month"] == "Avg. Total By Buyer") {
								x.month = "Average";
							} else {
								x.month = d.data["Month"];
							}
							x.invoice = d.data["Invoice Sales Amount"] || 0;
							x.cash = d.data["Cash Sales Amount"] || 0;
							x.kaccha = d.data["Kaccha Sales Amount"] || 0;
							x.total = d.data["Amount"] || 0;
						} else {
							x.month = d["Month"];
							x.invoice = d["Invoice Sales Amount"] || 0;
							x.cash = d["Cash Sales Amount"] || 0;
							x.kaccha = d["Kaccha Sales Amount"] || 0;
							x.total = d["Amount"] || 0;
							invoiceCashGraphData[0].values.push({
								"x": x.month,
								"y": x.invoice,
								"series": 0
							});
							invoiceCashGraphData[1].values.push({
								"x": x.month,
								"y": x.cash,
								"series": 1
							});
							invoiceCashGraphData[2].values.push({
								"x": x.month,
								"y": x.kaccha,
								"series": 1
							});
							
						}
						invoiceCashTableData.push(x);
					}

					var buyerSummaryTableData = [];
					var buyerSummaryGraphData = [];
					var buyerDetailsGraphData = [];
					var buyerColumnCount = 0;
					for (var i = 1; i < cfd.columns.length; i++) {
						if (cfd.columns[i].data == "Amount") {
							buyerSummaryTableData.push({
								"buyer": "Total"
							});
							buyerColumnCount = i;
							break;
						}
						buyerSummaryTableData.push({
							"buyer": cfd.columns[i].title
						});
						buyerSummaryGraphData.push({
							"x": cfd.columns[i].title,
							"color": randomColor()
						});
						buyerDetailsGraphData.push({
							"key": cfd.columns[i].title,
							"color": randomColor()
						});
					}
					for (i = 0; i < cfd.data.length; i++) {
						var d = cfd.data[i];
						if (_.isObject(d.data)) {
							d = d.data;
						}
						var key = d["Month"];
						if (key == "Avg. Total By Buyer")
							key = "average";
						if (key == "Percentage on Average Monthly Revenue")
							key = "percentage";
						for (j = 0; j < buyerColumnCount; j++) {
							buyerSummaryTableData[j][key] = d[cfd.columns[j+1].data] || 0;
							if (key == "percentage" && j < buyerColumnCount - 1) {
								buyerSummaryGraphData[j]["y"] = buyerSummaryTableData[j][key];
							} else if (key != "percentage" && key != "average" && j < buyerColumnCount - 1) {
								buyerDetailsGraphData[j].values = buyerDetailsGraphData[j].values || new Array(cfd.data.length - 2);
								buyerDetailsGraphData[j].values[i] = {
									"x": key,
									"y": Number(buyerSummaryTableData[j][key]),
									"series": i
								};
							}
						}
					}



					var pfd = params[18];
					var purchaseInvoiceCashKacchaTableData = [];
					var purchaseInvoiceCashKacchaGraphData = [{
						"key": "Invoice",
						"color": "midnightblue",
						"values": []
					}, {
						"key": "Cash",
						"color": "firebrick",
						"values": []
					}, {
						"key": "kaccha",
						"color": "limegreen",
						"values": []
					}];
					for (i = 0; i < pfd.data.length - 1; i++) {
						var d = pfd.data[i];
						var x = {};
						model.averageMonthlySales = 0;
						if (_.isObject(d.data)) {
							if (d.data["Month"] == "Average Total by Seller") {
								x.month = "Average";
								model.averageMonthlySales = parseInt(d.data["Invoice Sales Amount"]) + parseInt(d.data["Cash Sales Amount"]) + parseInt(d.data["Kaccha Sales Amount"]);
							} else {
								x.month = d.data["Month"];
							}
							x.invoice = d.data["Invoice Sales Amount"] || 0;
							x.cash = d.data["Cash Sales Amount"] || 0;
							x.kaccha = d.data["Kaccha Sales Amount"] || 0;
							x.total = d.data["Amount"] || 0;
						} else {
							x.month = d["Month"];
							x.invoice = d["Invoice Sales Amount"] || 0;
							x.cash = d["Cash Sales Amount"] || 0;
							x.kaccha = d["Kaccha Sales Amount"] || 0;
							x.total = d["Amount"] || 0;
							purchaseInvoiceCashKacchaGraphData[0].values.push({
								"x": x.month,
								"y": x.invoice,
								"series": 0
							});
							purchaseInvoiceCashKacchaGraphData[1].values.push({
								"x": x.month,
								"y": x.cash,
								"series": 1
							});
							purchaseInvoiceCashKacchaGraphData[2].values.push({
								"x": x.month,
								"y": x.kaccha,
								"series": 1
							});
							
						}
						purchaseInvoiceCashKacchaTableData.push(x);
					}

					var bpl = params[8].data[0];
					/*var purchase=params[18].data;*/
					/*Household income sum for applicant and co applicant , assuming it snever bethere for gurantor*/
					var household_income=0;
					var household=params[7].sections;
					_.each(household, function(household){
						household_income += parseInt(household.data[0]['Net Household Income']);

					})
					bpl.household_income=household_income;
					bpl.ExistingLoanRepayments= params[0].data[0]['Existing Loan Repayments'];
					bpl.avgMonDep=model.business.summary.bankStatement.averageMonthlyDeposit;
					bpl.avgMonBal=model.business.summary.bankStatement.averageMonthlyBalance;

					/*purchase splitup calculation under profit and loss*/
                    
                    var purchases= params[18].data;
                    if(purchases.length!= 0){
                    	  _.each(purchases, function(purchase){
                    	 if(_.has(purchase, "data")){
                    	 	if(purchase.data["Month"]== "Average Total by Seller"){
                    	 		bpl['purchase_inv']= (purchase.data["Invoice Sales Amount"]== 0)?"0.00":purchase.data["Invoice Sales Amount"];
                    	 		bpl['purchase_cash']= (purchase.data["Cash Sales Amount"]== 0)?"0.00":purchase.data["Cash Sales Amount"];
                    	 		bpl['purchase_cash_pct']= purchase.data["Cash (%)"].toFixed(2) + " %";
                    	 		bpl['purchase_inv_pct']= purchase.data["Invoice (%)"].toFixed(2) + " %";
                    	 	}

                    	 }

                    })
                    }else{
                    	bpl['purchase_inv']= "0";
                    	bpl['purchase_cash']= "0";
                    	bpl['purchase_cash_pct']= "0.00 %";
                    	bpl['purchase_inv_pct']= "0.00 %"

                    }
                  

					var CalPercentage=function(total, value){
						if(total== 0 && value!= 0) return "0.00 %";
						if(total!= 0 && value== 0) return "0.00 %"
						if(total== 0 && value== 0) return "0.00 %"
						return ((value/total)*100).toFixed(2)+" %";
					}

					model.summary = {
						"cashFlowDetails": {
							"invoiceCash": {
								"tableData": invoiceCashTableData,
								"graphData": invoiceCashGraphData,
								"graphOptions": {
									"chart": {
										"type": "multiBarChart",
										"height": 280,
										"duration": 500,
										"stacked": false
									}
								}
							},
							"buyerSummary": {
								"tableData": buyerSummaryTableData,
								"graphData": buyerSummaryGraphData,
								"graphOptions": {
									"chart": {
										"type": "pieChart",
										"height": buyerSummaryGraphData.length * 50,
										"duration": 500,
										"labelsOutside": true,
										"labelType": "value",
										"legendPosition": "right"
									}
								}
							},
							"buyerDetails": {
								"tableData": buyerSummaryTableData,
								"graphData": buyerDetailsGraphData,
								"graphOptions": {
									"chart": {
										"type": "multiBarChart",
										"height": 280,
										"duration": 500,
										"stacked": false
									}
								}
							},
							"purchaseDetails": {
								"tableData": purchaseInvoiceCashKacchaTableData,
								"graphData": purchaseInvoiceCashKacchaGraphData,
								"graphOptions": {
									"chart": {
										"type": "multiBarChart",
										"height": 280,
										"duration": 500,
										"stacked": false
									}
								}
							}
						},
						"profitLoss": {
							"summary": {
								"tableData": [{
									"title": "Income",
									"amount": "",
									"total": bpl['Total Business Revenue'],
									"percentage": "",
									"description": "",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								},{
									"title": "Average monthly sales",
									"amount": "",
									"total": model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf7,
									"percentage": "",
									"description": "",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								}, {
									"title": "Purchases",
									"amount": "",
									"total": bpl['Purchases'],
									"percentage": bpl['Purchases pct'],
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								}, {
									"title": "Average monthly purchases",
									"amount": "",
									"total": (model.sellerMonthlyValue+model.averageMonthlySales)/2,
									"percentage": "",
									"description": "",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								}, {
									"title": "OPEX",
									"amount": "",
									"total": bpl['Opex'],
									"percentage":CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Opex'])),
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								}, {
									"title": "Total Expenses",
									"amount": "",
									"total": bpl['Total Expenses'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Total Expenses'])),						
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								}, {
									"title": "Gross Income",
									"amount": "",
									"total": bpl['Gross Income'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Gross Income'])),
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								}, {
									"title": "Existing Loan Repayments",
									"amount": "",
									"total": bpl['Business Liabilities'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Business Liabilities'])),
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								},{
									"title": "Net Income",
									"amount": "",
									"total": bpl['Net Business Income'],
									"percentage": bpl['Net Business Income pct'],
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								},{
									"title": "Household Net Income",
									"amount": "",
									"total": bpl['household_income'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['household_income'])),
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								}, {
									"title": "Revised Net Income",
									"amount": "",
									"total":  bpl['Net Income'],
									"percentage":CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Net Income'])),
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								},{
									"title": "IREP_EMI",
									"amount": "",
									"total": bpl['Kinara EMI'],
									"percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['Kinara EMI'])),
									"description": "of Revised Net Income",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}

								},{
									"title": "Average Bank Balance",
									"amount": "",
									"total": bpl['avgMonBal']?bpl['avgMonBal']:("0.00") ,
									"percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonBal'])) ,
									"description": "of Revised Net Income",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								},{
									"title": "Average Bank Deposit",
									"amount": "",
									"total": bpl['avgMonDep']?bpl['avgMonDep']:("0.00") ,
									"percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonDep'])) ,
									"description": "of Revised Net Income",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								
								}]
							},
							"details": {
								"tableData": [{
									"title": "Income",
									"amount": "",
									"total": bpl['Total Business Revenue'],
									"percentage": "",
									"description": "",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								}, {
									"title": "Invoice",
									"amount": bpl['Invoice'],
									"total": "",
									"percentage": bpl['Invoice pct'],
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-right"
										}
									}
								}, {
									"title": "Cash",
									"amount": bpl['Cash'],
									"total": "",
									"percentage": bpl['Cash pct'],
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-right"
										}
									}
								}, {
									"title": "Scrap & Other Business Income",
									"amount": bpl['Scrap or any business related income'],
									"total": "",
									"percentage": bpl['Scrap or any business related income pct'],
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-right"
										}
									}
								},{
									"title": "Purchases",
									"amount": "",
									"total": bpl['Purchases'],
									"percentage": bpl['Purchases pct'],
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								},	{
                    	 			"title": "Invoice",
									"amount": (bpl['purchase_inv']==null)?"0":bpl['purchase_inv'],
									"total": "",
									"percentage": (bpl['purchase_inv_pct']==null)?"0.00%":bpl['purchase_inv_pct'],
									"description": "of total Purchases",
									"$config": {
										"title": {
											"className": "text-right"
										}
									}
                    	 		}, {
                    	 			"title": "Cash",
									"amount": (bpl['purchase_cash']==null)?"0":bpl['purchase_cash'],
									"total": "",
									"percentage": (bpl['purchase_cash_pct']==null)?"0.00%":bpl['purchase_cash_pct'],
									"description": "of total Purchases",
									"$config": {
										"title": {
											"className": "text-right"
										}
									}
                    	 		}, {
									"title": "OPEX",
									"amount": "",
									"total": bpl['Opex'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Opex'])),
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								},{
									"title": "Total Expenses",
									"amount": "",
									"total": bpl['Total Expenses'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']),parseInt(bpl['Total Expenses'])),
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								}, {
									"title": "Gross Income",
									"amount": "",
									"total": bpl['Gross Income'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Gross Income'])) ,
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								}, {
									"title": "Existing Loan Repayments",
									"amount": "",
									"total": bpl['Business Liabilities'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Business Liabilities'])),
									"description": "of turnover",
									"$config": {
										"title": {
											"className": "text-bold"
										}
									}
								}, {
									"title": "Net Income",
									"amount": "",
									"total": bpl['Net Business Income'],
									"percentage": bpl['Net Business Income pct'],
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								},{
									"title": "Household Net Income",
									"amount": "",
									"total": bpl['household_income'],
									"percentage": CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['household_income'])),
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								}, {
									"title": "Revised Net Income",
									"amount": "",
									"total":  bpl['Net Income'],
									"percentage":CalPercentage(parseInt(bpl['Total Business Revenue']), parseInt(bpl['Net Income'])),
									"description": "of turnover",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								}, {
									"title": "IREP_EMI",
									"amount": "",
									"total": bpl['Kinara EMI'],
									"percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['Kinara EMI'])),
									"description": "of Revised Net Income",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}

								},{
									"title": "Average Bank Balance",
									"amount": "",
									"total": bpl['avgMonBal']?bpl['avgMonBal']:("0.00") ,
									"percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonBal'])) ,
									"description": "of Revised Net Income",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								},{
									"title": "Average Bank Deposit",
									"amount": "",
									"total": bpl['avgMonDep']?bpl['avgMonDep']:("0.00") ,
									"percentage": CalPercentage(parseInt(bpl['Net Income']), parseInt(bpl['avgMonDep'])) ,
									"description": "of Revised Net Income",
									"$config": {
									    "title": {
										    "className": "text-bold"
										}
									}
								
								}]
							}
						}
					};

					model.businessPL = {
						"scrapIncome": bpl['Scrap or any business related income'],
						"scrapIncomePCT": bpl['Scrap or any business related income pct'],
						"totalBusinessIncome": bpl['Total Business Revenue'],
						"purchasesPCT": bpl['Purchases pct'],
						"grossIncome": bpl['Gross Income'],
						"Opex": bpl['Opex'],
						"EBITDA": bpl['EBITDA'],
						"EBITDA_PCT": bpl['EBITDA pct'],
						"businessLiabilities": bpl['Business Liabilities'],
						"netBusinessIncome": bpl['Net Business Income'],
						"netBusinessIncomePCT": bpl['Net Business Income pct'],
						"kinaraEmi": bpl['Kinara EMI'],
						"kinaraEmiPCT": bpl['Kinara EMI pct'],
						"netIncome": bpl['Net Income'],
						"finalKinaraEmi": bpl['Final Kinara EMI'],
						"finalKinaraEmiPCT": bpl['Final Kinara EMI pct']
					};

					/* Populate values for Balance Sheet */
					var bs = params[9].data[0];
					model.assetsAndLiabilities = {
						"cashInBank": bs['Cash in bank'],
						"payables": bs['Payables'],
						"accountsReceivable": bs['Accounts receivables'],
						"shortTermDebts": bs['Short-term debts '],
						"rawMaterial": bs['Raw material'],
						"currentPortionOfLongTermDeb": bs['Current portion of long-term debt'],
						"workInProgress": bs['Work in progress'],
						"finishedGoods": bs['Finished goods'],
						"totalCurrentAssets": bs['Total current assets'],
						"totalCurrentLiabilities": bs['Total current liabilities'],
						"machinery": bs['Machinery'],
						"longTermDebt": bs['Long-term debt'],
						"land": bs['Land'],
						"ownCapital": bs['Own capital'],
						"building": bs['Building'],
						"vehicle": bs['Vehicle'],
						"furnitureAndFixtures": bs['Furniture & Fixtures'],
						"totalFixedAssets": bs['Total fixed assets'],
						"totalLengTermLiabilities": bs['Total long-term liabilities'],
						"totalAssets": bs['Total Assets'],
						"totalLiabilities": bs['Total Liabilities']
					};
					self.renderReady("financial-summary");
				},
				"business-customer": function(bundleModel, model, params) {
					model.business = params;
					model.business.centreName = filterFilter(formHelper.enum('centre').data, {value: model.business.centreId})[0].name;

					var bankStatementSummary = (function() {
						var averageGraphData = [{
							"key": "Avg Bank Deposits",
							"color": "limegreen",
							"values": []
						}, {
							"key": "Avg Bank Balances",
							"color": "firebrick",
							"values": []
						}];
						var bouncesGraphData = [{
							"key": "No of EMI Bounces",	
							"color": "limegreen",
							"values": []
						}, {
							"key": "No of non EMI Bounces",
							"color": "firebrick",
							"values": []
						}];
						var totalAverageDeposits = 0;
						var totalAverageWithdrawals = 0;
						var totalAvgbalanceon15 = 0;
						var totalChequeBounces = 0;
						var totalEMIBounces = 0;
						var graphStatement = {};
						for (i = 0; i < model.business.customerBankAccounts.length; i++) {
							var acc = model.business.customerBankAccounts[i];
							var totalDeposits = 0;
							var totalOpeningBalance = 0;
							var totalClosingBalance = 0;
							var totalEMIAmountDeducted = 0;
							var totalWithdrawals = 0;
							var balnceon15 = 0;
							var noOfEmiChequeBounced = 0;
							var noOfChequeBounced = 0;
							for (j in acc.bankStatements) {
								var stat = acc.bankStatements[j];
								totalDeposits += stat.totalDeposits;
								totalOpeningBalance += stat.openingBalance;
								totalClosingBalance += stat.closingBalance;
								totalEMIAmountDeducted += stat.amountOfEmiDeducted;
								totalWithdrawals += stat.totalWithdrawals;
								balnceon15 += stat.balanceAsOn15th;
								noOfEmiChequeBounced += stat.noOfEmiChequeBounced;
								noOfChequeBounced += stat.noOfChequeBounced;

								var graphKey = stat.startMonth;							    
								if(graphStatement[graphKey]){
									graphStatement[graphKey].count++
								}else{
									graphStatement[graphKey]={};
									graphStatement[graphKey].count=1;

								}
								graphStatement[graphKey].totalDeposits = graphStatement[graphKey].totalDeposits || 0;
								graphStatement[graphKey].totalDeposits += stat.totalDeposits;
								graphStatement[graphKey].totalWithdrawals = graphStatement[graphKey].totalWithdrawals || 0;
								graphStatement[graphKey].totalWithdrawals += stat.totalWithdrawals;
								graphStatement[graphKey].balnceon15 = graphStatement[graphKey].balnceon15 || 0;
								graphStatement[graphKey].balnceon15 += stat.balanceAsOn15th;
								graphStatement[graphKey].noOfEmiChequeBounced = graphStatement[graphKey].noOfEmiChequeBounced || 0;
								graphStatement[graphKey].noOfEmiChequeBounced += stat.noOfEmiChequeBounced;
								graphStatement[graphKey].noOfChequeBounced = graphStatement[graphKey].noOfChequeBounced || 0;
								graphStatement[graphKey].noOfChequeBounced += stat.noOfChequeBounced;
							}
							acc.total = {
								"startMonth": "Average",
								"totalDeposits": totalDeposits,
								"averageOpeningBalance": totalOpeningBalance / acc.bankStatements.length,
								"averageClosingBalance": totalClosingBalance / acc.bankStatements.length,
								"averageEMIAmountDeducted": totalEMIAmountDeducted / acc.bankStatements.length,
								"averageDeposits": totalDeposits / acc.bankStatements.length,
								"totalWithdrawals": totalWithdrawals,
								"averageWithdrawals": totalWithdrawals / acc.bankStatements.length,
								"Avgbalnceon15": balnceon15 / acc.bankStatements.length,
								"noOfEmiChequeBounced": noOfEmiChequeBounced,
								"noOfChequeBounced": noOfChequeBounced
							};
							totalAverageDeposits += acc.total.averageDeposits;
							totalAverageWithdrawals += acc.total.averageWithdrawals;
							totalAvgbalanceon15 += acc.total.Avgbalnceon15,
							totalEMIBounces += acc.total.noOfEmiChequeBounced;
							totalChequeBounces += acc.total.noOfChequeBounced;
							acc.bankStatements.push(acc.total);
						}
						
                       // Graph data need to be sorted
                        var sortedGraphStatement = {};
                        Object.keys(graphStatement).sort().forEach(function(key) {
                         sortedGraphStatement[key] = graphStatement[key];
                         });

                        /*_.sortKeysBy(graphStatement);
                        _.sortKeysBy(obj, function(value, key) {
                            return value;
                        });*/


						_.forOwn(sortedGraphStatement, function(v, k) {
							k = moment(k, 'YYYY-MM-DD').format('MMM, YYYY');
							averageGraphData[0].values.push({
								"x": k,
								"y": v.totalDeposits / v.count,
								"series": 0
							})
							averageGraphData[1].values.push({
								"x": k,
								"y": v.balnceon15 / v.count,
								"series": 1
							})
							bouncesGraphData[0].values.push({
								"x": k,
								"y": v.noOfEmiChequeBounced,
								"series": 0
							})
							bouncesGraphData[1].values.push({
								"x": k,
								"y": v.noOfChequeBounced,
								"series": 1
							})
						});
						return {
							"averageMonthlyDeposit": totalAverageDeposits,
							"averageMonthlyWithdrawal": totalAverageWithdrawals,
							"averageMonthlyBalance": totalAvgbalanceon15,
							"totalAccounts": model.business.customerBankAccounts.length,
							"totalEMIBounces": totalEMIBounces,
							"totalChequeBounces": totalChequeBounces,
							"average": {
								"graphData": averageGraphData,
								"graphOptions": {
									"chart": {
										"type": "multiBarChart",
										"height": 280,
										"duration": 500,
										"stacked": false,
										"reduceXTicks": false
									}
								}
							},
							"bounces": {
								"graphData": bouncesGraphData,
								"graphOptions": {
									"chart": {
										"type": "multiBarChart",
										"height": 280,
										"duration": 500,
										"stacked": false,
										"rotateLabels": -90,
										"showControls": false,
										"reduceXTicks": false
									}
								}
							}
						};
					})();

					model.business.summary = {
						"bankStatement": bankStatementSummary
					}
					self.renderReady("business-customer");
				}
			},
			actions: {}
		}
	}
})