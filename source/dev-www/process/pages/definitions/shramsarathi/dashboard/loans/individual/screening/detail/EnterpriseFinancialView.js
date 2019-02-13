define({
	pageUID: "shramsarathi.dashboard.loans.individual.screening.detail.EnterpriseFinancialView",
	pageType: "Engine",
	dependencies: ["$log", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter", "irfElementsConfig", "Model_ELEM_FC"],
	$pageFn: function($log, Enrollment, formHelper, filterFilter, irfCurrencyFilter, irfElementsConfig, Model_ELEM_FC) {
		var randomColor = function() {
			return (function(m,s,c){return (c ? arguments.callee(m,s,c-1) : '#') + s[m.floor(m.random() * s.length)]})(Math,'0123456789ABCDEF',5);
		}
		var self = null;
		return {
			"type": "schema-form",
			"title": "FINANCIAL_INFORMATION_SUMMARY",
			"subTitle": "",
			initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
				model.bundlePageObj = bundlePageObj;
				model.bundleModel = bundleModel;
				self = this;
            $log.log("bundleModel",model.bundleModel);
				// self.form = [{
				// 	"type": "section",
				// 	"html": '<br><div style="text-align:center">Waiting for summary..<br><br><ripple-loader></ripple-loader></div>'
				// }];
				model.incomeExpense={};
				model.incomeExpense.destinationTotalIncome=0;
				model.incomeExpense.sourceTotalIncome=0;
				model.incomeExpense.incomeGrandTotal=0;
				model.incomeExpense.destinationTotalExpenses=0;
				model.incomeExpense.sourceTotalExpenses=0;
				model.incomeExpense.expensesGrandTotal=0;
				model.incomeExpense.destinationExtra=0;
				model.incomeExpense.sourceExtra=0;
				model.incomeExpense.totalExtra=0;
				model.assetsLiabilites={};
				model.assetsLiabilites.totalCurrentAssets=0;
				model.assetsLiabilites.totalFixedAsstes=0;
				model.assetsLiabilites.totalLiabilites =0;
				model.familyInfo={};
				model.familyInfo.totalMembers=0;
				model.familyInfo.earningMembers=0;
				model.familyInfo.noOfMigrants=0;
				model.familyInfo.noOfChildren=0;
				model.familyInfo.noOfSchoolGoing=0;
				model.familyInfo.noOfCollegeGoing=0;
				model.proposedAmount=0;
			},
			form: [	
				{
				"type": "box",
				"colClass": "col-sm-12",
				"notitle": true,
				"title": "Income /Expense ",
				"items": [
	
				{
					"type": "section",
					"colClass": "col-sm-12",
					"html": '<table class="table table-responsive">' +
						'<tbody>' +
						'<tr><td>{{"Destination Total Income" | translate}}</td><td>{{model.incomeExpense.destinationTotalIncome | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Source Total Income" | translate}}</td><td>{{model.incomeExpense.sourceTotalIncome | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Income Grand Total" | translate}}</td><td>{{model.incomeExpense.incomeGrandTotal | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Destination Total Expenses" | translate}}</td><td>{{model.incomeExpense.destinationTotalExpenses | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Source Total Expenses" | translate}}</td><td>{{model.incomeExpense.sourceTotalExpenses | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Expenses Grand Total" | translate}}</td><td>{{model.incomeExpense.expensesGrandTotal | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Destination Extra" | translate}}</td><td>{{model.incomeExpense.destinationExtra | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Source Extra" | translate}}</td><td>{{model.incomeExpense.sourceExtra | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Total Extra" | translate}}</td><td>{{model.incomeExpense.totalExtra | irfCurrency}}</td></tr>'+
						'</tbody>' +
						'</table>'
				}
			]
			},
			{
				"type": "box",
				"colClass": "col-sm-12",
				"notitle": true,
				"title": "Assets / Liabilites",
				"items": [
	
				{
					"type": "section",
					"colClass": "col-sm-12",
					"html": '<table class="table table-responsive">' +
						'<tbody>' +
						'<tr><td>{{"Total Current assets" | translate}}</td><td>{{model.assetsLiabilites.totalCurrentAssets | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Total Fixed assets" | translate}}</td><td>{{model.assetsLiabilites.totalFixedAsstes | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Total Liabilites" | translate}}</td><td>{{model.assetsLiabilites.totalLiabilites | irfCurrency}}</td></tr>'+
						
						'</tbody>' +
						'</table>'
				}
			]
			},
			{
				"type": "box",
				"colClass": "col-sm-12",
				"notitle": true,
				"title": "Family info",
				"items": [
	
				{
					"type": "section",
					"colClass": "col-sm-12",
					"html": '<table class="table table-responsive">' +
						'<tbody>' +
						'<tr><td>{{"Total Members" | translate}}</td><td>{{model.familyInfo.totalMembers | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Earning members" | translate}}</td><td>{{model.familyInfo.earningMembers | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No.of Migrants" | translate}}</td><td>{{model.familyInfo.noOfMigrants | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No. of Children" | translate}}</td><td>{{model.familyInfo.noOfChildren | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No of school going" | translate}}</td><td>{{model.familyInfo.noOfSchoolGoing | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No. of college going" | translate}}</td><td>{{model.familyInfo.noOfCollegeGoing | irfCurrency}}</td></tr>'+
						'</tbody>' +
						'</table>'
				},{
					"type":"text",
					"title":"Proposed Amount",
					"key":"model.proposedAmount"
				}
			]
			}
		
		],
			schema: function() {
				return Enrollment.getSchema().$promise;
			},
			eventListeners: {
				
			},
			actions: {}
		}
	}
})