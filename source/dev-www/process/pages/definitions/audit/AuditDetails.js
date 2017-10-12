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
        $scope.pageName = $stateParams.pageName;
        $scope.model = {
            "readonly": $stateParams.pageData.readonly
        };
        $scope.formHelper = formHelper;

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
            $scope.model.auditData = auditData;
            $scope.model.ai = auditData.audit_info;
            $scope.model._isOnline = $scope.$isOnline;
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
                Audit.online.getAuditFull({
                    audit_id: $this.auditId
                }).$promise.then(function(_auditData) {
                    $scope.$isOnline = true;
                    if ($scope.model.readonly === false) {
                        Audit.offline.setAudit($this.auditId, _auditData).then(function() {
                            $scope.$isOnline = false;
                            processAuditData(_auditData);
                        }, function(errRes) {
                            PageHelper.showErrors(errRes);
                            $log.info("=====FALLBACK TO ONLINE=====");
                            Utils.confirm("You may not be able to edit Audit. Do you want to continue?").then(function() {
                                processAuditData(_auditData);
                            }, function() {
                                irfNavigator.goBack();
                            });
                        });
                    } else {
                        processAuditData(_auditData);
                    }
                    deferred.resolve();
                }, function(errorResponse) {
                    PageHelper.showErrors(errorResponse);
                    deferred.reject();
                }).finally(PageHelper.hideLoader);
            }
        });

        var pdp = PagesDefinition.getUserAllowedDefinition({
            "title": "Audit Details",
            "iconClass": "fa fa-cube",
            "items": [
                "Page/Engine/audit.detail.GeneralObservation",
                "Page/Engine/audit.detail.PortfolioStats",
                "Page/Engine/audit.detail.JewelAppraisal",
                "Page/Engine/audit.detail.FieldVerification",
                "Page/Adhoc/audit.detail.ProcessCompliance",
                "Page/Engine/audit.detail.AuditSummary",
                "Page/Engine/audit.detail.FixedAsset"
            ]
        });

        var scoreMenuPromise = null;
        if ($stateParams.pageData.readonly) {
            scoreMenuPromise = PagesDefinition.getUserAllowedDefinition({
                "title": "Audit Details",
                "iconClass": "fa fa-cube",
                "items": [
                    "Page/Engine/audit.AuditScoreDetails"
                ]
            }).then(function(resp) {
                $scope.dashboardDefinition_Score = _.cloneDeep(resp.$menuMap["Page/Engine/audit.AuditScoreDetails"]);
                $scope.dashboardDefinition_Score.onClick = function(event, menu) {
                    var pageData = {};
                    pageData.readonly = $stateParams.pageData.readonly;
                    if (!pageData.auditScoresheet) {
                        Audit.online.getAuditScores({
                            "audit_id": $this.auditId
                        }).$promise.then(function(response) {
                            if (response.body && response.body.length == 1) {
                                pageData.auditScoresheet = response.body[0];
                                irfNavigator.go({
                                    "state": "Page.Engine",
                                    "pageName": "audit.AuditScoreDetails",
                                    "pageId": $this.auditId,
                                    "pageData": pageData
                                }, {
                                    "state": "Page.Adhoc",
                                    "pageName": "audit.AuditDetails",
                                    "pageId": $this.auditId,
                                    "pageData": $scope.model.auditData
                                });
                            } else {
                                var prefix = null;
                                if (response.body && response.body.length === 0) {
                                    prefix = "No";
                                } else {
                                    prefix = "More than one score";
                                }
                                PageHelper.setError({
                                    message: prefix + " sheets received for audit id: " + $this.auditId
                                });
                            }
                        }, PageHelper.showErrors);
                    } else {
                        irfNavigator.go({
                            "state": "Page.Engine",
                            "pageName": "audit.AuditScoreDetails",
                            "pageId": $this.auditId,
                            "pageData": pageData
                        }, {
                            "state": "Page.Adhoc",
                            "pageName": "audit.AuditDetails",
                            "pageId": $this.auditId,
                            "pageData": $scope.model.auditData
                        });
                    }
                    return false;
                };
            });
        } else {
            scoreMenuPromise = PagesDefinition.getUserAllowedDefinition({
                "title": "Score Sheet Details",
                "iconClass": "fa fa-cube",
                "items": [
                    "Page/Engine/audit.detail.ScoreSheet"
                ]
            }).then(function(resp) {
                $scope.dashboardDefinition_Score = _.cloneDeep(resp.$menuMap["Page/Engine/audit.detail.ScoreSheet"]);
            });
        }
        pdp.then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
        });
        $q.all([deferred.promise, pdp, scoreMenuPromise]).then(function() {
            $scope.dashboardDefinition.items.push($scope.dashboardDefinition_Score);
            elementsUtils.reloadDashboardBox && elementsUtils.reloadDashboardBox();
            var requestMenu = [
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.AuditInfo"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.GeneralObservation"],
                $scope.dashboardDefinition.$menuMap["Page/Adhoc/audit.detail.ProcessCompliance"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.AuditSummary"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.ScoreSheet"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.JewelAppraisal"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.PortfolioStats"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.FieldVerification"],
                $scope.dashboardDefinition.$menuMap["Page/Engine/audit.detail.FixedAsset"],
            ];
            if ($scope.dashboardDefinition_Score.uri === "Page/Engine/audit.detail.ScoreSheet") {
                requestMenu.push($scope.dashboardDefinition_Score);
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
                "condition": "(model.ai.current_stage == 'publish' || model.ai.current_stage == 'L1-approve') && !model.readonly"
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
                "condition": "!model.ai._dirty && model.ai.current_stage == 'start'",
                "title": "PUBLISH",
                "onClick": "actions.moveStage(model, 'publish')"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'publish'",
                "title": "APPROVE",
                "onClick": "actions.moveStage(model, 'L1-approve')"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'publish'",
                "title": "REJECT",
                "onClick": "actions.moveStage(model, 'reject')"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'L1-approve'",
                "title": "APPROVE",
                "onClick": "actions.moveStage(model, 'approve')"
            }, {
                "type": "button",
                "condition": "!model.ai._dirty && model.ai.current_stage == 'L1-approve'",
                "title": "REJECT",
                "onClick": "actions.moveStage(model, 'reject')"
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