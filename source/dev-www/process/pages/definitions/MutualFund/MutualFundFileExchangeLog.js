define({
	pageUID: "MutualFund.MutualFundFileExchangeLog",
	pageType: "Engine",
	dependencies: ["$log", "formHelper", "Enrollment","Model_ELEM_FC", "Queries", "$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator","PageHelper","MutualFund"],

	$pageFn: function($log, formHelper, Enrollment, Model_ELEM_FC,Queries, $state, SessionStore, Utils, PagesDefinition, irfNavigator,PageHelper,MutualFund) {

		return {
			"type": "search-list",
			"title": "MUTUAL_FUND_FILE_EXCHANGE_LOGS",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
			},
			definition: {
				title: "Search",
				searchForm: ["*"],
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"transactionType": {
							"title": "TRANSACTION_TYPE",
							"type": "string",
							"x-schema-form": {
								"type": "select",
								"titleMap":{
									"PURCHASE":"PURCHASE",
									"REDEMPTION":"REDEMPTION"
								},
								"screenFilter": true,
							}
						},
						"downloadDateFrom": {
							"title": "FROM_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date",
								"screenFilter": true,
							}
						},
						"downloadDateDateTo": {
							"title": "TO_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date",
								"screenFilter": true,
							}
						}
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var downloadDateFrom=searchOptions.downloadDateFrom?(searchOptions.downloadDateFrom +" "+ '00:00:00'):'';	
					var downloadDateDateTo=searchOptions.downloadDateDateTo? (searchOptions.downloadDateDateTo+ " "+'23:59:59'):'';
					var promise = MutualFund.getMutualFundFileExchangeLog({
						'transactionType': searchOptions.transactionType,
						'downloadDateFrom':downloadDateFrom,
						'downloadDateDateTo': downloadDateDateTo,
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
							Utils.getFullName(item.firstName, item.middleName, item.lastName),
							'Customer ID : ' + item.id,
							item.urnNo ? ('URN : ' + item.urnNo) : ("{{'CURRENT_STAGE'|translate}} : " + (item.currentStage === 'Stage02' ? 'House verification' :
								(item.currentStage === 'Stage01' ? 'Enrollment' : item.currentStage))),
							"{{'BRANCH'|translate}} : " + item.kgfsName,
							"{{'CENTRE_CODE'|translate}} : " + item.centreId,
							"{{'FATHERS_NAME'|translate}} : " + Utils.getFullName(item.fatherFirstName, item.fatherMiddleName, item.fatherLastName)
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
							title: 'ID',
							data: 'id'
						}, {
							title: 'TRANSACTION_TYPE',
							data: 'transactionType'
						},{
							title: 'TRANSACTION_AMOUNT',
							data: 'transactionAmount'
						}, {
							title: 'RECORD_COUNT',
							data: 'recordCount'
						}, {
							title: 'FROM_DATE',
							data: 'fromDate'
						},{
							title: 'TO_DATE',
							data: 'toDate'
						}]
					},
					getActions: function() {
						return [
						{
							name: "Download",
							desc: "",
							icon: "",
							fn: function(item, model) {
								var fileId = Model_ELEM_FC.fileStreamUrl+ '/' +item.fileId;
                                Utils.downloadFile(fileId);	
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
})