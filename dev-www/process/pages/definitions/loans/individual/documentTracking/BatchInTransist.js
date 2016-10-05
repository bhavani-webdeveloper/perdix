irf.pageCollection.factory(irf.page("loans.individual.documentTracking.BatchInTransist"),
["$log", "formHelper", "document","$state", "SessionStore", "Utils",
function($log, formHelper, document,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "BATCH_IN_TRANSIST",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("Batch in transist page got initiated");
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
					"Batch_No": {
						"title": "BATCH_NO",
						"type": "string"
					},
					"POD_No": {
						"title": "POD_NO",
						"type": "string"
					},
					"Hub": {
						"title": "HUB_NAME",
						"type": "string",
						"enumCode": "branch",
						"x-schema-form": {
							"type": "select",
							"screenFilter": true
						}
					},
					"dispatch_date":{
						"title":"DISPATCH_DATE",
						"type":"string",
						"x-schema-form": {
							"type":"date"
						}
					}
				},
				"required":[]
			},
			
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){   

				var promise = document.searchBIT({
					'batchNo': searchOptions.Batch_No,
					'podNo': searchOptions.POD_No,
					'hub': searchOptions.Hub,
					'page': pageOpts.pageNo,
					'itemsPerPage': pageOpts.itemsPerPage,
					'dispatchDate': searchOptions.dispatch_date,
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
