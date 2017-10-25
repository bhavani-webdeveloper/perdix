irf.pageCollection.factory(irf.page("audit.detail.processcompliance.SampleSet"),
["$log", "$state", "irfNavigator", "$stateParams", "$http", "Audit", "SessionStore", "PageHelper", "$q", "Utils",
    function($log, $state, irfNavigator, $stateParams, $http, Audit, SessionStore, PageHelper, $q, Utils) {
        var branch = SessionStore.getBranch();
        var returnObj = {
            "type": "schema-form",
            "title": "SAMPLE_SET",
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

                self.form = [];
                var auditId = $stateParams.pageId.split(':')[0];
                var sampleTypeId = $stateParams.pageId.split(':')[1];
                var master = Audit.offline.getAuditMaster();
                var sampleColumnsConfig = null;
                var tableColumnsConfig = [{
                    "title": "S_NO",
                    "data": "sub_id",
                    render: function(data, type, full, meta) {
                        return data ? data : "New";
                    }
                }, {
                    "title": "STATUS",
                    "data": "status",
                    render: function(data, type, full, meta) {
                        return full.status == "0" ? "Audited" : (full.status == "1" ? "No Issues" : (full.status == "2" ? "Not Audited" : ""));
                    }
                }];
                for (i in master.sampling_columns_config) {
                    sampleColumnsConfig = master.sampling_columns_config[i];
                    if (sampleColumnsConfig.scoring_sample_type_id == sampleTypeId) {
                        for (j in sampleColumnsConfig.columns) {
                            tableColumnsConfig.push({
                                "title": sampleColumnsConfig.columns[j].user_friendly_name,
                                "data": "column_values." + j
                            });
                        }
                    }
                };

                var processData = function(response) {
                    if (!model.$isOffline && $stateParams.pageData.auditData) {
                        pageData.auditData = $stateParams.pageData.auditData;
                    }
                    model.processCompliance = response;
                    for (i in response.auto_sampling) {
                        if (response.auto_sampling[i].scoring_sample_type_id == sampleTypeId) {
                            model.sampleSet = response.auto_sampling[i].sample_set;
                            $log.info(response.auto_sampling[i].sample_set)
                            break;
                        }
                    }
                    self.form = [{
                        "type": "box",
                        "colClass": "col-md-12",
                        "title": master.process_tabs[master.scoring_sample_sets[sampleTypeId].scoring_process_type_id].scoring_process_type,
                        "items": [{
                            "key": "sampleSet",
                            "title": master.scoring_sample_sets[sampleTypeId].scoring_sample_type,
                            "type": "tableview",
                            "selectable": false,
                            "editable": false,
                            "tableConfig": {
                                "searching": true,
                                "paginate": true,
                                "pageLength": 10
                            },
                            getColumns: function() {
                                return tableColumnsConfig;
                            },
                            getActions: function() {
                                return [{
                                    name: "SKIP_SAMPLE",
                                    fn: function(item, index) {
                                        item.status = "2";
                                        delete item.issue_details;
                                        if (model.$isOffline) {
                                            Audit.offline.setProcessCompliance(auditId, model.processCompliance);
                                        }
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly && item.status != "2";
                                    }
                                },{
                                    name: "NO_ISSUES",
                                    fn: function(item, index) {
                                        item.status = "1";
                                        delete item.issue_details;
                                        if (model.$isOffline) {
                                            Audit.offline.setProcessCompliance(auditId, model.processCompliance);
                                        }
                                    },
                                     isApplicable: function(item, index) {
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if (siteCode == 'KGFS') {
                                            return !$stateParams.pageData.readonly && item.status != "1";
                                        }
                                    }
                                }, {
                                    name: "DO_AUDIT",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleIssues',
                                            'pageId': auditId + ":" + sampleTypeId + ":" + (item.sub_id? item.sub_id: (item.sample_newgen_uid? '_'+item.sample_newgen_uid: '')),
                                            'pageData': pageData
                                        }, {
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleSet',                                            
                                            'pageId': auditId + ":" + sampleTypeId,
                                            'pageData': pageData
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly;
                                    }
                                }, {
                                    name: "DELETE_SAMPLE",
                                    fn: function(item, index) {
                                        Utils.confirm("Are you sure to delete the sample and issues captured?").then(function() {
                                            var sampleSet = model.sampleSet;
                                            for (i in sampleSet) {
                                                if (item.sample_newgen_uid == sampleSet[i].sample_newgen_uid) {
                                                    sampleSet.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            if (model.$isOffline) {
                                            Audit.offline.setProcessCompliance(auditId, model.processCompliance);
                                            }
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly && item.sample_newgen_uid;
                                    }
                                }, {
                                    name: "VIEW_ISSUES",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleIssues',
                                            'pageId': auditId + ":" + sampleTypeId + ":" + (item.sub_id? item.sub_id: (item.sample_newgen_uid? '_'+item.sample_newgen_uid: '')),
                                            'pageData': pageData
                                        }, {
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.detail.processcompliance.SampleSet',
                                            'pageId': auditId + ":" + sampleTypeId,
                                            'pageData': pageData
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return $stateParams.pageData.readonly
                                    }
                                }];
                            }
                        }]
                    }];
                    var actionsBoxItems = [];
                    if (!$stateParams.pageData.readonly) {
                        actionsBoxItems.push({
                            "type": "button",
                            "title": "NEW_SAMPLE",
                            onClick: function(model, formCtrl, form, event) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.detail.processcompliance.SampleIssues',
                                    'pageId': auditId + ":" + sampleTypeId + ":NEW",
                                    'pageData': pageData
                                }, {
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.detail.processcompliance.SampleSet',
                                    'pageId': auditId + ":" + sampleTypeId,
                                    'pageData': pageData
                                });
                            }
                        });
                    }
                    actionsBoxItems.push({
                        "type": "button",
                        "title": "VIEW_SUMMARY",
                        onClick: function(model, formCtrl, form, event) {
                            irfNavigator.go({
                                'state': 'Page.Engine',
                                'pageName': 'audit.detail.processcompliance.SampleSetSummary',
                                'pageId': auditId + ":" + sampleTypeId,
                                'pageData': pageData
                            }, {
                                'state': 'Page.Engine',
                                'pageName': 'audit.detail.processcompliance.SampleSet',
                                'pageId': auditId + ":" + sampleTypeId,
                                'pageData': pageData
                            });
                        }
                    });
                    self.form.push({
                        "type": "actionbox",
                        "items": actionsBoxItems
                    });
                };
                model.$isOffline = false;
                if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.process_compliance) {
                    processData($stateParams.pageData.auditData.process_compliance);
                } else {
                    PageHelper.showLoader();
                    Audit.offline.getProcessCompliance(auditId).then(function(response) {
                        model.$isOffline = true;
                        processData(response);
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
                    "sampleset": {
                        "type": "string"
                    }
                }
            },
            actions: {}
        };
        return returnObj;
    }
]);