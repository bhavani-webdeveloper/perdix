irf.pageCollection.factory(irf.page("loans.individual.booking.InitiationQueue"),
["$log", "formHelper","entityManager", "IndividualLoan","$state", "SessionStore", "Utils",
function($log, formHelper,EntityManager, IndividualLoan,$state, SessionStore, Utils){

	var branch = SessionStore.getBranch();

	return {
		"type": "search-list",
		"title": "LOANS_SEARCH",
		"subTitle": "",

		initialize: function (model, form, formCtrl) {
			model.branch = branch;
		},

		definition: {
			title: "SEARCH_LOANS",
            autoSearch: true,
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
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
						"type": "string"
					}
				},
				"required":["stage"]
			},

			getSearchFormHelper: function() {
				return formHelper;
			},

			getResultsPromise: function(searchOptions, pageOpts){     
				var promise = IndividualLoan.search({
					'stage': 'LoanInitiation',
					'branchName': searchOptions.branchName,
					'centreCode': searchOptions.centreCode,
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
					return [{
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
							return true;
						}
					}];
				}
			}
		}
	};
}]);
