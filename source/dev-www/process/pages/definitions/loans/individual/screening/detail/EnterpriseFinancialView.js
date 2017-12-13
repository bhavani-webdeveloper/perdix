define({
	pageUID: "loans.individual.screening.detail.EnterpriseFinancialView",
	pageType: "Engine",
	dependencies: ["$log", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter"],
	$pageFn: function($log, Enrollment, formHelper, filterFilter, irfCurrencyFilter) {
		return {
			"type": "schema-form",
			"title": "ENTERPRISE_FINANCIAL_VIEW",
			"subTitle": "",
			initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
				model.bundlePageObj = bundlePageObj;
				model.bundleModel = bundleModel;
			},
			form: [{
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
				"title": "Section 1 Cash Flow Summary",
				"colClass": "col-sm-12",
				"items": [{
					type: "tableview",
					key: "summary.cashFlowDetails.invoiceCash.tableData",
					title: "Invoice Vs Cash",
					transpose: true,
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
				}]
			}, {
				"type": "box",
				"overrideType": "default-view",
				"readonly": true,
				"title": "Bank Vs NonBank",
				"colClass": "col-sm-12",
				"items": []
			}, {
				"type": "box",
				"readonly": true,
				"overrideType": "default-view",
				"title": "Buyer Summary",
				"colClass": "col-sm-12",
				"items": []
			}, {
				"type": "box",
				"readonly": true,
				"overrideType": "default-view",
				"colClass": "col-sm-12",
				"title": "BANK_ACCOUNT_DETAILS",
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
					"type": "section",
					"items": [{
						"type": "tableview",
						"key": "bankAccounts",
						"title": "",
						"selectable": false,
						"transpose": true,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"title": "Bank Name",
								"data": "Bank Name"
							}, {
								"title": "Branch Name",
								"data": "",
								render: function(data, type, full, meta) {
									if (!full.branchName)
										return "NA";
									return full.branchName
								}

							}, {
								"title": "IFSC Code",
								"data": "IFS Code"
							}, {
								"title": "Account Holder Name",
								"data": "Account Holder Name"
							}, {
								"title": "Account Number",
								"data": "Account Number"
							}, {
								"title": "Account Type",
								"data": "Account Type"
							}, {
								"title": "Banking Since",
								"data": "",
								render: function(data, type, full, meta) {
									if (!full.Banking_Since)
										return "NA";
									return full.Banking_Since
								}
							}, {
								"title": "Net Banking Available",
								"data": "",
								render: function(data, type, full, meta) {
									if (!full.Net_Banking_Available)
										return "NA";
									return full.Net_Banking_Available
								}
							}, {
								"title": "Limit",
								"data": "Limit"
							}];
						},
						getActions: function() {
							return [];
						}
					}]
				}, {
					"type": "section",
					"items": [{
						"type": "tableview",
						"key": "businessBankStmtSummary",
						"title": "",
						"selectable": false,
						"transpose": true,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"notitle": true,
								"data": "data.Month"
							}, {
								"notitle": true,
								"data": "",
								render: function(data, type, full, meta) {
									return '<div class="dotted"></div>'
								}
							}, {
								"title": "Average Bank Balance",
								"data": "data.Average Bank Balance"
							}, {
								"title": "Average Bank Deposits",
								"data": "data.Average Bank Deposits"
							}, {
								"title": "No of EMI Bounces",
								"data": "data.No of EMI Bounces"
							}, {
								"title": "No of non EMI Bounces",
								"data": "data.No of non EMI Bounces"
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
			}, {

			}],
			schema: function() {
				return Enrollment.getSchema().$promise;
			},
			eventListeners: {
				"financial-summary": function(bundleModel, model, params) {
					model.cashflowDetails = params[15].data;
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
					for (i = 0; i < model.cashflowDetails.length - 1; i++) {
						var d = model.cashflowDetails[i];
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
					_.forOwn(model.cashflowDetails[model.cashflowDetails.length - 1].data, function(v, k) {
						for (i in model.cashflowDetails)
						if (k == "Month") {
							//
						} else {

						}
					});
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
										"height": 250,
										"duration": 500,
										"stacked": false
									}
								}
							}
						}
					};

					model.businessBankStmtSummary = params[16].data;
					model._opex = params[21].data;

					model.bankAccounts = params[10].BankAccounts;
					model.bankAccountSummary = {
						"total_avg_deposit": 0,
						"total_account": model.bankAccounts.length,
						"total_avg_withdrawals": 0,
						"total_cheque_bounces": 0,
						"total_EMI_bounces": 0
					};
					_.each(model.bankAccounts, function(account) {
						model.bankAccountSummary.total_avg_deposit += account['Average Bank Deposit'];
						model.bankAccountSummary.total_cheque_bounces += account['Total Cheque Bounced(Non EMI)'];
						model.bankAccountSummary.total_EMI_bounces += account['Total EMI Bounced'];
					});

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
				},
				"business_customer": function(bundleModel, model, params) {
					model.business = params;
					model.business.centreName = filterFilter(formHelper.enum('centre').data, {value: model.business.centreId})[0].name;
				}
			},
			actions: {}
		}
	}
})