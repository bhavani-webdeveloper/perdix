irf.pageCollection.factory(irf.page("psychometric.Queue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons", "Psychometric", "PsychometricTestService", "PageHelper",
	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons, Psychometric, PsychometricTestService, PageHelper) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "Psychometric Test",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = branch;
				$log.info("psychometric.Queue got initialized");
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
	                    },/*
	                    "businessName": {
	                        "title": "BUSINESS_NAME",
	                        "type": "string"
	                    },*/
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
					return Psychometric.searchLoanForPsychometric({
	                    'pincode':searchOptions.pincode,
	                    'first_name':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'village_name':searchOptions.villageName,
	                    //'customerName': searchOptions.businessName,
	                    
	                    'page': pageOpts.pageNo,
	                    'per_page': pageOpts.itemsPerPage,
	                });
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
							"pageLength": 10
						};
					},
					getColumns: function() {
						return [{
							title: 'ACCOUNT_NUMBER',
							data: 'account_number'
						}, {
							title: 'SCREENING_DATE',
							data: 'screening_date'
						}]
					},
					getActions: function() {
						return [{
							name: "PSYCHOMETRIC_TEST",
							desc: "",
							icon: "fa fa-eye-slash",
							fn: function(item, index) {
								PsychometricTestService.start(item.applicant, item.id).then(function(resp){
									PageHelper.showLoader();
									IndividualLoan.get({
										id: resp.applicationId
									}, function(reqData) {
										reqData.psychometricCompleted = 'Completed';
										IndividualLoan.update({
											loanProcessAction: 'PROCEED',
											loanAccount: reqData
										}).$promise.then(function(loanResp){
											
										}).finally(function(){
											$state.go('Page.Engine', {
												pageName: 'psychometric.Queue',
												pageId: null
											});
											PageHelper.hideLoader();
										});
									});
								}, function(errResp) {
									$log.error('Psychometric Test failed');
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