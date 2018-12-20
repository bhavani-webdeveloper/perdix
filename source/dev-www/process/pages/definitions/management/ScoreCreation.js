irf.pageCollection.factory(irf.page("management.ScoreCreation"),
    ["$log", "$state", "ScoresMaintenance", "formHelper", "$q", "irfProgressMessage", "ScoresMaintenance", "PageHelper", "Utils", "irfNavigator","$stateParams",
        function ($log, $state, ScoresMaintenance, formHelper, $q, irfProgressMessage, ScoresMaintenance, PageHelper, Utils, irfNavigator,$stateParams) {

            var tempErrorFix = function(resp){
                var newError = {};
                newError.errors = {};
                if(resp.data.body.errors){
                    var keys = Object.keys(resp.data.body.errors);
                    for(var i=0;i<keys.length;i++){
                        if(!keys[i]== "")
                            newError.errors[keys[i]] = resp.data.body.errors[keys[i]];
                    }
                    return newError;
                }
                return null;
            };
            var getEnumCode = function(value,model){
                for(var i=0; i< model.additions.criteriaLov.body.length; i++){
                    if(value == model.additions.criteriaLov.body[i].criteriaName){
                        return model.additions.criteriaLov.body[i].enumCode;
                    }
                }
            }
            var makeUnique = function(resp){
                var result = [];
                loop1: for (var i = 0; i < resp.length; i++) {
                    var name = resp[i].criteriaName;
                        for (var i2 = 0; i2 < result.length; i2++) {
                            if (result[i2].criteriaName == name) {
                                continue loop1;
                            }
                        }
                    result.push(resp[i]);
                }
                return result;
            }
            return {
                "type": "schema-form",
                "title": "SCORE_CREATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    var self = this;
                    self.form = self.formSource;
                    if(!$stateParams.pageId){
                    model.additions = {}; 
                        ScoresMaintenance.allCriteria().$promise.then(function(resp){
                            model.additions.criteriaLov = resp;
                        })
                    }
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
                        model.additions = {};
                        ScoresMaintenance.allCriteria().$promise.then(function(resp){
                            model.additions.criteriaLov = resp;
                            PageHelper.hideLoader();
                            defered.resolve(model);
                        })
                        PageHelper.hideLoader();
                    }),function (err) {
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
                            "type": "radios",
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
                            // titleExpr:"model.scoreMaster.subScores[arrayIndex].subscoreName",
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
                                        return $q.when(model.additions.criteriaLov);
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
                                        return [item.criteriaName];
                                    },
                                    onSelect: function (result, model, context) {
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaName = result.criteriaName;
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].enumCode = result.enumCode;
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaValue = null;
                                        model.scoreMaster.scoreCriterias[context.arrayIndex].status =result.status;
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
                                        $q.when(formHelper.enum(getEnumCode(model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaName,model))).then(function(value){
                                            defered.resolve({
                                                body:value.data
                                            })
                                        },function(err){
                                            defered.reject(err);
                                        })
                                        // $q.when(model.additions.criteriaLov.original).then(
                                        //     function (data) {
                                        //         var resp_array = [];
                                        //         resp_array = data.body;
                                        //         var output = [], l = resp_array.length, i;
                                        //         for (i = 0; i < l; i++) {
                                        //             if (resp_array[i].criteriaName == model.scoreMaster.scoreCriterias[context.arrayIndex].criteriaName) {
                                        //                 output.push({
                                        //                     name: resp_array[i].criteriaValue,
                                        //                     value: resp_array[i].criteriaValue
                                        //                 });
                                        //             }
                                        //         }
                                        //         defered.resolve({
                                        //             headers: {
                                        //                 "x-total-count": output.length
                                        //             },
                                        //             body: output
                                        //         });
                                        //     }, function (err) {
                                        //         defered.reject(err);
                                        //     });
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
                                    "type": "radios",
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
                            // titleExpr:"model.scoreMaster.subScores[arrayIndex].subscoreName",
                            "title":"SUBSCORE",
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
                                    "title": "IS_INDIVIDUAL_SCORE",
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
                                    "type": "radios",
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
                                    // titleExpr:"model.scoreMaster.subScores[arrayIndexes[0]].scoreParameters[arrayIndexes[1]].parameterName",
                                    "title": "SCORE_PARAMETERS",
                                    "items":[
                                        {   
                                            "key": "scoreMaster.subScores[].scoreParameters[].parameterName",
                                            "title":"PARAMETER_NAME",
                                            "type":"lov",
                                            searchHelper: formHelper,
                                            search: function (inputModel, form, model) {
                                                var defered = $q.defer();
                                                ScoresMaintenance.allParameterMaster({page:1,per_page:100}).$promise.then(function(item){
                                                    var out = {};
                                                    out.body = [];
                                                    for(var i=0;i<item.length;i++){
                                                        if(item[i].status == "ACTIVE")
                                                        var temparray = [];
                                                        temparray.push(item[i]);
                                                            out.body.push(temparray);

                                                    }
                                                    defered.resolve(out);
                                                
                                                });
                                                return defered.promise;
                                                
                                            },
                                            getListDisplayItem: function (item, index) {
                                                return [item[0].parameterDisplayName];
                                                
                                            },
                                            onSelect: function (result, model, context) {
                                                model.scoreMaster.subScores[context.arrayIndexes[0]].scoreParameters[context.arrayIndexes[1]].parameterName = result[0].parameterName;
                                                model.scoreMaster.subScores[context.arrayIndexes[0]].scoreParameters[context.arrayIndexes[1]].status = result[0].status;                                                
                                            }

                                        },
                                        {
                                            "title":"PARAMETER_PASS_SCORE",
                                            "type": "string",
                                            "required": false,
                                            "key": "scoreMaster.subScores[].scoreParameters[].parameterPassScore"
                                        },
                                        {
                                            "title":"PARAMETER_WEIGHTAGE",
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
                                            "type": "radios",
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
                    return ScoresMaintenance.getConfigurationJson({ name:"scoreManagementInformation.json" }).$promise;
                },
                actions: {
                    submit: function (model, form, formName) {
                        if (model.scoreMaster.scoreId === 0 || model.scoreMaster.scoreId == null) {
                            model.scoreMaster.status = 'ACTIVE';
                            ScoresMaintenance.scoreCreate(model).$promise.then(function (resp) {
                                Utils.alert("Score Created Successfully");
                                irfNavigator.goBack();
                            }, function (errResp) {
                                errors = tempErrorFix(errResp);
                                var error = {}
                                error.data = errors;
                                PageHelper.showErrors(error);
                            }).finally(function () {
                                PageHelper.hideLoader();
                            });
                        } else {
                            ScoresMaintenance.scoreUpdate(model).$promise.then(function (resp) {
                                Utils.alert("Score Updated Successfully");
                                irfNavigator.goBack();
                            }, function (errResp) {
                                errors = tempErrorFix(errResp);
                                var error = {};
                                error.data = errors;
                                PageHelper.showErrors(error);
                            }).finally(function () {
                                PageHelper.hideLoader();
                            });
                        }

                    }
                }
            };
        }]);
