irf.pageCollection.factory(irf.page("CBCheckCapture"),
	["$log", "$q", "CreditBureau", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "irfProgressMessage", "$filter", "PageHelper", "Enrollment","PagesDefinition",
	function($log, $q, CreditBureau, SessionStore, $state, entityManager, formHelper, $stateParams, PM, $filter, PageHelper, Enrollment,PagesDefinition){
	return {
		"type": "schema-form",
		"title": "CREDIT_BUREAU_CHECK",
		"subTitle": "LOAN_DATA_CAPTURE",
		initialize: function (model, form, formCtrl) {
			model.creditBureau = "AOR";
			if (model._request) {
				model.customerName = model._request.firstName;
				model.customerId = model._request.id;
				PageHelper.showLoader();
				Enrollment.getCustomerById({id:model.customerId},function(resp,header){
					model.loanAmount = resp.requestedLoanAmount;
					model.loanPurpose1 = resp.requestedLoanPurpose;
					PageHelper.hideLoader();
				}, function(resp){
					PageHelper.showErrors(resp);
                    PageHelper.hideLoader();
                });
				PagesDefinition.getRolePageConfig("Page/Engine/CBCheckCapture").then(function(config){
                    if (config && config.forceEnabled){
                        model.forceEnabled = true;
                    }
                });
				var creditBureauTypes = formHelper.enum('creditBureauTypes').data;
				creditBureauTypes = $filter('filter')(creditBureauTypes, {field1: 'default'});
				model.creditBureau = creditBureauTypes && creditBureauTypes.length > 0 ? creditBureauTypes[0].value: '';
			} else {
				$state.go("Page.Engine", {pageName:"CBCheck", pageId:null});
			}
			$log.info("I got initialized");
		},
		form: [{
			"type": "box",
			"title": "CREDIT_BUREAU_CHECK",
			"items": [
				{
					"key": "customerName",
					"readonly": true
				},
				"partner",
				{
					"key":"productCode",
					"filter": {
						"parentCode as partner": "model.partner",
						"field2": "'JLG'"
					}
				},/*
				{
					"key": "creditBureau",
					"titleMap": [{
						"value": "AOR",
						"name": "Highmark - AOR"
					},{
						"value": "Base",
						"name": "Highmark - Base"
					}]
				},*/
				"creditBureau",
				"loanAmount",
				"loanPurpose1"/*,
				{
					"key":"loanPurpose2",
					"filter": {
						"parentCode as loan_purpose_1": "model.loanPurpose1"
					}
				},
				{
					"key":"loanPurpose3",
					"filter": {
						"parentCode as loan_purpose_2": "model.loanPurpose2"
					}
				}*/,
				{
					"key": "force",
					"type" : "checkbox",
					"condition": "model.forceEnabled"
				}
			]
		},{
			"type": "actionbox",
			"items": [{
				"type": "submit",
				"title": "SEND_FOR_CB_CHECK"
			}]
		}],
		schema: {
			"type": 'object',
			"required":[
				"customerId",
				"customerName",
				"partner",
				"productCode",
				"creditBureau",
				"loanAmount",
				"loanPurpose1",
				"loanPurpose2",
				"loanPurpose3"
			],
			"properties": {
				"customerId": {
					"title": "CUSTOMER_ID",
					"type": "string"
				},
				"customerName": {
					"title": "CUSTOMER_NAME",
					"type": "string"
				},
				"partner": {
					"title": "PARTNER",
					"type": ["string","null"],
					"enumCode":"partner",
					"x-schema-form":{
						"type":"select"
					}
				},
				"productCode": {
					"title": "PRODUCT",
					"type": ["string","null"],
					"enumCode":"loan_product",
					"x-schema-form":{
						"type":"select"
					}
				},
				"creditBureau": {
					"title": "CREDIT_BUREAU",
					"type": ["string","null"],
					"enumCode": "creditBureauTypes",
					"x-schema-form":{
						"type":"select"
					}
				},
				"loanAmount": {
					"title": "LOAN_AMOUNT",
					"type": ["number","null"],
					"x-schema-form":{
						"type":"amount"
					}
				},
				"loanPurpose1": {
					"title": "LOAN_PURPOSE",
					"type": ["string","null"],
					"enumCode": "loan_purpose_1",
					"x-schema-form":{
						"type":"select"
					}
				},
				"force": {
					"title": "FORCE",
					"type": ["string", "null"]
				}
			}
		},
		actions: {
			submit: function(model, form, formName) {
				$log.info("form.$valid: " + form.$valid);
				PageHelper.showLoader();
				if (form.$valid) {
					PM.pop('cbcheck-submit', 'CB Check Submitting...');
					CreditBureau.postcreditBureauCheck({
						customerId: model.customerId,
						type: model.creditBureau,
						purpose: model.creditBureau == 'CIBIL'? 'Business Loan - General': model.loanPurpose1,
						loanAmount: model.loanAmount,
						force: model.force
					}, function(response){
						PageHelper.hideLoader();
						if(response.success==true){
							PM.pop('cbcheck-submit', 'CB Check success for ' + model.customerName, 5000);
						}
						else{
							PM.pop('cbcheck-submit', 'CB Check Failed' + model.customerName, 5000);
						}
						$state.go("Page.Engine", {pageName:"CBCheck", pageId:null});
					}, function(errorResponse){
						PageHelper.hideLoader();
						PM.pop('cbcheck-submit', 'CB Check Failed for ' + model.customerName, 5000);
					});
				}
			}
		}
	};
}]);
