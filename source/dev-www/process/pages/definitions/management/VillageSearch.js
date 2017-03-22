irf.pageCollection.factory("Pages__VillageSearch",
["$log", "formHelper", "Masters","$state", "SessionStore",
function($log, formHelper, Masters,$state, SessionStore){
	var branchId = SessionStore.getBranchId();
	return {
		"id": "VillageSearch",
		"type": "search-list",
		"name": "VillageSearch",
		"title": "VILLAGE_SEARCH",
		"subTitle": "",
		"uri":"Village Search",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Villages",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"name": {
						"title": "VILLAGE_NAME",
						"type": "string"
					}


				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Masters.query({
					'action':'listVillages',
					'branchId': branchId,
					'villageName': searchOptions.name
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 100;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count'];
				}
			},
			listOptions: {
				itemCallback: function(item, index) {
					$log.info(item);
                    $state.go("Page.Engine",{
                        pageName:"Management_VillageCRU",
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
						item.village_name,
						'PINCODE : ' + item.pincode,
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
