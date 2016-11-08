irf.pageCollection.factory(irf.page("lead.leadAssignmentPending"),
 ["$log", "formHelper", "Lead", "$state", "$q", "SessionStore", "Utils","entityManager",
	function($log, formHelper, Lead, $state, $q, SessionStore, Utils,entityManager) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "ASSIGNMENT_PENDING",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("search-list sample got initialized");
			},
			definition: {
				title: "SEARCH_LEAD",
				searchForm: [
					"*"
				],
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
						"branch": {
							"title": "HUB_NAME",
							"type": "string",
							"enumCode": "branch",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
							}
						},
						"leadName": {
							"title": "LEAD_NAME",
							"type": "string"
						},
						"businessName": {
							"title": "Business_NAME",
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
						'branchName': searchOptions.branch,
						'currentStage': "Assignment Pending",
						'leadName': searchOptions.first_name,
						'businessName': searchOptions.businessName,
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
							data: 'leadName'
						}, {
							title: 'Pincode',
							data: 'pincode'
						}]
					},
					getActions: function() {
						return [{

							name: "Assign Lead",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('lead.LeadReassign', {_request: item});
								$state.go("Page.Engine", {
									pageName: "lead.LeadReassign",
									pageId: item.id
								});
							},

							isApplicable: function(item, index) {

								return true;
							}
						}, ];
					}
				}
			}
		};
	}
]);