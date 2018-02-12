define({
	pageUID: "loans.group.Checker1Queue",
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
			"title": "CHECKER1_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branchId = SessionStore.getCurrentBranch().branchId;
				var bankName = SessionStore.getBankName();
				model.siteCode = SessionStore.getGlobalSetting('siteCode');
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
				model.partner = "KGFS";
				model.isPartnerChangeAllowed = false;
				$log.info("Checker1 Queue got initialized");
			},
			definition: {
				title: "CHECKER1_QUEUE",
				searchForm: [{
					"type": "section",
					"items": [{
						"key": "bankId",
						"readonly": true,
						"type": "select",
						"condition": "!model.fullAccess && (model.siteCode != 'KGFS')"
					}, {
						"key": "bankId",
						"type": "select",
						"condition": "model.fullAccess && (model.siteCode != 'KGFS')"
					}, {
						"key": "branchId",
						"type": "select",
						"parentEnumCode": "bank",
						"parentValueExpr": "model.bankId",
					}, {
						"key": "partner",
						"type": "select",
						"readonly": true,
						"condition": "!model.isPartnerChangeAllowed"
					}, {
						"key": "partner",
						"type": "select",
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
					},
					{
						"key": "groupCode",
						"type": "string",
						"title": "GROUP_CODE",
					}]
				}],
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"bankId": {
							"title": "BANK_NAME",
							"type": ["integer", "null"],
							enumCode: "bank"
						},
						"branchId": {
							"title": "BRANCH_NAME",
							"type": ["integer", "null"],
							"enumCode": "branch_id"
						},
						"partner": {
							"type": "string",
							"title": "PARTNER",
							"enumCode": "partner"
						},
						"groupCode": {
							"type": "string",
							"title": "GROUP_CODE",
						}, 
						"product": {
							"title": "PRODUCT"
						}
					},
					"required": ['partner']
				},

				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					return GroupProcess.search({
						'bankId': searchOptions.bankId,
						'branchId': searchOptions.branchId,
						'partner': searchOptions.partner,
						'groupCode':searchOptions.groupCode,
						'product': searchOptions.product,
						'groupStatus': true,
						'currentStage': "Checker1",
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
						},{
							title: 'GROUP_CODE',
							data: 'groupCode'
						}, {
							title: 'GROUP_NAME',
							data: 'groupName'
						}, {
							title: 'PARTNER',
							data: 'partnerCode'
						},{
							title: 'TRANSACTION_DATE',
							data: 'endTime',
							render: function(data, type, full, meta) {
                                if(data){
                                    return (moment(data).format("DD-MM-YYYY"));
                                }
                                else{
                                   return data; 
                                }
                            }
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
									pageName: "loans.group.Checker1",
									pageId:item.id
								}, {
									state: "Page.Engine",
									pageName: "loans.group.Checker1Queue",
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