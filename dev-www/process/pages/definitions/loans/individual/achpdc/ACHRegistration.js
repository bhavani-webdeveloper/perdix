irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHRegistration"),
["$log", "ACH","PageHelper","irfProgressMessage", "SessionStore","$state","Utils", "$stateParams", 
function($log, ACH,PageHelper, irfProgressMessage, SessionStore,$state,Utils,$stateParams){

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
			 model.achSearch = model.achSearch||{};
			 if (model._ach.loanId) {
				 	//model.ach=model._ach;
					model.ach.accountHolderName = model._ach.customerName;
					model.ach.accountId = model._ach.accountNumber;
					model.ach.branchName = model._ach.branchName;
					model.flag = false;
				 	

					ACH.search({id: model._ach.loanId})
	                    .$promise
	                    .then(
	                        function (res) {
	                            $log.info("response: " + res);

	                            PageHelper.showProgress('loan-load', 'Loading done.', 2000);
	                            for (var key in res) {
								  if (res.hasOwnProperty(key)) {
								    var val = res[key];
								    console.log(val);
								  }
								}
	                            model.achSearch = res;
	                            $log.info("Search res: " + model.achSearch.length);	
	                          var achSearchLength = model.achSearch.length;
	                          for (var i = model.achSearch.length - 1; i >= 0; i--) {
	                          	if(model.achSearch[i].accountHolderName == model.ach.accountHolderName)
	                          	{
	                          		model.flag = true;
	                          		model.ach = model.achSearch[i];
	                          	}
	                          $log.info("Flag Value: " + model.ach.flag);	
	                          }
	                           

						 }, function (httpRes) {
                            PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                            PageHelper.showErrors(httpRes);
                            $log.info("ACH Search Response : "  + httpRes);

                        }
                       );
 
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
									"key": "ach.accountId",
									"title": "LOAN_ID",
									"readonly":true
								},
								{
									"key": "ach.branchName",
									"title": "BRANCH_NAME",
									"readonly":true
								},
								{
									"key": "ach.CentreCode",
									"title": "CENTRE_CODE",
									"readonly":true
								},
								{
									"key": "ach.customerName",
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
									"key": "ach.bankAccountNumber",
									"title": "BANK_ACCOUNT_NUMBER"
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
									"key": "ach.branchName",
									"title": "BRANCH_NAME"
								},
								{
									"key": "ach.bankName",
									"title": "BANK_NAME"
								},
								{
									"key": "ach.bankCity",
									"title": "BANK_CITY"
								},
								{
									"key": "ach.mandateApplicationId",
									"title": "MANDATE_APPLICATION_ID"
								},
								{
									"key": "ach.mandateFilePath",
									"title": "MANDATE_FILE_PATH"
								},
								{
									"key": "ach.mandateId",
									"title": "MANDATE_ID",
									"type": "Number"
								},
								{
									"key": "ach.mandateOpenDate",
									"title": "MANDATE_OPEN_DATE",
									"type": "date"
								},
								{
									"key": "ach.mandateStatus",
									"title": "MANDATE_STATUS"
								},
								{
									"key": "ach.maximumAmount",
									"title": "MAX_ACH_AMOUNT",
									"type": "Number"
								},
								{
									"key": "ach.frequency",
									"title": "FREQUENCY",
									"type":"select",
									"enumCode":"frequency"
								},
								{
									"key": "ach.micr",
									"title": "MICR"
								},
								{
									"key": "ach.achStartDate",
									"title": "START_DATE",
									"type":"date"
								},
								{
									"key": "ach.achEndDate",
									"title": "END_DATE",
									"type": "date"
								},
								{
									"key": "ach.phoneNo",
									"title": "MOBILE_PHONE"
								},
								{
									"key": "ach.emailId",
									"title": "EMAIL"
								},
								{
									"key": "ach.reference1",
									"title": "REFERENCE1"
								},
								{
									"key": "ach.reference2",
									"title": "REFERENCE2"
								},
								{
									"key": "ach.sponsorAccountCode",
									"title": "SPONSOR_ACCOUNT_CODE"
								},
								{
									"key": "ach.sponsorBankCode",
									"title": "SPONSOR_BANK_CODE"
								},
								{
									"key": "ach.umrn",
									"title": "UMRN"
								},
								{
									"key": "ach.utilityCode",
									"title": "UTILITY_CODE"
								},
								{
									"key": "ach.verificationStatus",
									"title": "VERIFICATION_STATUS"
								},
								{
									"key": "ach.registrationDate",
									"title": "REGISTRATION_DATE",
									"type": "date"
								},
								{
									"key": "ach.remarks",
									"title": "remarks"
								}
								]
							}
						]
				},
				{
					"type": "actionbox",
					"condition":"!model.flag",
					"items": [{
						"type": "submit",
						"title": "Submit"
							  }]
				},
				{
					"type": "actionbox",
					"condition":"model.flag",
					"items": [{
						"type": "submit",
						"title": "Update"
							  }]
				}],
			schema: function() {
            return ACH.getSchema().$promise;
       		 },
			actions: {
				submit: function(model, form, formName){

					$log.info("Inside submit test()");
					PageHelper.showLoader();
					if (model.flag) {
						$log.info("Inside Update()");
						ACH.update(model.ach, function(response){
							PageHelper.hideLoader();
							// $state.go("Page.Engine", {
						 //    	pageName: 'loans.individual.booking.DocumentUploadQueue',
						 //    	pageId: model.ach.loanId
							// });
							//model.ach=Utils.removeNulls(model.ach,true);
						}, function(errorResponse){
							PageHelper.hideLoader();
							PageHelper.showErrors(errorResponse);
						});
					} else {
						$log.info("Inside Create()");
						ACH.create(model.ach, function(response){
							PageHelper.hideLoader();
							// $state.go("Page.Engine", {
						 //    	pageName: 'loans.individual.booking.DocumentUploadQueue',
						 //    	pageId: model.ach.loanId
							// });
							//model.ach=response;
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