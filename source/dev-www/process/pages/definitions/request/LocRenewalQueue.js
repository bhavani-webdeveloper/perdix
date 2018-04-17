define([],function(){

	return {
        pageUID: "request.LocRenewalQueue",
        pageType: "Engine",
        dependencies: ["$log", "formHelper", "Worklist", "$state", "SessionStore", "Utils", "Enrollment"],
        $pageFn: function($log, formHelper, Worklist, $state, SessionStore, Utils, Enrollment) {

			return {
				"type": "search-list",
				"title": "LOC_RENEWAL_QUEUE",
				"subTitle": "",
				initialize: function(model, form, formCtrl) {
					$log.info("Loc Renewal Queue got initialized");
					model.branchId = SessionStore.getCurrentBranch().branchId;
				},

				definition: {
					title: "Search Loc Renewal Requests",
					searchForm: [
						"*"
					],
					autoSearch: true,
					searchSchema: {
						"type": 'object',
						"title": 'SearchOptions',
						"properties": {
		                    'branchId': {
		                    	'title': "BRANCH",
		                    	"type": ["integer", "null"],
		                    	"enumCode": "branch_id",
								"x-schema-form": {
									"type": "select",
									"screenFilter": true,
									"readonly": true
								}
		                    },
	                        "centreName": {
								"title": "CENTRE",
								"type": ["integer", "null"],
								"x-schema-form": {
									"type": "select",
									"enumCode": "centre",
									"parentEnumCode": "branch_id",
									"parentValueExpr": "model.branchId",
									"screenFilter": true,
								}
							},
							"customerName": {
								"title": "CUSTOMER_NAME",
								"type": "string"
							},
							"accountNumber": {
								"title": "ACCOUNT_NUMBER",
								"type": "string"
							},
							"customerUrn": {
								"title": "CUSTOMER_URN",
								"type": "string"
							},
							"requestDate": {
								"title": "REQUEST_DATE",
								"type": "string",
								"x-schema-form": {
									"type": "date"
								}							
							}
						}
					},
					getSearchFormHelper: function() {
						return formHelper;
					},
					getResultsPromise: function(searchOptions, pageOpts) {
						
						var promise = Worklist.findWorklists({
							'customerId': searchOptions.customerId,
							'bracnhId': searchOptions.branchId,
							'requestType': 'loc-renewal',
							'customerURN': searchOptions.customerUrn,
							'requestDate': searchOptions.requestDate,
							'customerName': searchOptions.customerName,
							'accountNumber': searchOptions.accountNumber,
							'page': pageOpts.pageNo,
							'per_page': pageOpts.itemsPerPage
						}).$promise;
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
							return [
								{
									title: "HUB_NAME",
									data: 'branchId',
									render: function(data, type, full, meta) {
										var branches = formHelper.enum('branch').data;
										var branchName;
										for(var i=0;i<branches.length;i++) {
											if(branches[i].code == data) {
												branchName = branches[i].name;
												break;
											}
										}
										return branchName;
									}
								},
								{
									title: "CUSTOMER_URN",
									data: 'customerURN'	
								},
								{
									title: "CUSTOMER_NAME",
									data: 'customerName'	
								},
								{
									title: "REQUEST_TYPE",
									data: "requestType"
								},
								{
									title: "REQUEST_DATE",
									data: 'requestDate'
								}
							]
						},
						getActions: function() {
							return [{
								name: "Capture Loc Renewal Data",
								desc: "",
								icon: "fa fa-pencil-square-o",
								fn: function(item, index) {
									$state.go("Page.Engine", {
										pageName: "request.RequestDetail",
										pageId: item.id
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
	}
});