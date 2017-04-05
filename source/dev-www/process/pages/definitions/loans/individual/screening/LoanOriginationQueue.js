irf.pageCollection.factory(irf.page("loans.individual.screening.LoanOriginationQueue"), ["$log", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils", "irfNavigator",
	function($log, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils, irfNavigator) {


		return {
			"type": "search-list",
			"title": "LOAN_ORIGINATION_QUEUE",
			"subTitle": "",

			initialize: function(model, form, formCtrl) {
				
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
							"type": ["string", "null"],
							"enumCode": "origination_stage",
							"x-schema-form": {
								"type": "select",

								"screenFilter": true
							}
						},
						"branch": {
	                    	"title": "BRANCH",
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
						"accountNumber": {
							"title": "ACCOUNT_NUMBER",
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
					"required": []
				},

				getSearchFormHelper: function() {
					return formHelper;
				},

				getResultsPromise: function(searchOptions, pageOpts) {

					return IndividualLoan.search({
	                    'stage': searchOptions.stage,
	                    'branchName': searchOptions.branch,
	                    'centreCode': searchOptions.centre,
	                    'enterprisePincode':searchOptions.pincode,
	                    'applicantName':searchOptions.applicantName,
	                    'accountNumber':searchOptions.accountNumber,
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
						return [
						{
							title: 'HUB_NAME',
							data: 'branchName'
						},
						{
							title: 'SPOKE_NAME',
							data: 'centreName'
						},{
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
						},	{
							title: 'CURRENT_STAGE',
							data: 'stage'
						}]
					},
					getActions: function() {
						return [
							{
							name: "VIEW LOAN",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								irfNavigator.go({
									state: "Page.Bundle",
									pageName: "loans.individual.screening.LoanViewList",
									pageId: item.loanId
								},
								{
									state: "Page.Engine",
									pageName: "loans.individual.screening.LoanOriginationQueue"
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