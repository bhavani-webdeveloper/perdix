irf.pageCollection.factory(irf.page("customer360.RecaptureQueue"),
	["$log", "formHelper", "Enrollment", "CreditBureau", "SessionStore", "$state", "entityManager",
	function($log, formHelper, Enrollment, CreditBureau, SessionStore, $state, entityManager){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "RECAPTURE_APPROVED_QUEUE",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branchName = branch;
			$log.info("RECAPTURE_APPROVED_QUEUE got initialized");
		},
		definition: {
			autoSearch: true,
			title: "RECAPTURE_APPROVED_QUEUE",
			pageName: "customer360.RecaptureQueue",
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){
				var promise = Enrollment.search({
					'branchName': searchOptions.branchName,
					'firstName': searchOptions.firstName,
					'centreId': searchOptions.centreId,
					'page': pageOpts.pageNo,
					'per_page': pageOpts.itemsPerPage
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
