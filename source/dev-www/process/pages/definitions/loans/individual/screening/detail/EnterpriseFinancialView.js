define({
	pageUID: "loans.individual.screening.detail.EnterpriseFinancialView",
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
				model.bundlePageObj = bundlePageObj;
				model.bundleModel = bundleModel;
				self = this;

self.renderForm = function() {
	var buyerDetailsColumns = [{
		"title": "Buyer",
		"data": "buyer",
		render: function(data, type, full, meta) {
			return '<strong>'+data+'</strong>';
		}
	}];
	_.forOwn(model.summary.cashFlowDetails.buyerSummary.tableData[0], function(v, k) {
		if (k != "buyer" && k != "percentage") {
			buyerDetailsColumns.push({
				"title": _.capitalize(k),
				"data": k,
				"className": "text-right",
				render: function(data, type, full, meta) {
					return irfCurrencyFilter(data, null, null, "decimal") + ' ' + irfElementsConfig.currency.iconHtml;
				}
			});
		}
	})

	self.form = [{
		"type": "section",
		"html": `
<div class="col-sm-6"><i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">Existing Customer</em><br>&nbsp;</div>
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
			"type": "tableview",
			"key": "summary.cashFlowDetails.invoiceCash.tableData",
			"title": "Invoice vs Cash",
			"transpose": true,
			getColumns: function() {
				return [{
					"title": "Month",
					"data": "month",
					render: function(data, type, full, meta) {
						return '<strong>'+data+'</strong>';
					}
				}, {
					"title": "Invoice",
					"data": "invoice",
					"render": function(data, type, full, meta) {
						return irfCurrencyFilter(data);
					}
				}, {
					"title": "Cash",
					"data": "cash",
					"render": function(data, type, full, meta) {
						return irfCurrencyFilter(data);
					}
				}, {
					"title": "Scrap",
					"data": "scrap",
					"render": function(data, type, full, meta) {
						return irfCurrencyFilter(data);
					}
				}, {
					"title": "Total",
					"data": "total",
					"render": function(data, type, full, meta) {
						return irfCurrencyFilter(data);
					}
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
			"type": "fieldset",
			"title": "Buyer Summary",
			"items": [{
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
							"responsive": false,
							"scrollX": true
						},
						getColumns: function() {
							return [{
								"title": "Buyer",
								"data": "buyer"
							}, {
								"title": "Amount",
								"data": "average",
								"className": "text-right",
								"render": function(data, type, full, meta) {
									return irfCurrencyFilter(data);
								}
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
						"responsive": false,
						"scrollX": true
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
			}]
		}]
	}, {
		"type": "box",
		"readonly": true,
		"overrideType": "default-view",
		"colClass": "col-sm-12",
		"title": "Bank Statement Summary",
		"items": [{
			"type": "grid",
			"orientation": "horizontal",
			"items": [{
				"type": "grid",
				"orientation": "vertical",
				"items": [{
					"key": "bankAccountSummary.total_avg_deposit",
					"title": "Average Monthly Deposit"
				}, {
					"key": "",
					"title": "Average Monthly Withdrawls"
				}, {
					"key": "",
					"title": "Average Monthly Balance on requested EMI Date"
				}]
			}, {
				"type": "grid",
				"orientation": "vertical",
				"items": [{
					"key": "bankAccountSummary.total_account",
					"title": "Total no of Account"
				}, {
					"key": "bankAccountSummary.total_cheque_bounces",
					"title": "Total no of Cheque Bounce"
				}, {
					"key": "bankAccountSummary.total_EMI_bounces",
					"title": "Total no EMI Bounce"
				}]
			}]
		}, {
			"type": "expandablesection",
			"items": [{
				"type": "tableview",
				"key": "business.customerBankAccounts",
				"notitle": true,
				"transpose": true,
				getColumns: function() {
					return [{
						"title": "Bank Name",
						"data": "customerBankName",
						"render": function(data, type, full, meta) {
							return '<strong>'+data+'</strong>';
						}
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
						"data": "limit"
					}, {
						"title": "Bank Statement",
						"data": "bankStatements",
						"render": function(data, type, full, meta) {
							return data.reduce(function(r, o) {
								return r+'<a ng-href="'+Model_ELEM_FC.fileStreamUrl+'/'+o.bankStatementPhoto+'">'+moment(o.startMonth).format('MMMM YYYY')+'</a><br>'
							}, '');
						}
					}];
				}
			}]
		}]
	}, {
		"type": "box",
		"colClass": "col-sm-12",
		"items": [{
			"type": "section",
			"colClass": "col-sm-12",
			"html": '<table class="table table-responsive">' +
				'<colgroup>' +
				'<col width="30%"> <col width="30"> <col width="15%"> <col width="15%"> <col width="10%">' +
				'</colgroup>' +
				'<tbody>' +
				'<tr ng-style = "{\'font-weight\': \'bold\'}"><td></td><td></td><td>{{"AMOUNT" | translate}}</td><td>{{"Total" | translate}}</td><td></td></tr>' +
				'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"INCOME" | translate}}</td><td></td><td></td><td>{{model.businessPL.totalBusinessIncome | irfCurrency}}</td> <td></td> </tr>' +
				'<tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.businessPL.invoice | irfCurrency}}</td><td></td> <td>{{model.businessPL.invoicePCT}}</td> </tr>' +
				'<tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.businessPL.cashRevenue | irfCurrency}}</td><td></td> <td>{{model.businessPL.cashRevenuePCT}}</td> </tr>' +
				'<tr> <td></td><td>{{"SCRAP_OR_ANY_BUSINESS_INCOME" | translate}}</td><td>{{model.businessPL.scrapIncome | irfCurrency}}</td><td></td> <td>{{model.businessPL.scrapIncomePCT }}</td> </tr>' +
				'<tr class="dotted"> <th></th> <th></th> <th></th> <th></th> <th></th> </tr>' +
				'<tr class="table-sub-header" ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"PURCHASES" | translate}}</td><td></td><td></td><td>{{model.businessPL.purchases | irfCurrency}}</td><td></td></tr>' +

				'<tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.p1.business.purchase_invoice | irfCurrency}}</td><td></td> <td></td><td>{{model.p1.business.purchase_invoice_pct}}</td> </tr>' +
				'<tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.p1.business.purchase_cash | irfCurrency}}</td><td></td><td></td> <td>{{model.p1.business.purchase_cash_pct}}</td> </tr>' +

				'<tr class="table-sub-header" ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"OPEX" | translate}}</td><td></td><td>{{model.businessPL.Opex | irfCurrency}}</td> <td></td> </tr>' +
				'<tr ng-repeat="items in model._opex"><td></td><td>{{items["Expenditure Source"]}}</td><td>{{items["Monthly Expense"] | irfCurrency}}</td><td></td><td>{{items["% of Avg Monthly Revenue"]}}</td></tr>' +

				'<tr class="table-sub-header" ng-style = "{\'font-weight\': \'bold\'}"> <th>{{"TOTAL EXPANSES" | translate}}</th> <th></th> <th>{{model.businessPL.grossIncome | irfCurrency}}</th> <th></th> </tr>' +
				'<tr> <td><strong>{{"EBITDA" | translate}}</strong></td><td></td><td><strong>{{model.businessPL.EBITDA | irfCurrency}}</strong></td><td></td> <td>{{model.businessPL.EBITDA_PCT }}</td> </tr>' +
				'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"> <th>{{"EXISTING_LOAN_PAYMENTS" | translate}}</th> <th></th> <th></th> <th></th> <th></th> </tr>' +
				'<tr> <td></td><td>{{"BUSINESS_LIABILITIES" | translate}}</td><td>{{model.businessPL.businessLiabilities | irfCurrency}}</td> <td></td> </tr>' +
				'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"><td>{{"NET INCOME"}}</td><td></td><td></td><td></td><td></td></tr>' +
				'<tr> <td></td><td>{{"NET_INCOME" | translate}}</td> <td>{{model.businessPL.netIncome | irfCurrency}}</td> <td></td><td></td> </tr>' +

				'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"><td>{{"HOUSEHOLD NET INCOME"}}</td><td></td><td></td><td></td><td></td></tr>' +
				'<tr> <td></td><td>{{"HOUSEHOLD NET INCOME" | translate}}</td><td>{{model.businessPL.netBusinessIncome | irfCurrency}}</td><td></td><td>{{model.businessPL.netBusinessIncomePCT }}</td> </tr>' +

				'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"KINARA_EMI" | translate}}</td><td></td><td></td> <td></td> </tr>' +

				'<tr><td></td><td>Kinara EMI</td><td>{{model.businessPL.finalKinaraEmi | irfCurrency}}</td><td></td> <td>{{model.businessPL.finalKinaraEmiPCT }}</td> </tr>' +
				'</tbody>' +
				'</table>'
		}]
	}, {
		"type": "box",
		"colClass": "col-sm-12",
		"notitle": true,
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
				'<tr><td>{{"CASH_IN_BANK" | translate}}</td><td>{{model.assetsAndLiabilities.cashInBank | irfCurrency}}</td><td>{{"PAYABLES" | translate}}</td><td>{{model.assetsAndLiabilities.payables | irfCurrency}}</td></tr>' +
				'<tr><td>{{"ACCOUNTS_RECEIVABLES" | translate}}</td><td>{{model.assetsAndLiabilities.accountsReceivable | irfCurrency}}</td><td>{{"SHORT_TERM_DEBTS" | translate}}</td><td>{{model.assetsAndLiabilities.shortTermDebts | irfCurrency}}</td></tr>' +
				'<tr><td>{{"RAW_MATERIAL" | translate}}</td><td>{{model.assetsAndLiabilities.rawMaterial | irfCurrency}}</td><td>{{"CURRENT_PORTION_OF_LONG_TERM_DEBT" | translate}}</td><td>{{model.assetsAndLiabilities.currentPortionOfLongTermDeb | irfCurrency}}</td></tr>' +
				'<tr><td>{{"WORK_IN_PROGRESS" | translate}}</td><td>{{model.assetsAndLiabilities.workInProgress | irfCurrency}}</td><td></td><td></td></tr>' +
				'<tr><td>{{"FINISHED_GOODS" | translate}}</td><td>{{model.assetsAndLiabilities.finishedGoods | irfCurrency}}</td><td></td><td></td></tr>' +
				'<trclass="table-sub-header"><th>{{"TOTAL_CURRENT_ASSETS" | translate}}</th><th>{{model.assetsAndLiabilities.totalCurrentAssets | irfCurrency}}</th><th>{{"TOTAL_CURRENT_LIABILITIES" | translate}}</th><th>{{model.assetsAndLiabilities.totalCurrentLiabilities | irfCurrency}}</th></tr>' +
				'<tr ><td >{{"FIXED_ASSETS" | translate}}</td><td >{{"LONG_TERM_LIABILITIES" | translate}}</td></tr><tr><td>{{"MACHINERY" | translate}}</td><td>{{model.assetsAndLiabilities.machinery | irfCurrency}}</td><td>{{"LONGTERMDEBT" | translate}}</td><td>{{model.assetsAndLiabilities.longTermDebt | irfCurrency}}</td></tr>' +
				'<tr><td>{{"LAND" | translate}}</td><td>{{model.assetsAndLiabilities.land | irfCurrency}}</td><td>{{"OWN_CAPITAL" | translate}}</td><td>{{model.assetsAndLiabilities.ownCapital | irfCurrency}}</td></tr><tr><td>{{"BUILDING" | translate}}</td><td>{{model.assetsAndLiabilities.building | irfCurrency}}</td><td></td><td></td></tr>' +
				'<tr><td>{{"VEHICLE" | translate}}</td><td>{{model.assetsAndLiabilities.vehicle | irfCurrency}}</td><td></td><td></td></tr>' +
				'<tr><td>{{"FURNITURE_AND_FIXING" | translate}}</td><td>{{model.assetsAndLiabilities.furnitureAndFixtures | irfCurrency}}</td><td></td><td></td></tr>' +
				'<tr><td>{{"TOTAL_FIXED_ASSETS" | translate}}</td><td>{{model.assetsAndLiabilities.totalFixedAssets | irfCurrency}}</td><td>{{"TOTAL_LONG_TERM_LIABILITIES" | translate}}</td><td>{{model.assetsAndLiabilities.totalLengTermLiabilities | irfCurrency}}</td></tr><tr></tr>' +
				'<tr class="table-bottom-summary"><th>{{"TOTAL_ASSETS" | translate}}</th><th>{{model.assetsAndLiabilities.totalAssets | irfCurrency}}</th><th>{{"TOTAL_LIABILITIES" | translate}}</th><th>{{model.assetsAndLiabilities.totalLiabilities | irfCurrency}}</th></tr>' +
				'</tbody>' +
				'</table>'
		}]
	}];
}
			},
			form: [],
			schema: function() {
				return Enrollment.getSchema().$promise;
			},
			eventListeners: {
				"financial-summary": function(bundleModel, model, params) {
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
						"key": "Scrap",
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
							x.scrap = d.data["Revenue from Scrap Amount"] || 0;
							x.total = d.data["Revenue from Sales Amount"] || 0;
						} else {
							x.month = d["Month"];
							x.invoice = d["Invoice Sales Amount"] || 0;
							x.cash = d["Cash Sales Amount"] || 0;
							x.scrap = d["Revenue from Scrap Amount"] || 0;
							x.total = d["Revenue from Sales Amount"] || 0;
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
								"y": x.scrap,
								"series": 2
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

					model.summary = {
						"cashFlowDetails": {
							"invoiceCash": {
								"tableData": invoiceCashTableData,
								"graphData": invoiceCashGraphData,
								"graphOptions": {
									"chart": {
										"type": "multiBarChart",
										"height": 250,
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
										"height": 250,
										"duration": 500,
										"stacked": false
									}
								}
							}
						}
					};

					var bpl = params[8].data[0];
					model.businessPL = {
						"scrapIncome": bpl['Scrap or any business related income'],
						"scrapIncomePCT": bpl['Scrap or any business related income pct'],
						"totalBusinessIncome": bpl['Total Business Revenue'],
						"purchases": bpl['Purchases'],
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
					self.renderForm();
				},
				"business_customer": function(bundleModel, model, params) {
					model.business = params;
					model.business.centreName = filterFilter(formHelper.enum('centre').data, {value: model.business.centreId})[0].name;

					for (i = 0; i < model.business.customerBankAccounts.length; i++) {
						var acc = model.business.customerBankAccounts[i];
					}

					model.business.summary = {
						"bankStatementSummary": {
							"averageMonthlyDeposit": 0,
							"averageMonthlyWithdrawals": 0,
							"averageMonthlyBalance": 0,
							"totalAccounts": model.business.customerBankAccounts.length,
							"totalChequeBounces": 0,
							"totalEMIBounces": 0
						}
					}
				}
			},
			actions: {}
		}
	}
})