irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHRegistration"), ["$log", "ACH", "PageHelper", "irfProgressMessage", "SessionStore", "$state", "Utils", "$stateParams",
function($log, ACH, PageHelper, irfProgressMessage, SessionStore, $state, Utils, $stateParams) {
	/*
	ACHRegistration.js is to register or update a loan id. If the user exist, the Update module is called
	else the create field is called. Both Update and Create points to same API. 
	The search API is called in iniialize to identify if loan account number exist. If exist, the details are obtained
	and filled in the screen. 
	*/
	var branch = SessionStore.getBranch();

	return {
		"type": "schema-form",
		"title": "ACH_REGISTRATION",
		"subTitle": "",

		initialize: function(model, form, formCtrl) {

			//Create Model ach
			model.ach = model.ach || {};
			model.achSearch = model.achSearch || {};

			//flag is to identify Create(false) or Update(true), and to update Submit Button Name 
			model.flag = false;
			
			//_ach from loans.individual.achpdc.ACHMandateDownload
			//_loanAch  from loans.individual.Queue

			if (model._ach || model._loanAch) {

				if (model._ach) {
			
					model.ach.accountHolderName = model._ach.customerName;
					model.ach.accountId = model._ach.accountId;
					model.ach.branchName = model._ach.branchName;
			
				} 
				else if (model._loanAch) {
				
					model.ach.accountHolderName = model._loanAch.customerName;
					model.ach.accountId = model._loanAch.accountNumber;
					model.ach.branchName = model._loanAch.branchName;
				
				}

				//Search for existance of Loan account Number
				ACH.search({ accountNumber: model.ach.accountId }).$promise.then(function(res) {
						$log.info("response: " + res);
						model.achSearch = res;

						for (var i = 0; i < model.achSearch.body.length; i++) {
						
							//$log.info(achSearch.body[i].accountHolderName);
							if (model.achSearch.body[i].accountId == model.ach.accountId) {
						
								model.flag = true;
								model.ach = model.achSearch.body[i];
								model.ach.maximumAmount = parseInt(model.ach.maximumAmount);
						
							}
						}
					},
					function(httpRes) {
						PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
						PageHelper.showErrors(httpRes);
						$log.info("ACH Search Response : " + httpRes);
					}
				);

			} 
			else {
			
				if (model._ach) {
					$state.go("Page.Engine", {
						pageName: "loans.individual.achpdc.ACHMandateQueue",
						pageId: null
					});
				} 
				else {
					$state.go("Page.Engine", {
						pageName: "loans.individual.Queue",
						pageId: null
					});
				}

			}

			//   model.customer.urnNo="1234567890";
			$log.info("ACH_REGISTRATION got initialized");
		},

		modelPromise: function(pageId, model) {

		},
		offline: false,
		
		getOfflineDisplayItem: function(item, index) {

		},
		
		form: [
			{
				"type": "box",
				"notitle": true,
				"items": [
					{
						"type": "fieldset",
						"title": "LOAN_DETAILS",
						"items": [
							{
								"key": "ach.accountId",
								"title": "LOAN_ID",
								"readonly": true
							},
							{
								"key": "ach.branchName",
								"title": "BRANCH_NAME",
								"readonly": true
							},
							{
								"key": "ach.CentreCode",
								"title": "CENTRE_CODE",
								"readonly": true
							},
							{
								"key": "ach.customerName",
								"title": "ENTITY_NAME",
								"readonly": true
							},
							{
								"key": "ach.applicantName",
								"title": "APPLICANT_NAME",
								"readonly": true
							},
							{
								"key": "ach.coApplicantName",
								"title": "COAPPLICANT_NAME",
								"readonly": true
							}
						]
					},
					{
						"type": "fieldset",
						"title": "ACH_DETAILS",
						"items": [
							{
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
								"type": "select",
								"enumCode": "ach_mandate_stage"
							},
							{
								"key": "ach.maximumAmount",
								"title": "MAX_ACH_AMOUNT"
							},
							{
								"key": "ach.frequency",
								"title": "FREQUENCY",
								"type": "select",
								"enumCode": "ach_frequency"
							},
							{
								"key": "ach.micr",
								"title": "MICR"
							},
							{
								"key": "ach.achStartDate",
								"title": "START_DATE",
								"type": "date"
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
								"title": "VERIFICATION_STATUS",
								"type": "select",
								"enumCode": "ach_verification"
							},
							{
								"key": "ach.registrationDate",
								"title": "REGISTRATION_DATE",
								"type": "date"
							},
							{
								"key": "ach.remarks",
								"title": "REMARKS"
							},
							{
			                    "type":"fieldset",
			                    "condition": "model.flag",
			                    "title":"DOWNLOAD_ACH_MANDATE",
			                    "items":[
			                    	{
			                            "title":"DOWNLOAD",
			                            "htmlClass":"btn-block",
			                            "condition": "model.flag",
			                            "icon":"fa fa-download",
			                            "type":"button",
			                            "notitle":true,
			                            "readonly":false,
			                            "onClick": function(model, formCtrl, form, $event){
			                                            //model.mandate.link= "http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id=" + model.ach.accountId;
			                                            window.open("http://115.113.193.49:8080/formsKinara/formPrint.jsp?form_name=ach_loan&record_id=" + model.ach.accountId);
			                                                            
	                                    }
			                            //"onClick": "actions.downloadForm(model, formCtrl, form, $event)"
			                        }
		                        ]
		                    }
						]
					}
				]
			},
			{
				"type": "actionbox",
				"condition": "!model.flag",
				"items": [
					{
						"type": "submit",
						"title": "SUBMIT"
					}
				]
			},
			{
				"type": "actionbox",
				"condition": "model.flag",
				"items": [
					{
						"type": "submit",
						"title": "UPDATE"
					}
				]
			}
		],

		schema: function() {
			return ACH.getSchema().$promise;
		},

		actions: {
			submit: function(model, form, formName) {
				PageHelper.showLoader();
				ACH.create(model.ach, function(response) {
					PageHelper.hideLoader();
					PageHelper.showProgress("page-init", "Done.", 2000);
					model.flag = true;
					// $state.go("Page.Engine", {
					//pageName: 'loans.individual.booking.DocumentUploadQueue',
					//pageId: model.ach.loanId
					// });
					//model.ach=response;
				}, function(errorResponse) {
					PageHelper.hideLoader();
					PageHelper.showErrors(errorResponse);
				});
			}
		}
	};
}]);