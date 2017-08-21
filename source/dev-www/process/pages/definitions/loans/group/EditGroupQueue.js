define({
	pageUID: "loans.group.EditGroupQueue",
	pageType: "Engine",
	dependencies: ["$log", "$state", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],
	$pageFn: function($log, $state, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

		var branchId = SessionStore.getBranchId();
		var branchName = SessionStore.getBranch();

		return {
			"type": "search-list",
			"title": "EDIT_GROUP_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branchId = SessionStore.getCurrentBranch().branchId;
				var bankName = SessionStore.getBankName();
				var banks = formHelper.enum('bank').data;
				for (var i = 0; i < banks.length; i++){
					if(banks[i].name == bankName){
						model.bankId = banks[i].value;
						model.bankName = banks[i].name;
					}
				}
				var userRole = SessionStore.getUserRole();
				if(userRole && userRole.accessLevel && userRole.accessLevel === 5){
					model.fullAccess = true;
				}
				model.partner = SessionStore.session.partnerCode;
				model.isPartnerChangeAllowed = GroupProcess.hasPartnerCodeAccess(model.partner);
			},
			definition: {
				title: "GROUP_SEARCH",
				searchForm: [
					{
	                	"type": "section",
	                	items: [
	                	{
	                		key: "bankId",
	                		readonly: true, 
	                		condition: "!model.fullAccess"
	                	},
	                	{
	                		key: "bankId",
	                		condition: "model.fullAccess"
	                	},
	                	{
	                		key: "branchId", 
	                	},
	                	{
	                		key: "partner",
	                		"readonly": true,
							"condition": "!model.isPartnerChangeAllowed"
						}, 
						{
							"key": "partner",
							"condition": "model.isPartnerChangeAllowed"
						}, {
							"key": "product",
							"title": "PRODUCT_CATEGORY",
							"type": "select",
							"enumCode": "jlg_loan_product",
							"parentEnumCode": "partner",
							"parentValueExpr": "model.partner"
						}, {
							"key": "product",
							condition: "model.product",
							"type": "string",
							"title": "PRODUCT",
							readonly: true
						}]
	                }
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"bankId": {
							"title": "BANK_NAME",
							"type": ["integer", "null"],
							enumCode: "bank",	
							"x-schema-form": {
								"type": "select",
								"screenFilter": true,

							}
						},
						"branchId": {
							"title": "BRANCH_NAME",
							"type": ["integer", "null"],
							"enumCode": "branch_id",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true,
								"parentEnumCode": "bank",
								"parentValueExpr": "model.bankId",
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
							"title": "PRODUCT"
						}
					},
					"required": ['bankId', 'branchId']
				},

				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					return GroupProcess.search({
						'branchId': searchOptions.branchId,
						'partner': searchOptions.partner,
						'partner': searchOptions.partner,
						'groupStatus': true,
						'currentStage': "GroupCreation",
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
							name: "EDIT_GROUP",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "loans.group.CreateGroup",
									pageId: item.id,
									pageData: {
									}
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