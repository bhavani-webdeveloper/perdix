define({
	pageUID: "loans.individual.achpdc.BatchMonitoringQueue",
	pageType: "Engine",
	dependencies: ["$log", "formHelper", "ACHPDCBatchProcess", "$state", "SessionStore", "Utils", "PageHelper", "Queries", "$q"],
	$pageFn: function($log, formHelper, ACHPDCBatchProcess, $state, SessionStore, Utils, PageHelper, Queries, $q) {

		var branchId = SessionStore.getBranchId();
		var achSearchResult = [];

		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "ACHPDC_BATCH_MONITORING",
			"subTitle": "",
			initialize: function (model, form, formCtrl) {
				model.branch = SessionStore.getCurrentBranch().branchId;
				$log.info("search-list sample got initialized");
			},
			definition: {
				title: "ACHPDC_BATCH_MONITORING",
				searchForm: [
					"*"
				],
				autoSearch: false,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"triggeredAt": {
							"title": "BATCH_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date",
								"screenFilter": true
							}
						},
						"status": {
							"title": "STATUS",
							"type": "string",
							"x-schema-form": {
								"type": "select",
								"titleMap": {
									"IN_PROCESS" : "In Progress",
									"COMPLETED" : "Completed",
								},
								"screenFilter": true
							}
						}

					},
					"required":["demandDate"]
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
					searchOptions.batchType = 'demand';
					var promise = ACHPDCBatchProcess.getBatchMonitoringTasks(searchOptions);

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
						return [
							Utils.getFullName(item.firstName, item.middleName, item.lastName),
							'Customer ID : ' + item.id,
							item.urnNo?('URN : ' + item.urnNo):("{{'CURRENT_STAGE'|translate}} : " + (item.currentStage==='Stage02'?'House verification':
								(item.currentStage==='Stage01'?'Enrollment':item.currentStage))),
							"{{'BRANCH'|translate}} : " + item.kgfsName,
							"{{'CENTRE_CODE'|translate}} : " + item.centreCode,
							"{{'FATHERS_NAME'|translate}} : " + Utils.getFullName(item.fatherFirstName, item.fatherMiddleName, item.fatherLastName)
						]
					},
					getTableConfig: function() {
						return {
							// "serverPaginate": true,
							// "paginate": true,
							// "pageLength": 10
						};
					},
					getColumns: function(){
						return [
							{
								title:'BATCH_DATE',
								data: 'triggeredAt',
								type: 'date',
							},
							{
								title:'DEMAND_DATE',
								data: 'demandDate'
							},
							{
								title:'BRANCH',
								data: 'branchName'
							},
							{
								title:'CREATED_BY',
								data: 'userName',
							},
							{
								title:'STATUS',	
								data: 'status'
							}
						]
					},
					getActions: function(){
						return [];
					}
				}
			}
		}
	}
});
