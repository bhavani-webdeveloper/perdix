irf.pageCollection.factory(irf.page("score.ScoreValues"),
["$q","$log","$stateParams", "ScoresMaintenance", "$state", "SessionStore","formHelper", "PageHelper", "$httpParamSerializer", "AuthTokenHelper", "SchemaResource","irfProgressMessage",
    function($q,$log,$stateParams, ScoresMaintenance, $state, SessionStore,formHelper, PageHelper, $httpParamSerializer, AuthTokenHelper, SchemaResource,irfProgressMessage) {
	
	return {
        "type": "schema-form",
        "title": "MANAGE_PARAMETER_SCORE",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

            model.colors =[
                {colorEnglish : "RED", colorHexadecimal : "#FF0000"},
                {colorEnglish : "YELLOW", colorHexadecimal : "#FFFF00"},
                {colorEnglish : "GREEN", colorHexadecimal : "#008000"}];

            model.getByEnumCode = function (parameterName) {
                if(model.allParameterMaster){
                    var object = model.allParameterMaster.find(o => o.parameterName ==parameterName) ;
                    return object.enumCode;
                }
            }

            model.getModelSubScore = function(subscoreName,parameterName){


                // for (i = 0; i < model.scoreMaster.subScores.length; i++) {
                //     for (j = 0; j < model.scoreMaster.subScores[i].scoreParameters.length; i++) {
                //         if( model.scoreMaster.subScores[i].subscoreName==subscoreName && model.scoreMaster.subScores[i].scoreParameters[j].parameterName==parameterName)
                //             return subscoreName && model.scoreMaster.subScores[i].scoreParameters[j].scoreValues;
                //     }
                // }

                var values=[];

                model.scoreMaster.subScores.forEach(function(subScore) {
                    subScore.scoreParameters.forEach(function(scoreParameter) {
                        if( subScore.subscoreName==subscoreName && scoreParameter.parameterName==parameterName){
                            values=scoreParameter.scoreValues;
                        }
                    });
                });
                return values;

            }
            model.getScoreParameter = function(subscoreName,parameterName){
                var subScore = model.scoreMaster.subScores.find(function(subScore) {
                    return subScore.subscoreName == subscoreName;
                });

                var scoreParameter = subScore.scoreParameters.find(function(scoreParameter) {
                    return scoreParameter.parameterName == parameterName;
                });
                return scoreParameter;
            }

            model.getScoreValuesByParamId = function(subscoreName,parameterName){
                return model.scoreValues.filter(subScore => subScore.subScoreName == subscoreName && subScore.parameterName == parameterName);
            }

           
            $log.info('Manage score view');
            model.scoreMaster = {};
            try {
                model.scoreMasterID = $stateParams.pageId;


                model.allParameterMaster =ScoresMaintenance.allParameterMaster({page:1, per_page: 100}, function (resp, header) {
                    console.log(resp);
                     //model.allParameterMaster=resp;
                    //  {
                    //      "ParamName": {

                    //      }
                    //  }
                    //  {
                    //      "SubscoreName": {
                    //          "ParamName": {OJB},
                    //          "ParamName": {OJB},
                    //          "ParamName": {OJB}
                    //      },
                    //      "SubscoreName": {
                    //         "ParamName": {OJB},
                    //         "ParamName": {OJB},
                    //         "ParamName": {OJB}
                    //     }
                    //  }

                }, function (err) {

                });


                console.log("scoreParamID : "+model.scoreMasterID);

                ScoresMaintenance.getScoresById({ id: model.scoreMasterID  }, function (resp, header) {

                    model.scoreMaster = resp.body.scoreMaster;
                    model.scoreValues=[];
                    model.parameterMaster=[];
                    model.scoreMaster.subScores.forEach(function(subScore) {
                        console.log(subScore);
                        subScore.scoreParameters.forEach(function(scoreParameters) {
                            scoreParameters.enumCode = model.getByEnumCode(scoreParameters.parameterName);
                            scoreParameters.subscoreName=subScore.subscoreName;
                            model.parameterMaster.push(scoreParameters);

                            console.log(scoreParameters);
                            scoreParameters.scoreValues.forEach(function(scoreValue) {
                                console.log(scoreValue);

                                //console.log(scoreValue);

                                scoreValue.subScoreId = subScore.id;
                                scoreValue.subScoreName = subScore.subscoreName;

                                scoreValue.scoreParameterId = scoreParameters.id;
                                scoreValue.scoreParameterName = scoreParameters.parameterName;

                                scoreValue.enumCode = model.getByEnumCode(scoreParameters.parameterName);

                                model.scoreValues.push(scoreValue);

                            });
                        });
                    });
                    console.log( model.scoreValues);

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
                        key: "scoreValues",
                        type: "datatable",
                        title: "SCORE_VALUE",
                        startEmpty: true,
                        dtlConfig: {
                            columnsFn: function () {
                                return $q.resolve({
                                    "dtlKeyvalue": "ADD_PARAMETER",
                                    "columns": [
                                        {
                                            prop: "subScoreName",
                                            type: "select",
                                            name: "SUB_SCORE_NAME",
                                            getListOptions: function (model) {
                                                return $q.when(model.scoreMaster.subScores).then(function (subScores) {
                                                    var options = [];
                                                    if(subScores){
                                                        for (i = 0; i < subScores.length; i++) {
                                                            options.push(subScores[i].subscoreName);
                                                        }
                                                    }
                                                    return options;
                                                });
                                            },
                                        },
                                        {
                                            prop: "parameterName",
                                            type: "select",
                                            name: "PARAMETER_NAME",
                                            onClick : function(value , model , row){
                                                row.enumCode = model.getByEnumCode(row.parameterName);
                                                row.categoryValueFrom="";
                                                row.categoryValueTo="";
                                            },
                                            getListOptions: function (model, row) {
                                                return $q.when(model.parameterMaster).then(function (value) {
                                                    var options = [];
                                                    if(value){
                                                        for (i = 0; i < value.length; i++) {  
                                                            if( row.subscoreName &&  value[i].subscoreName==row.subscoreName)
                                                                options.push(value[i].parameterName  );
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
                                            name: "FROM",
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
                                            name: "TO",
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
                                            type: "select",
                                            name: "COLOR_ENGLISH",
                                            onClick : function(value , model , row){
                                                var colorHexadecimalObj = model.colors.find(o => o.colorEnglish == row.colorEnglish) ;
                                                row.colorHexadecimal = colorHexadecimalObj.colorHexadecimal;
                                            },
                                            getListOptions: function (model) {
                                                return $q.when(model.colors).then(function (value) {
                                                    var options = [];
                                                    for (i = 0; i < value.length; i++) {
                                                        options.push(value[i].colorEnglish );
                                                    }
                                                    return options;
                                                });
                                            },
                                        },
                                        {
                                            prop: "colorHexadecimal",
                                            type: "text",
                                            name: "COLOR_HAXADECIMAL"
                                        },
                                        {
                                            prop: "nonNegotiable",
                                            type: "select",
                                            name: "NON_NEGOTIABLE",
                                            getListOptions: function (model,row ) {
                                                return $q.when(model.allParameterMaster).then(function (value) {
                                                    var options = ["YES","NO"];
                                                    return options;
                                                });
                                            },
                                        },
                                        {
                                            prop: "value",
                                            type: "text",
                                            name: "VALUE"
                                        },
                                        {
                                            prop: "status",
                                            type: "select",
                                            name: "STATUS",
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

                // model.scoreValues.forEach(function(subScore) {
                //     var subScores = model.getModelSubScore(subScore.subscoreName,subScore.parameterName);
                //     //var object = subScores.find(o => o.parameterName ==parameterName) ;
                //     subScores.push(subScore);
                //     subScoreName
                //     parameterName
                // });


                model.scoreMaster.subScores.forEach(function(subScore) {
                    console.log(subScore);
                    // model.allParameterMaster.forEach(function(scoreParameters) {
                    //     console.log(scoreParameters);
                    //     var ScoreParameter = model.getScoreParameter(subScore.subscoreName,scoreParameters.parameterName);
                    //     //console.log(ScoreParameter.scoreValues);
                    //     var values =model.getScoreValuesByParamId(subScore.subscoreName,scoreParameters.parameterName);
                    //     //console.log(values);
                    //     if(values.length>0 ){
                    //         if(ScoreParameter==undefined){
                    //             ScoreParameter = {
                    //                 parameterName: "DSCR",
                    //                 status: "ACTIVE",
                    //                 scoreValues: []
                    //             };
                    //         }
                    //         ScoreParameter.scoreValues= values;
                    //     }
                        

                    // });

                    subScore.scoreParameters.forEach(function(scoreParameters) {
                        console.log(scoreParameters);
                        var ScoreParameter = model.getScoreParameter(subScore.subscoreName,scoreParameters.parameterName);
                        //console.log(ScoreParameter.scoreValues);
                        var values =model.getScoreValuesByParamId(subScore.subscoreName,scoreParameters.parameterName);
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
                    var errObj = JSON.stringify(err);
                    irfProgressMessage.pop('cust-update', 'err : '+err.data.body.error, 2000);
                });
			}
			
        }
    };

}]);
