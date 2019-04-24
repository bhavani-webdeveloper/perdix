irf.pageCollection.factory(irf.page("loans.individual.luc.LucRiskQueue"),
	["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils", "irfNavigator",
		function ($log, formHelper, LUC, $state, SessionStore, Utils, irfNavigator) {
			var searchSchemaGen = function (siteCode) {
				if (siteCode == 'shramsarathi') {
					return {
						"type": 'object',
						"title": 'SearchOptions',
						"properties": {
							"applicantName": {
								"title": "APPLICANT_NAME",
								"type": "string"
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
					}
				} else {
					return {
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
							"lucScheduledDate": {
								"title": "LUC_SCHEDULED_DATE",
								"type": "number"
							},

						},
						"required": ["LoanAccountNumber"]
					}
				}
			}

			return {
				"type": "search-list",
				"title": "LUC_RISK_QUEUE",
				"subTitle": "",
				initialize: function (model, form, formCtrl) {
					$log.info("luc Schedule Queue got initialized");
					model.siteCode = SessionStore.getGlobalSetting("siteCode");
				},
				definition: {
					title: "CUSTOMER_SEARCH",
					searchForm: [
						"*"
					],
					autoSearch: true,
					searchSchema: searchSchemaGen(SessionStore.getGlobalSetting("siteCode")),

					getSearchFormHelper: function () {
						return formHelper;
					},
					getResultsPromise: function (searchOptions, pageOpts) {
						var branch = SessionStore.getCurrentBranch();
						var centres = SessionStore.getCentres();
						var centreId = [];
						if (centres && centres.length) {
							for (var i = 0; i < centres.length; i++) {
								centreId.push(centres[i].id);
							}

						}

						var promise = LUC.search({
							'accountNumber': searchOptions.accountNumber,
							'currentStage': "LUCEscalate",
							'monitoringType': "LUC",
							'centreId': centreId[0],
							'branchName': branch.branchName,
							'page': pageOpts.pageNo,
							'per_page': pageOpts.itemsPerPage,
							'applicantName': searchOptions.applicantName,
							'bussinessName': searchOptions.businessName,
						}).$promise;

						return promise;
					},
					paginationOptions: {
						"getItemsPerPage": function (response, headers) {
							return 100;
						},
						"getTotalItemsCount": function (response, headers) {
							return headers['x-total-count']
						}
					},
					listOptions: {
						selectable: false,
						expandable: true,
						listStyle: "table",
						itemCallback: function (item, index) { },
						getItems: function (response, headers) {
							if (response != null && response.length && response.length != 0) {
								return response;
							}
							return [];
						},
						getListItem: function (item) {
							return [
								item.applicantName,
								item.businessName,
								item.accountNumber,
								item.loanId,
								item.disbursementDate,
								item.lucDate,
							]
						},
						getTableConfig: function () {
							return {
								"serverPaginate": true,
								"paginate": true,
								"pageLength": 10
							};
						},
						getColumns: function () {
							if (SessionStore.getGlobalSetting("siteCode") == 'shramsarathi') {
								return [{
									title: 'Applicant Name',
									data: 'customerName'
								}, {
									title: 'Account Number',
									data: 'accountNumber'
								}, {
									title: 'Loan Id',
									data: 'loanId'
								}, {
									title: 'LUC Date',
									data: 'lucDate'
								}, {
									title: 'Escalated Reason',
									data: 'lucEscalatedReason'
								}]
							} else {
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
									title: 'LUC Date',
									data: 'lucDate'
								}, {
									title: 'Escalated Reason',
									data: 'lucEscalatedReason'
								}]

							}


						},
						getActions: function () {
							return [{
								name: "Capture LUC Data",
								desc: "",
								icon: "fa fa-pencil-square-o",
								fn: function (item, index) {
									$state.go("Page.Engine", {
										pageName: "loans.individual.luc.LucData",
										pageId: item.id
									});
								},
								isApplicable: function (item, model) {
									return (model.siteCode != "KGFS");
								}
							}, {
								name: "Capture LUC Data",
								desc: "",
								icon: "fa fa-pencil-square-o",
								fn: function (item, index) {
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "loans.individual.luc.LucVerification",
										pageId: item.id,
										pageData: { _lucCompleted: true }
									});
								},
								isApplicable: function (item, model) {
									return (model.siteCode == "KGFS");
								}
							}];
						}
					}
				}
			};
		}
	]);