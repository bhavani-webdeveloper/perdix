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
						'<tr><td>{{"Destination Total Income" | translate}}</td><td>{{model.destinationTotalIncome | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Source Total Income" | translate}}</td><td>{{model.sourceTotalIncome | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Income Grand Total" | translate}}</td><td>{{model.incomeGrandTotal | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Destination Total Expenses" | translate}}</td><td>{{model.destinationTotalExpenses | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Source Total Expenses" | translate}}</td><td>{{model.sourceTotalExpenses | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Expenses Grand Total" | translate}}</td><td>{{model.expensesGrandTotal | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Destination Extra" | translate}}</td><td>{{model.destinationExtra | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Source Extra" | translate}}</td><td>{{model.sourceExtra | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Total Extra" | translate}}</td><td>{{model.totalExtra | irfCurrency}}</td></tr>'+
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
						'<tr><td>{{"Total Current assets" | translate}}</td><td>{{model.totalCurrentAssets | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Total Fixed assets" | translate}}</td><td>{{model.totalFixedAsstes | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Total Liabilites" | translate}}</td><td>{{model.totalLiabilites | irfCurrency}}</td></tr>'+
						
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
						'<tr><td>{{"Total Members" | translate}}</td><td>{{model.totalMembers | irfCurrency}}</td></tr>'+
						'<tr><td>{{"Earning members" | translate}}</td><td>{{model.earningMembers | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No.of Migrants" | translate}}</td><td>{{model.noOfMigrants | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No. of Children" | translate}}</td><td>{{model.noOfChildren | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No of school going" | translate}}</td><td>{{model.noOfSchoolGoing | irfCurrency}}</td></tr>'+
						'<tr><td>{{"No. of college going" | translate}}</td><td>{{model.noOfCollegeGoing | irfCurrency}}</td></tr>'+
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