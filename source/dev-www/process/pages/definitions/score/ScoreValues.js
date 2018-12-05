irf.pageCollection.factory(irf.page("score.ScoreValues"),
["$q","$log","$stateParams", "ScoresMaintenance", "$state", "SessionStore","formHelper", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "SchemaResource",
    function($q,$log,$stateParams, ScoresMaintenance, $state, SessionStore,formHelper, PageHelper, $httpParamSerializer, AuthTokenHelper, SchemaResource) {
	
	return {
        "type": "schema-form",
        "title": "Manage Parameter Score",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {


            model.getScoreParameter = function(subScoreId, ScoreParameterId){
                var subScore = model.scoreMaster.subScores.find(function(subScore) {
                    return subScore.id == subScoreId;
                });

                var scoreParameter = subScore.scoreParameters.find(function(scoreParameter) {
                    return scoreParameter.id == ScoreParameterId;
                });
                return scoreParameter;
            }

            model.getScoreValuesByParamId = function(subScoreId, ScoreParameterId){
                return model.scoreMaster.scoreValues.filter(subScore => subScore.subScoreId == subScoreId && subScore.scoreParameterId == ScoreParameterId);
            }

           
            $log.info('Manage score view');
            model.scoreMaster = {};
            try {
                model.scoreMasterID = $stateParams.pageId;


                model.allParameterMaster =ScoresMaintenance.allParameterMaster({}, function (resp, header) {
                    console.log(resp);
                     //model.allParameterMaster=resp;

                }, function (err) {

                });


                console.log("scoreParamID : "+model.scoreMasterID);

                ScoresMaintenance.getScoresById({ id: model.scoreMasterID  }, function (resp, header) {

                    model.scoreMaster = resp.body.scoreMaster;
                    model.scoreMaster.scoreValues=[];
                    model.scoreMaster.subScores.forEach(function(subScore) {
                        subScore.scoreParameters.forEach(function(scoreParameters) {
                            scoreParameters.scoreValues.forEach(function(scoreValue) {
                                //console.log(scoreValue);

                                scoreValue.subScoreId = subScore.id;
                                scoreValue.subScoreName = subScore.subscoreName;

                                scoreValue.scoreParameterId = scoreParameters.id;
                                scoreValue.scoreParameterName = scoreParameters.parameterName;

                                model.scoreMaster.scoreValues.push(scoreValue);

                            });
                        });
                    });
                    console.log( model.scoreMaster.scoreValues);

                }, function (err) {

                });

            }catch (e) {

            }
        },
        form: [
            {
                type: "box",
                colClass: "col-sm-12",
                items: [
                    {
                        key: "scoreMaster.scoreName",
                        title: "SCORE_NAME",
                        readonly : true
                    },
                    {
                        key: "scoreMaster.scoreValues",
                        type: "datatable",
                        title: "SCORE_VALUES",
                        startEmpty: true,
                        dtlConfig: {
                            columnsFn: function () {
                                return $q.resolve({
                                    "dtlKeyvalue": "ADD_PARAMETER",
                                    "columns": [

                                        {
                                            prop: "subScoreName",
                                            type: "text",
                                            name: "SUB_SCORE_NAME"
                                        },
                                        {
                                            prop: "parameterName",
                                            type: "select",
                                            name: "PARAMETER_NAME",
                                            getListOptions: function (model) {
                                                return $q.when(model.allParameterMaster).then(function (value) {
                                                    var options = [];
                                                    //console.log("okkkkkkkkk");
                                                    if(value){
                                                        for (i = 0; i < value.length; i++) {
                                                            options.push(value[i].parameterName);
                                                        }
                                                    }
                                                    return options;
                                                });
                                            },
                                        },
                                    //-------------------------------------------------------------
                                        {
                                            prop: "categoryValueFrom",
                                            type: "select-typeahead",
                                            name: "VALUE_FROM",
                                            isTypeaheadSelect : false,
                                            isTypeaheadStrategy : false,
                                            typeaheadExpr : "name",
                                            getItems: function (viewValue, model) {

                                                return $q.when(formHelper.enum("language")).then(function (value) {
                                                    var options = [];
                                                    for (i = 0; i < value.data.length; i++) {
                                                        options.push({ "name" :  value.data[i].value}  );
                                                    }
                                                    return options;
                                                });

                                            },
                                        },
                                        //-------------------------------------------------------------
                                        
                                        {
                                            prop: "categoryValueTo",
                                            type: "text",
                                            name: "VALUE_TO"
                                        },
                                        {
                                            prop: "colorEnglish",
                                            type: "text",
                                            name: "COLOR"
                                        },
                                        {
                                            prop: "status",
                                            type: "select",
                                            name: "status",
                                            getListOptions: function (model) {
                                                return $q.when(model.allParameterMaster).then(function (value) {
                                                    var options = ["ACTIVE","DEACTIVE"];
                                                    return options;
                                                });
                                            },
                                        },
                                    ],

                                })
                            }
                        }
                    }

                ]
            },
            {
                type: "actionbox",
                items: [
                    {
                        type: "submit",
                        title: "Submit"
                    },
                ]
            }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName) {
                console.log("Goog");

                model.scoreMaster.subScores.forEach(function(subScore) {
                    subScore.scoreParameters.forEach(function(scoreParameters) {
                        var ScoreParameter = model.getScoreParameter(subScore.id,scoreParameters.id);
                        //console.log(ScoreParameter.scoreValues);
                        var values =model.getScoreValuesByParamId(subScore.id,scoreParameters.id);
                        //console.log(values);
                        ScoreParameter.scoreValues= values;
                        //console.log("-------");
                    });
                });


                var requestBody ={ scoreMaster : model.scoreMaster}
                ScoresMaintenance.scoreUpdate( requestBody, function (resp, header) {
                    irfProgressMessage.pop('cust-update', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                }, function (err) {

                });
			}
			
        }
    };

}]);
