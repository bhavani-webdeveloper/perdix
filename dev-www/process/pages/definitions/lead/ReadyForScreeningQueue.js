irf.pageCollection.factory(irf.page("lead.ReadyForScreeningQueue"), ["$log", "formHelper", "Lead", "$state", "$q", "SessionStore", "Utils", "entityManager",
	function($log, formHelper, Lead, $state, $q, SessionStore, Utils, entityManager) {
		var branch = SessionStore.getBranch();
		var centres = SessionStore.getCentres();
		var centreName = [];

		for (var i = 0; i < centres.length; i++) {
			centreName.push(centres[i].centreName);
		}

		/*var branches = formHelper.enum('branch_id').data;
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
*/
		return {
			"type": "search-list",
			"title": "READY_FOR_SCREENING",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("search-list sample got initialized");
				var branchId = SessionStore.getBranchId();
				var branchName = SessionStore.getBranch();
			},
			definition: {
				title: "SEARCH_LEAD",
				searchForm: [
					 "*"
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
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
						},
						"screeningDate": {
							"title": "SCREENING_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date",
								"screenFilter": true
							}
						}
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var promise = Lead.search({
						'branchName': searchOptions.branch,
						'currentStage': "ReadyForScreening",
						'leadName': searchOptions.leadName,
						'businessName': searchOptions.businessName,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'centreName': centreName[0],
						'area': searchOptions.area,
						'cityTownVillage': searchOptions.cityTownVillage,
						
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
							title: 'Lead Status',
							data: 'leadStatus'
						},{
							title: 'Screening Date',
							data: 'screeningDate'
						}, {
							title: 'Address Line1',
							data: 'addressLine1'
						}, {
							title: 'CityTownVillage',
							data: 'cityTownVillage'
						}, {
							title: 'Pincode',
							data: 'pincode'
						}]
					},
					getActions: function() {
						return [{
							name: "Do Screening",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('lead.LeadGeneration', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "loans.individual.screening.ScreeningInput",
									pageData: {
										lead_id: item.id
									}
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