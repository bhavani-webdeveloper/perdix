irf.pageCollection.factory(irf.page("CBCheckCapture"),
	["$log", "$q", "CreditBureau", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "irfProgressMessage",
	function($log, $q, CreditBureau, SessionStore, $state, entityManager, formHelper, $stateParams, PM){
	return {
		"type": "schema-form",
		"title": "CREDIT_BUREAU_CHECK",
		"subTitle": "LOAN_DATA_CAPTURE",
		initialize: function (model, form, formCtrl) {
			model.creditBureau = "AOR";
			if (model._request) {
				model.customerName = model._request.firstName;
				model.customerId = model._request.id;
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
				}*/
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
					"type": "string",
					"enumCode":"partner",
					"x-schema-form":{
						"type":"select"
					}
				},
				"productCode": {
					"title": "PRODUCT",
					"type": "string",
					"enumCode":"loan_product",
					"x-schema-form":{
						"type":"select"
					}
				},
				"creditBureau": {
					"title": "CREDIT_BUREAU",
					"type": "string",
					"enum":["AOR", "Base"],
					"x-schema-form":{
						"type":"select"
					}
				},
				"loanAmount": {
					"title": "LOAN_AMOUNT",
					"type": "number",
					"x-schema-form":{
						"type":"amount"
					}
				},
				"loanPurpose1": {
					"title": "LOAN_PURPOSE",
					"type": "string",
					"enumCode": "loan_purpose_1",
					"x-schema-form":{
						"type":"select"
					}
				}
			}
		},
		actions: {
			submit: function(model, form, formName) {
				$log.info("form.$valid: " + form.$valid);
				if (form.$valid) {
					PM.pop('cbcheck-submit', 'CB Check Submitting...');
					CreditBureau.creditBureauCheck({
						customerId: model.customerId,
						highMarkType: model.creditBureau,
						purpose: model.loanPurpose1,
						loanAmount: model.loanAmount
					}, function(response){
						PM.pop('cbcheck-submit', 'CB Check successfully sent for ' + model.customerName, 5000);
						$state.go("Page.Engine", {pageName:"CBCheck", pageId:null});
					}, function(errorResponse){
						PM.pop('cbcheck-submit', 'CB Check Failed for ' + model.customerName, 5000);
					});
				}
			}
		}
	};
}]);
