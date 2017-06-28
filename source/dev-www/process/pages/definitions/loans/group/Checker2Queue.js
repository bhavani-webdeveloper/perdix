define({
	pageUID: "loans.group.Checker2Queue",
	pageType: "Engine",
	dependencies: ["$log", "$state", "Groups","entityManager", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],
	$pageFn: function($log, $state, Groups,entityManager, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

		var branchId = SessionStore.getBranchId();
		var branchName = SessionStore.getBranch();

		return {
			"type": "search-list",
			"title": "Checker2 QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				$log.info("Checker2 Queue got initialized");
			},
			definition: {
				title: "Checker2 QUEUE",
				searchForm: [
					"*"
				],
				//autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"bankId": {
							"type": "string",
							"title": "BANK_NAME",
							"x-schema-form": {
								"type": "select",
								"enumCode": "partner"
							}
						},
						"branchId": {
							"type": "string",
							"title": "BRANCH_NAME",
							"x-schema-form": {
								"type": "select",
								"enumCode": "partner"
							}
						},
						"partner": {
							"type": "string",
							"title": "PARTNER",
							"x-schema-form": {
								"type": "select",
								"enumCode": "partner"
							}
						},
						"product": {
							"type": "string",
							"title": "PRODUCT",
							"x-schema-form": {
								"type": "select",
								"enumCode": "partner"
							}
						},
					},
					"required": []
				},

				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {

					var params = {
						'branchId': branchId,
						'partner': searchOptions.partner,
						//'groupStatus': true,
						'page': pageOpts.pageNo,
						//'currentStage': "CGT3",
						'per_page': pageOpts.itemsPerPage
					};

					var promise = Groups.search(params).$promise;
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
						return []
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
							title: 'GROUP_ID',
							data: 'id'
						}, {
							title: 'PARTNER_CODE',
							data: 'partnerCode'
						}, {
							title: 'GROUP_NAME',
							data: 'groupName'
						}]
					},
					getActions: function() {
						return [{
							name: "CHECKER",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "loans.group.Checker2",
									pageId:item.id
								}, {
									state: "Page.Engine",
									pageName: "loans.group.Checker2Queue",
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
})