/*
About ACHRegistration.js
------------------------
To register or update ACH loan id. If the user exist, the Update module is called
else the create field is called(both update and create usessame API).
Both Update and Create points to same API.
The search API is called in iniialize to identify if loan account number exist. If exist, the details are obtained
and filled in the screen.

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the Domand Form for the ACH Account
submit : To submit the created/updated ACH

Services
--------
ACH.search({ accountNumber: model.ach.accountId }) : Search for existance of Loan account Number
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHUpdate"), ["$log", "ACH", "IndividualLoan", "LoanAccount", "PageHelper", "irfProgressMessage", "SessionStore", "$state", "Utils", "$stateParams", "formHelper", "CustomerBankBranch", 'Queries', "$q",
	function($log, ACH, IndividualLoan, LoanAccount, PageHelper, irfProgressMessage, SessionStore, $state, Utils, $stateParams, formHelper, CustomerBankBranch, Queries, $q) {

		var branch = SessionStore.getBranch();
		var achAccountId;
		var checkACHExist = false;


		return {
			"type": "schema-form",
			"title": "ACH_REGISTRATION",
			"subTitle": "",

			initialize: function(model, form, formCtrl) {
				//Create Model ach
				model.ach = model.ach || {};
				model.achACHSearch = model.achACHSearch || [];
				//flag is to identify Create(false) or Update(true), and to update Submit Button Name

				if (!$stateParams.pageId) {
					$state.go("Page.Engine", {
						pageName: "loans.individual.achpdc.ACHMandateQueue",
						pageId: null
					});
					return;
				}

				if ($stateParams.pageId) {
					achAccountId = $stateParams.pageId;

					PageHelper.clearErrors();
					PageHelper.showLoader();
	
					ACH.search({
						accountNumber: $stateParams.pageId
					}).$promise.then(
						function(res) {
							$log.info("response: " + res);
						
							model.achACHSearch = res.body;	
							for (var i = 0; i < model.achACHSearch.length; i++) {
								if (model.achACHSearch[i].accountId == achAccountId) {
									model.ach = model.achACHSearch[i];
									model.ach.sponsorAccountCode = "Cash"; 
									checkACHExist = true;
								}
							}
							if(!checkACHExist){
								PageHelper.showProgress("page-init", "ACH Registration not done for the Account", 5000);
									$state.go("Page.Engine", {
										pageName: "loans.individual.achpdc.ACHMandateQueue",
										pageId: null,
										pageData: null
									});
							}
						},
						function(httpRes) {}

					).finally(function() {
						PageHelper.hideLoader();
					});
				}
			},
			offline: false,

			getOfflineDisplayItem: function(item, index) {},

			form: [{
				"type": "box",
				"notitle": true,
				"items": [{
					"type": "fieldset",
					"title": "LOAN_DETAILS",
					"items": [{
						"key": "ach.accountId",
						"title": "ACCOUNT_NUMBER",
						"readonly": true
					}, {
						"key": "ach.branch",
						"title": "BRANCH_NAME",
						"readonly": true
					}, {
						"key": "ach.centreCode",
						"title": "SPOKE",
						"readonly": true
					}, {
						"key": "ach.entityName",
						"title": "ENTITY_NAME",
						"readonly": true
					}, {
						"key": "ach.applicantName",
						"title": "APPLICANT_NAME",
						"readonly": true
					}, {
						"key": "ach.coApplicantName",
						"title": "COAPPLICANT_NAME",
						"readonly": true
					}]
				}, {
					"type": "fieldset",
					"title": "ACH_DETAILS",
					"items": [{
							"key": "ach.accountHolderName",
							"title": "ACCOUNT_HOLDER_NAME"
						}, {
							"key": "ach.accountType",
							"title": "ACCOUNT_TYPE",
							"type": "select",
							"enumCode": "ach_account_type"

						}, {
							key: "ach.bankAccountNumber",
							type: "lov",
							autolov: true,
							title: "BANK_ACCOUNT_NUMBER",
							bindMap: {},
							outputMap: {
								"account_number": "ach.bankAccountNumber",
								"ifsc_code": "ach.ifscCode"
							},
							searchHelper: formHelper,
							onSelect: function(result, model, arg1){
								CustomerBankBranch.search({
									'ifscCode': result.ifsc_code
								}).$promise.then(function(response)
								{
									console.log(response);
									if(response.body)
									{
										model.ach.bankName  = response.body[0].bankName;
										model.ach.branchName  = response.body[0].branchName;
										model.ach.micr  = response.body[0].micrCode;
									}
								},function(error)
								{

								});
							},
							search: function(inputModel, form, model) {
								var urn = [];
								for (var i = 0; i < model.achIndividualLoanSearch.loanCustomerRelations.length; i++) {
									urn.push(model.achIndividualLoanSearch.loanCustomerRelations[i].urn);
								}
								urn.push(model.achIndividualLoanSearch.urnNo);
								return Queries.getCustomersBankAccounts({
									customer_urns: urn,
									customer_ids: model.achIndividualLoanSearch.customerId
								});
							},
							getListDisplayItem: function(item, index) {
								return [
									'Account Number : ' + item.account_number,
									'Branch : ' + item.customer_bank_branch_name,
									'Bank : ' + item.customer_bank_name,
									'IFSC Code : ' + item.ifsc_code

								];
							}
						}, {
							"key": "ach.mandateStatus",
							"title": "ACCOUNT_TYPE",
							"type": "select",
							"enumCode": "ach_mandate_status"

						}, {
							"key": "ach.ifscCode",
							"title": "IFSC_CODE",
							"type": "lov",
							"inputMap": {
								"ifscCode": {
									"key": "ach.ifscCode"
								},
								"bankName": {
									"key": "ach.bankName"
								},
								"branchName": {
									"key": "ach.branchName"
								}
							},
							bindMap: {
							},
							outputMap: {
								"bankName": "ach.bankName",
								"branchName": "ach.branchName",
								"ifscCode": "ach.ifscCode",
								"micrCode": "ach.micr"
							},
							searchHelper: formHelper,

							search: function(inputModel, form) {
								$log.info("SessionStore.getBranch: " + SessionStore.getBranch());
								var promise = CustomerBankBranch.search({
									'bankName': inputModel.bankName,
									'ifscCode': inputModel.ifscCode,
									'branchName': inputModel.branchName
								}).$promise;
								return promise;
							},

							getListDisplayItem: function(data, index) {
								return [
									data.ifscCode,
									data.branchName,
									data.bankName,
									data.micrCode
								];
							}
						}, {
							"key": "ach.micr",
							"title": "MICR"
						}, {
							"key": "ach.branchName",
							"title": "BRANCH_NAME"
						}, {
							"key": "ach.branchName",
							"title": "BANK_CITY"
						}, {
							"key": "ach.bankName",
							"title": "BANK_NAME"
						},
						// {
						// 	"key": "ach.mandateApplicationId",
						// 	"title": "MANDATE_APPLICATION_ID"
						// }, 
						{
							"key": "ach.mandateOpenDate",
							"title": "MANDATE_OPEN_DATE",
							"type": "date",
							"required": true
						}, {
							"key": "ach.achStartDate",
							"title": "ACH_START_DATE",
							"type": "date",
							"required": true
						}, {
							"key": "ach.maximumAmount",
							"title": "MAX_ACH_AMOUNT",
							"type": "string"
						}, {
							"key": "ach.frequency",
							"title": "FREQUENCY",
							"type": "select",
							"enumCode": "ach_frequency"
						}, {
							key: "ach.sponsorBankCode",
							type: "lov",
							autolov: true,
							title: "SPONSOR_BANK_CODE",
							required: true,
							bindMap: {

							},
							outputMap: {
								"sponsor_bank_code": "ach.sponsorBankCode",
								"utility_code": "ach.utilityCode"
							},
							searchHelper: formHelper,
							search: function(inputModel, form, model) {
								var deferred = $q.defer();
								Queries.getBankAccounts().then(
									function(res) {
										var newBody = [];
										for (var i = 0; i < res.body.length; i++) {
											if (res.body[i].sponsor_bank_code != null && res.body[i].utility_code != null) {
												newBody.push(res.body[i])
											}
										}
										res.body = newBody;
										deferred.resolve(res);
									},
									function(httpRes) {
										deferred.reject(res);
									}
								);
								return deferred.promise;
							},
							getListDisplayItem: function(item, index) {
								return [
									item.account_number,
									item.sponsor_bank_code + ', ' +
									item.utility_code
								];
							}
						}, {
							"key": "ach.utilityCode",
							"title": "UTILITY_CODE",
							"required": true
						}, {
							"key": "ach.phoneNo",
							"title": "MOBILE_PHONE"
						}, {
							"key": "ach.emailId",
							"title": "EMAIL"
						}, {
							"key": "ach.reference1",
							"title": "REFERENCE1",
							"type": "string"
						}, {
							"key": "ach.reference2",
							"title": "REFERENCE2",
							"type": "string"
						}
					]
				}]
			}, {
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "UPDATE"
				}]
			}],

			schema: function() {
				return ACH.getSchema().$promise;
			},

			actions: {
				submit: function(model, form, formName) {
					PageHelper.clearErrors();
					PageHelper.showLoader();
					model.ach.bankCity = model.ach.branchName;
					ACH.create(model.ach, function(response) {
						PageHelper.hideLoader();
						PageHelper.showProgress("page-init", "ACH Update Successful", 5000);
						$state.go("Page.Engine", {
							pageName: 'loans.individual.achpdc.ACHMandateQueue',
							pageId: null
						});
						//model.ach=response;
					}, function(errorResponse) {
						PageHelper.hideLoader();
						PageHelper.showErrors(errorResponse);
					});
				}
			}
		};
	}
]);