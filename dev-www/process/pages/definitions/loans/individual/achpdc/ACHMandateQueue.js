/*
About ACHMandateQueue.js
-------------------------
1. Search page that displays all the ACH Loan Accounts based on the sort criteria.
2. To update ACH Account
3. To Dounload ACH Mandate Registration file.

Methods
-------
Initialize : To decare the required model variables.
getResultsPromise : TO return the result of ACH.search.
getListItem : Values to display from search result
getActions : Menu icon to Update ACH or to Download Mandate.

Services
--------
ACH.search : To get all the ACH Accounts.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHMandateQueue"),
["$log", "formHelper","entityManager", "ACH","$state", "SessionStore", "Utils",
function($log, formHelper,EntityManager, ACH,$state, SessionStore, Utils){

	var branch = SessionStore.getBranch();

	return {
		"type": "search-list",
		"title": "ACH_MANDATE_QUEUE",
		"subTitle": "",

		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("search-list sample got initialized");
		},

		definition: {
			title: "SEARCH_CUSTOMERS",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SEARCH_OPTIONS',
				"properties": {
					"accountNumber": {
						"title": "ACCOUNT_NUMBER",
						"type": "string",
						"enumCode": "stage",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"mandateStatus": {
						"title": "MANDATE_STATUS",
						"type": "string"
					},
					"bankName": {
						"title": "BANK_NAME",
						"type": "string"
					}
				}
				//"required":["branch"]
			},

			getSearchFormHelper: function() {
				return formHelper;
			},

			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = ACH.search({
					'accountNumber': searchOptions.accountNumber,
					'mandateStatus': searchOptions.mandateStatus,
					'bankName': searchOptions.bankName
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
					if (response!=null && response.length && response.length!=0) {
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						
						"{{'ACCOUNT_NUMBER'|translate}} : " + item.accountId,
						"{{'CUSTOMER_NAME'|translate}} : " + item.accountHolderName,
						"{{'LOAN_AMOUNT'|translate}} : " + item.maximumAmount,
						"{{'REGISTRATION_STATUS'|translate}} : " + item.registrationStatus
					]
				},
				getActions: function(){
					return [
						{
							name: "ACH_UPDATE",
							desc: "",
							icon: "fa fa-user-plus",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.achpdc.ACHRegistration",{_ach:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.achpdc.ACHRegistration",
									pageId:item.loanId
								});
							},
							isApplicable: function(item, index){
								return true;

							}
						},
						{
							name: "ACH_MANDATE",
							desc: "",
							icon: "fa fa-user-plus",
							fn: function(item, index){
								EntityManager.setModel("loans.individual.achpdc.ACHMandateDownload",{_achMandate:item});
								$state.go("Page.Engine",{
									pageName:"loans.individual.achpdc.ACHMandateDownload",
									pageId:item.loanId
								});
							},
							isApplicable: function(item, index){
								if ((item.registrationStatus == "PENDING") || (item.registrationStatus == "REJECTED")) {
									return true;
								} 
								else { 
									return false;
								}
							}
						}
					];
				}
			}
		}
	};
}]);
