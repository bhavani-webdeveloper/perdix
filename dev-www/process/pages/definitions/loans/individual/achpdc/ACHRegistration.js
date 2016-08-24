irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHRegistration"),
["$log", "ACHPDC","PageHelper","irfProgressMessage", "SessionStore","$state","Utils", "$stateParams", function($log, ACHPDC,PageHelper,irfProgressMessage, SessionStore,$state,Utils,$stateParams){

	var branch = SessionStore.getBranch();

	return {
		"id": "ach",
		"type": "schema-form",
		"name": "ach_pdc",
		"title": "ACH REGISTRATION",
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
			"title": "ACH REGISTRATION",
			// sample label code
			//"readonly": false, // default-false, optional, this & everything under items becomes readonly
				 "items": [{
								"key": "ach.accountHolderName",
								"title": "ACCOUNT_HOLDER_NAME"
							},
							{
								"key": "ach.accountType",
								"title": "ACCOUNT_TYPE"
							},
							{
								"key": "ach.amount",
								"title": "AMOUNT",
								"type": "Number"
							  
							},
							{
								"key": "ach.consumerReferenceNumber",
								"title": "CONSUMER_REFERENCE_NUMBER"
							},
							{
								"key": "ach.customerAdditionalInformation",
								"title": "CUSTOMER_ADDITIONAL_INFORMATION"
							},
							{
								"key": "ach.debitAmtOF",
								"title": "DEBIT_AMOUNT_OF"
							},
							{
								"key": "ach.emailId",
								"title": "E-mail_Id"
							},
							{
								"key": "ach.endDate",
								"title": "END_DATE",
								"type": "date"
							},
							{
								"key": "ach.frequency",
								"title": "frequency"
							},
							{
								"key": "ach.ifscCode",
								"title": "IFSC_Code"
							},
							{
								"key": "ach.initialRejectReason",
								"title": "INITIAL_REJECT_REASON"
							},
							{
								"key": "ach.legalAccountNumber",
								"title": "LEGAL_ACCOUNT_NUMBER"
							},
							{
								"key": "ach.loanAccountNumber",
								"title": "LOAN_ACCOUNT_NUMBER"
							},
							{
								"key": "ach.mandateDate",
								"title": "MANDATE_DATE",
								"type":"date"
							},
							{
								"key": "ach.micrCode",
								"title": "MICRO_CODE"
							},
							{
								"key": "ach.mobilNumber",
								"title": "MOBIL_NUMBER"
							},
							{
								"key": "ach.nameOfTheDestinationBankWithBranch",
								"title": "NAME_OF_THE_DESTINATION_BANK_WITH_BRANCH"
							},
							{
								"key": "ach.nameOfUtilityBillerBankCompany",
								"title": "NAME_OF_UTILITY_BILLER_BANK_COMPANY"
							},
							{
								"key": "ach.processedOnWithUmrn",
								"title": "PROCESSED_ON_WITH_UMRN"
							},
							{
								"key": "ach.rejectionCode",
								"title": "REJECTION_CODE"
							},
							{
								"key": "ach.rejectionReason",
								"title": "REJECTION_REASON"
							},
							{
								"key": "ach.schemPlanReferenceNo",
								"title": "SCHEME_PLAN_REFERENCE_NUMBER"
							},
							{
								"key": "ach.sponsorBankCode",
								"title": "SPONSOR_BANK_CODE"
							},
							{
								"key": "ach.startDate",
								"title": "START_DATA",
								"type":"date"
							},
							{
								"key": "ach.telephoneNo",
								"title": "TELEPHONE_NUMBER"
							},
							{
								"key": "ach.umnrNo",
								"title": "UMNR_NUMBER"
							},
							{
								"key": "ach.uptoMaximumAmt",
								"title": "UPTO_MAXIMUM_AMOUNT",
								"type": "Number"
							},
							{
								"key": "ach.utilityCode",
								"title": "UTILITY_CODE"
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
							model.ach=Utils.removeNulls(response,true);							
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