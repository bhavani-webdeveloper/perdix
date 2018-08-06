irf.pageCollection.factory(irf.page("audit.detail.GeneralObservation"), ["$log", "$q", "formHelper", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore", "filterFilter", "User",
    function($log, $q, formHelper, PageHelper, irfNavigator, $stateParams, Audit, SessionStore, filterFilter, User) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "GENERAL_OBSERVATION",
            initialize: function(model, form, formCtrl) {
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                var pageData = {
                    "readonly": $stateParams.pageData.readonly
                };
                model.readonly = $stateParams.pageData.readonly;
                model.audit_id = Number($stateParams.pageId);
                model.general_observations = model.general_observations || {};
                model.auditObservation = model.auditObservation || {};
                var masters = Audit.offline.getAuditMaster() || {};
                var self = this;
                self.form = [];
                var init = function(response) {
                    model.general_observations = response;
                    if (!model.general_observations || model.general_observations.length == 0) {
                        // populate fresh
                        model.general_observations = [];
                        _.forOwn(masters.general_observation.particulars, function(v, k) {
                            if (v.status == 1) {
                                var go = {
                                    "particular_id": v.particular_id,
                                    "comments": "",
                                    "option_id": [],
                                    "particular_name": v.particular_name
                                };
                                if (v.particular_type == 2) {
                                    go.option_type = 'user';
                                }
                                model.general_observations.push(go);
                            }
                        });
                    } else {
                        // fill particular name
                        for (i in model.general_observations) {
                            var go = model.general_observations[i];
                            var mgo = masters.general_observation.particulars[go.particular_id];
                            go.particular_name = mgo.particular_name;
                            if (mgo.particular_type != 2 && go.option_id && Number(go.option_id[0])) {
                                var gopos = filterFilter(masters.general_observation.particular_options[go.particular_id], {
                                    option_id: Number(go.option_id[0])
                                }, true);
                                if (gopos && gopos.length) {
                                    go.option_name = gopos[0].name;
                                }
                            }
                        }
                    }
                    self.form = [{
                        type: "box",
                        "readonly": pageData.readonly,
                        "colClass": "col-sm-12",
                        title: "GENERAL_OBSERVATION",
                        items: [{
                            key: "general_observations",
                            type: "array",
                            title: "GENERAL_OBSERVATION",
                            titleExpr: "model.general_observations[arrayIndex].particular_name",
                            view: "fixed",
                            add: null,
                            remove: null,
                            startEmpty: true,
                            items: [{
                                key: "general_observations[].option_name",
                                "condition": "model.general_observations[arrayIndex].option_type != 'user'",
                                "type": "lov",
                                lovonly: true,
                                "required": true,
                                outputMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var optionsToShow = masters.general_observation.particular_options[model.general_observations[context.arrayIndex].particular_id];
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": optionsToShow.length
                                        },
                                        body: optionsToShow
                                    });
                                },
                                getListDisplayItem: function(item, index, context) {
                                    return [
                                        item.name
                                    ];
                                },
                                onSelect: function(result, model, context) {
                                    model.general_observations[context.arrayIndex].option_id[0] = result.option_id;
                                    model.general_observations[context.arrayIndex].option_name = result.name;
                                }
                            }, {
                                "type": "section",
                                "htmlClass": "row",
                                "condition": "model.general_observations[arrayIndex].option_type == 'user'",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "items": [{
                                        "type": "section",
                                        "html": "<br><span class='pull-right'>{{'EMPLOYEE'|translate}}</span>"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-8",
                                    "items": [{
                                        "type": "array",
                                        "key": "general_observations[].option_id",
                                        "title": "EMPLOYEE",
                                        "titleExpr": "model.general_observations[arrayIndexes[0]].option_id[arrayIndexes[1]]",
                                        "startEmpty": true,
                                        "required": true,
                                        "items": [{
                                            key: "general_observations[].option_id[]",
                                            "type": "lov",
                                            lovonly: true,
                                            "required": true,
                                            inputMap: {
                                                "branch_id": {
                                                    "key": "branch_id"
                                                },
                                                "role_id": {
                                                    "key": "role_id"
                                                },
                                                "login": {
                                                    "key": "login"
                                                },
                                                "userName": {
                                                    "key": "user_name"
                                                }
                                            },
                                            searchHelper: formHelper,
                                            search: function(inputModel, form, model, context) {
                                                return User.query({
                                                    'login': inputModel.login,
                                                    'userName': inputModel.userName,
                                                    'roleId': inputModel.role_id,
                                                    'branchName': inputModel.branch_id,
                                                }).$promise;
                                            },
                                            getListDisplayItem: function(item, index, context) {
                                                return [
                                                    item.login + ': ' + item.userName,
                                                    item.branchName
                                                ];
                                            },
                                            onSelect: function(result, model, context) {
                                                model.general_observations[context.arrayIndexes[0]].option_id[context.arrayIndexes[1]] = result.login;
                                            }
                                        }]
                                    }]
                                }]
                            }, {
                                key: "general_observations[].comments",
                                "condition": 'model.general_observations[arrayIndex].option_name == "No"',
                                "required": true
                            }, {
                                key: "general_observations[].comments",
                                "condition": 'model.general_observations[arrayIndex].option_name == "Yes"',
                            }]
                        }]
                    }, {
                        type: "actionbox",
                        condition: "!model.readonly",
                        items: [{
                            type: "submit",
                            title: "UPDATE"
                        }]
                    }];
                };
                model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.general_observations) {
                    init($stateParams.pageData.auditData.general_observations);
                } else {
                    Audit.offline.getGeneralObservation($stateParams.pageId).then(function(res) {
                        init(res);
                        model.$isOffline = true;
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                }

            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "general_observations": {
                        "type": "array",
                        "title": "VERIFICATIONS",
                        "items": {
                            "type": "object",
                            "properties": {
                                "order_id": {
                                    "type": ["string", "null"],
                                    "title": "ORDER_ID"
                                },
                                "option_name": {
                                    "type": ["string", "null"],
                                    "title": "OPTION_NAME"
                                },
                                "particular_name": {
                                    "type": ["string", "null"],
                                    "title": "PARTICULAR_NAME"
                                },
                                "comments": {
                                    "type": ["string", "null"],
                                    "title": "COMMENTS"
                                }
                            }
                        }
                    },
                    "branch_id": {
                        "title": "BRANCH",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "user_name": {
                        "title": "USER_NAME",
                        "type": "string"
                    },
                    "login": {
                        "title": "LOGIN",
                        "type": "string"
                    },
                    "role_id": {
                        "title": "ROlE_ID",
                        "type": "number",
                        "enumCode": "roles",
                        "x-schema-form": {
                            "type": "select"
                        }
                    }
                },
            },
            actions: {
                submit: function(model, form, formName) {
                    if (model.$isOffline) {
                        Audit.offline.setGeneralObservation(model.audit_id, model.general_observations).then(function() {
                            PageHelper.showProgress("auditId", "Audit Updated Successfully.", 3000);
                            irfNavigator.goBack();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                    } else {
                        $stateParams.pageData.auditData.general_observations = model.general_observations;
                        irfNavigator.goBack();
                    }
                },
                goBack: function(model, form, formName) {
                    irfNavigator.goBack();
                },
            }
        };
    }
]);