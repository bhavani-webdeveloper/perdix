/*
About Queue.js
-------------------------
1. Search page that displays all the Loan Accounts based on the sort criteria.
2. To Create/update ACH Account
3. To Create/update PDC Account.

Methods
-------
Initialize : To decare the required model variables.
getResultsPromise : TO return the result of IndividualLoan.search.
getListItem : Values to display from search result
getActions : Menu icon to create/update ACH or create/update PDC.

Services
--------
IndividualLoan.search : To get all the Loan Accounts.
*/
irf.pageCollection.factory(irf.page("loans.individual.Queue"),
["$log", "formHelper","entityManager", "IndividualLoan","$state", "SessionStore", "Utils","PagesDefinition",
function($log, formHelper,EntityManager, IndividualLoan,$state, SessionStore, Utils,PagesDefinition){

	var branch = SessionStore.getBranch();

	return {
		"type": "search-list",
		"title": "LOANS_SEARCH",
		"subTitle": "",

		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			model.stage = 'Completed';
			model.siteCode = SessionStore.getGlobalSetting('siteCode');
			//model.branch = branch;
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
						"enumCode": "loan_stage1",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					'branch': {
						'title': "BRANCH",
						"type": ["string", "null"],
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
							"parentValueExpr": "model.branch",
							"screenFilter": true
						}
					},
					"customerId": {
						"title": "CUSTOMER_ID",
						"type": "number"
					},
					"accountNumber": {
						"title": "ACCOUNT_NUMBER",
						"type": "string"
					}
				},
				"required":["stage"]
			},

			getSearchFormHelper: function() {
				return formHelper;
			},

			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
				var promise = IndividualLoan.search({
					'stage': searchOptions.stage,
					'branchId':searchOptions.branch,
					'centreCode': searchOptions.centre,
					'customerId': searchOptions.customerId,
					'accountNumber': searchOptions.accountNumber,
                    'page': pageOpts.pageNo
				}).$promise;
				return promise;
			},

			paginationOptions: {
				"viewMode": "page",
				"getItemsPerPage": function(response, headers){
					return 20;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},

			listOptions: {
				expandable: true,
				itemCallback: function(item, index) {
				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [

						"{{'ACCOUNT_NUMBER'|translate}} : " + item.accountNumber,
						"{{'ENTITY_NAME'|translate}} : " + item.customerName,
						"{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount,
						"{{'LOAN_TYPE'|translate}} : " + item.loanType,
						"{{'PARTNER_CODE'|translate}} : " + item.partnerCode,
						"{{'PROCESS_TYPE'|translate}} : " + item.processType
					]
				},
				getActions: function(){
					return PagesDefinition.getUserAllowedQueueActionsDefinition([
						{
							name: "LOAN_INPUT",
							desc: "",
							icon: "fa fa-book",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.booking.LoanInput",{_loan:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.booking.LoanInput",
									pageId:item.loanId
								});
							},
							isApplicable: function(item, index){
								if(item.stage == "LoanInitiation") {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							name: "CAPTURE_DATES",
							desc: "",
							icon: "fa fa-clock-o",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.booking.LoanBooking",{_loan:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.booking.LoanBooking",
									pageId:item.loanId
								});
							},
							isApplicable: function(item, index){
								if(item.stage == "LoanBooking") {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							name: "DOCUMENT_UPLOAD",
							desc: "",
							icon: "fa fa-file-excel-o",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.booking.DocumentUpload",{_loan:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.booking.DocumentUpload",
									pageId:item.loanId
								});
							},
							isApplicable: function(item, index){
								if(item.stage == "DocumentUpload") {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							name: "View Details",
							desc: "",
							fn: function(item, index){
								$state.go('Page.Engine', {
									pageName: 'customer360.loans.LoanDetails',
									pageId: item.loanId
								})
							},
							isApplicable: function(item, index){
								var siteCode = SessionStore.getGlobalSetting('siteCode');
								if (item.loanId && siteCode=='witfin'){
									return true;
								}
								return false;
							}
						},
						{
							name: "Repay",
							desc: "",
							fn: function(item, index){
								$state.go('Page.Engine', {
									pageName: 'loans.LoanRepay',
									pageId: [item.accountNumber,item.urn].join(".")
								})
							},
							isApplicable: function(item, index){
								var siteCode = SessionStore.getGlobalSetting('siteCode');
								if(siteCode == 'witfin')
								{
									return true;
								} else {
									return false;
								}
							}
						},
						{
							name: "COLLECTION_STATUS",
							desc: "",
							fn: function(item, index){
							   // entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BounceQueue"});
								$state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.accountNumber});
							},
							isApplicable: function(item, index){
								var siteCode = SessionStore.getGlobalSetting('siteCode');
								if(siteCode == 'witfin') return true;
							}
						},
						{
							name: "Amend",
							desc: "",
							fn: function(item, index){
								$state.go('Page.Engine', {
									pageName: 'loans.LoanAmend',
									pageId: [item.accountNumber,item.urn].join(".")
								})
							},
							pagePermission:'Page/Engine/loans.LoanAmend',
							isApplicable: function(item, index){
								var siteCode = SessionStore.getGlobalSetting('siteCode');
								if(siteCode == 'witfin') {
									return true;
								}
								return false;
							}
						},
						{ 
							name: "Unmark NPA",
							desc: "",
							fn: function(item, index){
								$state.go('Page.Engine', {
									pageName: 'loans.UnmarkNPA',
									pageId: [item.accountNumber,item.urn].join(".")
								})
							},
							pagePermission:'Page/Engine/loans.UnmarkNPA',
							isApplicable: function(item, index){
								var siteCode = SessionStore.getGlobalSetting('siteCode');
									if (siteCode=='witfin') {
										return true
									} else {
										return false
									};


						}
						},

						{
							name: "CUSTOMER_360",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model){
								$state.go("Page.Customer360",{
									pageName:"Page.Customer360",
									pageId:item.customerId,
									pageData:model.siteCode
								});
							},
							isApplicable: function(item, model){
								var siteCode = SessionStore.getGlobalSetting('siteCode');
								if(item.stage == "Completed" && siteCode=="witfin") {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							name: "COLLECT_ADHOC_CHARGES",
							desc: "",
							icon: "fa fa-rupee",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.collections.ChargeFee", {"_loan": item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.collections.ChargeFee",
									pageId:item.accountNumber
								});
							},
							isApplicable: function(item, index){
								if(item.stage == "Completed") {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							name: "ACH_REGISTRATION",
							desc: "",
							icon: "fa fa-cc",
							fn: function(item, index){
								//EntityManager.setModel("loans.individual.achpdc.ACHRegistration",{_loanAch:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.achpdc.ACHRegistration",
									pageId:item.loanId, 
									pageData: item
								});
							},
							isApplicable: function(item, index){
								if(item.stage == "Completed") {
									return true;
								} else {
									return false;
								}
							}
						},
						{
							name: "PDC_REGISTRATION",
							desc: "",
							icon: "fa fa-cc",
							fn: function(item, index){
								//EntityManager.setModel("loans.individual.achpdc.PDCRegistration",{_pdc:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.achpdc.PDCRegistration",
									pageId:item.loanId,
									pageData: item
								});
							},
							isApplicable: function(item, index){
								if(item.stage == "Completed") {
									return true;
								} else {
									return false;
								}

							}
						},
						{
							name: "CLOSE_LOAN",
							desc: "",
							icon: "fa fa-close",
							fn: function(item, index){
								//EntityManager.setModel("loans.individual.achpdc.PDCRegistration",{_pdc:item});
								$state.go("Page.Engine",{
									pageName:"loans.CloseLoan",
									pageId:item.loanId,
									pageData: item
								});
							},
							isApplicable: function(item, index){
								if(item.stage != "Completed") {
									return true;
								} else {
									return false;
								}

							}
						}
					]);
				}
			}
		}
	};
}]);
