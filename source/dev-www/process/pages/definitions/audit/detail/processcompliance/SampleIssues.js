irf.pageCollection.factory(irf.page("audit.detail.processcompliance.SampleIssues"), ["$log", "$state", "irfNavigator", "SessionStore", "$stateParams", "$http", "Audit", "PageHelper", "$q", "elementsUtils", "formHelper", "User",
    function($log, $state, irfNavigator, SessionStore, $stateParams, $http, Audit, PageHelper, $q, elementsUtils, formHelper, User) {
        var master = null;

        var validateKgfs = function(sample) {
            var tempIssueDetails = [];
            for (i in sample.issue_details) {
                var id = sample.issue_details[i];
                var issue = master.autosampling_typeofissue_sets[id.type_of_issue_id];
                // if (issue.options.type == "dropdown") {
                if (id.option_id || id.deviation) {
                    if (!id.assignee_det || !id.assignee_det.length || !id.assignee_det[0].assignee_id) {
                        PageHelper.setError({
                            message: "Issue <strong>#" + (Number(i) + 1) + "</strong> requires responsible person to be given"
                        });
                        return false;
                    }
                    tempIssueDetails.push(id);
                }
                //}
            }
            sample.issue_details = tempIssueDetails;
            return true;
        };

        var validateKinara = function(sample) {
            for (i in sample.issue_details) {
                var id = sample.issue_details[i];
                var issue = master.autosampling_typeofissue_sets[id.type_of_issue_id];
                if (issue.options.type == "dropdown") {
                    for (j in issue.options.type_of_issue_options) {
                        if (issue.options.type_of_issue_options[j].option_id == id.option_id) {
                            if (issue.options.type_of_issue_options[j].marks === 0) {
                                if (!id.assignee_det || !id.assignee_det.length || !id.assignee_det[0].assignee_id) {
                                    PageHelper.setError({
                                        message: "Issue: <strong>" + (Number(i) + 1) + "</strong> option: <strong>" + issue.options.type_of_issue_options[j].option_label + "</strong> has 0 marks, which requires responsible person to be given"
                                    });
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        };
        return {
            "type": "schema-form",
            "title": "SAMPLE_ISSUES",
            initialize: function(model, form, formCtrl) {
                var self = this;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                var ids = $stateParams.pageId.split(':');
                if (ids.length != 3) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                var auditId = model.auditId = Number(ids[0]);
                var sampleTypeId = Number(ids[1]);
                var sampleSubId = 0;

                if (auditId <= 0 || sampleTypeId <= 0) {
                    irfNavigator.goBack();
                    return;
                }

                var sampleType = null;
                if (ids[2] === "NEW") {
                    sampleType = "N"; // New Sample
                    sampleSubId = elementsUtils.generateUUID();
                } else if (ids[2].startsWith("_")) {
                    sampleType = "M"; // New Sample Modified
                    sampleSubId = ids[2].substring(1);
                } else {
                    sampleType = "E"; // Existing Sample
                    sampleSubId = Number(ids[2]);
                    if (sampleSubId <= 0) {
                        irfNavigator.goBack();
                        return;
                    }
                }

                master = Audit.offline.getAuditMaster();
                model.sample = model.sample || {};
                self.form = [];
                var formDetails = [];
                var processSampleIssues = function(response) {
                    model.processCompliance = response;

                    /* START: identifying sampleset */
                    var sampleColumnsConfig = null;
                    var componentColumns = [];
                    var componentForm = [];
                    for (i in master.sampling_columns_config) {
                        sampleColumnsConfig = master.sampling_columns_config[i];
                        if (sampleColumnsConfig.scoring_sample_type_id == sampleTypeId) {
                            for (j in sampleColumnsConfig.columns) {
                                var col = sampleColumnsConfig.columns[j];
                                if (col.component_id) {
                                    componentColumns.push(col);
                                    col.$index = j;
                                }
                            }
                            break; // very important break to preserve - sampleColumnsConfig
                        }
                    };
                    /* END: identifying sampleset */

                    /* START: building sample forms */
                    for (j in sampleColumnsConfig.columns) {
                        var columnForm = {
                            "title": sampleColumnsConfig.columns[j].user_friendly_name,
                            "readonly": $stateParams.pageData.readonly || sampleType == "E",
                            "key": "sample.column_values[" + j + "]",
                            type: "text"
                        }
                        columnForm.title = sampleColumnsConfig.columns[j].user_friendly_name;
                        if (j == 0 && sampleType != "E") {
                            columnForm.required = true;
                            if (componentColumns.length) {
                                columnForm.type = "lov";
                                columnForm.inputMap = {};
                                for (k in componentColumns) { // master.components[componentColumns[k].component_id]
                                    columnForm.inputMap[master.components[componentColumns[k].component_id].component_name] = {
                                        "key": master.components[componentColumns[k].component_id].component_name
                                    }
                                }
                                columnForm.searchHelper = formHelper;
                                columnForm.search = function(inputModel, form, model) {
                                    var searchParams = {};
                                    for (n in componentColumns) {
                                        searchParams[componentColumns[n].column_name] = inputModel[master.components[componentColumns[n].component_id].component_name];
                                    }
                                    return Audit.online.findDumpSamples({
                                        "audit_id": auditId,
                                        "scoring_sample_type_id": sampleTypeId,
                                        "search_params": searchParams
                                    }).$promise;
                                };
                                columnForm.getListDisplayItem = function(item, index) {
                                    return [
                                        item.Entity,
                                        item.URN,
                                        item.product,
                                        item.transaction_amount
                                    ];
                                };
                                columnForm.onSelect = function(valueObj, model, context) {
                                    for (i in sampleColumnsConfig.columns) {
                                        model.sample.column_values[i] = valueObj[sampleColumnsConfig.columns[i].column_name];
                                    }
                                };
                            }
                        }
                        formDetails.push(columnForm);
                    }
                    /* END: building sample forms */

                    /* START: Identifying sample and assigning to model.sample */
                    model.sampleType = sampleType;
                    var auto_sampling_set_found = false;
                    var identifySample = function(auto_sampling_set) {
                        var sampleSet = auto_sampling_set.sample_set;
                        model.sampleSet = sampleSet;
                        if (sampleType == "N") {
                            model.sample = {
                                "sub_id": 0,
                                // "sample_id": 0,
                                // "status": "2",
                                "sample_newgen_uid": sampleSubId,
                                "column_values": []
                            };
                            for (j in sampleColumnsConfig.columns) {
                                model.sample.column_values[j] = "";
                            }
                        } else {
                            for (i in sampleSet) {
                                if (sampleType == "E") {
                                    if (sampleSubId == sampleSet[i].sub_id) {
                                        model.sample = sampleSet[i];
                                        break;
                                    }
                                } else if (sampleSubId == sampleSet[i].sample_newgen_uid) { // sampleType == "M"
                                    model.sample = sampleSet[i];
                                    break;
                                }
                            }
                        }
                    };
                    if (!_.isArray(response.auto_sampling)) {
                        response.auto_sampling = [];
                    }
                    for (k in response.auto_sampling) {
                        if (response.auto_sampling[k].scoring_sample_type_id == sampleTypeId) {
                            identifySample(response.auto_sampling[k]);
                            auto_sampling_set_found = true;
                        }
                    }
                    if (!auto_sampling_set_found) {
                        var new_auto_sampling_set = {
                            "sample_fetched": 0,
                            "sample_set": [],
                            "sample_total": 0,
                            "scoring_sample_type_id": sampleTypeId
                        };
                        response.auto_sampling.push(new_auto_sampling_set);
                        identifySample(new_auto_sampling_set);
                    }
                    /* END: Identifying sample and assigning to model.sample */

                    /* START: Component buttons */
                    if (sampleType !== "N") {
                        for (k in componentColumns) {
                            var component_name = master.components[componentColumns[k].component_id].component_name;
                            var sample_column_value = model.sample.column_values[componentColumns[k].$index];
                            if (_.indexOf(["CUSTOMER_ID", "LOAN_ID"], component_name) == -1 || !sample_column_value) continue;
                            switch (component_name) {
                                case "CUSTOMER_ID":
                                    formDetails.push({
                                        "type": "button",
                                        "title": "Customer (" + sample_column_value + ")",
                                        onClick: function(model, formCtrl, form, event) {
                                            irfNavigator.go({
                                                'state': 'Page.Customer360',
                                                'pageName': null,
                                                'pageId': sample_column_value
                                            });
                                        }
                                    });
                                    break;
                                case "LOAN_ID":
                                    formDetails.push({
                                        "type": "button",
                                        "title": "Loan (" + sample_column_value + ")",
                                        onClick: function(model, formCtrl, form, event) {
                                            irfNavigator.go({
                                                'state': 'Page.Bundle',
                                                'pageName': 'loans.individual.screening.LoanView',
                                                'pageId': sample_column_value
                                            });
                                        }
                                    });
                                    break;
                            }
                        }
                    }
                    /* END: Component buttons */

                    /* START: Issues processing */
                    var issueDetailsForm = [];
                    var processIssuesForm = function(issue, i) {
                        issueDetailsForm.push({
                            "type": "section",
                            "html": '<div><strong>' + (i + 1) + '.</strong> <span>' + master.typeofissues[issue.type_of_issue_id].description + '</span></div>'
                        });

                        if (issue.options.type == "dropdown") {
                            var dropdownTitleMap = [];
                            for (j in issue.options.type_of_issue_options) {
                                dropdownTitleMap.push({
                                    "name": issue.options.type_of_issue_options[j].option_label,
                                    "value": issue.options.type_of_issue_options[j].option_id
                                });
                            }
                            issueDetailsForm.push({
                                "key": "sample.issue_details[" + i + "].option_id",
                                "type": "select",
                                "title": "OPTION",
                                "titleMap": dropdownTitleMap
                            });
                        } else if (issue.options.type == "input") {
                            _.forOwn(issue.options.type_of_issue_options, function(v, k) {
                                issueDetailsForm.push({
                                    "key": "sample.issue_details[" + i + "].input_datas['" + k + "']",
                                    "title": k,
                                    "required": true
                                });
                            });
                        }

                        issueDetailsForm.push({
                            "key": "sample.issue_details[" + i + "].deviation",
                            "type": "textarea",
                            "title": "DEVIATION"
                        }, {
                            "key": "sample.issue_details[" + i + "].assignee_det[0].assignee_id",
                            "type": "lov",
                            "lovonly": true,
                            "title": "RESPONSIBILITY",
                            "inputMap": {
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
                            "outputMap": {
                                "login": "sample.issue_details[" + i + "].assignee_det[0].assignee_id"
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
                                return [
                                    item.login + ': ' + item.userName,
                                    item.branchName
                                ];
                            }
                        }, {
                            "key": "sample.issue_details[" + i + "].assignee_det[1].assignee_id",
                            "type": "lov",
                            "lovonly": true,
                            "title": "ADDL_RESPONSIBILITY",
                            "condition": "model.sample.issue_details[" + i + "].assignee_det[0].assignee_id",
                            "inputMap": {
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
                            "outputMap": {
                                "login": "sample.issue_details[" + i + "].assignee_det[1].assignee_id"
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
                                return [
                                    item.login + ': ' + item.userName,
                                    item.branchName
                                ];
                            }
                        }, {
                            "key": "sample.issue_details[" + i + "].latitude",
                            "title": "LOCATION",
                            "type": "geotag",
                            "latitude": "sample.issue_details[" + i + "].latitude",
                            "longitude": "sample.issue_details[" + i + "].longitude"
                        }, {
                            key: "sample.issue_details[" + i + "].document_id",
                            type: "file",
                            fileType: "application/pdf",
                            using: "scanner",
                            title: "DOCUMENT",
                            "category": "Audit",
                            "subCategory": "AUDITISSUEDOC"
                        });
                        if (model.siteCode == "KGFS") {
                            issueDetailsForm.push({
                                "key": "sample.issue_details[" + i + "].spot_fixed",
                                "type": "checkbox",
                                "fullwidth": true,
                                "schema": {
                                    "default": false
                                },
                                "title": "SPOT_FIX"
                            }, {
                                "key": "sample.issue_details[" + i + "].spot_action",
                                "condition": "model.sample.issue_details[" + i + "].spot_fixed == '1'",
                                "type": "textarea",
                                "title": "SPOT_ACTION"
                            });
                        }
                        issueDetailsForm.push({
                            "type": "section",
                            "html": '<hr>'
                        });
                    };

                    model.sample.issue_details = model.sample.issue_details || [];
                    // existing issues from sample
                    var issuesDataMap = {};
                    for (idx = 0; idx < model.sample.issue_details.length; idx++) {
                        processIssuesForm(master.autosampling_typeofissue_sets[model.sample.issue_details[idx].type_of_issue_id], idx);
                        issuesDataMap[model.sample.issue_details[idx].type_of_issue_id] = true;
                    }
                    // new issues from master
                    var issues = master.autosampling_scoring_sample_type_sets[sampleTypeId];
                    for (i = 0; i < issues.length; i++) {
                        if (issuesDataMap[issues[i].type_of_issue_id]) {
                            continue;
                        }
                        var typeofissue = master.typeofissues[issues[i].type_of_issue_id];
                        if (typeofissue.status != "1") {
                            continue; // SKIP inactive issues
                        }
                        model.sample.issue_details[idx] = {
                            "process_id": typeofissue.process_id,
                            "sub_process_id": typeofissue.sub_process_id,
                            "type_of_issue_id": typeofissue.type_of_issue_id,
                            "option_id": null,
                            "assignee_det": [{
                                "assignee_id": null,
                                "desgn_id": 0 // TODO global_settings audit.issue_assigned_to_role_id
                            }],
                            "input_datas": "",
                            "spot_fixed": "0"
                        };
                        processIssuesForm(issues[i], idx++);
                    }
                    /* END: Issues processing */

                    self.form = [{
                        "type": "box",
                        "title": "SAMPLE",
                        "items": formDetails
                    }, {
                        "type": "box",
                        "readonly": $stateParams.pageData.readonly,
                        "title": "ISSUES",
                        "items": issueDetailsForm
                    }];

                    if (!$stateParams.pageData.readonly) {
                        self.form.push({
                            "type": "actionbox",
                            "items": [{
                                "type": "submit",
                                "title": "UPDATE"
                            }]
                        });
                    }
                };

                model.$isOffline = false;
                if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.process_compliance) {
                    processSampleIssues($stateParams.pageData.auditData.process_compliance);
                } else {
                    PageHelper.showLoader();
                    Audit.offline.getProcessCompliance(auditId).then(function(response) {
                        model.$isOffline = true;
                        processSampleIssues(response);
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
                    },
                    "BRANCH": {
                        "title": "BRANCH_ID",
                        "type": "number",
                        "enumCode": "branch_id",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "CENTRE": {
                        "title": "CENTRE",
                        "type": ["integer", "null"],
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.branchName"
                        }
                    },
                    "LOAN_ID": {
                        "title": "LOAN_ID",
                        "type": "string"
                    },
                    "CUSTOMER_ID": {
                        "title": "CUSTOMER_ID",
                        "type": "string"
                    },


                }
            },
            actions: {
                submit: function(model, formCtrl, form, $event) {
                    PageHelper.clearErrors();
                    if (model.siteCode = "kinara") {
                        if (!validateKinara(model.sample)) {
                            return;
                        }
                    }
                    if (model.siteCode = "KGFS") {
                        if (!validateKgfs(model.sample)) {
                            return;
                        }
                    }
                    model.sample.status = "0";
                    if (model.$isOffline) {
                        PageHelper.showLoader();
                        if (model.sampleType == "N") {
                            model.sampleSet.push(model.sample);
                        }
                        Audit.offline.setProcessCompliance(model.auditId, model.processCompliance).then(function() {
                            PageHelper.showProgress('audit', 'Sample/Issues updated successfully', 3000);
                            irfNavigator.goBack();
                        }, function(err) {
                            if (model.sampleType == "N") {
                                model.sampleSet.pop();
                            }
                            PageHelper.showErrors(err);
                        }).finally(PageHelper.hideLoader);
                    } else {
                        PageHelper.showProgress('audit', 'Sample/Issues updated successfully', 3000);
                        irfNavigator.goBack();
                    }
                }
            }
        };
    }
]);