define({ 
	pageUID:"payment.PaymentApprovalSearch",
	pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "SessionStore", "PaymentApprove"],
	$pageFn: function($log, formHelper, $state, SessionStore, PaymentApprove) {
		return {
			"type": "search-list",
			"title": "PAYMENT_APPROVAL",
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
						"paymentId": {
							"title": "PAYMENT_ID",
							"type": "string"
						},
						"debitAccountName": {
							"title": "DEBIT_ACCOUNT_NAME",
							"type": "string",
						},
						"paymentType": {
							"title": "PAYMENT_TYPE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"titleMap": [{
									"name":"RTGS",
									"value":"RTGS"
								},{
									"name":"NEFT",
									"value":"NEFT"
								},{
									"name":"IMPS",
									"value":"IMPS"
								},{
									"name":"cheque",
									"value":"cheque"
								}]
							}
						},
						"paymentMode": {
							"title": "PAYMENT_MODE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"titleMap": [{
									"name":"Auto",
									"value":"auto",
								},{
									"name":"Manual",
									"value":"manual"
								}]
							}
						},
						"paymentPurpose": {
							"title": "PAYMENT_PURPOSE",
							"type": ["string", "null"],
							"x-schema-form": {
								"type": "select",
								"titleMap": [{
									"name":"Loan Disbursement",
									"value":"loanDisbursement"
								}]
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
					return PaymentApprove.getSearch().$promise;
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
							item.paymentId,
							item.paymentDate,
							item.debitAccountName,
							item.paymentType,
							item.paymentMode,
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
							title: 'Payment ID',
							data: 'paymentId'
						}, {
							title: 'Payment Date',
							data: 'paymentDate'
						}, {
							title: 'Debit Account Name',
							data: 'debitAccountName'
						}, {
							title: 'Payment Type',
							data: 'paymentType'
						}, {
							title: 'Payment Mode',
							data: 'paymentMode'
						}, {
							title: 'Payment Purpose',
							data: 'paymentPurpose'
						},
						{
							title: 'Beneficiary Name',
							data: 'beneficiaryName'
						}]
					},
					getActions: function() {
						return [{
							name: "Payment_Approval",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "payment",
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