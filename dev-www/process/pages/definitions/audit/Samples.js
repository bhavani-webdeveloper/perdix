irf.pageCollection.factory(irf.page("audit.Samples"),
["$log", "$q","formHelper","$state", "SessionStore", "Utils",
function($log,$q, formHelper,$state, SessionStore, Utils){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "Samples",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = branch;
			$log.info("Samples queue got initialized");
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
	                	Bank:    		     "Bangalore",
	                    Branch:   		     "Bangalore",
	                	CustomerName:  	     "Ravi",
	                	URN:         	     "1",
	                	Product:      		 "Loan",
	                	AccountNumber:       "12345",
	                	LoanApplicationDate: "12/5/16",
	                	LoanAmount:          "1,23,345", 
	                	ApplicationStatus:   "New",
	                	Status:              "Ok"

	                },
	                {
	                	Bank:    		     "Bangalore",
	                    Branch:   		     "Bangalore",
	                	CustomerName:  	     "Ravi",
	                	URN:         	     "1",
	                	Product:      		 "Loan",
	                	AccountNumber:       "12345",
	                	LoanApplicationDate: "12/5/16",
	                	LoanAmount:          "1,23,345", 
	                	ApplicationStatus:   "New",
	                	Status:              "Ok"
	                },
	                {
	                	Bank:    		     "Bangalore",
	                    Branch:   		     "Bangalore",
	                	CustomerName:  	     "Raj",
	                	URN:         	     "1",
	                	Product:      		 "Loan",
	                	AccountNumber:       "12345",
	                	LoanApplicationDate: "12/5/16",
	                	LoanAmount:          "1,23,345", 
	                	ApplicationStatus:   "New",
	                	Status:              "Ok"
	                },
	                {
	                	Bank:    		     "Bangalore",
	                    Branch:   		     "Bangalore",
	                	CustomerName:  	     "Ram",
	                	URN:         	     "1",
	                	Product:      		 "Loan",
	                	AccountNumber:       "12345",
	                	LoanApplicationDate: "12/5/16",
	                	LoanAmount:          "1,23,345", 
	                	ApplicationStatus:   "New",
	                	Status:              "Ok"
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
					item.Bank,	
					item.Branch,
				    item.CustomerName,
				    item.URN,
				    item.Product,
				    item.AccountNumber,
				    item.LoanApplicationDate,
				    item.LoanAmount,
				    item.ApplicationStatus,
				    item.Status,
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
							title:'Bank',
							data: 'Bank',
						},
						{
							title:'Branch',
							data: 'Branch'
						},
						{
							title:'CustomerName',
							data: 'CustomerName'
						},
						{
							title:'URN',
							data: 'URN'
						},
						{
							title:'Product',
							data: 'Product'
						},
						{
							title:'AccountNumber',
							data: 'AccountNumber'
						},
						{
							title:'LoanApplicationDate',
							data: 'LoanApplicationDate'
						},
						{
							title:'LoanAmount',
							data: 'LoanAmount'
						},
						{
							title:'ApplicationStatus',
							data: 'ApplicationStatus'
						},
					]
				},
				
				getActions: function(){
					return [
						{
							name: "NA",
							desc: "",
							icon: "",
							/*fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"ProfileInformation",
									pageId:item.id
								});
							},*/
							isApplicable: function(item, index){
								return true;
							}
						},
						{
							name: "Not OK",
							desc: "",
							icon: "",
							fn: function(item, index){
								$state.go("Page.Engine",{
									pageName:"audit.Issues",
									pageId:item.Bank
								});
							},
							isApplicable: function(item, index){
								return true;
							}
						}
						
					];
				},
				getBulkActions: function(){
					return [
						{
							name: "New Sample",
							desc: "",
							icon: "fa fa-plus",
							fn: function(items){
								$state.go("Page.Engine",{
									pageName:"audit.Issues",
									pageId:'edit'
								});
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
