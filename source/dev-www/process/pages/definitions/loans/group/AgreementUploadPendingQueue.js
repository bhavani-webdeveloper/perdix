define({
	pageUID: "loans.group.AgreementUploadPendingQueue",
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
			"title": "AGREEMENT_UPLOAD_PENDING_QUEUE",
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
				$log.info("AgreementUploadPending Queue got initialized");
			},
			definition: {
				title: "AGREEMENT_UPLOAD_PENDING_QUEUE",
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
						},{
							"key":"groupCode",
							"title": "GROUP_CODE",
							"type": ["string", "null"]
						}]
	                }
				],
				//autoSearch: true,
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
					"required": ['partner']
				},

				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {

					var params = {
						'bankId': searchOptions.bankId,
						'branchId': searchOptions.branchId,
						'partner': searchOptions.partner,
						'product': searchOptions.product,
						'groupCode': searchOptions.groupCode,
						'groupStatus': true,
						'page': pageOpts.pageNo,
						'currentStage': "AgreementUploadPending",
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
							title: 'GROUP_ID',
							data: 'id'
						}, {
							title: 'GROUP_NAME',
							data: 'groupName'
						},{
							title: 'GROUP_CODE',
							data: 'groupCode'
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
							name: "AGREEMENT_UPLOAD",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "loans.group.AgreementUploadPending",
									pageId:item.id
								}, {
									state: "Page.Engine",
									pageName: "loans.group.AgreementUploadPendingQueue",
								});
							},
							isApplicable: function(item, index) {

								return true;
							}
						}];
					}
				},
				offlineListOptions: {
					pageName: "loans.group.AgreementUploadPending",
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
							title: 'TRANSACTION_DATE',
							data: 'model.group.endTime',
							render: function(data, type, full, meta) {
                                if(data){
                                    return (moment(data).format("DD-MM-YYYY"));
                                }
                                else{
                                   return data; 
                                }
                            }
						}]
					}
				}
			}
		};
	}
})