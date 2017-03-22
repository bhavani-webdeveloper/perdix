irf.pageCollection.factory(irf.page("score.UpdateScore"),
["$log", "BIReports", "$state", "$stateParams", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, BIReports, $state, $stateParams, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "Update Score",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
				
				console.log($stateParams.pageId);
				
				var pageid = $stateParams.pageId;
				
				if(pageid == null)
				{
					alert("Please select the score and do edit");
					$state.go('Page.Engine', {pageName: 'score.ManageScore'});
				}
				else
				{
					model.Score = {};
				
					BIReports.SpecificScoreName({"score_id": pageid}).$promise.then(function(resp){
					console.log(resp.ScoreList[0].OverallPassValue);
									
					model.Score.ScoreName = resp.ScoreList[0].ScoreName;
					model.Score.OverallPassValue = resp.ScoreList[0].OverallPassValue;
					model.Score.MaxScoreValue = resp.ScoreList[0].MaxScoreValue;
					model.Score.Status = resp.ScoreList[0].Status;
					
					}, function(errResp){
						PageHelper.showErrors(errResp);
					}).finally(function(){
						PageHelper.hideLoader();
					});
				}
				PageHelper.hideLoader();
            },
            
            form: [
                {
                    "type": "box",
                    "title": "Update score",
					colClass : "col-sm-12",
                    "items": [
                        {
                            "key": "Score.ScoreName",
                            "type": "string",
							readonly: true
                        },
                        {
                            "key": "Score.OverallPassValue",
                            "type": "string"
                        },
                        {
                            "key": "Score.MaxScoreValue",
                            "type": "string"
                        },
                        {
                            "key": "Score.Status",
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
                        title: "Update Score"
                    },
					{
                        type: "button",
                        title: "Back",
						onClick : function(model){
							$state.go('Page.Engine', {pageName: 'score.ManageScore', pageId: ''});
						}
                    }]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "Score": {
                        "type": "object",
                        "properties": {
                            "ScoreName": {
                                "type": "string",
                                "title": "ScoreName"
                            },
                            "OverallPassValue": {
                                "type": "string",
                                "title": "OverallPassValue"
                            },
                            "MaxScoreValue": {
                                "type": "string",
                                "title": "MaxScoreValue"
                            },
                            "Status": {
                                "type": "string",
                                "title": "Status"
                            }
                        },
                        "required": [
                            "ScoreName",
                            "OverallPassValue",
                            "MaxScoreValue",
							"Status"
                        ]
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
										
					var biScoreArray = [];
					biScoreArray.push(model.Score);
					console.log($httpParamSerializer(model.Score));
					
					BIReports.UpdateScore({"ScoreName": model.Score.ScoreName}, biScoreArray).$promise.then(function(resp){
						//console.log(resp.DataResponse[0].message);
						
						if(resp.DataResponse[0].Status == 'Failure')
						{
							alert('error');
							PageHelper.showErrors(resp.DataResponse[0].message);
						}
						else
						{
							alert('Successfully Updated Score');
							$state.go('Page.Engine', {pageName: 'score.ManageScore', pageId: ''});
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