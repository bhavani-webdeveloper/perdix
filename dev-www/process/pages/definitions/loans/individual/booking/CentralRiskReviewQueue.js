irf.pageCollection.factory(irf.page("loans.individual.booking.CentralRiskReviewQueue"), 
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
						"hubname":
						{
	                        "title": "HUB_NAME",
	                        "type": "string"
	                    },
	                    "spokename":
						{
	                        "title": "SPOKE_NAME",
	                        "type": "string"
	                    },
	                    "applicantName":
						{
	                        "title": "APPLICANT_NAME",
	                        "type": "string"
	                    },
	                    "businessName": {
	                        "title": "BUSINESS_NAME",New
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
	                    "screeningDate": {
	                        "title": "SCREENING_DATE",
	                        "type": "string",
	                        "x-schema-form": {
	                            "type": "date"
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
	                    'stage': 'CentralRiskReview',
	                    'branchName': searchOptions.branchName,
	                    'centreCode': searchOptions.centreCodeForSearch,
	                    'customerName': searchOptions.customer_name,
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
							item.hubname,
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
							data: 'hubname'
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
								entityManager.setModel('loan.CentralRiskReview', {
									_request: item
								});
								$state.go("Page.Engine", {
									pageName: "loans.individual.booking.CentralRiskReview",
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