irf.pageCollection.factory(irf.page("psychometric.Queue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons", "Psychometric", "PsychometricTestService", "PageHelper",
	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons, Psychometric, PsychometricTestService, PageHelper) {
		var branch = SessionStore.getBranch();
		var centres = SessionStore.getCentres();
		var centreId=[];
		for (var i = 0; i < centres.length; i++) {
			centreId.push(centres[i].centreId);
		}
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
	                    'centreCode':centreId[0],
	                    'branchName':branch,
	                    'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'status':searchOptions.status,
	                    'villageName':searchOptions.villageName,
	                    'customerName': searchOptions.businessName,
	                    'psychometric_completed': 'N',
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
							title: 'SCREENING_DATE',
							data: 'screeningDate'
						}, {
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						},{
							title: 'BUSINESS_NAME',
							data: 'customerName'
						}, {
							title: 'AREA',
							data: 'area'
						}, {
							title: 'CITY_TOWN_VILLAGE',
							data: 'villageName'
						}, {
							title: 'PIN_CODE',
							data: 'enterprisePincode'
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
											loanProcessAction: 'SAVE',
											loanAccount: reqData
										}).$promise.then(function(loanResp){
											
										}, function(errResp){
											PageHelper.setErrors(errResp);
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