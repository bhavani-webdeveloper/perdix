irf.pageCollection.factory(irf.page("loans.individual.documentTracking.PendingForVerification"),
["$log", "formHelper", "Enrollment","$state", "SessionStore", "Utils",
function($log, formHelper, Enrollment,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "Pending_For_Dispatch",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("Perding for verification page got initiated");
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
					"customer_name": {
						"title": "CUSTOMER_NAME",
						"type": "string"
					},
					"Business_name": {
						"title": "Business_NAME",
						"type": "string"
					},
					"Loan_id": {
						"title": "LOAN_ID",
						"type": "string"
					},
					
					"spoke_name": {
						"title": "SPOKE_NAME",
						"type": "string",
						"enumCode": "centre",
						"x-schema-form": {
							"type": "select",
							"filter": {
								"parentCode as branch": "model.branch"
							},
							"screenFilter": true
						}
					},
					"disbursement_date":{
						"title":"DISBURSEMENT_DATE",
						"type":"string",
						"x-schema-form": {
							"type":"date"
						}
					}

				},
				"required":["Loan_id"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = Document.searchPFD({
					'customername': searchOptions.customer_name,
					'businessname': searchOptions.Business_name,
					'loanid': searchOptions.LOAN_ID,
					'page': pageOpts.pageNo,
					'itemsPerPage': pageOpts.itemsPerPage,
					'spokename': searchOptions.spoke_name,
					'disbursementdate': searchOptions.disbursement_date,
					
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"getItemsPerPage": function(response, headers){
					return 100;
				},
				"getTotalItemsCount": function(response, headers){
					return headers['x-total-count']
				}
			},
			listOptions: {
				selectable: false,
				expandable: true,
				listStyle: "table",
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
						Utils.getFullName(item.firstName, item.middleName, item.lastName),
						'Customer ID : ' + item.id,
						item.urnNo?('URN : ' + item.urnNo):("{{'CURRENT_STAGE'|translate}} : " + (item.currentStage==='Stage02'?'House verification':
							(item.currentStage==='Stage01'?'Enrollment':item.currentStage))),
						"{{'BRANCH'|translate}} : " + item.kgfsName,
						"{{'CENTRE_CODE'|translate}} : " + item.centreCode,
						"{{'FATHERS_NAME'|translate}} : " + Utils.getFullName(item.fatherFirstName, item.fatherMiddleName, item.fatherLastName)
					]
				},
				getTableConfig: function() {
					return {
						"serverPaginate": true,
						"paginate": true,
						"pageLength": 10
					};
				},
				getColumns: function(){
					return [
						{
							title:'NAME',
							data: 'firstName',
							render: function(data, type, full, meta) {
								return (full.customerType==='Individual'?'<i class="fa fa-user" style="color:#777">&nbsp;</i> ':'<i class="fa fa-industry" style="color:#777"></i> ') + data;
							}
						},
						{
							title:'URN_NO',
							data: 'urnNo'
							// type: 'html',
						},
						{
							title:'CURRENT_STAGE',
							data: 'currentStage'
						},
						{
							title:'BRANCH',
							data: 'kgfsName'
						},
						{
							title:'CENTRE_CODE',
							data: 'centreCode'
						},
						{
							title:'FATHERS_NAME',
							data: 'fatherFirstName'
						}
					]
				},
				getActions: function(){
					return [
						{
							name: "Enroll Customer",
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
								return false;
							}
						},
						{
							name: "Do House Verification",
							desc: "",
							icon: "fa fa-house",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"AssetsLiabilitiesAndHealth",
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Stage02')
									return true;
								return false;
							}
						},
						{
							name: "Customer 360",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index){
								$state.go("Page.Customer360",{
									pageId:item.id
								});
							},
							isApplicable: function(item, index){
								if (item.currentStage==='Completed')
									return true;
								return false;
							}
						}
					];
				}
			}
		}
	};
}]);
