irf.pageCollection.factory(irf.page("loans.individual.InventoryTracking.InventoryByBranchQueue"), ["$log", "formHelper", "Inventory", "$state", "SessionStore", "Utils",
	function($log, formHelper, Inventory, $state, SessionStore, Utils) {
	
		return {
			"type": "search-list",
			"title": "SEARCH_INVENTORY_BY_BRANCH",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				
				$log.info("Inventory Schedule Queue got initialized");
				
			},
			definition: {
				title: "SEARCH INVENTORY",
				searchForm: [
					"*"
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"branchId": {
							"title": "BRANCH_NAME",
							"type": "number",
							"enumCode": "branch_id",
							"x-schema-form": {
							"type": "select",
							"screenFilter": true
						    }
						},
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) { 
					var branchId = SessionStore.getBranchId();

					var promise = Inventory.searchInventory({
						'branchId': searchOptions.branchId || branchId ,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
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
						/*if (response != null && response.length && response.length != 0) {
							return response;
						}*/
						
						if (response != null && response.inventryTrackingDetails && response.inventryTrackingDetails.length && response.inventryTrackingDetails.length != 0) {
							return response.inventryTrackingDetails;
						}
						return [];
					},
					getListItem: function(item) {
						return [
							item.inventoryName,
							item.numberOfInventories
						]
					},
					getTableConfig: function() {
						return {
							"serverPaginate": true,
							"paginate": true,
							"pageLength": 10
						};
					},
					getColumns: function() {
						return [{
							title: 'Inventory Name',
							data: 'inventoryName'
						},
						{
							title: 'Number Of Inventories',
							data: 'numberOfInventories'
						}]
					},
					getActions: function() {
						/*return [{
							name: "Create Batch",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "loans.individual.InventoryTracking.InventoryTracking",
									pageId: item.id
								});
							},
							isApplicable: function(item, index) {

								return true;
							}
						}];*/
					}
				}
			}
		};
	}
]);