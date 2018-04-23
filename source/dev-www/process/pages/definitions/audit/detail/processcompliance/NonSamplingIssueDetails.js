irf.pageCollection.factory(irf.page("audit.detail.processcompliance.NonSamplingIssueDetails"), ["$log", "$state", "irfNavigator", "$stateParams", "Audit", "PageHelper", "$q", "elementsUtils", "formHelper", "$filter", "User",
    function($log, $state, irfNavigator, $stateParams, Audit, PageHelper, $q, elementsUtils, formHelper, $f, User) {
        var master = null;
        var validateKgfs = function(sample) {
            var tempIssueDetails = [];
            for (i in sample.issue_details) {
                var id = sample.issue_details[i];
                var issue = master.autosampling_typeofissue_sets[id.type_of_issue_id];
                if (issue.options.type == "dropdown") {
                    for (j in issue.options.type_of_issue_options) {
                        if ((issue.options.type_of_issue_options[j].option_id == id.option_id) || id.deviation) {
                            if (!id.assignee_det || !id.assignee_det.length || !id.assignee_det[0].assignee_id) {
                                PageHelper.setError({
                                    message: "Issue: <strong>" + (Number(i) + 1) + "</strong>Requires responsible person to be given"
                                });
                                return false;
                            }                            
                            tempIssueDetails.push(id);
                        } else if ((issue.options.type_of_issue_options[j].option_id == id.option_id) == null && id.deviation == "") {
                            for (var i = id.length - 1; i <= 0; i--) {
                                id.splice(i, 1);
                            }
                        }
                    }
                }
            }
            tempIssueDetails = sample.issue_details;
            return true;
        };
        var validateResponsibility = function(manual_issue) {
            var issue = master.non_mapped_typeofissue_sets[manual_issue.type_of_issue_id];
            if (issue.options.type == "dropdown") {
                for (j in issue.options.type_of_issue_options) {
                    if (issue.options.type_of_issue_options[j].option_id == manual_issue.option_id) {
                        if (issue.options.type_of_issue_options[j].marks === 0) {
                            if (!manual_issue.assignee_det || !manual_issue.assignee_det.length || !manual_issue.assignee_det[0].assignee_id) {
                                PageHelper.setError({
                                    message: "Option: <strong>" + issue.options.type_of_issue_options[j].option_label + "</strong> has 0 marks, which requires responsible person to be given"
                                });
                                return false;
                            }
                        }
                    }
                }
            }
            return true;
        };
        return {
            "type": "schema-form",
            "title": "NON_SAMPLING_ISSUES",
            initialize: function(model, form, formCtrl) {
                var self = this;
                if (!$stateParams.pageId || $stateParams.pageId.split(':').length != 2) {
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

                model.new = "New";
                model.manual_issue = model.manual_issue || {};
                var auditId = $stateParams.pageId;
                master = Audit.offline.getAuditMaster();

                var auditId = $stateParams.pageId.split(':')[0];
                var issueId = $stateParams.pageId.split(':')[1];
                if (issueId == "NEW") {
                    issueType = "N";
                    issueId = elementsUtils.generateUUID();
                } else if (issueId.startsWith("_")) {
                    issueType = "M";
                    issueId = issueId.substring(1);
                } else {
                    issueType = "E";
                    issueId = Number(issueId);
                }

                var typeOfIssuesTitleMap = [];
                var subprocessRefereneMap = {};
                var processRefereneMap = {};
                _.forOwn(master.non_mapped_typeofissue_sets, function(v, k) {
                    var toi = master.typeofissues[v.type_of_issue_id];
                    if (!toi) {
                        $log.error("non_mapped_typeofissue_sets->type_of_issue_id:" + v.type_of_issue_id + " not maintained in 'typeofissues'");
                        return;
                    }
                    if (pageData.readonly || !pageData.readonly && toi.status == "1") {
                        typeOfIssuesTitleMap.push({
                            "name": toi.description,
                            "value": toi.type_of_issue_id,
                            "group": toi.sub_process_id
                        });
                        subprocessRefereneMap[toi.sub_process_id] = master.subprocess[toi.sub_process_id];
                        processRefereneMap[toi.process_id] = master.process[toi.process_id];
                    }
                });

                var subProcessIdTitleMap = [];
                _.forOwn(subprocessRefereneMap, function(v, k) {
                    subProcessIdTitleMap.push({
                        "name": v.sub_process_name,
                        "value": v.sub_process_id,
                        "group": v.process_id
                    });
                });

                var processIdTitleMap = [];
                _.forOwn(processRefereneMap, function(v, k) {
                    processIdTitleMap.push({
                        "name": v.process_name,
                        "value": v.process_id
                    });
                });

                self.form = [];
                var renderForm = function() {
                    if (master.process[model.manual_issue.process_id]) {
                        model.manual_issue.process_name = master.process[model.manual_issue.process_id].process_name;
                    }
                    if (master.subprocess[model.manual_issue.sub_process_id]) {
                        model.manual_issue.sub_process_name = master.subprocess[model.manual_issue.sub_process_id].sub_process_name;
                    }
                    if (master.typeofissues[model.manual_issue.type_of_issue_id]) {
                        model.manual_issue.type_of_issue_desc = master.typeofissues[model.manual_issue.type_of_issue_id].description;
                    }

                    var boxItems = [{
                        "key": "manual_issue.issue_id",
                        "title": "ISSUE_ID",
                        "condition": "model.manual_issue.issue_id",
                        "readonly": true
                    }, {
                        "key": "new",
                        "title": "ISSUE_ID",
                        "condition": "model.manual_issue.issue_newgen_uid",
                        "readonly": true
                    }];

                    if (master.book_entity) {
                        var bookEntityTitleMap = [];
                        _.forOwn(master.book_entity, function(v, k) {
                            if (v.status == 1) {
                                bookEntityTitleMap.push({
                                    "name": v.entity_name,
                                    "value": v.entity_id
                                });
                            }
                        });
                        if (bookEntityTitleMap.length == 1) {
                            model.manual_issue.entity_id = bookEntityTitleMap[0].value;
                        } else {
                            boxItems.push({
                                "key": "manual_issue.entity_id",
                                "title": "BOOK_ENTITY",
                                "type": "select",
                                "titleMap": bookEntityTitleMap,
                                "required": true
                            });
                        }
                    }

                    boxItems.push({
                        "key": "manual_issue.process_name",
                        "title": "PROCESS",
                        "type": "lov",
                        "lovonly": true,
                        "autolov": true,
                        "searchHelper": formHelper,
                        "outputMap": {
                            "name": "manual_issue.process_name",
                            "value": "manual_issue.process_id"
                        },
                        getListDisplayItem: function(i) {
                            return [i.name]
                        },
                        search: function(i, fm, m) {
                            var f = processIdTitleMap;
                            return $q.resolve({
                                "headers": {
                                    "x-total-count": f.length
                                },
                                "body": f
                            });
                        },
                        onSelect: function(valueObj, model, context) {
                            model.manual_issue.sub_process_name = '';
                            model.manual_issue.sub_process_id = 0;
                            model.manual_issue.type_of_issue_desc = '';
                            model.manual_issue.type_of_issue_id = 0;
                        }
                    }, {
                        "key": "manual_issue.sub_process_name",
                        "title": "SUB_PROCESS",
                        "type": "lov",
                        "lovonly": true,
                        "autolov": true,
                        "searchHelper": formHelper,
                        "outputMap": {
                            "name": "manual_issue.sub_process_name",
                            "value": "manual_issue.sub_process_id"
                        },
                        getListDisplayItem: function(i) {
                            return [i.name]
                        },
                        search: function(i, fm, m) {
                            var f = $f("filter")(subProcessIdTitleMap, {
                                "group": m.manual_issue.process_id
                            }, true);
                            return $q.resolve({
                                "headers": {
                                    "x-total-count": f.length
                                },
                                "body": f
                            });
                        },
                        onSelect: function(valueObj, model, context) {
                            model.manual_issue.type_of_issue_desc = '';
                            model.manual_issue.type_of_issue_id = 0;
                        }
                    }, {
                        "key": "manual_issue.type_of_issue_desc",
                        "title": "ISSUE",
                        "type": "lov",
                        "lovonly": true,
                        "autolov": true,
                        "required": true,
                        "searchHelper": formHelper,
                        "outputMap": {
                            "name": "manual_issue.type_of_issue_desc",
                            "value": "manual_issue.type_of_issue_id"
                        },
                        getListDisplayItem: function(i) {
                            return [i.name]
                        },
                        search: function(i, fm, m) {
                            var f = $f("filter")(typeOfIssuesTitleMap, {
                                "group": m.manual_issue.sub_process_id
                            }, true);
                            return $q.resolve({
                                "headers": {
                                    "x-total-count": f.length
                                },
                                "body": f
                            });
                        },
                        onSelect: function() {
                            renderForm();
                        }
                    });

                    // Dynamic form section to be rendered as per data change in typeofissue
                    if (model.manual_issue.type_of_issue_id) {
                        var options = master.non_mapped_typeofissue_sets[model.manual_issue.type_of_issue_id].options;
                        if (options.type == "dropdown") {
                            var dropdownTitleMap = [];
                            for (i in options.type_of_issue_options) {
                                var v = options.type_of_issue_options[i];
                                dropdownTitleMap.push({
                                    "name": v.option_label,
                                    "value": v.option_id
                                });
                            }
                            boxItems.push({
                                "key": "manual_issue.option_id",
                                "type": "select",
                                "title": "OPTION",
                                "titleMap": dropdownTitleMap,
                                "required": true
                            });
                        } else if (options.type == "input") {
                            _.forOwn(options.type_of_issue_options, function(v, k) {
                                boxItems.push({
                                    "key": "input_datas['" + k + "']",
                                    "title": k,
                                    "required": true
                                });
                            });
                        }
                    }

                    boxItems.push({
                        "key": "manual_issue.deviation",
                        "type": "textarea",
                        "title": "DEVIATION",
                        "required": true
                    }, {
                        "key": "manual_issue.assignee_det[0].assignee_id",
                        "type": "lov",
                        "lovonly": true,
                        "required": true,
                        "title": "RESPONSIBILITY",
                        "inputMap": {
                            "branch_id": "branch_id",
                            "role_id": "role_id",
                            "login": "login",
                            "userName": "user_name"
                        },
                        "outputMap": {
                            "login": "manual_issue.assignee_det[0].assignee_id"
                        },
                        "searchHelper": formHelper,
                        search: function(inputModel, form, model) {
                            return User.query({
                                'login': inputModel.login,
                                'userName': inputModel.userName,
                                'roleId': inputModel.role_id,
                                'branchName': inputModel.branch_id,
                            }).$promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [item.login + ': ' + item.userName, item.branchName];
                        }
                    }, {
                        "key": "manual_issue.assignee_det[1].assignee_id",
                        "type": "lov",
                        "lovonly": true,
                        "title": "ADDL_RESPONSIBILITY",
                        "condition": "model.manual_issue.assignee_det[0].assignee_id",
                        "inputMap": {
                            "branch_id": "branch_id",
                            "role_id": "role_id",
                            "login": "login",
                            "userName": "user_name"
                        },
                        "outputMap": {
                            "login": "manual_issue.assignee_det[1].assignee_id"
                        },
                        "searchHelper": formHelper,
                        search: function(inputModel, form, model) {
                            return User.query({
                                'login': inputModel.login,
                                'userName': inputModel.userName,
                                'roleId': inputModel.role_id,
                                'branchName': inputModel.branch_id,
                            }).$promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [item.login + ': ' + item.userName, item.branchName];
                        }
                    }, {
                        "key": "manual_issue.latitude",
                        "title": "LOCATION",
                        "type": "geotag",
                        "latitude": "manual_issue.latitude",
                        "longitude": "manual_issue.longitude"
                    }, {
                        key: "manual_issue.document_id",
                        type: "file",
                        fileType: "application/pdf",
                        using: "scanner",
                        title: "DOCUMENT",
                        "category": "Audit",
                        "subCategory": "AUDITISSUEDOC"
                    });

                    self.form = [{
                        "type": "box",
                        "title": "ISSUE",
                        "readonly": pageData.readonly,
                        "items": boxItems
                    }, {
                        "type": "actionbox",
                        "condition": "!model.readonly",
                        "items": [{
                            "type": "submit",
                            "title": "UPDATE",
                        }]
                    }];
                };

                var processNonSamplingIssueDetails = function(response) {
                    if (!model.$isOffline && $stateParams.pageData.auditData) {
                        pageData.auditData = $stateParams.pageData.auditData;
                    }
                    model.readonly = pageData.readonly;
                    model.process_compliance = response;
                    if (issueType != "N") {
                        for (i in response.manual_sampling) {
                            if (issueType == "E") {
                                if (response.manual_sampling[i].issue_id == issueId) {
                                    model.manual_issue = response.manual_sampling[i];
                                    break;
                                }
                            } else if (response.manual_sampling[i].issue_newgen_uid == issueId) {
                                model.manual_issue = response.manual_sampling[i];
                                break;
                            }
                        }
                    } else {
                        model.manual_issue = {
                            "issue_id": null,
                            "issue_newgen_uid": issueId,
                            "entity_id": 0,
                            "process_id": 0,
                            "sub_process_id": 0,
                            "spot_fixed": "0",
                            "deviation": "",
                            "spot_action": "",
                            "type_of_issue_id": 0,
                            "option_id": 0,
                            "assignee_det": [{
                                "assignee_id": "",
                                "desgn_id": ""
                            }],
                            "input_datas": {},
                            "type": "dropdown",
                            "type_name": "normal"
                        };
                    }

                    renderForm();
                };

                self.actions.submit = function(model, formCtrl, form, event) {
                    PageHelper.clearErrors();
                    if (model.siteCode == "kinara") {
                        if (!validateResponsibility(model.manual_issue)) {
                            return;
                        }
                    }
                    if (model.siteCode == "KGFS") {
                        if (!validateKgfs(model.manual_issue)) {
                            return;
                        }
                    }
                    // if (!validateResponsibility(model.manual_issue)) {
                    //     return;
                    // }
                    if (issueType == "N") {
                        model.process_compliance.manual_sampling.push(model.manual_issue);
                    }
                    Audit.offline.setProcessCompliance(auditId, model.process_compliance).then(function() {
                        PageHelper.showProgress('audit', 'Issue updated successfully', 3000);
                        irfNavigator.goBack();
                    }, function(err) {
                        if (issueType == "N") {
                            model.process_compliance.manual_sampling.pop();
                        }
                        PageHelper.showErrors(err);
                    }).finally(PageHelper.hideLoader);
                };

                model.$isOffline = false;
                if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.process_compliance) {
                    processNonSamplingIssueDetails($stateParams.pageData.auditData.process_compliance);
                } else {
                    PageHelper.showLoader();
                    Audit.offline.getProcessCompliance(auditId).then(function(response) {
                        model.$isOffline = true;
                        processNonSamplingIssueDetails(response);
                    }, PageHelper.showErrors).finally(PageHelper.hideLoader);
                }
            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
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
                }
            },
            actions: {}
        };
    }
]);