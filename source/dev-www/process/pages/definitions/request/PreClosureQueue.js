define([],function(){

	return {
        pageUID: "request.PreClosureQueue",
        pageType: "Engine",
        dependencies: ["$log", "formHelper", "Worklist", "$state", "SessionStore", "Utils", "Enrollment"],
        $pageFn: function($log, formHelper, Worklist, $state, SessionStore, Utils, Enrollment) {

			return {
				"type": "search-list",
				"title": "PRE_CLOSURE_QUEUE",
				"subTitle": "",
				initialize: function(model, form, formCtrl) {
					$log.info("Pre CLosure Queue got initialized");
					model.branchId = SessionStore.getCurrentBranch().branchId;
				},

				definition: {
					title: "Search Pre Closure Requests",
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
								"type": "string",
								"x-schema-form": {
									"type": "lov",
									"autolov": true,
									"bindmap": {},
									"searchHelper": formHelper,
									"lovonly": true,
			                        search: function(inputModel, form) {
			                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
			                            var promise = Enrollment.search({
			                                'branchName': SessionStore.getBranch(),
			                            }).$promise;
			                            return promise;
			                        },
			                        getListDisplayItem: function(data, index) {
			                            return [
			                                data.firstName
			                            ];
			                        },
			                        onSelect: function(valueObj, model, context){
			                        	model.customerName = valueObj.firstName;
			                        	model.customerId = valueObj.id;
									}
								}
							},
							"customerUrn": {
								"title": "CUSTOMER_URN",
								"type": "string"
							},
							"requestType": {
								"title": "REQUEST_TYPE",
								"type": "string"
							},
							"requestDate": {
								"title": "LOAN_ACCOUNT_NUMBER",
								"type": "string",
								"x-schema-form": {
									"type": "date"
								}							
							},
							"requestStatus": {
								"title": "REQUEST_STATUS",
								"type": "string"
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
							'requestType': 'pre-closure',
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
									title: "SPOKE_NAME",
									data: 'centreName'
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
								name: "Capture Pre Closure Data",
								desc: "",
								icon: "fa fa-pencil-square-o",
								fn: function(item, index) {
									console.log(item);
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