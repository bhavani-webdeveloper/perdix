define({ 
	pageUID:"loans.individual.achpdc.ACHPDCRealizationBatchMonitoring",
	pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "SessionStore", "ACHPDCBatchProcess"],
	$pageFn: function($log, formHelper, $state, SessionStore, ACHPDCBatchProcess) {
		return {
			"type": "search-list",
			"title": "ACHPDC_REALIZATION_BATCH_MONITORING",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				$log.info("achpdc RealizationBatchMonitoring list got initialized");
			},
			definition: {
				title: "ACHPDC_REALIZATION_BATCH_MONITORING",
				searchForm: [
					"*"
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"batchDate": {
							"title": "SEARCH_BATCH_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date"
							}
						},
						"repaymentType": {
							"title": "SEARCH_REPAYMENT_TYPE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"titleMap": {
									"ACH" : "ACH",
									"PDC" : "PDC",
								},
								"screenFilter": true
							}
						}
					}
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var promise = ACHPDCBatchProcess.getBatchSearch({
						'triggeredAt': searchOptions.batchDate,
						'repaymentMode': searchOptions.repaymentType,
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
						return [
							item.id,
							item.triggeredAt,
							item.repaymentMode,
							item.userId,
							item.status
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
							title: 'COL_BATCH_NUMBER',
							data: 'id'
						}, {
							title: 'COL_BATCH_DATE',
							data: 'triggeredAt'
						}, {
							title: 'COL_REPAYMENT_TYPE',
							data: 'repaymentMode'
						}, {
							title: 'COL_CREATED_BY',
							data: 'userId'
						}, {
							title: 'COL_STATUS',
							data: 'status'
						}]
					},
					getActions: function() {
						return [];
					}
				}
			}
		};
	}
});