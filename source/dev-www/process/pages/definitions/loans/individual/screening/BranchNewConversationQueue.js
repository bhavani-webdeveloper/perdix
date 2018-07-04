irf.pageCollection.factory(irf.page("loans.individual.screening.BranchNewConversationQueue"), 
	["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","Messaging", "LoanBookingCommons", "irfNavigator",
	function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, Messaging, LoanBookingCommons, irfNavigator) {
		var branch = SessionStore.getBranch();
		var centres = SessionStore.getCentres();
		var currentBranch = SessionStore.getCurrentBranch();
		var centreId=[];
	    if (centres && centres.length) {
		    for (var i = 0; i < centres.length; i++) {
			    centreId.push(centres[i].centreId);
		    }
	    }
		return {
			"type": "search-list",
			"title": "NEW_CONVERSATION_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				// model.branch = branch;
				model.branch = SessionStore.getCurrentBranch().branchId;
				model.branchId = SessionStore.getCurrentBranch().branchId;
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
	                    
	                    'branch': {
	                    	'title': "BRANCH",
	                    	"type": ["string", "null"],
							"x-schema-form": {
								"type":"userbranch",
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
								"parentValueExpr": "model.branch",
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
	                    "stage": {
							"title": "STAGE",
							"type": ["string", "null"],
							"enumCode": "origination_stage",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
							}
						},
	                    "status": {
							"title": "STATUS",
							"type": ["string", "null"],
							"required": true,
							"enumCode": "conversation_status",
							"default": "Active",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true
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
					return Messaging.findProcess({
	                    'replied': 'false',
	                    'stage': searchOptions.stage,
	                    'branchId':searchOptions.branch,
	                    'applicantName':searchOptions.applicantName,
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
							title: 'LAST_MESSAGE',
							data: 'lastMessage'
						}, {
							title: 'APPLICANT_NAME',
							data: 'applicantName'
						},{
							title: 'BUSINESS_NAME',
							data: 'customerName'
						},{
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
							title: 'CURRENT_STAGE',
							data: 'currentStage'
						},{
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
								entityManager.setModel('loans.individual.screening.LoanView', {
									_request: item
								});
								irfNavigator.go({
									state: "Page.Bundle",
									pageName: "loans.individual.screening.LoanView",
									pageId: item.loanId
								}, {
									state: 'Page.Engine',
                                    pageName: "loans.individual.screening.BranchNewConversationQueue"
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