irf.pageCollection.factory(irf.page("score.ManageScoreParameters"),
["$log", "BIReports", "$state", "SessionStore","formHelper", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "SchemaResource",
    function($log, BIReports, $state, SessionStore,formHelper, PageHelper, $httpParamSerializer, AuthTokenHelper, SchemaResource) {
	
	return {
        "type": "schema-form",
        "title": "Manage Parameters",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
           
                $log.info('Manage Parameters');
                PageHelper.showLoader();                
				model.ScoreParameter = {};
				
				BIReports.ListAllScoreParams().$promise.then(function(resp){
					
					model.ScoreParameter = resp;
					console.log(model.ScoreParameter.DataResponse[0].ScoreName);
						}, function(errResp){
							PageHelper.showErrors(errResp);
						}).finally(function(){
							PageHelper.hideLoader();
					});
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        eventListeners: {
            
        },
        form: [
            {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "Parameter Details",
                "items": [
                    {
                        type:"tableview",
                        key:"ScoreParameter.DataResponse",
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function() {
                            return [{
                                title: 'ScoreName',
                                data: 'ScoreName'
                            }, {
                                title: 'ParameterName',
                                data: 'ParameterName'
                            }, {
                                title: 'ParameterDisplayName',
                                data: 'ParameterDisplayName'
                            }, {
                                title: 'ParameterType',
                                data: 'ParameterType'
                            }, {
                                title: 'ParameterWeightage',
                                data: 'ParameterWeightage'
                            }, {
                                title: 'ParameterPassScore',
                                data: 'ParameterPassScore'
                            }, {
                                title: 'status',
                                data: 'status'
                            }
							]
                        },
                getActions: function(){
                    return [
                        {
                            name: "Edit Parameters",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'score.UpdateScoreParameters', pageId: item.param_id});
                            },
                            isApplicable: function(item, index){
                                return true;
                            }
                        }
                    ];
                }
                    }
                ]
            },
                {
                    type: "actionbox",
                    items: [{
                        type: "submit",
                        title: "New Parameter"
                    },
					{
                        type: "button",
                        title: "ScoreDashboard",
						onClick : function(model){
							$state.go('Page.ScoreDashboard');
						}
                    }]
                }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName) {
										
					$state.go('Page.Engine', {pageName: 'score.CreateScoreParameters'});
                	}
        }
    };

}]);
