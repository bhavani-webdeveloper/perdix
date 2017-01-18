irf.pageCollection.factory(irf.page("loans.individual.screening.CentralRiskReviewQueue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons",
	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
		return {
			"type": "search-list",
			"title": "CENTRAL_RISK_REVIEW_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				var currBranch = SessionStore.getCurrentBranch();
				model.branch = currBranch.branchName;

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
						"branch": 
						{
	                        "title": "HUB_NAME",
	                        "type": "string",
	                        "enumCode": "branch",
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
	                     "status": 
	                    {
                            "type":"string",
                            "title":"STATUS",
                            "enumCode": "origination_status",
                            "x-schema-form": {
                            	"type": "select"
                            }
                        }

					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
				
					return IndividualLoan.search({
	                    'stage': 'CentralRiskReview',
						'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'status':searchOptions.status,
	                    'villageName':searchOptions.villageName,
	                    'branchName': searchOptions.branch,
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
							data: 'loanId'
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
							name: "CENTRAL_RISK_REVIEW",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('loans.individual.screening.CentralRiskReview', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "loans.individual.screening.CentralRiskReview",
									pageId: item.loanId
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