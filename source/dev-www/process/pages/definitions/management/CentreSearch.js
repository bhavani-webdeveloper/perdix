irf.pageCollection.factory("Pages__CentreSearch",
["$log", "formHelper", "Masters","$state", "SessionStore",
function($log, formHelper, Masters,$state, SessionStore){
	var branchId = SessionStore.getBranchId();
	return {
		"id": "CentreSearch",
		"type": "search-list",
		"name": "CentreSearch",
		"title": "CENTRE_SEARCH",
		"subTitle": "",
		"uri":"Centre Search",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Centres",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"centreName": {
						"title": "CENTRE_NAME",
						"type": "string"
					}

				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Masters.query({
					'action':'listCentres',
					'branchId': branchId,
					'centre_name': searchOptions.centreName,
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 100;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);
                    $state.go("Page.Engine",{
                        pageName:"Management_CentreCRU",
                        pageId:item.id
                    });

				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.centre_name,
						'Code : ' + item.centre_code,
						null
					]
				},
				getActions: function(){
					return [

					];
				}
			}


		}
	};
}]);
