define({
    pageUID: "witfin.lead.leadAssignmentPendingQueue",
    pageType: "Engine",
    dependencies:["$log", "formHelper","PageHelper", "Lead", "$state", "$q", "SessionStore", "Utils", "entityManager"],

    $pageFn: function($log, formHelper,PageHelper, Lead, $state, $q, SessionStore, Utils, entityManager) {

		var branch = SessionStore.getBranch();

		return {
			"type": "search-list",
			"title": "LEAD_ASSIGNMENT_PENDING",
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
				autoSearch:true,
				searchSchema: {
					"type": 'object',
					"title": 'searchOptions',
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
					/*var branches = formHelper.enum('branch_id').data;
					var branchName;
					for (var i=0; i<branches.length;i++){
                        if(branches[i].code==searchOptions.branch_id)
                        branchName = branches[i].name;
                    }*/
					var promise = Lead.search({
						'branchName': searchOptions.branch,
						'currentStage': "Assignment Pending",
						'leadName': searchOptions.leadName,
						'area': searchOptions.area,
						'cityTownVillage': searchOptions.cityTownVillage,
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
					selectable: true,
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
							title: 'City/Town Village',
							data: 'cityTownVillage'
						}, {
							title: 'Area',
							data: 'area'
						}, {
							title: 'Pincode',
							data: 'pincode'
						},{
							title: 'Mobile No',
							data: 'mobileNo'
						}]
					},
					getActions: function() {
						return [/*{
							name: "Assign Lead",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('lead.LeadReassign', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "lead.LeadReassign",
									pageId: item.id
								});
							},
							isApplicable: function(item, index) {
								return true;
							}
						}*/];
					},
					getBulkActions: function() {
						return [{
							name: "Assign Lead",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(items) {
								if (items.length == 0) {
									PageHelper.showProgress("bulk-create", "Atleast one loan should be selected for Batch creation", 5000);
									return false;
								}
								$state.go("Page.Engine", {
									pageName: "lead.LeadReassign",
									pageData: items
								});
							},
							isApplicable: function(items) {
								return true;
							}
						}];
					}
				}
			}
		};
	}
})