define({
	pageUID: "shramsarathi.dashboard.loans.individual.screening.ApplicationReviewQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
    	var branch = SessionStore.getBranch();
		var centres = SessionStore.getCentres();
		var centreId=[];
	    if (centres && centres.length) {
		    for (var i = 0; i < centres.length; i++) {
			    centreId.push(centres[i].centreId);
		    }
	    }
		return {
			"type": "search-list",
			"title": "APPLICATION_REVIEW_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				//  model.branch = SessionStore.getCurrentBranch().branchName;
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
							"title": "ZONE_NAME",
							"type": ["integer", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "centre",
								"parentEnumCode": "branch_id",
								"parentValueExpr": "model.branch",
								"screenFilter": true
							}
						},
						"applicantName": {
	                        "title": "APPLICANT_NAME",
	                        "type": "string"
	                    },
	                    // "businessName": {
	                    //     "title": "BUSINESS_NAME",
	                    //     "type": "string"
	                    // },
	                    "customerId": {
	                        "title": "CUSTOMER_ID",
	                        "type": "string"
	                    },
	                    "area": {
	                        "title": "PANCHAYAT",
	                        "type": "string"
						},
						"pincode": {
	                        "title": "PIN_CODE",
	                        "type": "string"
	                    },
	                    "cityTownVillage": {
	                        "title": "CITY_TOWN_VILLAGE",
	                        "type": "string"
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
					if (_.hasIn(searchOptions, 'centreCode')){
	                    searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
	                }
					return IndividualLoan.search({
						'stage': 'ApplicationReview',
	                    'branchId':searchOptions.branch,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'status':searchOptions.status,
	                    'villageName':searchOptions.villageName,
	                    'customerName': searchOptions.businessName,
	                    'page': pageOpts.pageNo,
	                    'per_page': pageOpts.itemsPerPage,
	                    'centreCode':  searchOptions.centre
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
							"searching": true,
							"pageLength": 10
						};
					},
					getColumns: function() {
						return [{
                            title: 'ID',
                            data: 'loanId'
						},
						{
							title: 'BRANCH_NAME',
							data: 'branchName'
						},
						{
							title: 'SCREENING_DATE',
							data: 'screeningDate'
						},{
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						},
						// {
						// 	title: 'BUSINESS_NAME',
						// 	data: 'customerName'
						// },
						{
							title: 'Loan Amount',
							data: 'loanAmount'
						}, {
							title: 'AREA',
							data: 'area'
						}, {
							title: 'CITY_TOWN_VILLAGE',
							data: 'villageName'
						}, {
							title: 'PIN_CODE',
							data: 'enterprisePincode'
						}

					]
					},
					getActions: function() {
						return [{
							name: "APPLICATION_REVIEW",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('shramsarathi.dashboard.loans.individual.screening.ApplicationReview', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "shramsarathi.dashboard.loans.individual.screening.ApplicationReview",
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
})
