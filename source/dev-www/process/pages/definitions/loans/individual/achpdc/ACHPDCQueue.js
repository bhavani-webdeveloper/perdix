/*
About Queue.js
-------------------------
1. Search page that displays all the Loan Accounts based on the sort criteria.
2. To Create/update ACH Account
3. To Create/update PDC Account.

Methods
-------
Initialize : To decare the required model variables.
getResultsPromise : TO return the result of IndividualLoan.search.
getListItem : Values to display from search result
getActions : Menu icon to create/update ACH or create/update PDC.

Services
--------
IndividualLoan.search : To get all the Loan Accounts.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHPDCQueue"), ["$log", "formHelper", "ACH", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils", "PageHelper", "Queries",
	function($log, formHelper, ACH, EntityManager, IndividualLoan, $state, SessionStore, Utils, PageHelper, Queries) {

		var branchId = SessionStore.getBranchId();
		var achSearchResult = [];

		return {
			"type": "search-list",
			"title": "LOANS_SEARCH",
			"subTitle": "",

			initialize: function(model, form, formCtrl) {
				model.branchId = branchId;
			},

			definition: {
				title: "SEARCH_LOANS",
				searchForm: [
					"*"
				],
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"branchId": {
							"title": "HUB_NAME",
							"type": "integer",
							"enumCode": "branch_id",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
							}
						},
						"accountNumber": {
							"title": "LOAN_ACCOUNT_NUMBER",
							"type": "string"
						},
						"rejectedMandates": {
							"title": "INCLUDE_REJECTED_ACH_MANDATES",
							"type": "boolean"
						}
					},
					"required": ["branchId"]
				},

				getSearchFormHelper: function() {
					return formHelper;
				},

				getResultsPromise: function(searchOptions, pageOpts) { /* Should return the Promise */
					if(searchOptions.rejectedMandates) {
						searchOptions.mandateStatus = "REJECTED";
					} else {
						searchOptions.mandateStatus = "";
					}
					var promise = Queries.getCustomerBankDetails({
						'branchId': searchOptions.branchId,
						'accountNumber': searchOptions.accountNumber,
						'mandate_status': searchOptions.mandateStatus,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage
					});
					return promise;
				},

				paginationOptions: {
					"viewMode": "page",
					"getItemsPerPage": function(response, headers) {
						return 20;
					},
					"getTotalItemsCount": function(response, headers) {
						return headers['x-total-count']
					}
				},

				listOptions: {
					expandable: true,
					itemCallback: function(item, index) {},
					getItems: function(response, headers) {
						if (response != null && response.length && response.length != 0) {
							return response;
						}
						return [];
					},
					getListItem: function(item) {
						return [
							"{{'ACCOUNT_NUMBER'|translate}} : " + item.account_number,
							"{{'ENTITY_NAME'|translate}} : " + item.first_name,
							"{{'LOAN_AMOUNT'|translate}} : " + item.loan_amount,
							"{{'LOAN_TYPE'|translate}} : " + item.loan_type,
							"{{'PARTNER_CODE'|translate}} : " + item.product_code,
							"{{'PROCESS_TYPE'|translate}} : " + item.process_type
						]
					},
					getActions: function() {
						return [{
							name: "LOAN_INPUT",
							desc: "",
							icon: "fa fa-book",
							fn: function(item, index) {
								EntityManager.setModel("loans.individual.booking.LoanInput", {
									_loan: item
								});
								$state.go("Page.Engine", {
									pageName: "loans.individual.booking.LoanInput",
									pageId: item.loanId
								});
							},
							isApplicable: function(item, index) {
								if (item.stage == "LoanInitiation") {
									return true;
								} else {
									return false;
								}
							}
						}, {
							name: "CAPTURE_DATES",
							desc: "",
							icon: "fa fa-clock-o",
							fn: function(item, index) {
								EntityManager.setModel("loans.individual.booking.LoanBooking", {
									_loan: item
								});
								$state.go("Page.Engine", {
									pageName: "loans.individual.booking.LoanBooking",
									pageId: item.loanId
								});
							},
							isApplicable: function(item, index) {
								if (item.stage == "LoanBooking") {
									return true;
								} else {
									return false;
								}
							}
						}, {
							name: "DOCUMENT_UPLOAD",
							desc: "",
							icon: "fa fa-file-excel-o",
							fn: function(item, index) {
								EntityManager.setModel("loans.individual.booking.DocumentUpload", {
									_loan: item
								});
								$state.go("Page.Engine", {
									pageName: "loans.individual.booking.DocumentUpload",
									pageId: item.loanId
								});
							},
							isApplicable: function(item, index) {
								if (item.stage == "DocumentUpload") {
									return true;
								} else {
									return false;
								}
							}
						}, {
							name: "COLLECT_ADHOC_CHARGES",
							desc: "",
							icon: "fa fa-rupee",
							fn: function(item, index) {
								EntityManager.setModel("loans.individual.collections.ChargeFee", {
									"_loan": item
								});
								$state.go("Page.Engine", {
									pageName: "loans.individual.collections.ChargeFee",
									pageId: item.accountNumber
								});
							},
							isApplicable: function(item, index) {
								if (item.stage == "Completed") {
									return true;
								} else {
									return false;
								}
							}
						}, {
							name: "ACH_REGISTRATION",
							desc: "",
							icon: "fa fa-cc",
							fn: function(item, index) {
								//EntityManager.setModel("loans.individual.achpdc.ACHRegistration",{_loanAch:item});
								$state.go("Page.Engine", {
									pageName: "loans.individual.achpdc.ACHRegistration",
									pageId: item.id,
									pageData: item
								});
							},
							isApplicable: function(item, index) {
								return true;
							}
						}, {
							name: "PDC_REGISTRATION",
							desc: "",
							icon: "fa fa-cc",
							fn: function(item, index) {
								//EntityManager.setModel("loans.individual.achpdc.PDCRegistration",{_pdc:item});
								$state.go("Page.Engine", {
									pageName: "loans.individual.achpdc.PDCRegistration",
									pageId: item.id,
									pageData: item
								});
							},
							isApplicable: function(item, index) {
								return true;
							}
						}];
					}
				}
			}
		};
	}
]);
