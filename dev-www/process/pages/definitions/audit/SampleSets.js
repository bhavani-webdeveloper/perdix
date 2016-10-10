irf.pageCollection.factory(irf.page("audit.SampleSets"),
["$log","$q", "formHelper","$state", "SessionStore", "Utils",
function($log,$q, formHelper,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "Sample Sets",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("SampleSets Queue got initialized");
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
							"titlemap": {
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
							"titlemap": {
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
	                	SampleSet:   "Verification",
	                    NoOfSamples:  "15",
	                	TotalRecords: "30"

	                },
	               {
	                	SampleSet:   "CGT",
	                    NoOfSamples:  "5",
	                	TotalRecords: "20"

	                },
	               {
	                	SampleSet:   "GRT",
	                    NoOfSamples:  "5",
	                	TotalRecords: "10"

	                },
	               {
	                	SampleSet:   "Documentation",
	                    NoOfSamples:  "-",
	                	TotalRecords: "-"

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
					item.SampleSet,	
					"No. of samples: " + item.NoOfSamples,
				    "Total Records: " + item.TotalRecords,	
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
							name: "Edit",
							desc: "",
							icon: "fa fa-pencil-square-o ",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"audit.Samples",
								});
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
