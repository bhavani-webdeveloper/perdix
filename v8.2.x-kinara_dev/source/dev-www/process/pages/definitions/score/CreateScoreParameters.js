irf.pageCollection.factory(irf.page("score.CreateScoreParameters"),
["$log", "BIReports", "$state", "SessionStore", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, BIReports, $state, SessionStore, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "Create Score Parameters",
            initialize: function (model, form, formCtrl) {
				
				var self = this;
                self.form = [];
				
				BIReports.ScoreNameList().$promise.then(function(resp){
					
					self.formSource[0].items[0].titleMap = resp.DataResponse;					
					
						}, function(errResp){
							PageHelper.showErrors(errResp);
						}).finally(function(){
							PageHelper.hideLoader();
					});
				
				BIReports.ListScoreElements().$promise.then(function(resp){
						
						self.formSource[0].items[1].titleMap = resp.ScoreElementsList;
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
                    "title":"Score Parameters",
                    colClass: "col-sm-12",
                    "items":[
                        {
                            "key" : "Parameter.ScoreName",
                            "type": "select"
                        },
                        {
                            "key" : "Parameter.ParameterName",
							"type": "select"
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
                        title: "Create Parameters"
                    },
					{
                        type: "button",
                        title: "Back",
						onClick : function(model){
							$state.go('Page.Engine', {pageName: 'score.ManageScoreParameters', pageId: ''});
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
					
					var biScoreArray = [];
					biScoreArray.push(model);					
					
					BIReports.CreateScoreParameters(biScoreArray).$promise.then(function(resp){
						//console.log(resp.DataResponse[0].message);
						
						if(resp.DataResponse[0].Status == 'Failure')
						{
							alert('error');
							PageHelper.showErrors(resp.DataResponse[0].message);
						}
						else
						{
							alert('Successfully Created Parameter Score');
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
