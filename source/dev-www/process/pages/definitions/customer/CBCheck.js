irf.pageCollection.factory(irf.page("CBCheck"),
	["$log", "formHelper", "Enrollment", "CreditBureau", "SessionStore", "$state", "entityManager",
	function($log, formHelper, Enrollment, CreditBureau, SessionStore, $state, entityManager){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "CREDIT_BUREAU_CHECK",
		"subTitle": "CUSTOMER_SEARCH",
		initialize: function (model, form, formCtrl) {
			model.branchName = branch;
			$log.info("search-CustomerCBCheck got initialized");
		},
		definition: {
			title: "SEARCH_CUSTOMERS",
			pageName: "CustomerCBCheck",
			searchForm: ["*"],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"required": ["branchName"],
				"properties": {
					"firstName": {
						"title": "FULL_NAME",
						"type": "string"
					},
					"lastName": {
						"title": "LASTNAME",
						"type": "string"
					},
					"kycNumber": {
						"title": "KYC_NO",
						"type": "string"
					},
					"urnNo": {
						"title": "URN_NO",
						"type": "number"
					},
					"branchName": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true,
						}
					},
					"centreCode": {
						"title": "CENTRE_CODE",
						"type":["number", "null"],
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"filter": {
								"parentCode as branch": "model.branchName"
							},
							"screenFilter": true
						}
					}
				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){
				var promise = Enrollment.search({
					'branchName': searchOptions.branchName,
					'firstName': searchOptions.firstName,
					'centreCode': searchOptions.centreCode,
					'kycNumber': searchOptions.kycNumber,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
					'lastName': searchOptions.lastName,
					'urnNo': searchOptions.urnNo
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
				itemCallback: function(item, index) {
					$log.info(item);
				},
				getItems: function(response, headers){
					if (response!=null && response.length && response.length!=0){
						return response;
					}
					return [];
				},
				getListItem: function(item){
					return [
						item.firstName + " " + (item.lastName!=null?item.lastName:""),
						'Customer ID : ' + item.id,
						null
					]
				},
				getActions: function(){
					return [
						{
							name: "Capture CB check info",
							desc: "",
							fn: function(item, index) {
								$log.info(item.urnNo);
								entityManager.setModel('CBCheckCapture', {_request:item});
								$state.go("Page.Engine", {pageName:"CBCheckCapture", pageId:null});

/*"id": 327989,
"enrollmentId": "50862105161045482653",
"urnNo": null,
"firstName": "Test user",
"lastName": null,
"middleName": null,
"fatherFirstName": "Test father",
"fatherLastName": null,
"fatherMiddleName": null,
"verified": false,
"kgfsName": "Karambayam",
"kgfsBankName": "Pudhuaaru",
"enrolledAs": "CUSTOMER",
"parentCustomerId": null,
"centreCode": null*/
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
