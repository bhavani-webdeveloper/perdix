irf.pageCollection.controller(irf.controller("audit.detail.ProcessCompliance"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PageHelper", "irfNavigator", "Audit",
    function($log, $q, Utils, $stateParams, $scope, PageHelper, irfNavigator, Audit) {
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

    }
]);