irf.pageCollection.factory(irf.page("lead.IncompleteLeadQueue"), ["$log", "formHelper", "Lead", "$state", "$q", "SessionStore", "Utils", "entityManager",
	function($log, formHelper, Lead, $state, $q, SessionStore, Utils, entityManager) {
		var branch = SessionStore.getBranch();
		var branches = formHelper.enum('branch_id').data;
					var centres = formHelper.enum('centre').data;
					var branchCode;
					var centreName =[];
					for (var i = 0; i < branches.length; i++) {
						if (branches[i].name== branch)
							branchCode = branches[i].code;
						    $log.info(branchCode);
					}
					for (var i = 0; i < centres.length; i++) {
						if ((centres[i].parentCode) == branchCode) {
							centreName.push(centres[i].name);
						}
					}

		return {
			"type": "search-list",
			"title": "INCOMPLETE_LEAD",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				model.centre =centreName[0];
				$log.info(centreName[0]);
				$log.info("search-list sample got initialized");
				var branchId = SessionStore.getBranchId();
				var branchName = SessionStore.getBranch();
			},
			definition: {
				title: "SEARCH_LEAD",
				searchForm: [
					// "*"
					{
						"key": "branch_id",
						"type": "select"
					}, {
						"key": "centre",
						"type": "select",
						"parentEnumCode": "branch_id"
					}, {
						"key": "leadName"
					}, {
						"key": "businessName"
					}, {
						"key": "area"
					}, {
						"key": "cityTownVillage"
					}
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
						"branch_id": {
							"title": "HUB_NAME",
							"type": ["null", "number"],
							"enumCode": "branch_id" //,
								// "x-schema-form": {
								// 	"type": "select",
								// 	"screenFilter": true
								// }
						},
						"centre": {
							"title": "SPOKE_NAME",
							"type": ['null', 'number'],
							"enumCode": "centre" //,
								// "x-schema-form": {
								// 	"type": "select",
								// 	"filter": {
								// 		"parentCode as branch": "model.branch"
								// 	},
								// 	"screenFilter": true
								// }
						},
						"leadName": {
							"title": "LEAD_NAME",
							"type": "string"
						},
						"businessName": {
							"title": "BUSINESS_NAME",
							"type": "string"
						},
						"area": {
							"title": "AREA",
							"type": "string"
						},
						"cityTownVillage": {
							"title": "CITY/_TOWN_VILLAGE",
							"type": "string"
						}
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					

					var promise = Lead.search({
						'branchName': branch,
						'currentStage': "Incomplete",
						'leadName': searchOptions.leadName,
						'businessName': searchOptions.businessName,
						//'centreName': centreName,
						'area': searchOptions.area,
						'cityTownVillage': searchOptions.cityTownVillage,
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
							item.leadId,
							item.leadName,
							item.businessName,
							item.branchName,
							item.addressLine1,
							item.cityTownVillage,
							item.pincode,
							item.mobileNo
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
							title: 'Lead Name',
							data: 'leadName'
						}, {
							title: 'Business Name',
							data: 'businessName'
						}, {
							title: 'Address Line1',
							data: 'addressLine1'
						}, {
							title: 'CityTownVillage',
							data: 'cityTownVillage'
						}, {
							title: 'Area',
							data: 'area'
						}, {
							title: 'Spoke',
							data: 'centreId'
						}, {
							title: 'Pincode',
							data: 'pincode'
						}, {
							title: 'Mobile No',
							data: 'mobileNo'
						}]
					},
					getActions: function() {
						return [{
							name: "Additional Lead Details",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('lead.LeadGeneration', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "lead.LeadGeneration",
									pageId: item.id
								});
							},
							isApplicable: function(item, index) {

								return true;
							}
						}];
					}
				}
			}
		};
	}
]);