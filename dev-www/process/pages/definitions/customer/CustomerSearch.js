irf.pageCollection.factory("Pages__CustomerSearch",
["$log", "formHelper", "Enrollment","$state", "SessionStore",
function($log, formHelper, Enrollment,$state, SessionStore){
	var branch = SessionStore.getBranch();
	return {
		"id": "CustomerSearch",
		"type": "search-list",
		"name": "CustomerSearch",
		"title": "CUSTOMER_SEARCH",
		"subTitle": "",
		"uri":"Customer Search",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search Customers",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"first_name": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"lastName": {
						"title": "LASTNAME",
						"type": "string"
					},
					"kyc_no": {
						"title": "KYC_NO",
						"type": "string"
					},
					"branch": {
						"title": "BRANCH_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"centre": {
						"title": "CENTRE",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					}

				},
				"required":["branch"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Enrollment.search({
					'branchName': searchOptions.branch,
					'firstName': searchOptions.first_name,
					'centreCode': searchOptions.centre,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
					'kycNumber': searchOptions.kyc_no,
					'lastName': searchOptions.lastName
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
					if (item.currentStage==='Stage01') {
						$state.go("Page.Engine",{
							pageName:"ProfileInformation",
							pageId:item.id
						});
					} else {
						$state.go("Page.Customer360",{
							pageId:item.id
						});
					}
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
							name: "Edit/Enroll Customer",
							desc: "",
							icon: "fa fa-user-plus",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"ProfileInformation",
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Stage01')
									return true;
								else return false;
							}
						},
						{
							name: "Edit Enrollment",
							desc: "",
							icon: "fa fa-pencil",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"CustomerRUD",
									pageId:item.id,
									pageData:{
										intent:'EDIT'
									}
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Stage01')
									return false;
								else return true;
							}
						}
					];
				}
			}


		}
	};
}]);
