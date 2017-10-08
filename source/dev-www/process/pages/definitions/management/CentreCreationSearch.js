define({
	pageUID: "management.CentreCreationSearch",
    pageType: "Engine",
    dependencies: ["$log","formHelper","CentreCreationResource","$state","SessionStore","Utils","irfNavigator"],
    $pageFn: 
    function($log, formHelper, CentreCreationResource,$state, SessionStore, Utils, irfNavigator){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "CENTRE_SEARCH",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "SEARCH_CENTRE",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": 
       					{
        					 "branchId": {
           					 "type": ["number", "null"],
                             "title": "BRANCH_ID",
                             "x-schema-form": {
									"type": "select",
									"screenFilter": true,
									"enumCode": "branch_id",
								}
         					},
         					"centreName": {
           					 "type": ["string", "null"],
                             "title": "CENTRE_NAME_"
         					}

      					},
      					"required":[]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = CentreCreationResource.centreSearch({
					'branchId': searchOptions.branchId,
					'centreName': searchOptions.centreName,
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
							title:'CENTRE_NAME_',
							data: 'centreName'
						},
						{
							title:'CODE',	
							data: 'centreCode'
						},
						{
							title:'CLASSIFIERS',
							data: 'centreAddress'
						},
						{
							title:'LOCATION',
							data: 'centreAltitude'
						},
						{
							title:'GPS_CAPTURE_DATE',
							data: 'centreGpsCaptureDate'
						},
						{
							title:'EMPLOYEE_CODE',
							data: 'employee'
						},
						{
							title:'LEADER_URN',
							data: 'centreLeaderUrn'
						}

					]
				},
				getActions: function(){
					return [

							{
							name: "Edit_Centre",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "management.CentreCreation",
                                    pageId: item.id,
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "management.CentreCreationSearch",
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


						