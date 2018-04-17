define([],function(){

	return {
        pageUID: "request.ProfileSummaryQueue",
        pageType: "Engine",
        dependencies: ["$log", "formHelper", "Queries", "$state", "SessionStore", "Utils", "Enrollment", "$q"],
        $pageFn: function($log, formHelper, Queries, $state, SessionStore, Utils, Enrollment, $q) {

			return {
				"type": "search-list",
				"title": "PROFILE_SUMMARY_QUEUE",
				"subTitle": "",
				initialize: function(model, form, formCtrl) {
					$log.info("Profile Summary Queue got initialized");
					model.branchId = SessionStore.getCurrentBranch().branchId;
				},

				definition: {
					title: "SEARCH_PROFILES",
					searchForm: [
						"*"
					],
					
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
							"customerUrn": {
								"title": "CUSTOMER_URN",
								"type": "string"
							}
						}
					},
					getSearchFormHelper: function() {
						return formHelper;
					},
					getResultsPromise: function(searchOptions, pageOpts) {
						// var deffered = $q.defer();
						var promise = Queries.getProfileSummary({
							'customerURN': searchOptions.customerUrn,
							'customerName': searchOptions.customerName,
							'page': pageOpts.pageNo,
							'per_page': pageOpts.itemsPerPage
						})
						return promise;						
						// return promise;
						

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
									title: "CUSTOMER_NAME",
									data: 'first_name'
								},
								{
									title: "CUSTOMER_URN",
									data: 'urn_no'	
								},
								{
									title: "CURRENT_STAGE",
									data: 'current_stage'
								}
							]
						},
						getActions: function() {
							return [{
								name: "Approve profile summary",
								desc: "",
								icon: "fa fa-pencil-square-o",
								fn: function(item, index) {
									$state.go("Page.Engine", {
										pageName: "request.ProfileSummaryDetail",
										pageId: item.urn_no
									});
								},
								isApplicable:function(){
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