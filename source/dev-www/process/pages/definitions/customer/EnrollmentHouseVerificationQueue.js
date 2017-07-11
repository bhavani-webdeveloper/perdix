irf.pageCollection.factory(irf.page("EnrollmentHouseVerificationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore",
function($log, formHelper, Enrollment, $state, SessionStore){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list", 
		"title": "T_HOUSE_VERIFICATION_PENDING_QUEUE",
		"subTitle": "T_ENROLLMENTS_PENDING",
		initialize: function (model, form, formCtrl) {
			$log.info("search-list sample got initialized");
			model.branch = SessionStore.getCurrentBranch().branchId;
			model.stage = 'Stage02';
		},
		offline: true,
		getOfflineDisplayItem: function(item, index){
			return [
				"Branch: " + item["branch"],
				"Centre: " + item["centre"]
			]
		},
		getOfflinePromise: function(searchOptions){      /* Should return the Promise */
			var promise = Enrollment.search({
				'branchName': searchOptions.branch,
				'centreCode': searchOptions.centre,
				'firstName': searchOptions.first_name,
				'lastName': searchOptions.last_name,
				'page': 1,
				'per_page': 100,
				'stage': "Stage02"
			}).$promise;

			return promise;
		},
		definition: {
			title: "T_SEARCH_CUSTOMERS",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"required":["branch"],
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
						"type": ["integer", "null"],
						"enumCode": "branch_id",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"centre": {
						"title": "CENTRE",
						"type": ["integer", "null"],
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"parentEnumCode": "branch_id",
							"parentValueExpr": "model.branch",
							"screenFilter": true	
						}
					}
				}
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){    /* Should return the Promise */
				var branches = formHelper.enum('branch').data;
				var branchName = null;
				for (var i=0;i<branches.length; i++){
					var branch = branches[i];
					 if (branch.code == searchOptions.branch){
					 	branchName = branch.name;
					 }
				}
				
				var promise = Enrollment.search({
					'branchName': branchName,
					'centreCode': searchOptions.centre,
					'firstName': searchOptions.first_name,
					'lastName': searchOptions.lastName,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage,
					'stage': "Stage02"
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
					$log.info("Redirecting");
					$state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
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
							name: "Do House Verification",
							desc: "",
							fn: function(item, index){
								$log.info("Redirecting");
								$state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
							},
							isApplicable: function(item, index){
								//if (index%2==0){
								//	return false;
								//}
								return true;
							}
						}
					];
				}
			}
		}
	};
}]);
