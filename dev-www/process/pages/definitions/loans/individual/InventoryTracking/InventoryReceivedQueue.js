irf.pageCollection.factory(irf.page("loans.individual.InventoryTracking.InventoryReceivedQueue"), ["$log", "formHelper", "Inventory", "$state", "SessionStore", "Utils",
	function($log, formHelper, Inventory, $state, SessionStore, Utils) {

		return {
			"type": "search-list",
			"title": "RECEIVED_INVENTORIES",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {

				$log.info("Inventory Tracking Queue got initialized");

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
							},
						},
						"courierNumber": {
							"title": "COURIER_NUMBER",
							"type": "string"
						},
						"podNumber": {
							"title": "POD_NUMBER",
							"type": "string"
						}
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var branchId = SessionStore.getBranchId();

					var promise = Inventory.searchInventoryTracking({
						'branchId': searchOptions.branchId || branchId,
						'courierNumber':searchOptions.courierNumber,
						'podNumber':searchOptions.podNumber,
						'currentStage':"Completed",
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
						if (response != null && response.length && response.length != 0) {
							return response;
						}
						return [];
					},
					getListItem: function(item) {
						return [
						    item.id,
							item.batchNumber,
							item.podNumber,
							item.courierNumber,
							item.courierSentDate,
							item.courierReceivedDate,
							item.remarks
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
							title: 'Inventory ID',
							data: 'id'
						}, {
							title: 'Batch Number',
							data: 'batchNumber'
						},{
							title: 'Courier Number',
							data: 'courierNumber'
						},{
							title: 'POD Number',
							data: 'podNumber'
						},{
							title: 'Courier Sent Date',
							data: 'courierSentDate'
						},{
							title: 'Courier Received Date',
							data: 'courierReceivedDate'
						},{
							title: 'Remarks',
							data: 'remarks'
						}]
					},
					getActions: function() {
					/*	return [{
							name: "Update Inventory",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "loans.individual.InventoryTracking.InventoryReceived",
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