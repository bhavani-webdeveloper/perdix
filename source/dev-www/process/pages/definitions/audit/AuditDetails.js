irf.pageCollection.controller(irf.controller("audit.AuditDetails"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PagesDefinition", "PageHelper", "irfNavigator", "Audit", "formHelper", "SessionStore", "elementsUtils",
    function($log, $q, Utils, $stateParams, $scope, PagesDefinition, PageHelper, irfNavigator, Audit, formHelper, SessionStore, elementsUtils) {
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
            "readonly": $stateParams.pageData.readonly
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
</div></div></div>';

        var processAuditData = function(auditData) {
            $log.info(auditData);
            $log.info("auditData");
            $scope.model.auditData = auditData;
            $scope.model.ai = auditData.audit_info;
            $scope.model._isOnline = $scope.$isOnline;
            $scope.model.process_compliance = auditData.process_compliance;
            $log.info($scope.model.process_compliance)
        };
        var formType = {
            "type": "section",
            "htmlClass": "row",
            "colClass": "col-sm-12",
            "items": []
        }
        var fileView = function() {
                var tableColumnsConfig = [];
                for (i in $scope.model.process_compliance) {
                    var processComplianceData = $scope.model.process_compliance[i]
                    for (j in processComplianceData.auto_sampling) {
                        var sampleSet = processComplianceData.auto_sampling[j];
                        for (k in master.summary_rating) {
                            var ratingName = master.summary_rating[k].name;
                            var sampleSetId = sampleSet.scoring_sample_type_id;
                            if (_.hasIn(master.scoring_sample_sets[sampleSetId], 'scoring_sample_type')) {
                                var scoringSampleSet = master.scoring_sample_sets[sampleSetId].scoring_sample_type
                            }

                        }
                        // break;
                    }
                }
                tableColumnsConfig.push({
                    "title": "RATING",
                    "data": 'ratingName'
                }, {
                    "title": "SAMPLES",
                    "data": 'scoringSampleSet',

                });
                var columnForm = {
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
                return columnForm;
            }
            // return $scope.model.type;

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
            if ($scope.siteCode == 'kinara' && $scope.model.ai.status == 'O' || $scope.siteCode != 'kinara') {
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
                type: "string",
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
                key: "ai.message",
                type: "textarea",
                "condition": "(model.ai.current_stage == 'start' || model.ai.current_stage == 'create' || model.ai.current_stage == 'publish' || model.ai.current_stage == 'L1-approve') && !model.readonly"
            }]
        }, {
            "type": "box",
            "title": "AUDIT_REPORT",
            // "condition": "!model.ai.status == 'O'",
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
                    switch (value) {
                        case "SAMPLE":
                            var groupForm = fileView();
                            formType.items[0] = groupForm;
                            break;
                        case "PROCESS":
                            var groupForm = processView();
                            formType.items[0] = groupForm;
                            break;
                        case "RISK":
                            var groupForm = riskView();
                            formType.items[0] = groupForm;
                            break;
                    }
                }
            }, formType]

        }, {
            "type": "box",
            "condition": "model.ai.messages.length",
            "title": "MESSAGE_HISTORY",
            "readonly": true,
            "items": [{
                "key": "ai.messages",
                "type": "array",
                "view": "fixed",
                "items": [{
                    "type": "section",
                    "htmlClass": "",
                    "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.ai.messages[arrayIndex].created_by}}\
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
                "condition": "model.ai._dirty",
                "title": "UPLOAD",
                "icon": "fa fa-upload",
                "onClick": "actions.uploadAuditData(model)"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && (model.ai.current_stage == 'start' || model.ai.current_stage == 'create')",
                "title": "PUBLISH",
                "onClick": "actions.moveStage(model)"
            }, {
                "type": "button",
                "condition": "model.ai.status == 'O' && model.ai.draft_count > 0",
                "title": "DRAFT",
                "onClick": "actions.moveStage(model)"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'publish'",
                "title": "APPROVE",
                "onClick": "actions.moveStage(model)"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'publish'",
                "title": "REJECT",
                "onClick": "actions.moveStage(model, true)"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'L1-approve'",
                "title": "APPROVE",
                "onClick": "actions.moveStage(model)"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'L1-approve'",
                "title": "REJECT",
                "onClick": "actions.moveStage(model, true)"
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
                        "message": {
                            "type": "string",
                            "title": "MESSAGE"
                        }
                    }
                }
            }
        };

        $scope.actions = {
            moveStage: function(model, sendBack) {
                var nextStage = '';
                if (sendBack) {
                    switch (model.ai.current_stage) {
                        case 'publish':
                            nextStage = 'start';
                            break;
                        case 'L1-approve':
                            nextStage = 'publish';
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
                } else {
                    switch (model.ai.current_stage) {
                        case 'start':
                        case 'create':
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
                }
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
                        response.audit_info._offline = true;
                        response.audit_info._dirty = false;
                        Audit.offline.setAudit($this.auditId, response);
                        PageHelper.showProgress("audit", "Synchronized successfully", 3000);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                });
            }
        };
    }
]);