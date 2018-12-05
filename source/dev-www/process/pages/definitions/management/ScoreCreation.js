irf.pageCollection.factory(irf.page("management.ScoreCreation"),
    ["$log", "$state", "ScoresMaintenance", "formHelper", "$q", "irfProgressMessage", "ScoresMaintenance", "PageHelper", "Utils", "irfNavigator",
        function ($log, $state, ScoresMaintenance, formHelper, $q, irfProgressMessage, ScoresMaintenance, PageHelper, Utils, irfNavigator) {

            return {
                "type": "schema-form",
                "title": "SCORE_CREATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    var self = this;
                    self.form = self.formSource;
                },
                modelPromise: function (pageId, _model) {
                    self = this;
                    self.form = self.formSource;
                    var defered = $q.defer();
                    if (!pageId) {
                        return deferred.promise;
                    }
                    PageHelper.showLoader();
                    ScoresMaintenance.getScoresById({ id: pageId }).$promise.then(function(resp){
                        model = _model;
                        DataResponse = resp.body;
                        model = DataResponse;
                        PageHelper.hideLoader();
                        defered.resolve(model);
                    }),function (resp) {
                        defered.resolve(resp);
                    },function (err) {
                        PageHelper.hideLoader();
                        defered.reject(err);
                    };
                return defered.promise;
                },
                form: [],
                formSource: [{
                    "type": "box",
                    colClass: "col-sm-9",
                    "title": "SCORE_CREATION",
                    "items": [
                        {
                            "key": "scoreMaster.scoreName",
                            "title": "SCORE_NAME",
                            "type": "text",
                            "required": true,
                        },
                        {
                            "key": "scoreMaster.stage",
                            "title": "STAGE",
                            "type": "select",
                            "enumCode": "origination_stage",
                            "required": true
                        },
                        {
                            "key": "scoreMaster.order",
                            "title": "ORDER",
                            "required": true,
                        },
                        {
                            "key": "scoreMaster.partnerSelf",
                            "title": "PARTNER_SELF",
                            "type": "select",
                            "enumCode": "partner",
                        },
                        {
                            "key": "scoreMaster.overallPassvalue",
                            "title": "OVER_ALL_PASS_VALUE",
                            "type": "text",
                            "required": true,
                        },
                        {
                            "key": "scoreMaster.maxScoreValue",
                            "title": "MAX_SCORE",
                            "required": true,
                        },
                        {
                            "key": "scoreMaster.status",
                            "title": "STATUS",
                            "type": "select",
                            "titleMap": [{
                                "value": 'ACTIVE',
                                "name": "Active"
                            }, {
                                "value": 'INACTIVE',
                                "name": "InActive"
                            }]
                        },
                        // Score Criteria array
                        {
                            "key": "scoreMaster.scoreCriterias",
                            "type": "array",
                            "title": "CRITERIA",
                            "items": [
                                {
                                    "key": "scoreMaster.scoreCriterias[].criteriaName",
                                    "startEmpty": true,
                                    "title": "CRITERIA_NAME",
                                    "type": "lov",
                                    lovonly:true,            
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model) {
                                        var defered = $q.defer();
                                        ScoresMaintenance.allCriteria().$promise.then(function(item){
                                            var out = [];
                                            for(var i=0;i<item.body.length;i++){
                                                if(item.body[i].status == "ACTIVE")
                                                    out.push(item.body[i]);
                                            }
                                            defered.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                            
                                        },function(err){
                                            deferred.reject(err);
                                        });
                                        return defered.promise;    
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.id,
                                            item.criteriaName
                                        ]
                                        
                                    },
                                    onSelect: function (result, model, context) {
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaName = result.criteriaName;
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaValue = null;
                                    }
                                },            
                                {
                                    "key": "scoreMaster.scoreCriterias[].criteriaValue",
                                    "title": "CRITERIA_VALUE",
                                    "type": "lov",
                                    "required": true,
                                    "condition": "model.scoreMaster.scoreCriterias[arrayIndex].criteriaName",
                                    lovonly: true,
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model, context) {
                                        var defered = $q.defer();
                                        ScoresMaintenance.allCriteria().$promise.then(
                                            function (data) {
                                                var resp_array = [];
                                                resp_array = data.body;
                                                var output = [], l = resp_array.length, i;
                                                for (i = 0; i < l; i++) {
                                                    if (resp_array[i].criteriaName == model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaName) {
                                                        output.push({
                                                            name: resp_array[i].criteriaValue,
                                                            value: resp_array[i].criteriaValue
                                                        });
                                                    }
                                                }
                                                defered.resolve({
                                                    headers: {
                                                        "x-total-count": output.length
                                                    },
                                                    body: output
                                                });
                                            }, function (err) {
                                                defered.reject(err);
                                            });
                                        return defered.promise;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    },
                                    onSelect: function (result, model, context) {
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaValue = result.value;
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].scoreName = model.scoreMaster.scoreName;
                                    }
                                },
                                {
                                    "key": "scoreMaster.scoreCriterias[].status",
                                    "title": "STATUS",
                                    "type": "select",
                                    "titleMap": [{
                                        "value": 'ACTIVE',
                                        "name": "Active"
                                    }, {
                                        "value": 'INACTIVE',
                                        "name": "InActive"
                                    }]
                                },
                            ]
                        },
                        //  SUnscore array
                        {
                            "key": "scoreMaster.subScores",
                            "type": "array",
                            startEmpty: false,
                            "title": "SUBSCORE",
                            "items": [
                                {
                                    "key": "scoreMaster.subScores[].subscoreName",
                                    "title": "SUBSCORE_NAME",
                                    "type":"text",
                                    "required": true,
                                },
                                {
                                    "key": "scoreMaster.subScores[].subScoreWeightage",
                                    "title": "SUBSCORE_WEIGHTAGE",
                                    "required": true,
                                },
                                {
                                    "key": "scoreMaster.subScores[].isIndividualScore",
                                    "title": "IS_INDIVIDULA_SCORE",
                                    "type": "radios",
                                    "titleMap": [{
                                        value: true,
                                        name: "Yes"
                                    },
                                    {
                                        value: false,
                                        name: "No"
                                    }
                                    ]
                                },
                                {
                                    "key": "scoreMaster.subScores[].status",
                                    "title": "STATUS",
                                    "type": "select",
                                    "titleMap": [{
                                        "value": 'ACTIVE',
                                        "name": "Active"
                                    }, {
                                        "value": 'INACTIVE',
                                        "name": "InActive"
                                    }]
                                },
                                {
                                    "key":"scoreMaster.subScores[].scoreParameters",
                                    "type": "array",
                                    "title": "SCORE_PARAMETERS",
                                    "items":[
                                        {   
                                            "key": "scoreMaster.subScores[].scoreParameters[].parameterName",
                                            "title":"parameterName",
                                            "type":"lov",
                                            searchHelper: formHelper,
                                            search: function (inputModel, form, model) {
                                                var defered = $q.defer();
                                                ScoresMaintenance.allParameterMaster().$promise.then(function(item){
                                                    var out = {};
                                                    out.body = [];
                                                    for(var i=0;i<item.length;i++){
                                                        if(item[i].status == "ACTIVE")
                                                        var temparray = [];
                                                        temparray.push(item[i].parameterDisplayName);
                                                            out.body.push(temparray);

                                                    }
                                                    defered.resolve(out);
                                                
                                                });
                                                return defered.promise;
                                                
                                            },
                                            getListDisplayItem: function (item, index) {
                                                return item;
                                                
                                            },
                                            onSelect: function (result, model, context) {
                                                model.scoreMaster.subScores[context.arrayIndexes[0]].scoreParameters[context.arrayIndexes[1]].parameterName = result[0];
                                            }

                                        },
                                        {
                                            "title":"parameterPassScore",
                                            "type": "string",
                                            "key": "scoreMaster.subScores[].scoreParameters[].parameterPassScore"
                                        },
                                        {
                                            "title":"parameterWeightage",
                                            "type": "string",
                                            "key": "scoreMaster.subScores[].scoreParameters[].parameterWeightage"
                                        },
                                        {
                                            "title": "MAX_PARAMETERS_SCORE",
                                            "key": "scoreMaster.subScores[].scoreParameters[].maxParameterScore"
                                        },
                                        {
                                            "title": "STATUS",
                                            "key": "scoreMaster.subScores[].scoreParameters[].status",
                                            "type": "select",
                                            "titleMap": [{
                                                "value": 'ACTIVE',
                                                "name": "Active"
                                            }, {
                                                "value": 'INACTIVE',
                                                "name": "InActive"
                                            }]
                                        }
                                    ]
                                },
                            ]
                        },
                    ]
                },
                {
                    "type": "actionbox",
                    "condition": "!model.customer.id",
                    "items": [
                        {
                            "type": "submit",
                            "title": "SUBMIT"
                        }]
                }
                ],
                schema: function () {
                    return ScoresMaintenance.getConfigurationJson({ name:"ScoreManagementInformation.json" }).$promise;
                },
                actions: {
                    submit: function (model, form, formName) {
                        if (model.scoreMaster.scoreId === 0 || model.scoreMaster.scoreId == null) {
                            model.scoreMaster.status = 'ACTIVE';
                            ScoresMaintenance.scoreCreate(model).$promise.then(function (resp) {
                                Utils.alert("Score Created Successfully");
                                irfNavigator.goBack();
                                deferred.resolve(resp);
                            }, function (errResp) {
                                PageHelper.showErrors(errResp.data);
                            }).finally(function () {
                                PageHelper.hideLoader();
                            });
                        } else {
                            ScoresMaintenance.scoreUpdate(model).$promise.then(function (resp) {
                                Utils.alert("Score Updated Successfully");
                                irfNavigator.goBack();
                            }, function (errResp) {
                                PageHelper.showErrors(errResp.data);
                            }).finally(function () {
                                PageHelper.hideLoader();
                            });
                        }

                    }
                }
            };
        }]);
