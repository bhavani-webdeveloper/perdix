irf.pageCollection.factory(irf.page("lead.LeadSearchAll"), ["$log", "formHelper", "Enrollment", "$state", "$q", "SessionStore", "Utils",
	function($log, formHelper, Enrollment, $state, $q, SessionStore, Utils) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "LEAD_SEARCH",
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
							"title": "BRANCH_NAME",
							"type": "string",
							"enumCode": "branch",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
							}
						},
						"centre": {
							"title": "CENTER",
							"type": "number",
							"enumCode": "centre",
							"x-schema-form": {
								"type": "select",
								"filter": {
									"parentCode as branch": "model.branch"
								},
								"screenFilter": true
							}
						},
						"LoanOfficer": {
							"title": "LOAN_OFFICER",
							"type": "string",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true,
								titleMap: {
									"officer1": "officer1",
									"officer2": "officer2",
									"officer3": "officer3",
									"officer4": "officer4"
								}
							}
						},
						"first_name": {
							"title": "CUSTOMER_NAME",
							"type": "string"
						},
						"lead_no": {
							"title": "LEAD_ID",
							"type": "string"
						}
					},
					"required": ["branch"]
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) { /* Should return the Promise */
					/* var promise = Enrollment.search({
						'branchName': searchOptions.branch,
						'firstName': searchOptions.first_name,
						'centreCode': searchOptions.centre,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'kycNumber': searchOptions.kyc_no,
						'lastName': searchOptions.lastName,
						'urnNo': searchOptions.urnNo
					}).$promise;
					return promise;  */
					return $q.resolve({
						headers: {
							"x-total-count": 4
						},
						body: [{
								leadName: "Stalin",
								id: "1",
								leadGender: "MALE"

							}, {
								leadName: "Ravi",
								id: "2",
								leadGender: "MALE"
							}, {
								leadName: "Ram",
								id: "3",
								leadGender: "MALE"
							}, {
								leadName: "Raj",
								id: "4",
								leadGender: "MALE"
							},

						]
					});
				},
				paginationOptions: {
					"viewMode": "page",
					"getItemsPerPage": function(response, headers) {
						return 20;
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
							item.leadName,
							item.leadGender,

							item.id,

						]
					},
					getColumns: function() {
						return [{
							title: 'LEAD NAME',
							data: 'leadName',
							render: function(data, type, full, meta) {
								return (full.customerType === 'Individual' ? '<i class="fa fa-user" style="color:#777">&nbsp;</i> ' : '<i class="fa fa-industry" style="color:#777"></i> ') + data;
							}
						}, {
							title: 'GENDER',
							data: 'leadGender',
							// type: 'html',
							render: function(data, type, full, meta) {
								return '<b>' + data + '</b>';
							}
						}, {
							title: 'ID',
							data: 'id'
						}]
					},
					getActions: function() {
						return [{

								name: "Lead View/Update",
								desc: "",
								icon: "fa fa-pencil",
								fn: function(item, index) {
									$state.go("Page.Engine", {
										pageName: "lead.LeadGeneration",
										pageId: item.id
									});
								},

								isApplicable: function(item, index) {

									return true;
								}
							}, {
								name: "Lead Reassign",
								desc: "",
								icon: "fa fa-pencil-square-o",
								fn: function(item, index) {
									$state.go("Page.Engine", {
										pageName: "lead.LeadGeneration_Reassign",
										pageId: item.id
									});
								},

								isApplicable: function(item, index) {

									return true;
								}
							},

						];
					}
				}
			}
		};
	}
]);