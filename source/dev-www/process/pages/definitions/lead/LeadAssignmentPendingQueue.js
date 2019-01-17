irf.pageCollection.factory(irf.page("lead.leadAssignmentPendingQueue"),
 ["$log", "formHelper","PageHelper", "Lead", "$q", "SessionStore","LeadHelper","irfNavigator",
	function($log, formHelper,PageHelper, Lead,$q, SessionStore, LeadHelper,irfNavigator) {
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
							"type": ["string","null"],
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
							item.transactionType,
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
						}, {
							title: 'Type',
							data: 'transactionType'
						}, {
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
						/* 1)conditional check that all items selected from this queue should contains same transaction type 
						    and if no transaction type found then defaulting to new loan
						*/
						    let validateSameTransactionType = items[0]['transactionType']?items[0]['transactionType']:"New Loan"
						        _.each(items, function (item) {
						            if (_.isNull(item['transactionType']))
						                item['transactionType'] = "New Loan";
						            if (item['transactionType'] != validateSameTransactionType) {
						                PageHelper.showProgress("bulk-create", "Transaction Type of selected items should be same", 5000);
						                validateSameTransactionType=false;
						            }
								});
							
						/*  1)see irfpages for implementation : passing bacparam as second argument which is state
						      of the page to which the next page will go back 
						*/  
								if (validateSameTransactionType != false) {
									irfNavigator.go({
										'state': 'Page.Engine',
										'pageName': 'lead.LeadReassign',
										'pageData': items
									}, {
										'state': 'Page.LeadDashboard'
									});
								}
						    },
						    isApplicable: function (items) {
						        return true;
						    }
						}, {
							name: "Reject Lead",
							desc: "",
							htmlClass: "style='margin-left:10px'",
							fn: function(items) {
								if (items.length == 0) {
									PageHelper.showProgress("bulk-reject", "Atleast one loan should be selected for Batch Rejecton", 5000);
									return false;
								}
								_.each(items, function (item) {
									item.leadStatus="Reject";
									item.currentStage="Inprocess";
								  });
								LeadHelper.BulkLeadStatusUpdate(items).then(function(resp) {
									PageHelper.showProgress("Bulk-lead-Reject", "Done. lead Rejected", 5000);
								}, function(err){
									PageHelper.showProgress("Bulk-lead-Reject", "error in rejecting lead", 5000);
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
]);