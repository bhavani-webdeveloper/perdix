irf.pageCollection.factory(irf.page("loans.individual.luc.LucRescheduledQueue"), ["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils",
	function($log, formHelper, LUC, $state, SessionStore, Utils) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "LUC_RESCHEDULED_QUEUE",
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
						"applicantName": {
							"title": "APPLICANT_NAME",
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
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) { /* Should return the Promise */

					var promise = LUC.search({
						'accountNumber': searchOptions.accountNumber,
						'currentStage':"LUCReschedule",
						//'centreId': searchOptions.centreId,
						//'branchName': searchOptions.branchName,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'applicantName': searchOptions.applicantName,
						'businessName': searchOptions.businessName,
					}).$promise;

					return promise;
				},
				paginationOptions: {
					"getItemsPerPage": function(response, headers) {
						return 100;
					},
					"getTotalItemsCount": function(response, headers) {
						return headers['x-total-count']
					}
				},
				listOptions: {
					selectable: false,
					expandable: true,
					listStyle: "table",
					itemCallback: function(item, index) {},
					getItems: function(response, headers) {
						if (response != null && response.length && response.length != 0) {
							return response;
						}
						return [];
					},
					getListItem: function(item) {
						return [
							item.applicantName,
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
							title: 'Applicant Name',
							data: 'customerName'
						}, {
							title: 'Business Name',
							data: 'bussinessName'
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
							title: 'LUC Date',
							data: 'lucDate'
						}, {
							title: 'Rescheduled Date',
							data: 'lucRescheduledDate'
						},{
							title: 'Rescheduled Reason',
							data: 'lucRescheduleReason'
						},]
					},
					getActions: function() {
						return [{
							name: "Capture LUC Data",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "loans.individual.luc.LucData",
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