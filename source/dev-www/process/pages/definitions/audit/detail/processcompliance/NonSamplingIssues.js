irf.pageCollection.factory(irf.page("audit.detail.processcompliance.NonSamplingIssues"),
["$log", "irfNavigator", "$stateParams", "Audit", "PageHelper", "Utils", "SessionStore",
function($log, irfNavigator, $stateParams, Audit, PageHelper, Utils, SessionStore) {
    var returnObj = {
        "type": "schema-form",
        "title": "NON_SAMPLING_ISSUES",
        initialize: function(model, form, formCtrl) {
            var self = this;
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

            model.manual_sampling = model.manual_sampling || {};
            var auditId = $stateParams.pageId;
            var master = Audit.offline.getAuditMaster();
            model.siteCode = SessionStore.getGlobalSetting('siteCode');

            self.form = [];
            var processNonSamplingIssues = function(response) {
                if (!model.$isOffline && $stateParams.pageData.auditData) {
                    pageData.auditData = $stateParams.pageData.auditData;
                }
                model.readonly = pageData.readonly;
                model.process_compliance = response;
                model.manual_sampling = response.manual_sampling;
                model.master = master;

                self.form = [{
                    "type": "box",
                    "title": "ISSUES",
                    "colClass": "col-md-12",
                    "items": [{
                        "key": "manual_sampling",
                        "type": "tableview",
                        "selectable": false,
                        "editable": false,
                        "tableConfig": {
                            "searching": true,
                            "paginate": true,
                            "pageLength": 10
                        },
                        getColumns: function() {
                            var columns = [{
                                title: 'ISSUE_ID',
                                data: 'issue_id',
                                render: function(data, type, full, meta) {
                                    return data ? data : "New";
                                }
                            }, {
                                title: 'PROCESS',
                                data: 'process_id',
                                render: function(data, type, full, meta) {
                                    return master.process[data].process_name;
                                }
                            }, {
                                title: 'SUB_PROCESS',
                                data: 'sub_process_id',
                                render: function(data, type, full, meta) {
                                    return master.subprocess[data].sub_process_name;
                                }
                            }, {
                                title: 'ISSUE',
                                data: 'type_of_issue_id',
                                render: function(data, type, full, meta) {
                                    return master.typeofissues[data].description;
                                }
                            }];
                            if (model.siteCode != 'KGFS') {
                                columns.push({
                                    title: 'OPTION',
                                    data: 'option_id',
                                    render: function(data, type, full, meta) {
                                        var options = master.non_mapped_typeofissue_sets[full.type_of_issue_id].options;
                                        for (i in options.type_of_issue_options) {
                                            if (options.type_of_issue_options[i].option_id == data) {
                                                return options.type_of_issue_options[i].option_label;
                                            }
                                        }
                                        return '-';
                                    }
                                });
                            }
                            columns.push.apply(columns, [{
                                title: 'COMMENT',
                                data: 'deviation'
                            }, {
                                title: 'RESPONSIBILITY',
                                data: 'assignee_det.0.assignee_id'
                            }]);
                            return columns;
                        },
                        getActions: function() {
                            return [{
                                name: "UPDATE_ISSUE",
                                fn: function(item, index) {
                                    irfNavigator.go({
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.detail.processcompliance.NonSamplingIssueDetails',
                                        'pageId': auditId + ":" + (item.issue_id? item.issue_id: (item.issue_newgen_uid? '_'+item.issue_newgen_uid: '')),
                                        'pageData': pageData
                                    }, {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.detail.processcompliance.NonSamplingIssues',
                                        'pageId': auditId,
                                        'pageData': pageData
                                    });
                                },
                                isApplicable: function(item, index) {
                                    return !$stateParams.pageData.readonly
                                }
                            }, {
                                name: "DELETE_ISSUE",
                                fn: function(item, index) {
                                    Utils.confirm("Are you sure to delete?").then(function() {
                                        model.manual_sampling.splice(model.manual_sampling.indexOf(item), 1)
                                    })
                                },
                                isApplicable: function(item, index) {
                                    return !$stateParams.pageData.readonly && !item.issue_id
                                }
                            }, {
                                name: "VIEW_ISSUE",
                                fn: function(item, index) {
                                    irfNavigator.go({
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.detail.processcompliance.NonSamplingIssueDetails',
                                        'pageId': auditId + ":" + (item.issue_id? item.issue_id: (item.issue_newgen_uid? '_'+item.issue_newgen_uid: '')),
                                        'pageData': pageData
                                    }, {
                                        'state': 'Page.Engine',
                                        'pageName': 'audit.detail.processcompliance.NonSamplingIssues',
                                        'pageId': auditId,
                                        'pageData': pageData
                                    });
                                },
                                isApplicable: function(item, index) {
                                    return $stateParams.pageData.readonly
                                }
                            }];
                        }
                    }]
                }, {
                    "type": "actionbox",
                    "condition": "!model.readonly",
                    "items": [{
                        "type": "button",
                        "title": "NEW_ISSUE",
                        onClick: function(model, formCtrl, form, event) {
                            irfNavigator.go({
                                'state': 'Page.Engine',
                                'pageName': 'audit.detail.processcompliance.NonSamplingIssueDetails',
                                'pageId': auditId + ':NEW',
                                'pageData': pageData
                            }, {
                                'state': 'Page.Engine',
                                'pageName': 'audit.detail.processcompliance.NonSamplingIssues',
                                'pageId': auditId,
                                'pageData': pageData
                            });
                        }
                    }]
                }];
            };

            model.$isOffline = false;
            if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.process_compliance) {
                processNonSamplingIssues($stateParams.pageData.auditData.process_compliance);
            } else {
                PageHelper.showLoader();
                Audit.offline.getProcessCompliance(auditId).then(function(response) {
                    model.$isOffline = true;
                    processNonSamplingIssues(response);
                }, PageHelper.showErrors).finally(PageHelper.hideLoader);
            }
        },
        form: [],
        schema: { "type": "object", "properties": { "manual_samplinga": { "type": "string" }}},
        actions: {}
    };
    return returnObj;
}]);