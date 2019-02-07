define({
	pageUID: "kgfs.loans.individual.screening.CreditAppraisalQueue",
   pageType: "Engine",
   dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager","IndividualLoan", "LoanBookingCommons","irfNavigator"],
   $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, IndividualLoan, LoanBookingCommons,irfNavigator) {
	   var branch = SessionStore.getBranch();
	   var centres = SessionStore.getCentres();
	   var centreId=[];
	   if (centres && centres.length) {
		   for (var i = 0; i < centres.length; i++) {
			   centreId.push(centres[i].centreId);
		   }
	   }
	   return {
		"type": "search-list",
		"title": "CREDIT_APPRAISAL",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			$log.info("search-list sample got initialized");

		},
		definition: {
			title: "SEARCH",
			searchForm: [
				"*"
			],
			//autoSearch: true,
			searchSchema: {
				"type": 'object',
				"title": 'SEARCH_OPTIONS',
				"properties": {
					"branch": {
						'title': "BRANCH",
						"type": ["string", "null"],
						"required":true,
						"x-schema-form": {
							"type": "userbranch",
							"screenFilter": true
						}
					},
					"centre": {
						"title": "CENTRE",
						"type": ["integer", "null"],
                       // "required":true,
						"x-schema-form": {
							"type": "select",
							"enumCode": "centre",
							"parentEnumCode": "branch_id",
							"parentValueExpr": "model.branch",
							"screenFilter": true
						}
					},
					"applicantName": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"urn": {
						"title": "URN_NO",
						"type": "string"
					},
					"loanType": {
						"title": "PRODUCT_TYPE",
						"enumCode": "product_type",
						"type": "string",
						"x-schema-form": {
							"type": "select"
						}
					},
				},
				"required": []
			},
			getSearchFormHelper: function () {
				return formHelper;
			},
			getResultsPromise: function (searchOptions, pageOpts) {
				if (_.hasIn(searchOptions, 'centreCode')) {
					searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
				}
				return IndividualLoan.search({
					'branchId': searchOptions.branch,
					'stage': 'CreditAppraisal',
					'applicantName': searchOptions.applicantName,
					'centreCode': searchOptions.centre,
					'urn':searchOptions.urn,
					'loanType':searchOptions.loanType
				}).$promise;
			},
			paginationOptions: {
				"getItemsPerPage": function (response, headers) {
					return 100;
				},
				"getTotalItemsCount": function (response, headers) {
					return headers['x-total-count']
				}
			},
			listOptions: {
				selectable: false,
				expandable: true,
				listStyle: "table",
				itemCallback: function (item, index) { },
				getItems: function (response, headers) {
					if (response != null && response.length && response.length != 0) {
						return response;
					}
					return [];
				},
				getListItem: function (item) {
					return [
						item.applicantName,
						item.urn,
						item.loanAmount,
						item.loanType,
						item.partnerCode,
					]
				},
				getTableConfig: function () {
					return {
						"serverPaginate": true,
						"paginate": true,
						"pageLength": 10
					};
				},
				getColumns: function () {
					return [ {
							title: 'LOAN_ID',
							data: 'id'
                        },{
							title: 'URN_NO',
							data: 'urn'
						},{
							title: 'CUSTOMER_NAME',
							data: 'applicantName'
						},{
							title:'LOAN_AMOUNT',
							data:'loanAmount'
						},{
							title: 'LOAN_TYPE',
							data: 'loanType'
                      	},{
							title: 'PARTNER_CODE',
							data: 'partnerCode'
                        }]
				},
				getActions: function () {
					return [{
						name: "CREDIT_APPRAISAL",
						desc: "",
						icon: "fa fa-pencil-square-o",
						fn: function (item, index) {
							entityManager.setModel('kgfs.loans.individual.screening.CreditAppraisal', {
								_request: item
							});
							irfNavigator.go({
								state: "Page.Bundle",
								pageName: "kgfs.loans.individual.screening.CreditAppraisal",
								pageId: item.loanId
							}, {
									state: 'Page.Engine',
									pageName: "kgfs.loans.individual.screening.CreditAppraisalQueue"
								});
						},
						isApplicable: function (item, index) {

							return true;
						}
					}];
				}
			}
		}
	};
}
})