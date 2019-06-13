define({
	pageUID: "shramsarathi.dashboard.loans.individual.screening.detail.EnterpriseFinancialView",
	pageType: "Engine",
	dependencies: ["$log", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter", "irfElementsConfig", "Model_ELEM_FC","Misc","BundleManager","IndividualLoan"],
	$pageFn: function($log, Enrollment, formHelper, filterFilter, irfCurrencyFilter, irfElementsConfig, Model_ELEM_FC,Misc,BundleManager,IndividualLoan) {
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
				Misc.getSummary({"customer_id":model.customerId}).$promise.then(function(resp){
				//Misc.getSummary({"customer_id":77}).$promise.then(function(resp){ 
				   console.log(model);
				   console.log("------model");
					console.log(resp);
				model.incomeExpense={};
				model.incomeExpense.destinationTotalIncome= resp.destination ;
				model.incomeExpense.sourceTotalIncome= resp.source;
				model.incomeExpense.incomeGrandTotal= resp.destination + resp.source;
				model.incomeExpense.destinationTotalExpenses= resp.distination_total_expense;
				model.incomeExpense.sourceTotalExpenses=resp.source_total_expense;
				model.incomeExpense.expensesGrandTotal= resp.distination_total_expense + resp.source_total_expense;
				model.incomeExpense.destinationExtra = resp.destination - resp.distination_total_expense;
				model.incomeExpense.sourceExtra = resp.source - resp.source_total_expense;
				model.incomeExpense.totalExtra = model.incomeExpense.destinationExtra + model.incomeExpense.sourceExtra;
				model.assetsLiabilites={};
				model.assetsLiabilites.totalCurrentAssets= resp.total_current_assets;
				model.assetsLiabilites.totalFixedAsstes = resp.total_fixed_assets;
				model.assetsLiabilites.totalLiabilites = resp.total_liability;
				model.familyInfo={};
				model.familyInfo.totalMembers = resp.total_members;
				model.familyInfo.earningMembers = resp.earning_members;
				model.familyInfo.noOfMigrants = resp.no_of_migrants;
				model.familyInfo.noOfChildren = resp.no_of_childrens;
				model.familyInfo.noOfSchoolGoing = resp.no_of_school_going;
				model.familyInfo.noOfCollegeGoing = resp.no_of_college_going;
				model.proposedAmount = 0;
				BundleManager.broadcastEvent('financial-income', model);
				})

				//financial summary event
				IndividualLoan.get({
					id: model.customerId
				})
				.$promise
				.then(function(resp){
					var params=[{data:[{'Loan Product':resp.productCategory,'Tenure':resp.tenure,'financialSummaryModel':model}]}];
                       BundleManager.broadcastEvent('financial-sum', params);
				},function(err){
				})	
			},
			form: [	
				{
				"type": "box",
				"colClass": "col-sm-12",
				"notitle": true,
				"title": "Income / Expense ",
				"items": [
	
				{
					"type": "section",
					"colClass": "col-sm-12",
					"html": '<table class="table table-responsive">' +
						'<tbody>' +
						'<tr><td>{{"Destination Total Income" | translate}}</td><td>{{model.incomeExpense.destinationTotalIncome }}</td></tr>'+
						'<tr><td>{{"Source Total Income" | translate}}</td><td>{{model.incomeExpense.sourceTotalIncome }}</td></tr>'+
						'<tr><td>{{"Income Grand Total" | translate}}</td><td>{{model.incomeExpense.incomeGrandTotal }}</td></tr>'+
						'<tr><td>{{"Destination Total Expenses" | translate}}</td><td>{{model.incomeExpense.destinationTotalExpenses }}</td></tr>'+
						'<tr><td>{{"Source Total Expenses" | translate}}</td><td>{{model.incomeExpense.sourceTotalExpenses }}</td></tr>'+
						'<tr><td>{{"Expenses Grand Total" | translate}}</td><td>{{model.incomeExpense.expensesGrandTotal }}</td></tr>'+
						'<tr><td>{{"Destination Surplus" | translate}}</td><td>{{model.incomeExpense.destinationExtra }}</td></tr>'+
						'<tr><td>{{"Source Surplus" | translate}}</td><td>{{model.incomeExpense.sourceExtra }}</td></tr>'+
						'<tr><td>{{"Total Extra" | translate}}</td><td>{{model.incomeExpense.totalExtra }}</td></tr>'+
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
						'<tr><td>{{"Total Current assets" | translate}}</td><td>{{model.assetsLiabilites.totalCurrentAssets }}</td></tr>'+
						'<tr><td>{{"Total Fixed assets" | translate}}</td><td>{{model.assetsLiabilites.totalFixedAsstes }}</td></tr>'+
						'<tr><td>{{"Total Liabilites" | translate}}</td><td>{{ model.assetsLiabilites.totalLiabilites }}</td></tr>'+
						
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
						'<tr><td>{{"Total Members" | translate}}</td><td>{{model.familyInfo.totalMembers }}</td></tr>'+
						'<tr><td>{{"Earning members" | translate}}</td><td>{{model.familyInfo.earningMembers }}</td></tr>'+
						'<tr><td>{{"No.of Migrants" | translate}}</td><td>{{model.familyInfo.noOfMigrants }}</td></tr>'+
						'<tr><td>{{"No. of Children" | translate}}</td><td>{{model.familyInfo.noOfChildren }}</td></tr>'+
						'<tr><td>{{"No of school going" | translate}}</td><td>{{model.familyInfo.noOfSchoolGoing }}</td></tr>'+
						'<tr><td>{{"No. of college going" | translate}}</td><td>{{model.familyInfo.noOfCollegeGoing }}</td></tr>'+
						'<tr style="display:none"><td>{{"Proposed Amount" | translate}}</td><td>{{model.proposedAmount }}</td></tr>'+
						'</tbody>' +
						'</table>'
				},
				// {
				// 	"type":"text",
				// 	"title":"Proposed Amount",
				// 	"key":"model.proposedAmount"
				//}
			]
			}
		
		],
			schema: function() {
				return Enrollment.getSchema().$promise;
			},
			// eventListeners: {
			// 	"Individual_Enrollment":function(bundleModel,model,params){
			// 		console.log("Individual_Enrollment",params);
			// 		model.liability=params.liabilities.length;
			// 		//debugger;
			// 	},
			// 	"Enrollment2":function(bundleModel,model,params){
			// 		console.log("Enrollment2",params);
			// 		model.liability=params.enrolmentProcess.customer.liabilities.length;
			// 		debugger;
			// 	}
			// },
			actions: {}
		}
	}
})