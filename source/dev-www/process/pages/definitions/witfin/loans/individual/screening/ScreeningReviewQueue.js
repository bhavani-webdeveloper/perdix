define({
	 pageUID: "witfin.loans.individual.screening.ScreeningReviewQueue",
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
			"title": "SCREENING_REVIEW_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				// model.branch = branch;
				$log.info("search-list sample got initialized");

			},
			definition: {
				title: "SEARCH",
				searchForm: [
					"*"
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
						"applicantName": {
	                        "title": "APPLICANT_NAME",
	                        "type": "string"
	                    },
	                    "businessName": {
	                        "title": "BUSINESS_NAME",
	                        "type": "string"
	                    },
	                    'branch': {
	                    	'title': "BRANCH",
	                    	"type": ["string", "null"],
	                    	"enumCode": "branch",
							"x-schema-form": {
								"type": "select",
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
								"screenFilter": true
							}
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
	                    'branchName':searchOptions.branch,
	                    'stage': 'ScreeningReview',
	                    'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'villageName':searchOptions.villageName,
	                    'status':searchOptions.status,
	                    'customerName': searchOptions.businessName,
	                    'page': pageOpts.pageNo,
	                    'per_page': pageOpts.itemsPerPage,
	                    'centreCode': searchOptions.centre
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
							item.branchName,
							item.centreName
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
                        }, {
							title: 'SCREENING_DATE',
							data: 'screeningDate'
						}, {
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						}, {
							title: 'BUSINESS_NAME',
							data: 'customerName'
						}, {
							title: 'BRANCH_NAME',
							data: 'branchName'
						}, {
							title: 'CENTRE_NAME',
							data: 'centreName'
						}]
					},
					getActions: function() {
						return [{
							name: "REVIEW",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('witfin.loans.individual.screening.ScreeningReview', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "witfin.loans.individual.screening.ScreeningReview",
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

// irf.pageCollection.factory(irf.page("witfin.loans.individual.screening.ScreeningReviewQueue"),
// 	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons",
// 	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
// 		var branch = SessionStore.getBranch();
// 		var centres = SessionStore.getCentres();
// 		var centreId=[];
// 	    if (centres && centres.length) {
// 		    for (var i = 0; i < centres.length; i++) {
// 			    centreId.push(centres[i].centreId);
// 		    }
// 	    }
// 		return {
// 			"type": "search-list",
// 			"title": "SCREENING_REVIEW_QUEUE",
// 			"subTitle": "",
// 			initialize: function(model, form, formCtrl) {
// 				// model.branch = branch;
// 				$log.info("search-list sample got initialized");

// 			},
// 			definition: {
// 				title: "SEARCH",
// 				searchForm: [
// 					"*"
// 				],
// 				autoSearch: true,
// 				searchSchema: {
// 					"type": 'object',
// 					"title": 'SEARCH_OPTIONS',
// 					"properties": {
// 						"applicantName": {
// 	                        "title": "APPLICANT_NAME",
// 	                        "type": "string"
// 	                    },
// 	                    "businessName": {
// 	                        "title": "BUSINESS_NAME",
// 	                        "type": "string"
// 	                    },
// 	                    'branch': {
// 	                    	'title': "BRANCH",
// 	                    	"type": ["string", "null"],
// 	                    	"enumCode": "branch",
// 							"x-schema-form": {
// 								"type": "select",
// 								"screenFilter": true
// 							}
// 	                    },
//                         "centre": {
// 							"title": "CENTRE",
// 							"type": ["integer", "null"],
// 							"x-schema-form": {
// 								"type": "select",
// 								"enumCode": "centre",
// 								"parentEnumCode": "branch",
// 								"screenFilter": true
// 							}
// 						},
// 	                    "customerId": {
// 	                        "title": "CUSTOMER_ID",
// 	                        "type": "string"
// 	                    },
// 	                    "area": {
// 	                        "title": "AREA",
// 	                        "type": "string"
// 	                    },
// 	                    "cityTownVillage": {
// 	                        "title": "CITY_TOWN_VILLAGE",
// 	                        "type": "string"
// 	                    },
// 	                     "pincode": {
// 	                        "title": "PIN_CODE",
// 	                        "type": "string"
// 	                    },
// 	                     "status":
// 	                    {
//                             "type":"string",
//                             "title":"STATUS",
//                             "enumCode": "origination_status",
//                             "x-schema-form": {
//                             	"type": "select"
//                             }
//                         }
// 					},
// 					"required": []
// 				},
// 				getSearchFormHelper: function() {
// 					return formHelper;
// 				},
// 				getResultsPromise: function(searchOptions, pageOpts) {
// 					if (_.hasIn(searchOptions, 'centreCode')){
// 	                    searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
// 	                }
// 					return IndividualLoan.search({
// 	                    'branchName':searchOptions.branch,
// 	                    'stage': 'ScreeningReview',
// 	                    'enterprisePincode':searchOptions.pincode,
// 	                    'applicantName':searchOptions.applicantName,
// 	                    'area':searchOptions.area,
// 	                    'villageName':searchOptions.villageName,
// 	                    'status':searchOptions.status,
// 	                    'customerName': searchOptions.businessName,
// 	                    'page': pageOpts.pageNo,
// 	                    'per_page': pageOpts.itemsPerPage,
// 	                    'centreCode': searchOptions.centre
// 	                }).$promise;
// 				},
// 				paginationOptions: {
// 					"getItemsPerPage": function(response, headers) {
// 						return 100;
// 					},
// 					"getTotalItemsCount": function(response, headers) {
// 						return headers['x-total-count']
// 					}
// 				},
// 				listOptions: {
// 					selectable: false,
// 					expandable: true,
// 					listStyle: "table",
// 					itemCallback: function(item, index) {},
// 					getItems: function(response, headers) {
// 						if (response != null && response.length && response.length != 0) {
// 							return response;
// 						}
// 						return [];
// 					},
// 					getListItem: function(item) {
// 						return [
// 							item.screeningDate,
// 							item.applicantName,
// 							item.customerName,
// 							/*item.area,
// 							item.villageName,
// 							item.enterprisePincode*/
// 							item.branchName,
// 							item.centreName
// 						]
// 					},
// 					getTableConfig: function() {
// 						return {
// 							"serverPaginate": true,
// 							"paginate": true,
// 							"pageLength": 10
// 						};
// 					},
// 					getColumns: function() {
// 						return [{
// 							title: 'SCREENING_DATE',
// 							data: 'screeningDate'
// 						}, {
// 							title: 'APPLICANT_NAME',
// 							data: 'applicantName'
// 						},{
// 							title: 'BUSINESS_NAME',
// 							data: 'customerName'
// 						},{
// 							title: 'Loan Amount',
// 							data: 'loanAmount'
// 						}, /*{
// 							title: 'AREA',
// 							data: 'area'
// 						}, {
// 							title: 'CITY_TOWN_VILLAGE',
// 							data: 'villageName'
// 						}, {
// 							title: 'PIN_CODE',
// 							data: 'enterprisePincode'
// 						}*/{
// 							title: 'BRANCH_NAME',
// 							data: 'branchName'
// 						}, {
// 							title: 'CENTRE_NAME',
// 							data: 'centreName'
// 						}]
// 					},
// 					getActions: function() {
// 						return [{
// 							name: "REVIEW",
// 							desc: "",
// 							icon: "fa fa-pencil-square-o",
// 							fn: function(item, index) {
// 								entityManager.setModel('witfin.loans.individual.screening.ScreeningReview', {
// 									_request: item
// 								});
// 								$state.go("Page.Bundle", {
// 									pageName: "witfin.loans.individual.screening.ScreeningReview",
// 									pageId: item.loanId
// 								});
// 							},
// 							isApplicable: function(item, index) {

// 								return true;
// 							}
// 						}];
// 					}
// 				}
// 			}
// 		};
// 	}
// ]);
