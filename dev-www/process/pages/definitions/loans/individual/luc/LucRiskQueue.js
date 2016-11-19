irf.pageCollection.factory(irf.page("loans.individual.luc.LucRiskQueue"), ["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils",
	function($log, formHelper, LUC, $state, SessionStore, Utils) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "LUC_RISK_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				$log.info("luc Schedule Queue got initialized");
			},
			definition: {
				title: "SEARCH CUSTOMER",
				searchForm: [
					"*"
				],
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"branchName": {
							"title": "HUB_NAME",
							"type": "string",
							"enumCode": "branch",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
							}
						},
						"centreId": {
							"title": "SPOKE_NAME",
							"type": "number",
							"enumCode": "centre",
							"x-schema-form": {
								"type": "select",
								"filter": {
									"parentCode": "branch"
								},
								"screenFilter": true
							}
						},
						"applicationName": {
							"title": "APPLICATION_NAME",
							"type": "string"
						},
						"businessName": {
							"title": "BUSINESS_NAME",
							"type": "number"
						},
						"accountNumber": {
							"title": "LOAN_ACCOUNT_NUMBER",
							"type": "number"
						},
						"lucScheduledDate": {
							"title": "LUC_SCHEDULED_DATE",
							"type": "number"
						},

					},
					"required": ["LoanAccountNumber"]
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) { /* Should return the Promise */

					var promise = LUC.search({
						'accountNumber': searchOptions.accountNumber,
						'lucScheduledDate': searchOptions.lucScheduledDate,
						//'centreId': searchOptions.centreId,
						//'branchName': searchOptions.branchName,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'applicationName': searchOptions.applicationName,
						'businessName': searchOptions.businessName,
					}).$promise;

					return promise;
				},
				paginationOptions: {
					"getItemsPerPage": function(response, headers) {
						return 20;
					},
					"getTotalItemsCount": function(response, headers) {
						return headers['x-total-count']
					}
				},
				listOptions: {
					selectable: false,
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
							item.applicationName,
							item.businessName,
							item.accountNumber,
							item.loanId,
							item.disbursementDate,
							item.lucDate,
						]
					},
					getTableConfig: function() {
						return {
							"serverPaginate": true,
							"paginate": true,
							"pageLength": 10
						};
					},
					getColumns: function() {
						return [{
							title: 'Application Name',
							data: 'applicationName'
						}, {
							title: 'Business Name',
							data: 'businessName'
						}, {
							title: 'Account Number',
							data: 'accountNumber'
						}, {
							title: 'Loan Id',
							data: 'loanId'
						}, {
							title: 'Disbursement Date',
							data: 'disbursementDate'
						}, {
							title: 'LUC Scheduled Date',
							data: 'lucDate'
						}]
					},
					getActions: function() {
						return [{
							name: "Capture LUC Data",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('lead.LeadGeneration', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "lead.LeadGeneration",
									pageId: item.id
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