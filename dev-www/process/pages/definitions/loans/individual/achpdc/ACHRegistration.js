irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHRegistration"),
["$log", "ACHPDC","PageHelper","irfProgressMessage", "SessionStore","$state","Utils", "$stateParams", function($log, ACHPDC,PageHelper,irfProgressMessage, SessionStore,$state,Utils,$stateParams){

	var branch = SessionStore.getBranch();

	return {
		"id": "ach",
		"type": "schema-form",
		"name": "ach",
		"title": "ACH_REGISTRATION",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			$log.info("ACH selection Page got initialized");
			 model.ach = model.ach||{};
			 if (model._ach.accountNumber) {
				model.ach.loanAccountNumber=model._ach.accountNumber;
			 } else if ($stateParams.pageId) {
			  model.ach.loanAccountNumber=$stateParams.pageId;
			 } else {
			  $state.go("Page.Engine",{
									pageName:"loans.individual.Queue",
									pageId:null
								});
			 }
		 //   model.customer.urnNo="1234567890";
		},
		modelPromise: function(pageId,model){

		},
		offline: false,
		getOfflineDisplayItem: function(item, index){
			
		},
		form: [{
			"type": "box",
			"notitle": true ,
			"colClass":"col-sm-8",
				 "items": [{
				 			"type":"fieldset",
				 			"title": "LOAN_DETAILS",
				 			"items":[{
									"key": "ach.loanAccountNumber",
									"title": "LOAN_ACCOUNT_NUMBER",
									"readonly":true
								},
								{
									"key": "ach.BranchCode",
									"title": "BRANCH_NAME",
									"readonly":true
								},
								{
									"key": "ach.CentreCode",
									"title": "CENTRE_CODE",
									"readonly":true
								},
								{
									"key": "ach.entityName",
									"title": "ENTITY_NAME",
									"readonly":true
								},
								{
									"key": "ach.applicantName",
									"title": "APPLICANT_NAME",
									"readonly":true
								},
								{
									"key": "ach.coApplicantName",
									"title": "COAPPLICANT_NAME",
									"readonly":true
								}]
							},
							{
								"type":"fieldset",
								"title":"ACH_DETAILS",
								"items":[{
									"key": "ach.accountHolderName",
									"title": "ACCOUNT_HOLDER_NAME"
								},
								{
									"key": "ach.accountType",
									"title": "ACCOUNT_TYPE"
								},
								{
									"key": "ach.legalAccountNumber",
									"title": "LEGAL_ACCOUNT_NUMBER"
								},
								{
									"key": "ach.ifscCode",
									"title": "IFSC_CODE",
									"type": "lov",
                                    "inputMap": {
                                        "ifscCode": {
                                            "key": "ifscCode",
                                            "title": "IFSC_CODE"
                                        }
                                    }
								},
								{
									"key": "ach.nameOfTheDestinationBankWithBranch",
									"title": "NAME_OF_THE_DESTINATION_BANK_WITH_BRANCH"
								},
								{
									"key": "ach.uptoMaximumAmt",
									"title": "UPTO_MAXIMUM_AMOUNT",
									"type": "Number"
								},
								{
									"key": "ach.frequency",
									"title": "FREQUENCY",
									"type":"select",
									"enumCode":"frequency"
								},
								{
									"key": "ach.startDate",
									"title": "START_DATE",
									"type":"date"
								},
								{
									"key": "ach.endDate",
									"title": "END_DATE",
									"type": "date"
								},
								{
									"key": "ach.mobilNumber",
									"title": "MOBILE_PHONE"
								},
								{
									"key": "ach.emailId",
									"title": "EMAIL"
								}]
							}
						]
				},
				{
					"type": "actionbox",
					"condition":"!model.ach.id",
					"items": [{
						"type": "submit",
						"title": "Submit",
							  }]
				},
				{
					"type": "actionbox",
					"condition":"model.ach.id",
					"items": [{
						"type": "submit",
						"title": "Update",
							  }]
				}],
			schema: function() {
            return ACHPDC.getSchema().$promise;
       		 },
			actions: {
				submit: function(model, form, formName){

					$log.info("Inside submit()");
					PageHelper.showLoader();
					if (model.ach.id) {
						ACHPDC.update(model.ach, function(response){
							PageHelper.hideLoader();
							model.ach=Utils.removeNulls(model.ach,true);
						}, function(errorResponse){
							PageHelper.hideLoader();
							PageHelper.showErrors(errorResponse);
						});
					} else {
						ACHPDC.create(model.ach, function(response){
							PageHelper.hideLoader();
							model.ach=response;
						}, function(errorResponse){
							PageHelper.hideLoader();
							PageHelper.showErrors(errorResponse);
						});
					}
						// $state.go("Page.Engine", {
						//     pageName: 'IndividualLoanBookingConfirmation',
						//     pageId: model.customer.id
						// });
				}
			}
	};
}]);