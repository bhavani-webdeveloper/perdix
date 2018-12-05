irf.pageCollection.factory(irf.page("management.ScoreCreationSearch"), ["$log","formHelper","CentreCreationResource","$state","ScoresMaintenance","SessionStore","Utils","irfNavigator",
function($log, formHelper, CentreCreationResource,$state, ScoresMaintenance,SessionStore, Utils, irfNavigator){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "SCORE_SEARCH",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "SEARCH_CENTRE",
			searchForm: [
                {
					"key":"scoreName",
					"title": "SCORE_NAME"
				}
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": 
       					{
         					"scoreName": {
           					 "type": ["string", "null"],
                             "title": "SCORE_NAME"
         					}
      					},
      					"required":[]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = ScoresMaintenance.scoreSearch({
					'scoreName': searchOptions.scoreName,
					'per_page': pageOpts.itemsPerPage,
					'page': pageOpts.pageNo,
					'status': 'ACTIVE'
				}).$promise;
				console.log(promise);
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
							title:'SCORE_NAME',	
							data: 'scoreName'
						},
						{
							title:'STAGE',
							data: 'stage'
						},
						{
							title:'PARTERN_OR_SELF',
							data: 'partnerSelf'
						},
						{
							title:'order',
							data: 'order'
						},
						{
							title:'OverallPassValue',
							data: 'overallPassvalue'
						},
						{
							title:'Status',
							data: 'status'
						}

					]
				},
				getActions: function(){
					return [

							{
							name: "Edit_Score",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "management.ScoreCreation",
                                    pageId: item.scoreId,
                                },
                                {
                                    state: "Page.Engine", 
                                    pageName: "management.ScoreCreationSearch",
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
]);


						