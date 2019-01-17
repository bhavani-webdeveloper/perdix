irf.pageCollection.controller(irf.controller("audit.detail.ProcessCompliance"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PageHelper", "irfNavigator", "Audit", "filterFilter","SessionStore",
    function($log, $q, Utils, $stateParams, $scope, PageHelper, irfNavigator, Audit, filterFilter, SessionStore) {
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
        var $this = this;
        $scope.fullDefinition = [];
        $this.auditId = $stateParams.pageId;
        $scope.pageName = $stateParams.pageName;
        $scope.model = {};
        var master = Audit.offline.getAuditMaster();
        var processAuditData = function(process_compliance) {
            if (!$scope.$isOffline && $stateParams.pageData.auditData) {
                pageData.auditData = $stateParams.pageData.auditData;
            }
            var dashboardBox = {};
            var addSampleSet = function(scoringSampleSet, sampleSetId) {
                var module = master.process_tabs[scoringSampleSet.scoring_process_type_id];
                var menuDefinition = {
                    "title": scoringSampleSet.scoring_sample_type,
                    "state": "Page.Engine",
                    "stateParams": {
                        "pageName": "audit.detail.processcompliance.SampleSet",
                        "pageId": $stateParams.pageId + ":" + sampleSetId,
                        "pageData": pageData
                    }
                };
                if (!$scope.$isOffline) {
                    menuDefinition.stateParams.pageData.auditData = $stateParams.pageData.auditData;
                }
                dashboardBox[scoringSampleSet.scoring_process_type_id] = dashboardBox[scoringSampleSet.scoring_process_type_id] || [];
                dashboardBox[scoringSampleSet.scoring_process_type_id].push(menuDefinition);
            };
            if (pageData.readonly) {
                var auto_sampling = process_compliance.auto_sampling;
                for (i in auto_sampling) {
                    var sampleSet = auto_sampling[i];
                    var sampleSetId = sampleSet.scoring_sample_type_id;
                    var scoringSampleSet = master.scoring_sample_sets[sampleSetId];
                    addSampleSet(scoringSampleSet, sampleSetId);
                }
            } else {
                _.forOwn(master.scoring_sample_sets, function(scoringSampleSet, sampleSetId) {
                    if (scoringSampleSet.status == "1") {
                        addSampleSet(scoringSampleSet, sampleSetId);
                    }
                });
            }
            $scope.dashboardDefinitions = [];
            _.forOwn(dashboardBox, function(v, k) {
                $scope.dashboardDefinitions.push({
                    "title": master.process_tabs[k].scoring_process_type,
                    "items": v
                });
            });
            $scope.dashboardDefinitions.push({
                "title": "Non Sampling",
                "items": [{
                    "title": "ISSUES",
                    "state": "Page.Engine",
                    "stateParams": {
                        "pageName": "audit.detail.processcompliance.NonSamplingIssues",
                        "pageId": $this.auditId,
                        "pageData": pageData
                    }
                }]
            });
        };
        if ($stateParams.pageData) {
            $scope.$readonly = $stateParams.pageData.readonly;
        }
        $scope.$isOffline = false;
        if ($stateParams.pageData.auditData && $stateParams.pageData.auditData.process_compliance) {
            processAuditData($stateParams.pageData.auditData.process_compliance);
        } else {
            PageHelper.showLoader();
            Audit.offline.getProcessCompliance($stateParams.pageId).then(function(process_compliance) {
                $scope.$isOffline = true;
                processAuditData(process_compliance);
            }, function(errRes) {
                PageHelper.showErrors(errRes);
            }).finally(function() {
                PageHelper.hideLoader();
            })
        }

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
                if ($stateParams.pageData) {
                    $scope.$readonly = $stateParams.pageData.readonly;
                }
        
                $scope.formName = irf.form($scope.pageName);
                $scope.initialize = function(model, form, formCtrl) {
                    model.siteCode = SessionStore.getGlobalSetting('siteCode');
                };
                $scope.form = [ {
                    "type": "section",
                    "condition": "model.siteCode == 'KGFS'",
                    "html": configurableActionBoxHtml,
                    "items": [{
                        "type": "button",
                        "condition": "!model._isOnline",
                        "title": "Downloand Samples",
                        "icon": "fa fa-download",
                        "fieldHtmlClass": "pull-right",
                        "style": "btn-default",
                        "onClick": "actions.downloadSample(model)"
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
                            }
                        }
                    }
                };
        
                $scope.actions = {
                    downloadSample: function(model, sendBack) { 
                        var biDownloadUrl = irf.BI_BASE_URL+'/kgfs_sample_report.php?audit_id='+$this.auditId;
                                            $log.info(biDownloadUrl);
                                            window.open(biDownloadUrl);

                    }
                };

    }
]);