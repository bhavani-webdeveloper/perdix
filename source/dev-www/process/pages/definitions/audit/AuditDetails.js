irf.pageCollection.controller(irf.controller("audit.AuditDetails"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Audit", "formHelper", "SessionStore", "elementsUtils", "User",
    function($log, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Audit, formHelper, SessionStore, elementsUtils, User) {
        if (!$stateParams.pageId) {
            irfNavigator.goBack();
            PageHelper.showProgress("audit", "Audit ID is empty", 5000);
            return;
        }
        $stateParams.pageData = $stateParams.pageData || {};
        if (typeof($stateParams.pageData.readonly) == 'undefined') {
            $stateParams.pageData.readonly = true;
        }
        var $this = this;
        $this.auditId = $stateParams.pageId;
        var master = Audit.offline.getAuditMaster();

        $scope.pageName = $stateParams.pageName;
        $scope.model = {
            "readonly": $stateParams.pageData.readonly,
            "type": $stateParams.pageData.type
        };
        $scope.formHelper = formHelper;
        $scope.siteCode = SessionStore.getGlobalSetting('siteCode');

        var configurableActionBoxHtml =
            '<div class="col-xs-12 action-box-col"><div class="box no-border"><div class="box-body" style="padding-right:0">\
    <button ng-repeat="item in form.items"\
            class="btn {{item.fieldHtmlClass}}" ng-class="item.style? item.style: \'btn-theme\'" type="button" style="margin-right:10px"\
            ng-click="evalExpr(\'buttonClick(event,form)\', {event:$event,form:item})"\
            ng-show="!item.condition || evalExpr(item.condition, {form:item})">\
        <i ng-if="item.icon" class="{{item.icon}}">&nbsp;</i>\
        {{item.title | translate}}\
    </button>\
    <span class="pull-right" style="padding-top: 6px;padding-right: 15px;" ng-bind-html="model.actions.getOfflineStatus(model.ai)"></span>\
</div></div></div>';

        var processAuditData = function(auditData) {
            $scope.model.auditData = auditData;
            $scope.model.ai = auditData.audit_info;
            $scope.model._isOnline = $scope.$isOnline;
        };
        var reportForm = {
            "type": "section",
            "htmlClass": "row",
            "colClass": "col-sm-12",
            "items": []
        }

        var userRole = SessionStore.getUserRole();
        var reportView = {
            SAMPLE: function(responsibilityType) {
                var as = $scope.model.auditData.process_compliance.auto_sampling;
                var sampleMap = {};
                for (i in as) {
                    for (j in as[i].sample_set) {
                        var sample = as[i].sample_set[j];
                        if (sample.status === "0") {
                            var sMap = sampleMap[sample.sample_id];
                            if (!sMap) {
                                sMap = {
                                    type: 'SAMPLE',
                                    id: sample.sample_id,
                                    name: sample.column_values[0],
                                    count: 0
                                };
                                sampleMap[sample.sample_id] = sMap;
                            }
                            for (k in sample.issue_details) {
                                var issue = sample.issue_details[k];
                                if (Audit.utils.isIssueApplicable(master, issue.type_of_issue_id, responsibilityType, userRole.id)) {
                                    sMap.count ++;
                                }
                            }
                        }
                    }
                }
                var sampleReport = [];
                _.forOwn(sampleMap, function(v, k) {
                    sampleReport.push(v);
                });
                return sampleReport;
            }
        };

        var processView = function() {
            for (i in master.summary_rating) {
                var ratingName = master.summary_rating[i].name;
                for (j in master.process) {
                    var processName = master.process[j].process_name
                    var tableColumnsConfig = [];
                    tableColumnsConfig.push({
                        "title": "RATING",
                        "data": ratingName
                    }, {
                        "title": "PROCESS",
                        "data": processName,

                    });
                    var columnForm = {
                        "type": "box",
                        "title": "AUDIT_REPORT_DETAILS",
                        "colClass": "col-sm-12",
                        "items": [{
                            "type": "tableview",
                            "selectable": false,
                            "editable": false,
                            "tableConfig": {
                                "searching": true,
                                "paginate": true,
                                "pageLength": 10,
                            },
                            getColumns: function() {
                                return tableColumnsConfig; //its coming from after adding issue
                            },
                            getActions: function() {
                                return [{
                                    name: "REVIEW_DETAILS",
                                    icon: "fa fa-pencil-square-o",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            'state': 'Page.Engine',
                                            'pageName': 'audit.AuditIssues',
                                            'pageId': item.id + ":" + viewType + ":" + viewTypeId,
                                            'pageData': {
                                                "readonly": $scope.model.readonly,
                                                "type": $scope.model.type
                                            }
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return true;
                                    }
                                }];
                            }
                        }]
                    }
                }


            }
            return columnForm;
        }

        var riskView = function() {
            var tableColumnsConfig = [];
            for (i in master.risk_classification) {
                var riskClassificationName = master.risk_classification[i].risk_clasification_name;
                $log.info(riskClassificationName);
                $log.info("riskClassificationName");
                // if (scoringSampleSet) {
                tableColumnsConfig.push({
                    "title": "RATING",
                    "data": "rating_name"
                }, {
                    "title": "RISK_CLASSIFICATION",
                    "data": riskClassificationName,

                });
                // }
            }
            var columnForm = {
                "type": "box",
                "title": "AUDIT_REPORT_DETAILS",
                "colClass": "col-sm-12",
                "items": [{
                    "type": "tableview",
                    "selectable": false,
                    "editable": false,
                    "tableConfig": {
                        "searching": true,
                        "paginate": true,
                        "pageLength": 10,
                    },
                    getColumns: function() {
                        return tableColumnsConfig;
                    },
                    getActions: function() {
                        return [{
                            name: "REVIEW_DETAILS",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'audit.AuditIssues',
                                    'pageId': item.id + ":" + viewType + ":" + viewTypeId,
                                    'pageData': {
                                        "readonly": $scope.model.readonly,
                                        "type": $scope.model.type
                                    }
                                });
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    }
                }]
            }
            return columnForm;
        }

        var deferred = $q.defer();
        PageHelper.showLoader();
        Audit.offline.getAudit($this.auditId).then(function(auditData) {
            $scope.$isOnline = false;
            processAuditData(auditData);
            deferred.resolve();
            PageHelper.hideLoader();
        }, function() {
            if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.audit_info && $stateParams.pageData.auditData.audit_info.audit_id == $this.auditId) {
                $scope.$isOnline = true;
                processAuditData($stateParams.pageData.auditData);
                PageHelper.hideLoader();
                deferred.resolve();
            } else {
                Audit.online.getAuditFull({
                    audit_id: $this.auditId
                }).$promise.then(function(_auditData) {
                    $scope.$isOnline = true;
                    if ($scope.model.readonly === false) {
                        Audit.offline.setAudit($this.auditId, _auditData).then(function() {
                            $scope.$isOnline = false;
                            processAuditData(_auditData);
                            deferred.resolve();
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                            $log.info("=====FALLBACK TO ONLINE=====");
                            Utils.confirm("You may not be able to edit Audit. Do you want to continue?").then(function() {
                                processAuditData(_auditData);
                                deferred.resolve();
                            }, function() {
                                irfNavigator.goBack();
                            });
                        });
                    } else {
                        processAuditData(_auditData);
                        deferred.resolve();
                    }
                }, function(errorResponse) {
                    PageHelper.showErrors(errorResponse);
                    deferred.reject();
                }).finally(PageHelper.hideLoader);
            }
        });
        var pdp = null;
        if ($scope.siteCode == 'KGFS') {
            pdp = PagesDefinition.getUserAllowedDefinition({
                "title": "Audit Details",
                "iconClass": "fa fa-cube",
                "items": [
                    "Page/Engine/audit.detail.GeneralObservation",
                    "Page/Engine/audit.detail.PortfolioStats",
                    "Page/Engine/audit.detail.JewelAppraisal",
                    "Page/Engine/audit.detail.FixedAsset",
                    "Page/Engine/audit.detail.FieldVerification",
                    "Page/Adhoc/audit.detail.ProcessCompliance",
                    "Page/Engine/audit.detail.AuditSummary",
                    // "Page/Adhoc/audit.AuditDraftDetails",
                ]
            });
        } else if ($scope.siteCode == 'kinara') {
            pdp = PagesDefinition.getUserAllowedDefinition({
                "title": "Audit Details",
                "iconClass": "fa fa-cube",
                "items": [
                    "Page/Adhoc/audit.detail.ProcessCompliance",
                    // "Page/Engine/audit.detail.AuditSummary",
                ]
            });

        }
        var scoreMenuPromise = PagesDefinition.getUserAllowedDefinition({
            "title": "Audit Details",
            "iconClass": "fa fa-cube",
            "items": [
                "Page/Adhoc/audit.AuditScoreDetails"
            ]
        }).then(function(resp) {
            $scope.dashboardDefinition_Score = _.cloneDeep(resp.$menuMap["Page/Adhoc/audit.AuditScoreDetails"]);
        });
        var manualScoreMenuPromise = null;
        if (!$stateParams.pageData.readonly) {
            manualScoreMenuPromise = PagesDefinition.getUserAllowedDefinition({
                "title": "Score Sheet Details",
                "iconClass": "fa fa-cube",
                "items": [
                    "Page/Engine/audit.detail.ScoreSheet"
                ]
            }).then(function(resp) {
                $scope.dashboardDefinition_ManualScore = _.cloneDeep(resp.$menuMap["Page/Engine/audit.detail.ScoreSheet"]);
            });
        }
        pdp.then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
        });
        var allPromises = [deferred.promise, pdp, scoreMenuPromise];
        if (manualScoreMenuPromise) {
            allPromises.push(manualScoreMenuPromise);
        }
        $q.all(allPromises).then(function() {
            $scope.showDashboard = true;
            if ($scope.siteCode == 'kinara' && $scope.model.ai.status !== 'O') {
                $scope.showDashboard = false;
                return;
            }

            // if ($scope.siteCode == 'kinara' && $scope.model.ai.status == 'O' || $scope.siteCode != 'kinara') {
            var requestMenu = [
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.AuditInfo"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.GeneralObservation"],
                $scope.dashboardDefinition.$menuMap["Page/Adhoc/audit.detail.ProcessCompliance"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.AuditSummary"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.JewelAppraisal"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.PortfolioStats"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.FieldVerification"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.FixedAsset"]
            ];

            var reloadDashboardBox = false;
            if ($scope.dashboardDefinition_Score &&
                ($scope.model.ai.current_stage == 'publish' ||
                    $scope.model.ai.current_stage == 'L1-approve' ||
                    $scope.model.ai.current_stage == 'approve')) {
                requestMenu.push($scope.dashboardDefinition_Score);
                $scope.dashboardDefinition.items.push($scope.dashboardDefinition_Score);
                reloadDashboardBox = true;
            }
            if ($scope.dashboardDefinition_ManualScore) {
                requestMenu.push($scope.dashboardDefinition_ManualScore);
                $scope.dashboardDefinition.items.push($scope.dashboardDefinition_ManualScore);
                reloadDashboardBox = true;
            }
            if (reloadDashboardBox) {
                elementsUtils.reloadDashboardBox && elementsUtils.reloadDashboardBox();
            }
            _.each(requestMenu, function(v, k) {
                if (v) {
                    v.onClick = function(event, menu) {
                        var pageData = {};
                        pageData.readonly = $stateParams.pageData.readonly;
                        pageData.type = $stateParams.pageData.type;
                        if ($scope.$isOnline) {
                            pageData.auditData = $scope.model.auditData;
                        }
                        irfNavigator.go({
                            "state": menu.state,
                            "pageName": menu.stateParams.pageName,
                            "pageId": $this.auditId,
                            "pageData": pageData
                        }, {
                            "state": "Page.Adhoc",
                            "pageName": "audit.AuditDetails",
                            "pageId": $this.auditId,
                            "pageData": pageData
                        });
                        return false;
                    };
                }
            });
        });

        $scope.formName = irf.form($scope.pageName);


        $scope.initialize = function(model, form, formCtrl) {};
        $scope.form = [{
            "type": "box",
            "title": "AUDIT_INFORMATION",
            "items": [{
                key: "ai.audit_id",
                type: "text",
                "readonly": true,
            }, {
                key: "ai.branch_id",
                type: "select",
                "readonly": true,
            }, {
                key: "ai.report_date",
                type: "date",
                "readonly": true,
            }, {
                key: "ai.start_date",
                type: "date",
                "readonly": true,
            }, {
                key: "ai.end_date",
                type: "date",
                "readonly": true,
            }, {
                key: "ai.auditor_id",
                type: "text",
                "readonly": true,
            }, {
                key: "ai.message",
                type: "textarea",
                "condition": "actions.showAddMessage(model)"
            }]
        }, {
            "type": "box",
            "title": "AUDIT_REPORT",
            "condition": "model.ai.status !== 'O'",
            "items": [{
                "key": "issueGroupType",
                "type": "radios",
                "titleMap": [{
                    "name": "File View",
                    "value": "SAMPLE",
                }, {
                    "name": "Process View",
                    "value": "PROCESS"
                }, {
                    "name": "Risk Classification View",
                    "value": "RISK"
                }],
                onChange: function(value, form, model) {
                    $scope.model.report = reportView[value]('draft'); // TODO: next phase dev: responsibilityType [draft|fix]
                }
            }, {
                "type": "tableview",
                "condition": "model.report",
                "key": "report",
                getColumns: function() {
                    return [{
                        "title": "SAMPLE_NAME",
                        "data": 'name'
                    }, {
                        "title": "NO_OF_ISSUES",
                        "data": 'count'
                    }];
                },
                getActions: function() {
                    return [{
                        "name": "VIEW_ISSUES",
                        fn: function(item, index) {
                            irfNavigator.go({
                                'state': 'Page.Engine',
                                'pageName': 'audit.AuditIssues',
                                'pageId': $this.auditId + ":" + item.type + ":" + item.id,
                                'pageData': {
                                    "readonly": $scope.model.readonly,
                                    "type": $scope.model.type
                                }
                            });
                        },
                        isApplicable: function(item, index) {
                            return true;
                        }
                    }];
                }
            }]

        }, {
            "type": "box",
            "condition": "model.ai.messages.length",
            "title": "MESSAGE_HISTORY",
            "readonly": true,
            "items": [{
                "key": "ai.messages",
                "type": "array",
                "view": "fixed",
                "titleExpr": "actions.getStageTitle(model.ai.messages[arrayIndex].type)",
                "items": [{
                    "type": "section",
                    "htmlClass": "",
                    "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.actions.getUsername(model.ai.messages[arrayIndex].created_by)}}\
                    <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.ai.messages[arrayIndex].created_on}}\
                    <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.ai.messages[arrayIndex].comment}}</strong><br>'
                }]
            }]
        }, {
            "type": "section",
            "condition": "!model.readonly",
            "html": configurableActionBoxHtml,
            "items": [{
                "type": "button",
                "condition": "!model._isOnline",
                "title": "RESYNC",
                "icon": "fa fa-refresh",
                "fieldHtmlClass": "pull-right",
                "style": "btn-default",
                "onClick": "actions.resyncAuditData(model)"
            }, {
                "type": "button",
                "condition": "model.ai._dirty && model.type == 'audit'",
                "title": "UPLOAD",
                "icon": "fa fa-upload",
                "onClick": "actions.uploadAuditData(model)"
            }, {
                "type": "button",
                "condition": "actions.showProceed(model)",
                "title": "PROCEED",
                "onClick": "actions.proceed(model)"
            }, {
                "type": "button",
                "condition": "actions.showReject(model)",
                "title": "REJECT",
                "onClick": "actions.reject(model)"
            }]
        }];


        $scope.form.push();

        $scope.schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "ai": {
                    "type": "object",
                    "properties": {
                        "branch_id": {
                            "title": "BRANCH_NAME",
                            "type": "integer",
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "audit_id": {
                            "type": ["number", "null"],
                            "title": "AUDIT_ID"
                        },
                        "report_date": {
                            "type": "string",
                            "title": "REPORT_DATE"
                        },
                        "start_date": {
                            "type": "string",
                            "title": "START_DATE"
                        },
                        "end_date": {
                            "type": "string",
                            "title": "END_DATE"
                        },
                        "auditor_id": {
                            "type": "string",
                            "title": "AUDITOR_ID"
                        },
                        "message": {
                            "type": ["string", "null"],
                            "title": "MESSAGE"
                        }
                    }
                }
            }
        };

        $scope.actions = {
            showAddMessage: function(model) {
                if (!model.ai) return;
                if (!model.ai._dirty && !model.readonly && model.type == 'audit') {
                    switch (model.ai.current_stage) {
                        case 'start':
                        case 'create':
                        case 'draft':
                        case 'publish':
                        case 'L1-approve':
                            return true;
                    }
                }
                return false;
            },
            showProceed: function(model) {
                if (!model.ai) return;
                if (!model.ai._dirty && model.ai._sync && model.type == 'audit') {
                    return true;
                }
                return false;
            },
            showReject: function(model) {
                if (!model.ai) return;
                if (!model.ai._dirty && model.ai._sync && model.type == 'audit') {
                    switch (model.ai.current_stage) {
                        case 'publish':
                        case 'L1-approve':
                            return true;
                    }
                }
                return false;
            },
            proceed: function(model) {
                if (!model.ai) return;
                var nextStage = '';
                switch (model.ai.current_stage) {
                    case 'start':
                    case 'create':
                        nextStage = $scope.siteCode == 'kinara'? 'draft': 'publish';
                        break;
                    case 'draft':
                        nextStage = 'publish';
                        break;
                    case 'publish':
                        if ($scope.siteCode == 'KGFS')
                            nextStage = 'approve';
                        else
                            nextStage = 'L1-approve';
                        break;
                    case 'L1-approve':
                        nextStage = 'approve';
                        break;
                    default:
                        return;
                }
                if (!model.ai.message) {
                    PageHelper.setError({
                        message: 'Audit ' + nextStage + ' message is required'
                    });
                    return;
                }
                $scope.actions.moveStage(model, nextStage);
            },
            reject: function(model) {
                if (!model.ai) return;
                var rejectStage = '';
                switch (model.ai.current_stage) {
                    case 'publish':
                        rejectStage = 'start';
                        break;
                    case 'L1-approve':
                        rejectStage = 'publish';
                        break;
                    default:
                        return;
                }
                if (!model.ai.message) {
                    PageHelper.setError({
                        message: 'Audit reject message is required'
                    });
                    return;
                }
                $scope.actions.moveStage(model, rejectStage);
            },
            moveStage: function(model, nextStage) {
                PageHelper.clearErrors();
                Utils.confirm("All unsaved data will be lost, Do you want to proceed?").then(function() {
                    var reqData = $scope.model.ai;
                    reqData.next_stage = nextStage;
                    Audit.online.updateAuditInfo(reqData).$promise.then(function(res) {
                        $scope.model.ai = res;
                        PageHelper.showProgress("audit", "Audit Updated Successfully.", 5000);
                        $scope.$online || Audit.offline.deleteAudit($this.auditId).catch(PageHelper.showErrors);
                        irfNavigator.goBack();
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    })
                });
            },
            uploadAuditData: function(model) {
                PageHelper.clearErrors();
                PageHelper.showLoader();
                var reqData = model.auditData;
                $scope.$online || Audit.offline.setAuditInfo($this.auditId, reqData.audit_info);
                Audit.online.updateAuditFull(reqData).$promise.then(function(response) {
                    Audit.online.getAuditFull({
                        audit_id: $this.auditId
                    }).$promise.then(function(auditData) {
                        processAuditData(auditData);
                        $scope.$online || Audit.offline.setAudit($this.auditId, auditData);
                        deferred.resolve();
                    }, function(errorResponse) {
                        PageHelper.showErrors(errorResponse);
                        deferred.reject();
                    }).finally(PageHelper.hideLoader);
                    PageHelper.showProgress("audit", "Audit Updated Successfully.", 3000);
                }, function(errRes) {
                    PageHelper.showErrors(errRes);
                    PageHelper.hideLoader();
                });
            },
            resyncAuditData: function(model) {
                Utils.confirm('All your audit data will be reset with server copy. Do you really want to resync?').then(function() {
                    PageHelper.showLoader();
                    Audit.online.getAuditFull({
                        audit_id: $this.auditId
                    }).$promise.then(function(response) {
                        PageHelper.hideLoader();
                        response.audit_info._online = true;
                        response.audit_info._offline = true;
                        response.audit_info._dirty = false;
                        response.audit_info._sync = true;
                        Audit.offline.setAudit($this.auditId, response);
                        processAuditData(response);
                        PageHelper.showProgress("audit", "Synchronized successfully", 3000);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                });
            },
            getStageTitle: function(stage) {
                return _.capitalize(stage)
            },
            getUsername: function(userId) {
                return User.offline.getDisplayName(userId);
            },
            getOfflineStatus: function(auditInfo) {
                return Audit.utils.auditStatusHtml(auditInfo, true);
            }
        };
        $scope.model.actions = $scope.actions;
    }
]);