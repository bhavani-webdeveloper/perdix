define({ 
	pageUID:"payment.PaymentApprovalSearch",
	pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "SessionStore", "Payment"],
	$pageFn: function($log, formHelper, $state, SessionStore, Payment) {
		return {
			"type": "search-list",
			"title": "PAYMENT_APPROVAL_SEARCH",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				$log.info("payment approval list got initialized");
			},
			definition: {
				title: "Search",
				searchForm: [
					"*"
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"paymentDate": {
							"title": "PAYMENT_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date"
							}
						},
						"id": {
							"title": "PAYMENT_ID",
							"type": "string"
						},
						"debitAccountName": {
							"title": "DEBIT_ACCOUNT_NAME",
							"type": "string",
						},
						"transactionType": {
							"title": "PAYMENT_TYPE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode":"payment_type"
							}
						},
						"modeOfPayment": {
							"title": "PAYMENT_MODE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode":"mode_of_payment"
							}
						},
						"paymentPurpose": {
							"title": "PAYMENT_PURPOSE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode":"payment_purpose"
							}
						},
						"beneficiaryName": {
							"title": "BENEFICIARY_NAME",
							"type": "string",
						}
					}
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					return Payment.search({
						'paymentDate': searchOptions.paymentDate,
						'transactionType': searchOptions.transactionType,
						'modeOfPayment': searchOptions.modeOfPayment,
						'id': searchOptions.id,
						'debitAccountName': searchOptions.debitAccountName,
						'paymentPurpose': searchOptions.paymentPurpose,
						'beneficiaryName': searchOptions.beneficiaryName,
						'currentStage':"PaymentApproval",
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
							item.id,
							item.paymentDate,
							item.debitAccountName,
							item.transactionType,
							item.modeOfPayment,
							item.paymentPurpose,
							item.beneficiaryName
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
							title: 'Payment_ID',
							data: 'id'
						}, {
							title: 'Payment_Date',
							data: 'paymentDate'
						}, {
							title: 'Debit_Account_Name',
							data: 'debitAccountName'
						}, {
							title: 'Payment_Type',
							data: 'transactionType'
						}, {
							title: 'Payment_Mode',
							data: 'modeOfPayment'
						}, {
							title: 'Payment_Purpose',
							data: 'paymentPurpose'
						},
						{
							title: 'Beneficiary_Name',
							data: 'beneficiaryName'
						}]
					},
					getActions: function() {
						return [{
							name: "VIEW_DETAILS",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "payment.PaymentApproval",

									pageId: item.id
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
});