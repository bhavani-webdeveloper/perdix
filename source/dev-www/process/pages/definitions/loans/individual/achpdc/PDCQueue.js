
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCQueue"),
["$log", "formHelper","entityManager", "IndividualLoan","$state", "SessionStore", "Utils",
function($log, formHelper,EntityManager, IndividualLoan,$state, SessionStore, Utils){

	var branch = SessionStore.getBranch();

	return {
		"type": "search-list",
		"title": "PDC_LOANS_SEARCH",
		"subTitle": "",

		initialize: function (model, form, formCtrl) {
			model.branch = branch;
		},

		definition: {
			title: "SEARCH_PDC_LOANS",
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
                        "title": "CENTER_NAME",
                        "type": ["number", "null"],
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "parentEnumCode":"branch"
                        }
                    },
					"customerId": {
						"title": "CUSTOMER_ID",
						"type": "number"
					},
					"accountNumber": {
						"title": "ACCOUNT_NUMBER",
						"type": "string"
					},
					"customerName": {
						"title": "ENTITY_NAME",
						"type": "string"
					}
				},
				"required":["branchName"]
			},

			getSearchFormHelper: function() {
				return formHelper;
			},

			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
				var promise = IndividualLoan.search({
					'stage': "Completed",
					'branchName': searchOptions.branchName,
					'centreCode': searchOptions.centreCode,
					'customerId': searchOptions.customerId,
					'accountNumber': searchOptions.accountNumber,
					'customerName': searchOptions.customerName,
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
					return [
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
								return true;
							}
						}
					];
				}
			}
		}
	};
}]);
