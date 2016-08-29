irf.pageCollection.factory(irf.page("loans.individual.Queue"),
["$log", "formHelper","entityManager", "IndividualLoan","$state", "SessionStore", "Utils",
function($log, formHelper,EntityManager, IndividualLoan,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"id": "CustomerSearch",
		"type": "search-list",
		"name": "CustomerSearch",
		"title": "CUSTOMER_SEARCH",
		"subTitle": "",
		"uri":"Customer Search",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Customers",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"stage": {
						"title": "STAGE",
						"type": "string"
					},
					"branchName": {
						"title": "BRANCH_ID",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"centreCode": {
						"title": "CENTRE_CODE",
						"type": "string"
					},
					"customerId": {
						"title": "CUSTOMER_ID",
						"type": "number"
					},
					"accountNumber": {
						"title": "ACCOUNT_NUMBER",
						"type": "number"
					}
				},
				"required":["branch"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = IndividualLoan.search({
					'stage': searchOptions.stage,
					'branchName': searchOptions.branchName,
					'centreCode': searchOptions.centreCode,
					'customerId': searchOptions.customerId,
					'accountNumber': searchOptions.accountNumber
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
						"{{'CUSTOMER_NAME'|translate}} : " + item.customerName,
						"{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount,
						"{{'LOAN_TYPE'|translate}} : " + item.loanType,
						"{{'PARTNER_CODE'|translate}} : " + item.partnerCode,
						"{{'PROCESS_TYPE'|translate}} : " + item.processType
					]
				},
				getActions: function(){
					return [
						{
							name: "Update ACH",
							desc: "",
							icon: "fa fa-user-plus",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.achpdc.ACHRegistration",{_ach:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.achpdc.ACHRegistration",
									pageId:item.accountNumber
								});
							},
							isApplicable: function(item, index){
								
								return true;
							}
						},
						{
							name: "Update PDC",
							desc: "",
							icon: "fa fa-user-plus",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.achpdc.PDCRegistration",{_pdc:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.achpdc.PDCRegistration",
									pageId:item.accountNumber
								});
							},
							isApplicable: function(item, index){
								
								return true;
							}
						},
						{
							name: "Do House Verification",
							desc: "",
							icon: "fa fa-house",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"AssetsLiabilitiesAndHealth",
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Stage02')
									return true;
								return false;
							}
						},
						{
							name: "Customer 360",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index){
								$state.go("Page.Customer360",{
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Completed')
									return true;
								return false;
							}
						}
					];
				}
			}
		}
	};
}]);
