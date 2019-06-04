define({
	pageUID: "insurance.InsuranceRegistrationQueue", 
	pageType: "Engine",
	dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "Insurance", "entityManager", "irfNavigator"],
	$pageFn: function($log, formHelper, $state, $q, SessionStore, Utils,Insurance, entityManager, irfNavigator) {
		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "INSURANCE_REGISTRATION_QUEUE", 
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				
				$log.info("search-list sample got initialized");
			},
			definition: {
				title: "SEARCH_INSURANCES",
				searchForm: [
					"*"
				],
				autoSearch: false,
				searchSchema: {
					"type": 'object',
					"title": 'SEARCH_OPTIONS',
					"properties": {
						'customerId': {
	                    	'title': "CUSTOMER_ID",
	                    	"type": ["number", "null"]
	                    },
						"productCode": {
							"title": "PRODUCT_CODE",
							"type": ["string", "null"]
						},
	                    "patnerCode":
						{
	                        "title": "PARTNER_CODE",
	                        "type": "string"
	                    },
	                    "insuranceType": {
	                        "title": "INSURANCE_TYPE",
	                        "type": "string"
	                    },
	                    "centreId": {
	                        "title": "CENTRE_ID",
	                        "type": "string"
	                    }
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {

					return Insurance.search({
	                    'centreId':searchOptions.centreId,
	                    'customerId':searchOptions.customerId,
	                    'productCode': searchOptions.productCode,
	                    'partnerCode':searchOptions.partnerCode,
	                    'insuranceType': searchOptions.InsuranceType,
	                    'page': pageOpts.pageNo,
	                    'per_page': pageOpts.itemsPerPage
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
							item.customerId,
							item.benificieryName,
							item.benificieryRelationship,
							item.centreId,
							item.productCode,
							item.premiumRateCode,
							item.insuranceType
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
							title: 'CUSTOMER_ID',
							data: 'customerId'
						},
						{
							title: 'CENTRE_ID',
							data: 'centreId'
						},
						{
							title: 'BENIFICIERY_NAME',
							data: 'benificieryName'
						},
						{
							title: 'INSURANCE_IN_NAME_OF',
							data: 'benificieryRelationship'
						}, 
						{
							title: 'PRODUCT_CODE',
							data: 'productCode'
						},
						{
							title: 'INSURANCE_TYPE',
							data: 'insuranceType'
						}]
					},
					getActions: function() {
						return [
							{
							name: "INSURANCE_POLICY",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								if(item.insuranceType == 'PAI'){
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "insurance.Registration",
									pageId: item.id
								});
							}else if(item.insuranceType == 'TLI'){
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "insurance.RegistrationTLI",
									pageId: item.id
								});
							}

							},
							isApplicable: function(item, index) {

								return true;
							}
							},
							{
								name: "REVERSE",
								desc: "",
								icon: "fa fa-pencil-square-o",
								fn: function(item, index) {
									debugger;
									if(item.insuranceType == 'PAI'){
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "insurance.Registration",
										pageId: item.id,
										pageData:{
											'insuranceReversal':true
										}
									});
								}else if(item.insuranceType == 'TLI'){
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "insurance.RegistrationTLI",
										pageId: item.id,
										pageData:{
											'insuranceReversal':true
										}
									});
								}
	
								},
								isApplicable: function(item, index) {
									return true;
								}
							}
						];
					}
				}
			}
		};
	}
});