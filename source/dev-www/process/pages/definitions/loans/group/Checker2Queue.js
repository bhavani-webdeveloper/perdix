define({
	pageUID: "loans.group.Checker2Queue",
	pageType: "Engine",
	dependencies: ["$log", "$state", "GroupProcess","entityManager", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator","filterFilter"
	],
	$pageFn: function($log, $state, GroupProcess,entityManager, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator,filterFilter) {

		var branchId = SessionStore.getBranchId();
		var branchName = SessionStore.getBranch();

		return {
			"type": "search-list",
			"title": "CHECKER2_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branchId = SessionStore.getCurrentBranch().branchId;
				model.siteCode = SessionStore.getGlobalSetting('siteCode');
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
				if(model.siteCode =='KGFS'){
					model.partner = "AXIS";
					model.isPartnerChangeAllowed = false;
				}
				$log.info("Checker2 Queue got initialized");
			},
			definition: {
				title: "CHECKER2_QUEUE",
				autoSearch:true,
				searchForm: [
					{
	                	"type": "section",
	                	items: [
	                	{
	                		key: "bankId",
	                		readonly: true, 
	                		condition: "!model.fullAccess && (model.siteCode != 'KGFS')"
	                	},
	                	{
	                		key: "bankId",
	                		condition: "model.fullAccess && (model.siteCode != 'KGFS')"
	                	},
	                	{
	                		key: "bankId",
	                		"type": "select",
	                		condition: "model.siteCode == 'KGFS'"
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
						},
						{
							"key": "groupCode",
							"type": "string",
							"title": "GROUP_CODE",
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

					var params = {
						'bankId': searchOptions.bankId,
						'branchId': searchOptions.branchId,
						'partner': searchOptions.partner,
						'product': searchOptions.product,
						'groupCode':searchOptions.groupCode,
						'groupStatus': true,
						'page': pageOpts.pageNo,
						'currentStage': "Checker2",
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
						var branches = formHelper.enum('branch_id').data;
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
							title:'BRANCH',
							data: 'branchId',
							render: function(data, type, full, meta) {
	                            if (data) {
	                                var branchvalue = filterFilter(branches, {
	                                    "value": Number(full.branchId)
	                                }, true);
	                                data = (branchvalue.length>0)?branchvalue[0].name:"";
	                            }
	                            return data;
							}	
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
									pageName: "loans.group.Checker2",
									pageId:item.id
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