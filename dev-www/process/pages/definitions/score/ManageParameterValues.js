irf.pageCollection.factory(irf.page("score.ManageParameterValues"),
["$log", "BIReports", "$state", "SessionStore","formHelper", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "SchemaResource",
    function($log, BIReports, $state, SessionStore,formHelper, PageHelper, $httpParamSerializer, AuthTokenHelper, SchemaResource) {
	
	return {
        "type": "schema-form",
        "title": "Manage Parameters",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
           
                $log.info('Manage Parameter Values');
                PageHelper.showLoader();                
				model.ParameterValues = {};
				
				BIReports.ListParameterValues().$promise.then(function(resp){
					
					model.ParameterValues = resp;
					console.log(model.ParameterValues.DataResponse[0].ScoreName);
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
                        key:"ParameterValues.DataResponse",
                        selectable: false,
                        paginate: true,
                        searching: false,
                        getColumns: function() {
                            return [{
                                title: 'ScoreName',
                                data: 'ScoreName'
                            }, {
                                title: 'ParameterName',
                                data: 'ParameterName'
                            }, {
                                title: 'CategoryValueFrom',
                                data: 'CategoryValueFrom'
                            }, {
                                title: 'CategoryValueTo',
                                data: 'CategoryValueTo'
                            }, {
                                title: 'Value',
                                data: 'Value'
                            }, {
                                title: 'status',
                                data: 'status'
                            }
							]
                        },
                getActions: function(){
                    return [
                        {
                            name: "Edit Values",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'score.UpdateParameterValues', pageId: item.Id});
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
                        title: "New Parameter Value"
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
										
					$state.go('Page.Engine', {pageName: 'score.CreateParameterValues'});
                	}
        }
    };

}]);
