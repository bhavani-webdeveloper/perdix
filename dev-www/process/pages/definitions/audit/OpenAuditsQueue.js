irf.pageCollection.factory(irf.page("audit.OpenAuditsQueue"),
["$log", "$q","formHelper","$state", "SessionStore", "Utils",
function($log,$q, formHelper,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "Open Audits",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("Open Audit Queue got initialized");
		},
		definition: {
			title: "",
			searchForm: [
				
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties": {
					"Branch": {
						"title": "SelectBranch",
						"type": "string",
						"x-schema-form": {
							"type": "select",
							 titleMap: {
                                        "Branch1": "Branch1",
                                        "Branch2": "Branch2"
                                    }
						}
			
					},
					"AuditType": {
						"title": "SelectAuditType",
						"type": "string",
						"x-schema-form": {
							"type": "select",
							 titleMap: {
                                        "Audittype1": "Audittype1",
                                        "Audittype2": "Audittype2"
                                    }
						}
					},
					
				},
				"required":["Branch"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				return $q.resolve({
	                headers: {
	                	"x-total-count": 4
	                },
	                body: [
	                {
	                	BranchName:    "Akra",
	                    AuditStartedOn:"9-10-2016 3:30:00 ",
	                	AuditType:     "fixed",
	                	$synced: true,
	                	$syncedOn: "10-10-2016 4:30:00"

	                },
	                {
	                	BranchName:    "Baranagar",
	                    AuditStartedOn:"9-10-2016 4:30:00 ",
	                	AuditType:     "fixed"
	                },
	                {
	                	BranchName:    "Bolpur",
	                    AuditStartedOn:"10-10-2016 1:30:00 ",
	                	AuditType:     "fixed"
	                },
	                {
	                	BranchName:    "Kholapata",
	                    AuditStartedOn:"10-10-2016 3:30:00 ",
	                	AuditType:     "fixed"
	                },

	                ]
                });
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
				//listStyle: "table",
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
						(item.$synced ? '<i class="fa fa-check text-green">&nbsp;</i>':'<i class="fa fa-warning text-yellow">&nbsp;</i>') + "Branch Name: " + item.BranchName,	
						"Audit Start Date: " + item.AuditStartedOn,
					    "Audit Type: " + item.AuditType,
					    item.$synced ? "Synced On:" + item.$syncedOn : ""
					]
				},
				getTableConfig: function() {
					return {
						"serverPaginate": true,
						"paginate": true,
						"pageLength": 10
					};
				},
				
				getActions: function(){
					return [
						{
							name: "Do Audit",
							desc: "",
							icon: "fa fa-pencil-square-o ",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"audit.SampleSets",
									//pageId:item.AuditType
								});
							},
							isApplicable: function(item, index){
								return item.$synced;
							}
						},
						{
							name: "Upload",
							desc: "",
							icon: "fa fa-upload",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"audit.SampleSets",
									//pageId:item.AuditType
								});
							},
							isApplicable: function(item, index){
								return item.$synced;
							}
						},
						{
							name: "Sync",
							desc: "",
							icon: "fa fa-refresh",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"audit.SampleSets",
									//pageId:item.AuditType
								});
							},
							isApplicable: function(item, index){
								return !item.$synced;
							}
						}
					];
				},
				getBulkActions: function(){
					return [
						{
							name: "Sync All",
							desc: "",
							icon: "fa fa-refresh",
							fn: function(items){
							},
							isApplicable: function(items){
								return true;
							}
						}
						
					];
				}
			}
		}
	};
}]);
