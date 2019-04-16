
irf.pageCollection.factory(irf.page("shramsarathi.dashboard.loans.individual.screening.ScreeningReviewQueue"),
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons",
	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons) {
		var branch = SessionStore.getBranch();
		console.log(branch);
		var centres = SessionStore.getCentres();
		var centreId=[];
	    if (centres && centres.length) {
		    for (var i = 0; i < centres.length; i++) {
			    centreId.push(centres[i].centreId);
		    }
		}
		var centreCode = formHelper.enum('centre').data;
		var out = [];
		if (centres && centres.length) {
			for (var i = 0; i < centreCode.length; i++) {
				for (var j = 0; j < centres.length; j++) {
					if (centreCode[i].value == centres[j].id) {
						out.push({
							name: centreCode[i].name,
							value:centreCode[i].code
						})
					}
				}
			}
		}
		
		return {
			"type": "search-list",
			"title": "SCREENING_REVIEW_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				// model.branch = branch;
				model.branch = SessionStore.getCurrentBranch().branchId;
				model.centreCode=out[0].value;
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
	                    // "businessName": {
	                    //     "title": "BUSINESS_NAME",
	                    //     "type": "string"
	                    // },
	                    // 'branch': {
	                    // 	'title': "BRANCH",
	                    // 	"type": ["string", "null"],
						// 	"x-schema-form": {
						// 		"type":"userbranch",
						// 		"screenFilter": true
						// 	}
	                    // },
						"centreCode": {
                            "title": "ZONE_NAME",
                            "required":false,
							"type": ["integer", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "centre",
								"parentEnumCode": "branch_id",
								"parentValueExpr": "model.branch",
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
	                    // 'branchId':searchOptions.branch,
	                    'stage': 'ScreeningReview',
	                    'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'villageName':searchOptions.villageName,
	                    'status':searchOptions.status,
	                    'customerName': searchOptions.businessName,
	                    'page': pageOpts.pageNo,
	                    'per_page': pageOpts.itemsPerPage,
	                    'centreCode': searchOptions.centreCode
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
							/*item.area,
							item.villageName,
							item.enterprisePincode*/
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
						},{
							title: 'SCREENING_DATE',
							data: 'screeningDate'
						}, {
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
						}, /*{
							title: 'AREA',
							data: 'area'
						}, {
							title: 'CITY_TOWN_VILLAGE',
							data: 'villageName'
						}, {
							title: 'PIN_CODE',
							data: 'enterprisePincode'
						}*/{
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
								entityManager.setModel('shramsarathi.dashboard.loans.individual.screening.ScreeningReview', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "shramsarathi.dashboard.loans.individual.screening.ScreeningReview",
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
