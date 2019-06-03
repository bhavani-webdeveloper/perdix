define({
	pageUID: "arthan.loans.individual.screening.ValuationQueue",
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
			"title": "VALUATION_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				//model.branch = branch;
				$log.info("search-list sample got initialized");
				// var centres = SessionStore.getCentres();
				// if (_.isArray(centres) && centres.length > 0){
				// 	model.centre = centres[0].centreName;
				// 	model.centreCode = centres[0].centreCode;
				// }
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
								"type": "userbranch",
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
	                    'stage': 'Application',
	                    'centreCode':searchOptions.centreCode,
						'branchName':branch,
						'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'status':searchOptions.status,
	                    'villageName':searchOptions.villageName,
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
							item.applicantName,
							item.customerName,
							item.area,
							item.villageName,
							item.enterprisePincode,
							item.branchName,
							item.centreName,
							
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
							name: "VALUATION_REVIEW",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								
								entityManager.setModel('arthan.loans.individual.screening.ValuationReview', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "arthan.loans.individual.screening.ValuationReview",
									pageId: item.loanId
								});
								//BundleManager.broadcastEvent('cpv-response', item);
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
