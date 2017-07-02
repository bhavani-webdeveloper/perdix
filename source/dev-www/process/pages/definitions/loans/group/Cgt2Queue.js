define({
	pageUID: "loans.group.Cgt2Queue",
	pageType: "Engine",
	dependencies: ["$log", "$state", "GroupProcess","entityManager", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],
	$pageFn: function($log, $state, GroupProcess,entityManager, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

		var branchId = SessionStore.getBranchId();
		var branchName = SessionStore.getBranch();

		return {
			"type": "search-list",
			"title": "CGT2 Queue",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.partner = SessionStore.session.partnerCode;
			},
			definition: {
				title: "CGT2 QUEUE",
				searchForm: [{
					"key": "partner",
					"readonly": true,
					"condition": "model.partner"
				}, {
					"key": "partner",
					"condition": "!model.partner"
				}],
				autoSearch: true,
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
						}
					},
					"required": []
				},

				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					return GroupProcess.search({
						'branchId': branchId,
						'partner': searchOptions.partner,
						//'groupStatus': true,
						'currentStage': "CGT2",
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage
					}).$promise;
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
							name: "CGT",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "loans.group.CGT2",
									pageId:item.id
								}, {
									state: "Page.Engine",
									pageName: "loans.group.Cgt2Queue",
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