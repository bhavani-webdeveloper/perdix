
irf.pageCollection.factory(irf.page("loans.individual.screening.RejectedQueue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons", "irfNavigator",
		function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons, irfNavigator) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "REJECTED_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				//model.branch = branch;
				model.branch = SessionStore.getCurrentBranch().branchId;
				$log.info("search-list sample got initialized");
			},
			definition: {
				title: "SEARCH_LOAN",
				searchForm: [
					"*"
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
						'branch': {
	                    	'title': "BRANCH",
	                    	"type": ["string", "null"],
							"x-schema-form": {
								"type":"userbranch",
								"screenFilter": true
							}
	                    },
                        "centre": {
							"title": "CENTRE",
							"type": ["integer", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "centre",
								"parentEnumCode": "branch",
								"parentValueExpr": "model.branch",
								"screenFilter": true
							}
						},
	                    "applicantName":
						{
	                        "title": "APPLICANT_NAME",
	                        "type": "string"
	                    },
	                    "businessName": {
	                        "title": "BUSINESS_NAME",
	                        "type": "string"
	                    },
	                    "customerId": {
	                        "title": "CUSTOMER_ID",
	                        "type": "string"
	                    },
	                    "area": {
	                        "title": "AREA",
	                        "type": "string"
	                    },
	                    "cityTownVillage": {
	                        "title": "CITY_TOWN_VILLAGE",
	                        "type": "string"
	                    },
	                    "pincode": {
	                        "title": "PIN_CODE",
	                        "type": "string",
	                        
	                    },
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var branches = formHelper.enum('branch_id').data;
					var branchName;
					for (var i=0; i<branches.length;i++){
	                    if(branches[i].code==searchOptions.branch)
	                        branchName = branches[i].name;
	                }
					return IndividualLoan.search({
	                    'stage': 'Rejected',
						'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'villageName':searchOptions.villageName,
	                    'branchId':searchOptions.branch,
	                    'centreCode': searchOptions.centre,
	                    'customerName': searchOptions.businessName,
	                    'page': pageOpts.pageNo,
	                    'per_page': pageOpts.itemsPerPage,
	                }).$promise;
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
							item.branchName,
							item.centreName,
							item.screeningDate,
							item.applicantName,
							item.customerName,
							item.area,
							item.villageName,
							item.enterprisePincode
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
						},
						{
							title: 'HUB_NAME',
							data: 'branchName'
						},
						{
							title: 'SPOKE_NAME',
							data: 'centreName'
						},
						{
							title: 'SCREENING_DATE',
							data: 'screeningDate'
						}, 
						{
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						},
						{
							title: 'BUSINESS_NAME',
							data: 'customerName'
						}, 
						{
							title: 'AREA',
							data: 'area'
						}, 
						{
							title: 'CITY_TOWN_VILLAGE',
							data: 'villageName'
						}, 
						{
							title: 'PIN_CODE',
							data: 'enterprisePincode'
						}]
					},
					getActions: function() {
						return [{
							name: "VIEW LOAN",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Bundle",
									pageName: "loans.individual.screening.LoanViewList",
									pageId: item.loanId
								},
								{
									state: "Page.Engine",
									pageName: "loans.individual.screening.RejectedQueue"
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