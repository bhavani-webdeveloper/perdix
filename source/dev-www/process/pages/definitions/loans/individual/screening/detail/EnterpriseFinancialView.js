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
				model.custom_fields = {
					'bank_fields': {}
				};
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
					key: "summary.cashFlowDetails.data",
					title: "Invoice Vs Cash",
					transpose: true,
					getColumns: function() {
						return [{
							"title": "  ",
							"data": "Month",
							render: function(data, type, full, meta) {
								if (data) return '<strong>'+data+'</strong>';
								if (_.isObject(full.data)) {
									if (full.data[this.data] == 'Avg. Total By Buyer') {
										full.data[this.data] = 'Average';
									}
									return '<strong>'+full.data[this.data]+'</strong>';
								}
							}
						}, {
							"title": "Invoice",
							"data": "Invoice Sales Amount",
							render: function(data, type, full, meta) {
								if (data) return irfCurrencyFilter(data);
								if (_.isObject(full.data)) return irfCurrencyFilter(full.data[this.data] || '0');
								else return irfCurrencyFilter('0');
							}
						}, {
							"title": "Cash",
							"data": "Cash Sales Amount",
							render: function(data, type, full, meta) {
								if (data) return irfCurrencyFilter(data);
								if (_.isObject(full.data)) return irfCurrencyFilter(full.data[this.data] || '0');
								else return irfCurrencyFilter('0');
							}
						}, {
							"title": "Scrap",
							"data": "Revenue from Scrap Amount",
							render: function(data, type, full, meta) {
								if (data) return irfCurrencyFilter(data);
								if (_.isObject(full.data)) return irfCurrencyFilter(full.data[this.data] || '0');
								else return irfCurrencyFilter('0');
							}
						}, {
							"title": "Total",
							"data": "Revenue from Sales Amount",
							render: function(data, type, full, meta) {
								if (data) return irfCurrencyFilter(data);
								if (_.isObject(full.data)) return irfCurrencyFilter(full.data[this.data] || '0');
								else return irfCurrencyFilter('0');
							}
						}];
					}
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
							"key": "custom_fields.bank_fields.total_avg_Deposit",
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
							"key": "custom_fields.bank_fields.toal_account",
							"title": "Total no of Account"
						}, {
							"key": "custom_fields.bank_fields.tot_checque_bounce",
							"title": "Total no of Cheque Bounce"
						}, {
							"key": "custom_fields.bank_fields.tot_EMI_bounce",
							"title": "Total no EMI Bounce"
						}]
					}]
				}, {
					"type": "section",
					"items": [{
						"type": "tableview",
						"key": "bankAccountDetails.BankAccounts",
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
						"key": "business_bank_statement.data",
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
						'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"INCOME" | translate}}</td><td></td><td></td><td>{{model.pl.business.totalBusinessIncome | irfCurrency}}</td> <td></td> </tr>' +
						'<tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.pl.business.invoice | irfCurrency}}</td><td></td> <td>{{model.pl.business.invoicePCT}}</td> </tr>' +
						'<tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.pl.business.cashRevenue | irfCurrency}}</td><td></td> <td>{{model.pl.business.cashRevenuePCT}}</td> </tr>' +
						'<tr> <td></td><td>{{"SCRAP_OR_ANY_BUSINESS_INCOME" | translate}}</td><td>{{model.pl.business.scrapIncome | irfCurrency}}</td><td></td> <td>{{model.pl.business.scrapIncomePCT }}</td> </tr>' +
						'<tr class="dotted"> <th></th> <th></th> <th></th> <th></th> <th></th> </tr>' +
						'<tr class="table-sub-header" ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"PURCHASES" | translate}}</td><td></td><td></td><td>{{model.pl.business.purchases | irfCurrency}}</td><td></td></tr>' +

						'<tr> <td></td><td>{{"INVOICE" | translate}}</td><td>{{model.p1.business.purchase_invoice | irfCurrency}}</td><td></td> <td></td><td>{{model.p1.business.purchase_invoice_pct}}</td> </tr>' +
						'<tr> <td></td><td>{{"CASH" | translate}}</td><td>{{model.p1.business.purchase_cash | irfCurrency}}</td><td></td><td></td> <td>{{model.p1.business.purchase_cash_pct}}</td> </tr>' +

						'<tr class="table-sub-header" ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"OPEX" | translate}}</td><td></td><td>{{model.pl.business.Opex | irfCurrency}}</td> <td></td> </tr>' +
						'<tr ng-repeat="items in model._opex.data"><td></td><td>{{items["Expenditure Source"]}}</td><td>{{items["Monthly Expense"] | irfCurrency}}</td><td></td><td>{{items["% of Avg Monthly Revenue"]}}</td></tr>' +

						'<tr class="table-sub-header" ng-style = "{\'font-weight\': \'bold\'}"> <th>{{"TOTAL EXPANSES" | translate}}</th> <th></th> <th>{{model.pl.business.grossIncome | irfCurrency}}</th> <th></th> </tr>' +
						'<tr> <td><strong>{{"EBITDA" | translate}}</strong></td><td></td><td><strong>{{model.pl.business.EBITDA | irfCurrency}}</strong></td><td></td> <td>{{model.pl.business.EBITDA_PCT }}</td> </tr>' +
						'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"> <th>{{"EXISTING_LOAN_PAYMENTS" | translate}}</th> <th></th> <th></th> <th></th> <th></th> </tr>' +
						'<tr> <td></td><td>{{"BUSINESS_LIABILITIES" | translate}}</td><td>{{model.pl.business.businessLiabilities | irfCurrency}}</td> <td></td> </tr>' +
						'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"><td>{{"NET INCOME"}}</td><td></td><td></td><td></td><td></td></tr>' +
						'<tr> <td></td><td>{{"NET_INCOME" | translate}}</td> <td>{{model.pl.business.netIncome | irfCurrency}}</td> <td></td><td></td> </tr>' +

						'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"><td>{{"HOUSEHOLD NET INCOME"}}</td><td></td><td></td><td></td><td></td></tr>' +
						'<tr> <td></td><td>{{"HOUSEHOLD NET INCOME" | translate}}</td><td>{{model.pl.business.netBusinessIncome | irfCurrency}}</td><td></td><td>{{model.pl.business.netBusinessIncomePCT }}</td> </tr>' +

						'<tr class="table-sub-header " ng-style = "{\'font-weight\': \'bold\'}"> <td>{{"KINARA_EMI" | translate}}</td><td></td><td></td> <td></td> </tr>' +

						'<tr><td></td><td>Kinara EMI</td><td>{{model.pl.business.finalKinaraEmi | irfCurrency}}</td><td></td> <td>{{model.pl.business.finalKinaraEmiPCT }}</td> </tr>' +
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
					var cashFlowDetails = _.cloneDeep(params[15]);
					cashFlowDetails.data.pop();
					model.summary = {
						cashFlowDetails: cashFlowDetails,
						bankAccountDetails: params[10],
						businessBankStmtSummary: params[16],
						businessPL: params[8]
					};


					model.cashFlowDetails = params[15];
					model.bankAccountDetails = params[10];
					model.business_bank_statement = params[16];
					model.businessPL = params[8];
					model.purchaseDetails = params[18];
					model._opex = params[21];
					model.balanceSheet = params[9];

					/*Bank Account Fielsa*/
					model.custom_bank_statement = [];
					model.custom_fields.bank_fields.total_avg_Deposit = 0;
					model.custom_fields.bank_fields.toal_account = model.bankAccountDetails.BankAccounts.length;

					model.custom_fields.bank_fields.total_avg_withdrawals = 0;
					model.custom_fields.bank_fields.avg_bal_EMI_date;
					model.custom_fields.bank_fields.tot_checque_bounce = 0;
					model.custom_fields.bank_fields.tot_EMI_bounce = 0;
					_.each(model.bankAccountDetails.BankAccounts, function(account) {
						model.custom_fields.bank_fields.total_avg_Deposit += account['Average Bank Deposit'];
						model.custom_fields.bank_fields.tot_checque_bounce += account['Total Cheque Bounced(Non EMI)'];
						model.custom_fields.bank_fields.tot_EMI_bounce += account['Total EMI Bounced'];
					});


					model.pl = {
						business: {}
					};
					/*
										model.p1.business.purchase_invoice=model.purchaseDetails.data[0]['Invoice Sales Amount'];
										model.p1.business.purchase_invoice_pct=model.purchaseDetails.data[0]['Invoice (%)'];
										model.p1.business.purchase_cash=model.purchaseDetails.data[0]['Cash Sales Amount'];
										model.p1.business.purchase_cash_pct=model.purchaseDetails.data[0]['Cash (%)'];*/
					model.pl.business.invoice /*= model.businessPL.data[0]['Invoice']*/ ;
					model.pl.business.invoicePCT /*= model.businessPL.data[0]['Invoice pct']*/ ;
					model.pl.business.cashRevenue /*= model.businessPL.data[0]['Cash']*/ ;
					model.pl.business.cashRevenuePCT /*= model.businessPL.data[0]['Cash pct']*/ ;
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