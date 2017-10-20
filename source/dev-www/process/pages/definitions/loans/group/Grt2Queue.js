define({
	pageUID: "loans.group.Grt2Queue",
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
			"title": "GRT_2_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.partner = SessionStore.session.partnerCode;
				model.isPartnerChangeAllowed = GroupProcess.hasPartnerCodeAccess(model.partner);
			},
			definition: {
				title: "GRT_2_QUEUE",
				searchForm: [{
					"key": "partner",
					"readonly": true,
					"condition": "!model.isPartnerChangeAllowed"
				}, {
					"key": "partner",
					"condition": "model.isPartnerChangeAllowed"
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
						'groupStatus': true,
						'currentStage': "GRT2",
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
						},{
							title: 'GROUP_CODE',
							data: 'groupCode'
						}]
					},
					getActions: function() {
						return [{
							name: "GRT2",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "loans.group.GRT2",
									pageId:item.id
								}, {
									state: "Page.Engine",
									pageName: "loans.group.Grt2Queue",
								});
							},
							isApplicable: function(item, index) {

								return true;
							}
						}];
					}
				},
				offlineListOptions: {
					pageName: "loans.group.GRT2",
					getColumns: function() {
						return [{
							title: 'GROUP_ID',
							data: 'model.group.id'
						}, {
							title: 'PARTNER_CODE',
							data: 'model.group.partnerCode'
						}, {
							title: 'GROUP_NAME',
							data: 'model.group.groupName'
						}, {
							title: 'GROUP_CODE',
							data: 'model.group.groupCode'
						}]
					}
				}
			}
		};
	}
})