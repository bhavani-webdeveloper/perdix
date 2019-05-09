define({
	pageUID: "management.VillageCreationSearch",
	pageType: "Engine",
	dependencies: ["$log", "formHelper", "VillageCreationResource", "$state", "SessionStore", "Utils", "irfNavigator"],
	$pageFn:
		function ($log, formHelper, VillageCreationResource, $state, SessionStore, Utils, irfNavigator) {
			return {
				"type": "search-list",
				"title": "VILLAGE_SEARCH",
				"subTitle": "",
				initialize: function (model, form, formCtrl) {
					$log.info("search-list sample got initialized");
				},
				definition: {
					title: "SEARCH_VILLAGE",
					searchForm: [
						{
							"key": "villageName",
							"title": "VILLAGE_NAME",
							// "condition": "model.siteCode !='sambandh'",
						},
						{
							"key": "bankId",
							"title": "BANK_NAME",
						},
						{
							"key": "branchName",
							"title": "BRANCH_NAME"
						},
						{
							"key": "pincode",
							"title": "PIN_CODE"
						}

					],
					searchSchema: {
						"type": 'object',
						"title": 'SearchOptions',
						"properties":
						{
							"villageName": {
								"type": ["string", "null"],
								"title": "VILLAGE_NAME",
							},
							"bankId": {
								"type": ["number", "null"],
								"title": "BANK_NAME",
								"x-schema-form": {
									"type": "select",
									"screenFilter": true,
									"enumCode": "bank",
								}
							},
							"branchName": {
								"title": "BRANCH_NAME",
								"type": ["string", "null"],
								"x-schema-form": {
									"type": "select",
									"screenFilter": true,
									"enumCode": "branch",
									"parentEnumCode": "bank",
									"parentValueExpr": "model.bankId",
								}
							},
							"pincode": {
								"type": ["integer", "null"],
								"title": "PIN_CODE",
							}
						},
						"required": []
					},
					getSearchFormHelper: function () {
						return formHelper;
					},
					getResultsPromise: function (searchOptions, pageOpts) {      /* Should return the Promise */
						var promise = VillageCreationResource.villageSearch({
							'villageName': searchOptions.villageName,
							'branchName': searchOptions.branchName,
							'pincode': searchOptions.pincode,
							'freqcode': searchOptions.freqcode,
							'per_page': pageOpts.itemsPerPage,
							'page': pageOpts.pageNo
						}).$promise;

						return promise;
					},
					paginationOptions: {
						"getItemsPerPage": function (response, headers) {
							return 20;
						},
						"getTotalItemsCount": function (response, headers) {
							return headers['x-total-count']
						}
					},
					listOptions: {
						selectable: false,
						expandable: true,
						listStyle: "table",
						itemCallback: function (item, index) {
						},
						getItems: function (response, headers) {
							if (response != null && response.length && response.length != 0) {
								return response;
							}
							return [];
						},
						getListItem: function (item) {
							return []
						},
						getTableConfig: function () {
							return {
								"serverPaginate": true,
								"paginate": false,
								"pageLength": 20
							};
						},
						getColumns: function () {
							return [

								{
									title: 'VILLAGE_NAME',
									data: 'villageName'
								},
								{
									title: 'BANK_NAME_',
									data: 'bankId'
								},
								{
									title: 'BRANCH_NAME',
									data: 'branchName'
								},
								{
									title: 'PIN_CODE',
									data: 'pincode'
								},
								{
									title: 'FREG_CODE',
									data: 'fregcode'
								}

							]
						},
						getActions: function () {
							return [

								{
									name: "Edit_Village",
									desc: "",
									icon: "fa fa-user",
									fn: function (item, index) {
										irfNavigator.go({
											state: "Page.Engine",
											pageName: "management.VillageCreation",
											pageId: item.id,
										},
											{
												state: "Page.Engine",
												pageName: "management.VillageCreationSearch",
											});
									},
									isApplicable: function (item, index) {
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


