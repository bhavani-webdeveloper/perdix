define({
	pageUID: "management.BranchCreationSearch",
    pageType: "Engine",
    dependencies: ["$log","formHelper","BranchCreationResource","$state","SessionStore","Utils","irfNavigator"],
    $pageFn: 
    function($log, formHelper, BranchCreationResource,$state, SessionStore, Utils, irfNavigator){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "BRANCH_SEARCH",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "SEARCH_BRANCH",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"branchName": {
						"type": ["string", "null"],
						"title": "BRANCH_NAME",
					},
				},
				"required": []
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = BranchCreationResource.branchSearch({
					'branchName': searchOptions.branchName,
					'per_page': pageOpts.itemsPerPage,
					'page': pageOpts.pageNo
				}).$promise;
				return promise;
			},
			paginationOptions: {
				"getItemsPerPage": function(response, headers){
					return 20;
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
						"paginate": false,
						"pageLength": 20
					};
				},
				getColumns: function(){
					return [
						{
							title:'BRANCH_NAMR',
							data: 'branchName'
						},
						{
							title:'BRANCH_CODE',	
							data: 'branchCode'
						},
						{
							title:'BRANCH_HUB_NAME',
							data: 'hubId'
						}
					]
				},
				getActions: function(){
					return [

							{
							name: "EDIT_BRANCH",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "management.BranchMaintenance",
                                    pageId: item.id,
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "management.BranchCreationSearch",
                                });
                            },
							isApplicable: function(item, index){
									return true;
							}
							}
						];
				}
			}
		}
	};
}
   
})


						