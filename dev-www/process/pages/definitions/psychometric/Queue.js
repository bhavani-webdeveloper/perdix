irf.pageCollection.factory(irf.page("psychometric.Queue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore","IndividualLoan", "LoanBookingCommons",
	function($log, formHelper, $state, $q, SessionStore, IndividualLoan, LoanBookingCommons) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "PSYCHOMETRIC_PENDING_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("psychometric.Queue got initialized");
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
						"applicantName": {
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
	                        "title": "PINCODE",
	                        "type": "string",
	                       
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
	                    'stage': 'Psychometric',
	                    'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'villageName':searchOptions.villageName,
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
						return [
						{
							title: 'ID',
							data: 'id'
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
							name: "PSYCHOMETRIC_TEST",
							desc: "",
							icon: "fa fa-eye-slash",
							fn: function(item, index) {
								$state.go("Page.PsychometricTest", {
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