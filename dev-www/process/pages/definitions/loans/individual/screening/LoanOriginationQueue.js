irf.pageCollection.factory(irf.page("loans.individual.screening.LoanOriginationQueue"), ["$log", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils",
	function($log, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils) {

		var branch = SessionStore.getBranch();

		return {
			"type": "search-list",
			"title": "LOAN_ORIGINATION_QUEUE",
			"subTitle": "",

			initialize: function(model, form, formCtrl) {
				model.branch = branch;
			},

			definition: {
				title: "SEARCH_LOANS",
				searchForm: [
					"*"
				],
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"stage": {
							"title": "STAGE",
							"type": "string",
							"enumCode": "origination_stage",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
							}
						},
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
							"title": "PIN_CODE",
							"type": "string"
						},
						"status": {
							"type": "string",
							"title": "STATUS",
							"enumCode": "origination_status",
							"x-schema-form": {
								"type": "select"
							}
						}
					},
					"required": ["stage"]
				},

				getSearchFormHelper: function() {
					return formHelper;
				},

				getResultsPromise: function(searchOptions, pageOpts) {
					var branch = SessionStore.getCurrentBranch();
		            var centres = SessionStore.getCentres();
		            var centreId=[];
				    if (centres && centres.length) {
					    for (var i = 0; i < centres.length; i++) {
						    centreId.push(centres[i].centreId);
					    }
				    }
					if (_.hasIn(searchOptions, 'centreCode')){
	                    searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
	                }
					return IndividualLoan.search({
	                    'stage': searchOptions.stage,
	                    'centreCode':centreId[0],
	                    'branchName':branch.branchName,
	                    'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'area':searchOptions.area,
	                    'status':searchOptions.status,
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
						},{
							title: 'CURRENT_STAGE',
							data: 'stage'
						}]
					},
					getActions: function() {
						return [/*{
							name: "FIELD_APPRAISAL_REVIEW",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								entityManager.setModel('loans.individual.screening.FieldAppraisalReview', {
									_request: item
								});
								$state.go("Page.Bundle", {
									pageName: "loans.individual.screening.FieldAppraisalReview",
									pageId: item.loanId
								});
							},
							isApplicable: function(item, index) {

								return true;
							}
						}*/];
					}
				}
			}
		};
	}
]);