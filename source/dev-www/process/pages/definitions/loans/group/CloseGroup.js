define({
	pageUID: "loans.group.CloseGroup",
	pageType: "Engine",
	dependencies: ["$log", "$state", "GroupProcess","filterFilter", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],
	$pageFn: function($log, $state, GroupProcess,filterFilter, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

		return {
			"type": "search-list",
			"title": "VIEW_OR_CLOSE_GROUP",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				$log.info("View / close group got initialized");
				model.branchId = SessionStore.getCurrentBranch().branchId;
				model.siteCode = SessionStore.getGlobalSetting("siteCode");
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        model.bankId = banks[i].value;
                        model.bankName = banks[i].name;
                        break;
                    }
                }
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
						"branchId": {
							"title": "BRANCH_NAME",
							"type": ["integer", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "branch_id"
							}
						},
						"centre": {
							"title": "CENTRE_NAME",
							"type": ["integer", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "centre",
								"parentEnumCode": "branch_id",
                                "parentValueExpr": "model.branchId",
                                "screenFilter": true
							}
						},
						"groupName": {
							"title": "GROUP_NAME",
							"type": ["string", "null"]
						},
						"groupCode": {
							"title": "GROUP_CODE",
							"type": ["string", "null"]
						},
						"stage": {
							"title": "STAGE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "groupLoanStages"
							}
						},
						"groupStatus":{
							"title": "GROUP_STATUS",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
                                "titleMap": {
                                    true:"Active",
                                    false:"Closed"
                                }
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
						//'groupStatus': true,
						'currentStage': searchOptions.stage,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'branchId': searchOptions.branchId,
						'centre': searchOptions.centre,
						'groupName': searchOptions.groupName,
						'groupStatus': searchOptions.groupStatus,
						'groupCode': searchOptions.groupCode
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
						//var centres = formHelper.enum('centre').data;
						//var siteCode=SessionStore.getGlobalSetting("siteCode");
						return [{
							title: 'ID',
							data: 'id'
						}, {
							title: 'PARTNER_CODE',
							data: 'partnerCode'
						}, {
							title: 'CENTRE_ID',
							data: 'centreCode',
						}, {
							title: 'GROUP_CODE',
							data: 'groupCode'
						}, {
							title: 'GROUP_NAME',
							data: 'groupName'
						}, {
							"data": "currentStage",
							"title": "CURRENT_STAGE"
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