define({
	pageUID: "loans.group.CloseGroup",
	pageType: "Engine",
	dependencies: ["$log", "$state", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],
	$pageFn: function($log, $state, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

		return {
			"type": "search-list",
			"title": "VIEW_OR_CLOSE_GROUP",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				$log.info("View / close group got initialized");
			},
			definition: {
				title: "VIEW_OR_CLOSE_GROUP",
				searchForm: [
					"*"
				],
				//autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"partner": {
							"type": "string",
							"title": "PARTNER",
							"x-schema-form": {
								"type": "select",
								"enumCode": "partner"
							}
						},
						"stage": {
							"title": "STAGE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "groupLoanStages"
							}
						}
					},
					"required": []
				},

				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {

					var params = {
						//'branchId': branchId,
						'partner': searchOptions.partner,
						'groupStatus': true,
						'currentStage': searchOptions.stage,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage
					};

					var promise = GroupProcess.search(params).$promise;
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
							title: 'ID',
							data: 'id'
						}, {
							title: 'PARTNER_CODE',
							data: 'partnerCode'
						}, {
							title: 'GROUP_CODE',
							data: 'groupCode'
						}, {
							title: 'GROUP_NAME',
							data: 'groupName'
						}]
					},
					getActions: function() {
						return [{
							name: "VIEW_GROUP",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "loans.group.ViewGroup",
									pageId: item.id,
								}, {
									state: "Page.Engine",
									pageName: "loans.group.CloseGroup",
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