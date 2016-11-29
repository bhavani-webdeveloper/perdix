irf.pageCollection.factory(irf.page("loans.individual.screening.CentralRiskReviewQueue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons",
	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "CENTRAL_RISK_REVIEW_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("search-list sample got initialized");
			},
			definition: {
				title: "SEARCH_LOAN",
				searchForm: [
					"*"
				],
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
						"branch": 
						{
	                        "title": "HUB_NAME",
	                        "type": "integer",
	                        "enumCode": "branch_id",
	                        "x-schema-form": {
	                            "type": "select"
							}
	                    },
						"centre": 
						{
	                        "title": "CENTRE",
	                        "type": ["null", "number"],
	                        "enumCode": "centre",
	                        "screenFilter": true,
	                        "x-schema-form": {
	                            "type": "select",
	                        	"parentEnumCode":"branch_id"
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
	                    'stage': 'CentralRiskReview',
	                     'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'villageName':searchOptions.villageName,
	                    'branchName': branchName,
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
							item.branch,
							item.spokename,
							item.applicantName,
							item.businessName,
							item.customerId,
							item.area,
							item.cityTownVillage,
							item.pincode
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
							data: 'branch'
						},
						{
							title: 'SPOKE_NAME',
							data: 'spokename'
						},
						{
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						},{
							title: 'BUSINESS_NAME',
							data: 'businessName'
						},{
							title: 'CUSTOMER_ID',
							data: 'customerId'
						}, {
							title: 'AREA',
							data: 'area'
						}, {
							title: 'CITY_TOWN_VILLAGE',
							data: 'cityTownVillage'
						}, {
							title: 'PINCODE',
							data: 'pincode'
						}]
					},
					getActions: function() {
						return [{
							name: "CENTRAL_RISK_REVIEW",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('loans.individual.screening.CentralRiskReview', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "loans.individual.screening.CentralRiskReview",
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