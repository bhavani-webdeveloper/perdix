define({
	pageUID: "kgfs.loans.individual.screening.CBOCreditHeadReviewQueue",
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
		"title": "CBO_Credit_Head_Review",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branchId = SessionStore.getCurrentBranch().branchId;
				var bankName = SessionStore.getBankName();
				var banks = formHelper.enum('bank').data;
				for (var i = 0; i < banks.length; i++){
					if(banks[i].name == bankName){
						model.bankId = banks[i].value;
						model.bankName = banks[i].name;
					}
				}
				var userRole = SessionStore.getUserRole();
				if(userRole && userRole.accessLevel && userRole.accessLevel === 5){
					model.fullAccess = true;
				}
				model.partner = "AXIS";
				model.isPartnerChangeAllowed = false;
				$log.info("Checker1 Queue got initialized");

		},
		definition: {
			title: "SEARCH",
			searchForm: [{
				"type": "section",
				"items": [ 
				{
					"key": "bankId",
					"type": "select",
				}, {
					"key": "branchId",
					"type": "select",
					"parentEnumCode": "bank",
					"parentValueExpr": "model.bankId",
				},
				{
					"key": "centre",
					"type": "select",
					"parentEnumCode": "branch_id",
					"parentValueExpr": "model.branchId",
				},
				{
					"key": "applicantName",
					"type": "string"
				}, 
				{
					"key": "customerUrnNo",
					"type": "number"
				}, 
				{
					"key":"loanType",
					"type": "select"
				}
			]
			}],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"bankId": {
						"title": "BANK_NAME",
						"type": ["integer", "null"],
						enumCode: "bank"
					},
					"branchId": {
						"title": "BRANCH_NAME",
						"type": ["integer", "null"],
						"enumCode": "branch_id"
					},
					"centre":{
						"title": "CENTRE",
						"type": ["integer", "null"],
						"enumCode": "centre",
					},
					"applicantName": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"customerUrnNo": {
						"title": "CUSTOMER_URN_NO",
						"type": "number"
					},
					"loanType": {
						"title": "PRODUCT_TYPE",
						"type": ["string", "null"],
						"enumCode": "booking_loan_type",
					}
				}},
			
			getSearchFormHelper: function () {
				return formHelper;
			},
			getResultsPromise: function (searchOptions, pageOpts) {
				if (_.hasIn(searchOptions, 'centreCode')) {
					searchOptions.centreCodeForSearch = LoanBookingCommons.getCentreCodeFromId(searchOptions.centreCode, formHelper);
				}
				return IndividualLoan.search({
					'bankId': searchOptions.bankId,
					'branchId': searchOptions.branchId,
					'stage': 'CBOCreditHeadReview',
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
						item.centreName,
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
							title: 'CENTRE_NAME',
							data: 'centreName'
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
						name: "CBO_Credit_Head_Review",
						desc: "",
						icon: "fa fa-pencil-square-o",
						fn: function (item, index) {
							entityManager.setModel('kgfs.loans.individual.screening.CBOCreditHeadReview', {
								_request: item
							});
							irfNavigator.go({
								state: "Page.Bundle",
								pageName: "kgfs.loans.individual.screening.CBOCreditHeadReview",
								pageId: item.loanId
							}, {
									state: 'Page.Engine',
									pageName: "kgfs.loans.individual.screening.CBOCreditHeadReviewQueue"
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