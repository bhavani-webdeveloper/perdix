irf.pageCollection.controller(irf.controller("audit.AuditDetails"), ["$log", "translateFilter", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Audit", "formHelper", "SessionStore", "elementsUtils", "User",
    function($log, translateFilter, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Audit, formHelper, SessionStore, elementsUtils, User) {
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
            PageHelper.setWarning({
                message: $scope.model.ai.days_left + " day(s) left to complete"
            });
            $scope.model.stage = $scope.model.ai.current_stage;
            $scope.model._isOnline = $scope.$isOnline;
        };
        var reportForm = {
            "type": "section",
            "htmlClass": "row",
            "colClass": "col-sm-12",
            "items": []
        }

        var userRole = SessionStore.getUserRole();
        var reportView = function(reportType, responsibilityType) {
            var as = $scope.model.auditData.process_compliance.auto_sampling;
            var reportMap = {};
            for (i in as) {
                for (j in as[i].sample_set) {
                    var sample = as[i].sample_set[j];
                    if (sample.status === "0") {
                        for (k in sample.issue_details) {
                            var issue = sample.issue_details[k];
                            var roleId = $scope.model.type == 'operation' ? userRole.id : null;
                            if (Audit.utils.isIssueApplicable(master, issue.type_of_issue_id, responsibilityType, roleId)) {
                                var dropdownOptions = master.autosampling_typeofissue_sets[issue.type_of_issue_id].options.type_of_issue_options;
                                /*for (o in dropdownOptions) {
                                    if (issue.option_id == dropdownOptions[o].option_id && dropdownOptions[o].option_label != 'no') {
                                        dropdownOptions = null;
                                        break;
                                    }
                                }
                                if (!dropdownOptions) {
                                    continue;
                                }*/
                                if(issue.status=="IN"){
                                    continue;
                                }
                                var reportKey = null;
                                var reportKeyName = null;
                                switch (reportType) {
                                    case 'SAMPLE':
                                        reportKey = sample.sample_id;
                                        reportKeyName = sample.column_values[0];
                                        break;
                                    case 'PROCESS':
                                        reportKey = master.typeofissues[issue.type_of_issue_id].process_id;
                                        reportKeyName = master.process[reportKey].process_name;
                                        break;
                                    case 'RISK':
                                        reportKey = master.typeofissues[issue.type_of_issue_id].risk_classification;
                                        reportKeyName = master.risk_classification[reportKey].risk_clasification_name;
                                        break;
                                }
                                if (!reportKey || !reportKeyName) continue;
                                var reportEntry = reportMap[reportKey];
                                if (!reportEntry) {
                                    reportEntry = {
                                        type: reportType,
                                        id: reportKey,
                                        name: reportKeyName,
                                        sampleName: {},
                                        count: 0
                                    };
                                    reportMap[reportKey] = reportEntry;
                                }
                                reportEntry.count++;
                                reportEntry.sampleName[sample.sample_id] = sample.column_values[0];
                            }
                        }
                    }
                }
            }
            var report = [];
            _.forOwn(reportMap, function(v, k) {
                report.push(v);
            });
            return report;
        };

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
                Audit.online.getAuditData({
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
        var ddPromise = PagesDefinition.getUserAllowedDefinition({
            "title": "Audit Details",
            "iconClass": "fa fa-cube",
            "items": [
                "Page/Engine/audit.detail.GeneralObservation",
                "Page/Engine/audit.detail.PortfolioStats",
                "Page/Engine/audit.detail.JewelAppraisal",
                "Page/Engine/audit.detail.FixedAsset",
                "Page/Engine/audit.detail.FieldVerification",
                "Page/Adhoc/audit.detail.ProcessCompliance",
                "Page/Engine/audit.detail.AuditSummary"
            ]
        });
        ddPromise.then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
        });

        var allPromises = [deferred.promise, ddPromise];
        allPromises.push(
            PagesDefinition.getUserAllowedDefinition({
                "title": "Audit Details",
                "iconClass": "fa fa-cube",
                "items": [
                    "Page/Engine/audit.AuditScoreDetails"
                ]
            }).then(function(resp) {
                $scope.viewScoreMenu = _.cloneDeep(resp.$menuMap["Page/Engine/audit.AuditScoreDetails"]);
            })
        );
        if (!$stateParams.pageData.readonly) {
            allPromises.push(
                PagesDefinition.getUserAllowedDefinition({
                    "title": "Score Sheet Details",
                    "iconClass": "fa fa-cube",
                    "items": [
                        "Page/Engine/audit.detail.ScoreSheet"
                    ]
                }).then(function(resp) {
                    $scope.editScoreMenu = _.cloneDeep(resp.$menuMap["Page/Engine/audit.detail.ScoreSheet"]);
                })
            );
        }
        allPromises.push(
            PagesDefinition.getUserAllowedDefinition({
                "title": "Audit Details",
                "iconClass": "fa fa-cube",
                "items": [
                    "Page/Engine/audit.detail.AuditIssueSummary"
                ]
            }).then(function(resp) {
                $scope.issueSummaryMenu = _.cloneDeep(resp.$menuMap["Page/Engine/audit.detail.AuditIssueSummary"]);
            })
        );
        $q.all(allPromises).then(function() {
            $scope.showDashboard = true;
            // View process compliance & other when status == O || view == all
            if ($stateParams.pageData.view != 'all' && $scope.model.ai.status != 'O') {
                $scope.showDashboard = false;
                return;
            }

            var requestMenu = [
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.GeneralObservation"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.JewelAppraisal"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.PortfolioStats"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.FieldVerification"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.FixedAsset"],
                $scope.dashboardDefinition.$menuMap["Page/Adhoc/audit.detail.ProcessCompliance"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.AuditSummary"]
            ];

            // View score when status == A
            var reloadDashboardBox = false;
            if ($scope.viewScoreMenu && $scope.model.ai.status == 'A') {
                requestMenu.push($scope.viewScoreMenu);
                $scope.dashboardDefinition.items.push($scope.viewScoreMenu);
                reloadDashboardBox = true;
            }
            // edit score when status == O
            if ($scope.editScoreMenu && $scope.model.ai.status == 'O') {
                requestMenu.push($scope.editScoreMenu);
                $scope.dashboardDefinition.items.push($scope.editScoreMenu);
                reloadDashboardBox = true;
            }
            // view issue Summary when status == P, A
            if ($scope.issueSummaryMenu && ($scope.model.ai.status == 'P' || $scope.model.ai.status == 'A')) {
                requestMenu.push($scope.issueSummaryMenu);
                $scope.dashboardDefinition.items.push($scope.issueSummaryMenu);
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
                        // Edit process compliance & other when status == O, P
                        if ($stateParams.pageData.view == 'all' && $scope.model.ai.status != 'O' && $scope.model.ai.status != 'P') {
                            pageData.readonly = true;
                        }
                        pageData.type = $stateParams.pageData.type;
                        pageData.view = $stateParams.pageData.view;
                        if ($scope.$isOnline) {
                            pageData.auditData = $scope.model.auditData;
                        }
                        irfNavigator.go({
                            "state": menu.state,
                            "pageName": menu.stateParams.pageName,
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
                "condition": "actions.showAddMessage(model)",
                "required": true
            }]
        }, {
            "type": "box",
            "title": "AUDIT_REPORT",
            "condition": "model.ai.status !== 'O'",
            "items": [{
                "key": "issueGroupType",
                "type": "radios",
                "titleMap": [{
                    "name": "Process View",
                    "value": "PROCESS"
                },{
                    "name": "File View",
                    "value": "SAMPLE",
                },{
                    "name": "Risk Classification View",
                    "value": "RISK"
                }],
                onChange: function(value, form, model) {
                    $scope.model.report = reportView(value, 'draft'); // TODO: next phase dev: responsibilityType [draft|fix]
                }
            }, {
                "type": "tableview",
                "condition": "model.report",
                "key": "report",
                "tableConfig": {
                    "searching": false
                },
                getColumns: function() {
                    return [{
                        "title": "NAME",
                        "data": 'name'
                    }, {
                        "title": "NO_OF_ISSUES",
                        "data": 'count'
                    }];
                },
                getActions: function() {
                    return [{
                        "name": "VIEW_ISSUES",
                        fn: function(item, index, model) {
                            irfNavigator.go({
                                'state': 'Page.Engine',
                                'pageName': 'audit.AuditIssues',
                                'pageId': $this.auditId + ":" + item.type + ":" + item.id,
                                'pageData': {
                                    "readonly": $scope.model.readonly,
                                    "type": $scope.model.type,
                                    "report": item,
                                    "stage": $scope.model.stage
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
            "condition": "model.ai.messages.length && model.type == 'audit'",
            "title": "MESSAGE_HISTORY",
            "readonly": true,
            "items": [{
                "key": "ai.messages",
                "type": "array",
                "view": "fixed",
                "titleExpr": "actions.getStageTitle(model, arrayIndex)",
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
                "condition": "actions.showSendBack(model)",
                "title": "SEND_BACK",
                "onClick": "actions.sendBack(model)"
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
                            "title": "Message"
                        }
                    }
                }
            }
        };

        $scope.actions = {
            isVisited: function(ai) {
                if (!ai.messages || !ai.messages.length) {
                    return false;
                }
                for (i = 1; i < ai.messages.length; i++) {
                    if (ai.current_stage == ai.messages[i].type) {
                        return true;
                    }
                }
                return false;
            },
            showAddMessage: function(model) {
                if (!model.ai || model.readonly) return false;
                if (!model.ai._dirty && !model.readonly && model.type == 'audit') {
                    switch (model.ai.current_stage) {
                        case 'start':
                        case 'create':
                        case 'draft':
                        case 'draft-review':
                        case 'publish':
                        case 'L1-approve':
                            return true;
                    }
                }
                if (!model.ai._dirty && !model.readonly && model.type == 'operation') {
                    switch (model.ai.current_stage) {
                        case 'draft':
                            return true;
                    }
                }
                return false;
            },
            showProceed: function(model) {
                if (!model.ai) return false;
                if (!model.ai._dirty && model.type == 'audit') {
                    switch (model.ai.current_stage) {
                        case 'start':
                        case 'create':
                        case 'draft':
                        case 'draft-review':
                        case 'publish':
                        case 'L1-approve':
                            return true;
                    }
                }
                if (!model.ai._dirty && model.type == 'operation') {
                    switch (model.ai.current_stage) {
                        case 'draft':
                            return true;
                    }
                }
                return false;
            },
            showSendBack: function(model) {
                if (!model.ai) return false;
                if (!model.ai._dirty && model.type == 'audit') {
                    switch (model.ai.current_stage) {
                        case 'publish':
                        case 'L1-approve':
                            return !$scope.actions.isVisited(model.ai);
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
                        nextStage = ($scope.siteCode == 'kinara' && !model.ai.draft_count) ? 'draft' : 'publish';
                        break;
                    case 'draft':
                        nextStage = 'draft-review';
                        break;
                    case 'draft-review':
                        model.ai.draft_count = 1;
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
            sendBack: function(model) {
                if (!model.ai) return;
                var sendBackStage = '';
                switch (model.ai.current_stage) {
                    case 'publish':
                        sendBackStage = 'start';
                        break;
                    case 'L1-approve':
                        sendBackStage = 'publish';
                        break;
                    default:
                        return;
                }
                if (!model.ai.message) {
                    PageHelper.setError({
                        message: 'Audit send back message is required'
                    });
                    return;
                }
                $scope.actions.moveStage(model, sendBackStage);
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
                Audit.online.updateAuditData(reqData).$promise.then(function(response) {
                    Audit.online.getAuditData({
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
                    Audit.online.getAuditData({
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
            getStageTitle: function(model, arrayIndex) {
                var preStage = model.ai.messages.length - 1 == arrayIndex ? '' : model.ai.messages[arrayIndex + 1].type;
                var postStage = model.ai.messages[arrayIndex].type;
                preStage = preStage ? translateFilter(master.stages[preStage].stage_label) || preStage : '*';
                postStage = translateFilter(master.stages[postStage].stage_label) || postStage;
                return preStage == '*' ? postStage : preStage + ' ⤑ ' + postStage; // &DDotrahd;
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