define({
	pageUID: "management.ReferenceCodeSearch",
    pageType: "Engine",
    dependencies: ["$log","formHelper","ReferenceCodeResource","$state","SessionStore","Utils", "irfNavigator"],
    $pageFn:
    function($log, formHelper, ReferenceCodeResource,$state, SessionStore, Utils, irfNavigator){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "ReferenceCode_Search",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			$log.info("search-list sample got initialized");
		},
		definition: {
			title: "Search ReferenceCode",
			searchForm: [
				"*"
			],
			searchSchema: {
				"type": 'object',
				"title": 'SearchOptions',
				"properties":
       					{
        					 "classifier": {
           					 "type": ["string", "null"],
                             "title": "CLASSIFIERS",
                             "x-schema-form": {
									"type": "select",
									"screenFilter": true,
									"enumCode": "refcode_classifiers",
								}
         					},
         					"name": {
           					 "type": ["string", "null"],
                             "title": "NAME"
         					},
         					"code": {
           					 "type": ["string", "null"],
                             "title": "CODE"
         					}

      					},
      					"required":["classifier"]
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				var promise = ReferenceCodeResource.search({
					'classifier': searchOptions.classifier,
					'per_page': pageOpts.itemsPerPage,
					'page': pageOpts.pageNo
				}).$promise;

				return promise;
			},
			paginationOptions: {
				"getItemsPerPage": function(response, headers){
					return 20;
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
					return []
				},
				getTableConfig: function() {
					return {
						"serverPaginate": true,
						"paginate": false,
						"pageLength": 20
					};
				},
				getColumns: function(){
					return [
						{
							title:'NAME',
							data: 'name'
						},
						{
							title:'CODE',
							data: 'code'
						},
						{
							title:'CLASSIFIERS',
							data: 'classifier'
						},
						{
							title:'FIELD_1',
							data: 'field1'
						},
						{
							title:'FIELD_2',
							data: 'field2'
						},
						{
							title:'FIELD_3',
							data: 'field3'
						},
						{
							title:'FIELD_4',
							data: 'field4'
						},
						{
							title:'FIELD_5',
							data: 'field5'
						}

					]
				},
				getActions: function(){
					return [

							{
							name: "Edit_RefrenceCode",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, index){
								$state.go("Page.Engine", {
									pageName: "management.ReferenceCode",
									pageId: item.id,
									pageData: item
								});
							},
							isApplicable: function(item, index){
									return true;
							}
							},
                            {
                                name: "DELETE_REFERENCE_CODE",
                                desc: "",
                                icon: "fa fa-user",
                                fn: function(item, index) {
                                    var promise =  ReferenceCodeResource.referenceCodesDelete({
                                        id: item.id
                                    }).$promise.then(function(response){
                                        console.log("insider here");
                                        irfNavigator.go({
                                            state: "Page.Adhoc",
                                            pageName: "witfin.loans.LoanOriginationDashboard"
                                        });
                                    }, function(err){
                                        console.log("error here");
                                        console.log(err);
                                    });

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

})
