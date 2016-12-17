irf.pageCollection.factory(irf.page("score.UpdateScoreParameters"),
["$log", "BIReports", "$state", "$stateParams", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, BIReports, $state, $stateParams, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "Update Score Parameters",
            initialize: function (model, form, formCtrl) {
				
				model.Parameter = {};
				
				var pageid = $stateParams.pageId;
				
				if(pageid == null)
				{
					alert("Please select the parameter and do edit");
					$state.go('Page.Engine', {pageName: 'score.ManageScoreParameters'});
				}
				else
				{
					BIReports.GetSpecificParameter({"param_id": pageid}).$promise.then(function(resp){
						
						model.Parameter.ScoreName = resp.DataResponse[0].ScoreName;
						model.Parameter.ParameterName = resp.DataResponse[0].ParameterName;
						model.Parameter.ParameterDisplayName = resp.DataResponse[0].ParameterDisplayName;
						model.Parameter.ParameterType = resp.DataResponse[0].ParameterType;
						model.Parameter.ParameterWeightage = resp.DataResponse[0].ParameterWeightage;
						model.Parameter.ParameterPassScore = resp.DataResponse[0].ParameterPassScore;
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
                    "title":"Score Parameters",
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
							"key" : "Parameter.ParameterDisplayName",
							"type": "string"
						},
						{
							"key":"Parameter.ParameterType",
							"type": "select",
							titleMap:{
								"DERIVED":"DERIVED",
                               	"STATIC":"STATIC"									
							}
						},
						{
							"key":"Parameter.ParameterWeightage",
							"type": "number"
						},
						{
							"key":"Parameter.ParameterPassScore",
							"type": "number"
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
                        title: "Update Parameters"
                    },
					{
                        type: "button",
                        title: "Back",
						onClick : function(model){
							$state.go('Page.Engine', {pageName: 'score.ManageScoreParameters', pageId: ''});
						}
                    }
					]
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
                            "ParameterDisplayName": {
                                "type": "string",
                                "title": "ParameterDisplayName"
                            },
                            "ParameterType": {
                                "type": "string",
                                "title": "ParameterType"
                            },
                            "ParameterWeightage": {
                                "type": "number",
                                "title": "ParameterWeightage"
                            },
                            "ParameterPassScore": {
                                "type": "number",
                                "title": "ParameterPassScore"
                            },
                            "Status": {
                                "type": "string",
                                "title": "Status"
                            }
                        },
                        "required": [
                            "ScoreName",
                            "ParameterName",
                            "ParameterDisplayName",
							"ParameterType",
							"ParameterWeightage",
							"ParameterPassScore",
							"Status"
                        ]
                    }
                }
            },
            actions: {
                submit: function(model, form, formName){
					
					var pageid = $stateParams.pageId;
					var biScoreArray = [];
					biScoreArray.push(model.Parameter);					
					
					
					BIReports.UpdateScoreParameters({"param_id": pageid}, biScoreArray).$promise.then(function(resp){
						//console.log(resp.DataResponse[0].message);
						
						if(resp.DataResponse[0].Status == 'Failure')
						{
							alert('error');
							PageHelper.showErrors(resp.DataResponse[0].message);
						}
						else
						{
							alert('Successfully Updated Parameter Score');
							$state.go('Page.Engine', {pageName: 'score.ManageScoreParameters', pageId: ''});
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