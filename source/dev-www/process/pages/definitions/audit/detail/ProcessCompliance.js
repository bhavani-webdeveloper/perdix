irf.pageCollection.controller(irf.controller("audit.detail.ProcessCompliance"), ["$log", "$q", "Utils", "$stateParams", "$scope", "PageHelper", "irfNavigator", "Audit", "filterFilter",
    function($log, $q, Utils, $stateParams, $scope, PageHelper, irfNavigator, Audit, filterFilter) {
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
            var addSampleSet = function(scoringSampleSet, sampleSetId, count) {
                // var module = master.process_tabs[scoringSampleSet.scoring_process_type_id];
                var menuDefinition = {
                    "title": scoringSampleSet.scoring_sample_type,
                    "data": count,
                    onClick: function(event, menu) {
                        irfNavigator.go({
                            "title": scoringSampleSet.scoring_sample_type,
                            "state": "Page.Engine",
                            "pageName": "audit.detail.processcompliance.SampleSet",
                            "pageId": $stateParams.pageId + ":" + sampleSetId,
                            "pageData": pageData
                        });
                        return false;
                    }
                };
                if (!$scope.$isOffline) {
                    menuDefinition.stateParams.pageData.auditData = $stateParams.pageData.auditData;
                }
                dashboardBox[scoringSampleSet.scoring_process_type_id] = dashboardBox[scoringSampleSet.scoring_process_type_id] || [];
                dashboardBox[scoringSampleSet.scoring_process_type_id].push(menuDefinition);
            };
            var auto_sampling = process_compliance.auto_sampling;
            if (pageData.readonly) {
                for (i in auto_sampling) {
                    var sampleSet = auto_sampling[i];
                    var sampleSetId = sampleSet.scoring_sample_type_id;
                    var scoringSampleSet = master.scoring_sample_sets[sampleSetId];
                    var count = (sampleSet.sample_set && sampleSet.sample_set.length)? sampleSet.sample_set.length: 0;
                    addSampleSet(scoringSampleSet, sampleSetId, count);
                }
            } else {
                _.forOwn(master.scoring_sample_sets, function(scoringSampleSet, sampleSetId) {
                    if (scoringSampleSet.status == "1") {
                        var sampleSets = filterFilter(auto_sampling, {"scoring_sample_type_id": Number(sampleSetId)}, true);
                        var count = "-";
                        if (sampleSets && sampleSets.length == 1) {
                            count = (sampleSets[0].sample_set && sampleSets[0].sample_set.length)? sampleSets[0].sample_set.length: 0;
                        }
                        addSampleSet(scoringSampleSet, sampleSetId, count);
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
                    "data": (process_compliance.manual_sampling && process_compliance.manual_sampling.length)? process_compliance.manual_sampling.length: 0,
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