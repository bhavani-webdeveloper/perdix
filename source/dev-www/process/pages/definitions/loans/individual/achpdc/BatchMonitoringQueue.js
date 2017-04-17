irf.pageCollection.factory(irf.page("loans.individual.achpdc.BatchMonitoringQueue"), ["$log", "formHelper", "ACH", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils", "PageHelper", "Queries", "$q",
	function($log, formHelper, ACH, EntityManager, IndividualLoan, $state, SessionStore, Utils, PageHelper, Queries, $q) {

		var branchId = SessionStore.getBranchId();
		var achSearchResult = [];

		var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "Batch Monitoring",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Batch Monitoring",
			searchForm: [
				"*"
			],
			autoSearch: false,
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"batchDate": {
						"title": "Batch date",
						"type": "string",
						"x-schema-form": {
							"type": "date",
							"screenFilter": true
						}
					},
					"batchType": {
						"title": "Batch Type",
						"type": "string",
						"x-schema-form": {
							"type": "select",
							"titleMap": {
								"Demand" : "Demand Batch",
								"Repayment" : "Repayment Batch",
							},
							"screenFilter": true
						}
					},
					"repayType": {
						"title": "Repay Type",
						"type": "string",
						"x-schema-form": {
							"type": "select",
							"titleMap": {
								"ACH" : "ACH",
								"PDC" : "PDC",
							},
							"screenFilter": true
						}
					},
					"status": {
						"title": "Status",
						"type": "string",
						"x-schema-form": {
							"type": "select",
							"titleMap": {
								"InProgress" : "In Progress",
								"Completed" : "Completed",
							},
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

				/* GET BRANCH NAME */
				var branches = formHelper.enum('branch').data;
				var branchName = null;
				for (var i=0;i<branches.length; i++){
					var branch = branches[i];
					 if (branch.code == searchOptions.branch){
					 	branchName = branch.name;
					 }
				}

				var promise = $q.defer();

                promise.resolve([]);
				return promise.promise;
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
						// "serverPaginate": true,
						// "paginate": true,
						// "pageLength": 10
					};
				},
				getColumns: function(){
					return [
						{
							title:'NAME',
							data: 'firstName',
							render: function(data, type, full, meta) {
								return (full.customerType==='Individual'?'<i class="fa fa-user">&nbsp;</i> ':'<i class="fa fa-industry"></i> ') + data;
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
								if (item.currentStage==='BasicEnrolment')
									return true;
								return false;
							}
						},
						{
							name: "CUSTOMER_360",
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
	}
]);
