irf.pageCollection.factory(irf.page("score.CreateScore"),
["$log", "BIReports", "$state", "$stateParams", "SessionStore", "PageHelper", "$httpParamSerializer", "AuthTokenHelper",
    function($log, BIReports, $state, $stateParams, SessionStore, PageHelper, $httpParamSerializer, AuthTokenHelper) {

        return {
            "type": "schema-form",
            "title": "Create Score",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
				$log.info("Creation Page got initialized");
				PageHelper.hideLoader();
            },
            form: [
                {
                    "type": "box",
                    "title": "Create new score",
					colClass : "col-sm-12",
                    "items": [
                        {
                            "key": "CreateScore.ScoreName",
                            "type": "string"
                        },
                        {
                            "key": "CreateScore.OverallPassValue",
                            "type": "number"
                        },
                        {
                            "key": "CreateScore.MaxScoreValue",
                            "type": "number"
                        },
                        {
                            "key": "CreateScore.Status",
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
                        title: "Create Score"
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
                    "CreateScore": {
                        "type": "object",
                        "properties": {
                            "ScoreName": {
                                "type": "string",
                                "title": "ScoreName"
                            },
                            "OverallPassValue": {
                                "type": "number",
                                "title": "OverallPassValue"
                            },
                            "MaxScoreValue": {
                                "type": "number",
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
										
					var biReportArray = [];
					biReportArray.push(model.CreateScore);
					
					BIReports.CreateScore(biReportArray).$promise.then(function(resp){
						console.log(resp.DataResponse[0].message);
						
						if(resp.DataResponse[0].Status == 'Failure')
						{
							alert('error');
							PageHelper.showErrors(resp.DataResponse[0].message);
						}
						else
						{
							alert('Successfully Created Score');
							$state.go('Page.Engine', {pageName: 'score.ManageScore'});
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