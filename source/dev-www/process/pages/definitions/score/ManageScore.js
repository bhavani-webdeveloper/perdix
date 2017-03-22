irf.pageCollection.factory(irf.page("score.ManageScore"),
["$log", "BIReports", "$state", "SessionStore","formHelper", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "SchemaResource",
    function($log, BIReports, $state, SessionStore,formHelper, PageHelper, $httpParamSerializer, AuthTokenHelper, SchemaResource) {
	
	return {
        "type": "schema-form",
        "title": "Manage Score",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
           
                $log.info('Manage score view');
                PageHelper.showLoader();                
				model.Scores = {};
				
				BIReports.ListAllScores().$promise.then(function(resp){
					
					model.Scores = resp;
					console.log(model.Scores.DataResponse[0].ScoreName);
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
                "title": "Score Details",
                "items": [
                    {
                        type:"tableview",
                        key:"Scores.DataResponse",
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function() {
                            return [{
                                title: 'ScoreName',
                                data: 'ScoreName'
                            }, {
                                title: 'OverallPassValue',
                                data: 'OverallPassValue'
                            }, {
                                title: 'MaxScoreValue',
                                data: 'MaxScoreValue'
                            }, {
                                title: 'Status',
                                data: 'Status'
                            }
							]
                        },
                getActions: function(){
                    return [
                        {
                            name: "Edit Score",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'score.UpdateScore', pageId: item.score_id});
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
                        title: "New Score"
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
				$state.go('Page.Engine', {pageName: 'score.CreateScore'});
			}
			
        }
    };

}]);
