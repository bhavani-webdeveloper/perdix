irf.pageCollection.factory(irf.page("score.UpdateParameterValues"),
["$log", "BIReports", "$state", "$stateParams", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, BIReports, $state, $stateParams, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "Update Parameter Values",
            initialize: function (model, form, formCtrl) {
				
				model.Parameter = {};
				
				var pageid = $stateParams.pageId;
				
				if(pageid == null)
				{
					alert("Please select the parameter value and do edit");
					$state.go('Page.Engine', {pageName: 'score.ManageParameterValues'});
				}
				else
				{
					BIReports.GetSpecificParamValue({"Id": pageid}).$promise.then(function(resp){
						
						model.Parameter.ScoreName = resp.DataResponse[0].ScoreName;
						model.Parameter.ParameterName = resp.DataResponse[0].ParameterName;
						model.Parameter.CategoryValueFrom = resp.DataResponse[0].CategoryValueFrom;
						model.Parameter.CategoryValueTo = resp.DataResponse[0].CategoryValueTo;
						model.Parameter.Value = resp.DataResponse[0].Value;
						model.Parameter.Status = resp.DataResponse[0].status;
						
						}, function(errResp){
							PageHelper.showErrors(errResp);
						}).finally(function(){
							PageHelper.hideLoader();
						});
				}
				
				
            
            },
            form: [
               {
                    "type":"box",
                    "title":"Parameter Values",
                    colClass: "col-sm-12",
                    "items":[
                        {
                            "key" : "Parameter.ScoreName",
                            "type": "string",
							readonly: true
                        },
                        {
                            "key" : "Parameter.ParameterName",
							"type": "string",
							readonly: true
						},
						{
							"key" : "Parameter.CategoryValueFrom",
							"type": "string"
						},
						{
							"key":"Parameter.CategoryValueTo",
							"type": "string"
						},
						{
							"key":"Parameter.Value",
							"type": "string"
						},
						{
							"key":"Parameter.Status",
							"type": "radios",
							titleMap:{
								"ACTIVE":"ACTIVE",
                               	"INACTIVE":"INACTIVE"									
							}
						}
					]
                },
                {
                    type: "actionbox",
                    items: [{
                        type: "submit",
                        title: "Update Parameter Value"
                    },
					{
                        type: "button",
                        title: "Back",
						onClick : function(model){
							$state.go('Page.Engine', {pageName: 'score.ManageParameterValues', pageId: ''});
						}
                    }]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "Parameter": {
                        "type": "object",
                        "properties": {
                            "ScoreName": {
                                "type": "string",
                                "title": "ScoreName"
                            },
                            "ParameterName": {
                                "type": "string",
                                "title": "ParameterName"
                            },
                            "CategoryValueFrom": {
                                "type": ["string","null"],
                                "title": "CategoryValueFrom"
                            },
                            "CategoryValueTo": {
                                "type": ["string","null"],
                                "title": "CategoryValueTo"
                            },
                            "Value": {
                                "type":["string","null"],
                                "title": "Value"
                            },
                            "Status": {
                                "type": "string",
                                "title": "Status"
                            }
                        },
                        "required": [
                            "CategoryValueFrom",
							"Value",
							"Status"
                        ]
                    }
                }
			},
            actions: {
                submit: function(model, form, formName){
					
					var biScoreArray = [];
					biScoreArray.push(model.Parameter);	
					console.log($httpParamSerializer(model.Parameter));
					
					var pageid = $stateParams.pageId;				
					
					BIReports.UpdateParamValue({"Id": pageid}, biScoreArray).$promise.then(function(resp){
						
						if(resp.DataResponse[0].Status == 'Failure')
						{
							alert('error');
							PageHelper.showErrors(resp.DataResponse[0].message);
						}
						else
						{
							alert('Successfully Updated values');
							$state.go('Page.Engine', {pageName: 'score.ManageParameterValues'});
						}
						
						}, function(errResp){
							PageHelper.showErrors(errResp);
						}).finally(function(){
							PageHelper.hideLoader();
						});
                }
            }
        };
    }
]);