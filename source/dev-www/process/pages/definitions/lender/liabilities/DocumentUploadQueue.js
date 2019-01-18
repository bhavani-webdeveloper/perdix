define([], function() {
	return {
		pageUID: "lender.liabilities.DocumentUploadQueue",
		pageType: "Engine",
		dependencies: ["$log", "formHelper", "LiabilityAccountProcess","Queries","$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator"],
		$pageFn: function($log, formHelper, LiabilityAccountProcess,Queries,$state, SessionStore, Utils, PagesDefinition, irfNavigator) {
			return {
				"type": "search-list",
				"title": "DOCUMENT_UPLOAD",
				"subTitle": "",
				initialize: function (model, form, formCtrl) {
				},
				definition: {
					title: "Search Lender",
					searchForm: [
						{
		                	"type": "section",
		                	items: [
			                	{
			                		key: "lenderName"
			                	}
		                	]
		                }
					],
					autoSearch: true,
					searchSchema: {
						"type": 'object',
						"title": 'SearchOptions',
						"properties": {
							"lenderName": {
								"title": "LENDER_NAME",
								"type": "string"
							}
						}
					},
					getSearchFormHelper: function() {
						return formHelper;
					},
					getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
						var promise = LiabilityAccountProcess.search({
							'status': 'DocumentUpload',
							'lenderName': searchOptions.lenderName,
							'page': pageOpts.pageNo,
                        	'per_page': pageOpts.itemsPerPage,
						}).$promise;

						return promise;
					},
					paginationOptions: {
						"getItemsPerPage": function(response, headers){
							return 100;
						},
						"getTotalItemsCount": function(response, headers){
							return headers['x-total-count']
						}
					},
					listOptions: {
						selectable: false,
						expandable: true,
						listStyle: "table",
						itemCallback: function(item, index) {
						},
						getItems: function(response, headers){
							if (response!=null && response.length && response.length!=0){
								return response;
							}
							return [];
						},
						getListItem: function(item){
							return []
						},
						getTableConfig: function() {
							return {
								"serverPaginate": true,
								"paginate": true,
								"pageLength": 10
							};
						},
						getColumns: function(){
							return [
								{
									title:'LENDER_ID',
									data: 'lenderId'
								},
								{
									title:'LENDER_NAME',	
									data: 'lenderName'
								},
								{
									title:'PRODUCT_TYPE',
									data: 'productType'
								},
								{
									title:'LOAN_AMOUNT',
									data: 'loanAmount'
								}
							]
						},
						getActions: function(){
							return [
								{
									name: "Document Upload",
									desc: "",
									icon: "fa fa-user-plus",
									fn: function(item, model){
										$state.go("Page.Engine",{
											pageName:"lender.liabilities.LiabilityLoanDocumentUpload",
											pageId:item.id
										});
									},
									isApplicable: function(item, model) {
										return true;
									}
								}
							];
						}
					}
				}
			};
		}
	}
})