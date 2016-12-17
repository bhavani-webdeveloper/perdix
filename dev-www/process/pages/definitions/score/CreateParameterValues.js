irf.pageCollection.factory(irf.page("score.CreateParameterValues"),
["$log", "BIReports", "$state", "$stateParams", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, BIReports, $state, $stateParams, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "Create Parameter Values",
            initialize: function (model, form, formCtrl) {
				
				var self = this;
                self.form = [];
				
				//model.form ={};
				
				BIReports.ScoreNameList().$promise.then(function(resp){
					
					self.formSource[0].items[0].titleMap = resp.DataResponse;
					
					/*console.log($stateParams.pageId);
					model.form.ScoreName = $stateParams.pageId;*/
							
					//self.form = self.formSource;
						}, function(errResp){
							PageHelper.showErrors(errResp);
						}).finally(function(){
							PageHelper.hideLoader();
					});
				
				BIReports.ListAssignedParameters({"ScoreName": "RiskScore1"}).$promise.then(function(resp){
						
						self.formSource[0].items[1].titleMap = resp.DataResponse;
						self.form = self.formSource;
						
						}, function(errResp){
							PageHelper.showErrors(errResp);
						}).finally(function(){
							PageHelper.hideLoader();
						});
            
            },
			form: [],
            formSource: [
               {
                    "type":"box",
                    "title":"Parameter Values",
                    colClass: "col-sm-12",
                    "items":[
                        {
                            "key" : "Parameter.ScoreName",
                            "type": "select",
							"onChange": function(modelValue, form, model) {
								//alert(model.Parameter.ScoreName);
								//$state.go('Page.Engine', {pageName: 'score.CreateParameterValues', pageId: model.Parameter.ScoreName});
							}
                        },
                        {
                            "key" : "Parameter.ParameterName",
							"type": "select"
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
                        title: "Create Parameter Value"
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
                                "type": "number",
                                "title": "Value"
                            },
                            "Status": {
                                "type": "string",
                                "title": "Status"
                            }
                        },
                        "required": [
                            "ScoreName",
                            "ParameterName",
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
					biScoreArray.push(model);					
					
					BIReports.CreateParameterValues(biScoreArray).$promise.then(function(resp){
						
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
