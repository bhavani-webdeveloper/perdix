irf.pageCollection.factory(irf.page("loans.individual.booking.InitiationQueue"),
["$log","irfNavigator", "formHelper","entityManager", "IndividualLoan","$state", "SessionStore", "Utils","irfProgressMessage","Locking",
function($log, irfNavigator, formHelper,EntityManager, IndividualLoan,$state, SessionStore, Utils,irfProgressMessage,Locking){

	var branch = SessionStore.getBranch();

	return {
		"type": "search-list",
		"title": "LOANS_SEARCH",
		"subTitle": "",

		initialize: function (model, form, formCtrl) {
			// model.branch = branch;
			model.siteCode = SessionStore.getGlobalSetting("siteCode");
			model.branch = SessionStore.getCurrentBranch().branchId;
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

			getResultsPromise: function(searchOptions, pageOpts){     
				var promise = IndividualLoan.search({
					'stage': 'LoanInitiation',
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
					return [{
						name: "LOAN_INPUT",
						desc: "",
						icon: "fa fa-book",
						fn: function(item, index){
							Locking.findlocks({}, {}, function (resp, headers) {
								var i;
								for (i = 0; i < resp.body.length; i++) {
									if (item.loanId == resp.body[i].recordId) {
										var def = true;
									}
								}
								if (def) {
									irfProgressMessage.pop("Selected list", "File is Locked, Please unlock from AdminScreen", 4000);
								}
								else {
									irfNavigator.go({
										'state': 'Page.Engine',
										'pageName': 'loans.individual.booking.LoanInput',
										'pageId': item.loanId,
										'pageData': item
									});
								}
							}, function (resp) {
								$log.error(resp);
							});
														
						},
						isApplicable: function(item, model){
							return model.searchOptions.siteCode != 'sambandh';
						}
					},{
						name: "LOAN_INPUT",
						desc: "",
						icon: "fa fa-book",
						fn: function(item, index){
							irfNavigator.go({
                                'state': 'Page.Engine',
                                'pageName': 'loans.individual.booking.SimpleLoanInput',
                                'pageId': item.loanId,
                                'pageData': item
                            });								
						},
						isApplicable: function(item, model){
							return model.searchOptions.siteCode == 'sambandh';
						}
					}];
				}
			}
		}
	};
}]);
