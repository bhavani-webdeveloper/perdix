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
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHRegistration"), ["$log", "ACH", "IndividualLoan", "LoanAccount", "PageHelper", "irfProgressMessage", "SessionStore", "$state", "Utils", "$stateParams", "formHelper", "CustomerBankBranch", 'Queries', "$q",
	function($log, ACH, IndividualLoan, LoanAccount, PageHelper, irfProgressMessage, SessionStore, $state, Utils, $stateParams, formHelper, CustomerBankBranch, Queries, $q) {

		var branch = SessionStore.getBranch();
		var achSearchPromise;
		var loanAccountPromise;
		var queriesPromise;

		return {
			"type": "schema-form",
			"title": "ACH_REGISTRATION",
			"subTitle": "",

			initialize: function(model, form, formCtrl) {
				//Create Model ach
				model.ach = model.ach || {};
				model.achACHSearch = model.achACHSearch || {};
				model.ach.loanId = $stateParams.pageId;
				model.isRejected = false;
				//flag is to identify Create(false) or Update(true), and to update Submit Button Name

				if (!$stateParams.pageId) {
					$state.go("Page.Engine", {
						pageName: "loans.individual.achpdc.ACHPDCQueue",
						pageId: null
					});
					return;
				}

				if ($stateParams.pageId || model._loanAch) {

					PageHelper.clearErrors();
					PageHelper.showLoader();


					IndividualLoan.get({
						id: model.ach.loanId
					}).$promise.then(
						function(res) {
							model.achIndividualLoanSearch = res;
							// model.ach.mandateOpenDate = Utils.getCurrentDate();
							// model.ach.registrationDate = Utils.getCurrentDate();
							model.ach.reference1 = model.achIndividualLoanSearch.accountNumber;
							model.ach.reference2 = model.achIndividualLoanSearch.urnNo;
							//model.ach.utilityCode = "HDFC05720000027482";
							model.ach.accountId = model.achIndividualLoanSearch.accountNumber;
							model.ach.bankAccountNumber = model.achIndividualLoanSearch.customerBankAccountNumber;
							//model.ach.ifscCode = model.achIndividualLoanSearch.customerBankIfscCode;
							//model.ach.sponsorBankCode = "HDFC0999999";
							model.ach.sponsorAccountCode = "Cash";
							model.ach.mandateStatus = "PENDING";
							//model.ach.branch = model.achIndividualLoanSearch.branch;
							model.ach.id = model.ach.loanId;
							//model.ach.customerName = model.achIndividualLoanSearch.customerId;
							//model.ach.accountHolderName = model.achIndividualLoanSearch.accountHolderName;
							//model.ach.accountType = model.achIndividualLoanSearch.loanType;
							model.ach.accountNumber = model.achIndividualLoanSearch.accountNumber;
							model.ach.centreId = model.achIndividualLoanSearch.loanCentre.centreId;

							if (model.achIndividualLoanSearch.disbursementSchedules && model.achIndividualLoanSearch.disbursementSchedules.length > 0) {
								if (model.achIndividualLoanSearch.disbursementSchedules[0].actualDisbursementDate && model.achIndividualLoanSearch.disbursementSchedules[0].actualDisbursementDate != null) {
									model.ach.achStartDate = model.achIndividualLoanSearch.disbursementSchedules[0].actualDisbursementDate;
									model.ach.mandateOpenDate = model.achIndividualLoanSearch.disbursementSchedules[0].actualDisbursementDate;
								} else if (model.achIndividualLoanSearch.disbursementSchedules[0].scheduledDisbursementDate && model.achIndividualLoanSearch.disbursementSchedules[0].scheduledDisbursementDate != null) {
									model.ach.achStartDate = model.achIndividualLoanSearch.disbursementSchedules[0].scheduledDisbursementDate;
									model.ach.mandateOpenDate = model.achIndividualLoanSearch.disbursementSchedules[0].scheduledDisbursementDate;
								}
							}



							for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
								if (parseInt(formHelper.enum('branch_id').data[i].code) == parseInt(model.achIndividualLoanSearch.branchId)) {
									model.ach.branch = formHelper.enum('branch_id').data[i].name;
									break;
								}
							}

							model.ach.centreId = model.achIndividualLoanSearch.loanCentre.centreId;
							for (var i = 0; i < formHelper.enum('centre').data.length; i++) {
								if (parseInt(formHelper.enum('centre').data[i].code) == parseInt(model.ach.centreId)) {
									model.ach.centreCode = formHelper.enum('centre').data[i].name;
									break;
								}
							}


							Queries.getCustomerBasicDetails({
								urns: [model.achIndividualLoanSearch.applicant, model.achIndividualLoanSearch.coBorrowerUrnNo, model.achIndividualLoanSearch.urnNo]
							}).then(
								function(resQuery) {
									// console.log(resQuery);
									// console.log(resQuery.urns[model.achIndividualLoanSearch.applicant].first_name);
									model.ach.applicantName = resQuery.urns[model.achIndividualLoanSearch.applicant].first_name;
									model.ach.entityName = resQuery.urns[model.achIndividualLoanSearch.urnNo].first_name;
								},
								function(errQuery) {}
							);

							loanAccountPromise = LoanAccount.get({
								accountId: model.achIndividualLoanSearch.accountNumber
							}).$promise.then(
								function(response) {
									model.achLoanAccountSearch = response;
									//model.ach.accountHolderName = model.achLoanAccountSearch.accountName;
									model.ach.achEndDate = model.achLoanAccountSearch.maturityDate;

									if (!_.isNull(model.achLoanAccountSearch.customer1Email)) {
										model.ach.emailId = model.achLoanAccountSearch.customer1Email;
									}

									if (!_.isNull(model.achLoanAccountSearch.customer1Phone1)) {
										model.ach.phoneNo = model.achLoanAccountSearch.customer1Phone1;
									}

									model.ach.maximumAmount = parseInt(model.achLoanAccountSearch.equatedInstallment);
									model.ach.maximumAmount = model.ach.maximumAmount.toString();
									model.ach.frequency = model.achLoanAccountSearch.tenureUnit;
								},
								function(error) {}
							);

							achSearchPromise = ACH.search({
								accountNumber: model.achIndividualLoanSearch.accountNumber
							}).$promise.then(
								function(res) {
									$log.info("response: " + res);
									model.achACHSearch = res;
									for (var i = 0; i < model.achACHSearch.body.length; i++) {
										if ((model.achACHSearch.body[i].accountId == model.ach.accountId) && (model.achACHSearch.body[i].mandateStatus != "REJECTED")) {
											PageHelper.showProgress("page-init", "ACH Registration Done for the Account", 5000);
											$state.go("Page.Engine", {
												pageName: "loans.individual.achpdc.ACHPDCQueue",
												pageId: null,
												pageData: null
											});
										} else if ((model.achACHSearch.body[i].accountId == model.ach.accountId) && (model.achACHSearch.body[i].mandateStatus == "REJECTED")) {
											model.isRejected = true;
											angular.extend(model.ach, model.achACHSearch.body[i]);
											model.ach.mandateStatus = "PENDING";
											model.ach.registrationStatus = "PENDING";
										}
									}
								},
								function(httpRes) {}

							);
                            $q.all([loanAccountPromise, achSearchPromise])
                                .then(function(){
                                    PageHelper.hideLoader();
                                })
						},
						function(httpRes) {
							$log.info("ACH Search Response : " + httpRes);
						}
					).finally(function() {});
				}

				$log.info("ACH_REGISTRATION got initialized");
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
							onSelect: function(result, model, arg1) {
								CustomerBankBranch.search({
									'ifscCode': result.ifsc_code
								}).$promise.then(function(response) {
									console.log(response);
									if (response.body) {
										model.ach.bankName = response.body[0].bankName;
										model.ach.branchName = response.body[0].branchName;
										model.ach.micr = response.body[0].micrCode;
									}
								}, function(error) {

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
							bindMap: {},
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
					"title": "SUBMIT"
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
						PageHelper.showProgress("page-init", "ACH Registration Successful", 5000);
						if (model.isRejected) {
							model.achUpdateStatus = [];
							model.achUpdateStatus.push(model.ach);
							ACH.updateMandateStatus(model.achUpdateStatus).$promise.then(
								function(response) {
									PageHelper.hideLoader();
									PageHelper.showProgress("page-init", "Done.", 2000);
									$state.go("Page.Engine", {
										pageName: 'loans.individual.achpdc.ACHPDCQueue',
										pageId: null
									});
								},
								function(errorResponse) {
									PageHelper.hideLoader();
									PageHelper.showErrors(errorResponse);
								}
							).finally(function() {
								PageHelper.hideLoader();
							});
						} else {
							$state.go("Page.Engine", {
								pageName: 'loans.individual.achpdc.ACHPDCQueue',
								pageId: null
							});
						}

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
