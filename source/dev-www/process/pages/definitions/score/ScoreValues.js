irf.pageCollection.factory(irf.page("score.ScoreValues"),
["$q","$log","$stateParams", "ScoresMaintenance", "$state", "SessionStore","formHelper", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "SchemaResource","irfProgressMessage",
    function($q,$log,$stateParams, ScoresMaintenance, $state, SessionStore,formHelper, PageHelper, $httpParamSerializer, AuthTokenHelper, SchemaResource,irfProgressMessage) {
	
	return {
        "type": "schema-form",
        "title": "Manage Parameter Score",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

            model.getByEnumCode = function (parameterName) {
                if(model.allParameterMaster){
                    var object = model.allParameterMaster.find(o => o.parameterName ==parameterName) ;
                    return object.enumCode;
                }
            }


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


                model.allParameterMaster =ScoresMaintenance.allParameterMaster({page:1, per_page: 100}, function (resp, header) {
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
                                            onClick : function(value , model , row){
                                                console.log("its working ");
                                                row.enumCode = model.getByEnumCode(row.parameterName);
                                                row.categoryValueFrom="";
                                                row.categoryValueTo="";
                                            },
                                            getListOptions: function (model) {
                                                return $q.when(model.allParameterMaster).then(function (value) {
                                                    var options = [];
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
                                            getItems: function (viewValue, model,row) {
                                                return $q.when(formHelper.enum(row.enumCode)).then(function (value) {
                                                    var options = [];
                                                    for (i = 0; i < value.data.length; i++) {
                                                        options.push({ "name" :  value.data[i].value}  );
                                                    }
                                                    return options;
                                                });

                                            },
                                        },
                                        {
                                            prop: "categoryValueTo",
                                            type: "select-typeahead",
                                            name: "VALUE_TO",
                                            isTypeaheadSelect : false,
                                            isTypeaheadStrategy : false,
                                            typeaheadExpr : "name",
                                            getItems: function (viewValue, model,row) {
                                                return $q.when(formHelper.enum(row.enumCode)).then(function (value) {
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

                PageHelper.showLoader();
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

                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cust-update', 'Done. Score Values are Updated ', 2000);
                }, function (err) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('cust-update', 'Oops. Some error.', 2000);
                });
			}
			
        }
    };

}]);
