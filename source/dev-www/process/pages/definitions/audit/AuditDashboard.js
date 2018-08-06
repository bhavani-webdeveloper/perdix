irf.pageCollection.controller(irf.controller("audit.AuditDashboard"), ["$log", "formHelper", "$q", "$stateParams", "$scope", "PagesDefinition", "SessionStore", "PageHelper", "Audit",
    function($log, formHelper, $q, $stateParams, $scope, PagesDefinition, SessionStore, PageHelper, Audit) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";

        if (!irf.appConfig.AMS_ENABLED) {
            PageHelper.setError({
                message: "Audit Feature is disabled"
            });
            return;
        }

        var role_id = SessionStore.getUserRole().id;

        PagesDefinition.getUserAllowedDefinition({
            "title": "AUDIT_DASHBOARD",
            "items": [
                "Page/Engine/audit.CreateAudit",
                "Page/Engine/audit.ScheduleAudit",
                "Page/Engine/audit.ScheduledAuditsQueue",
                "Page/Engine/audit.ScheduledAuditsViewQueue",
                "Page/Engine/audit.DeferredAuditsQueue",
                "Page/Engine/audit.OpenRegularAuditsQueue",
                "Page/Engine/audit.DraftOperationQueue",
                "Page/Engine/audit.DraftAuditQueue",
                "Page/Engine/audit.OpenSnapAuditsQueue",
                "Page/Engine/audit.PublishedAuditsViewQueue",
                "Page/Engine/audit.PublishedAuditsQueue",
                "Page/Engine/audit.ReviewedAuditsQueue",
                "Page/Engine/audit.ReviewedAuditsViewQueue",
                "Page/Engine/audit.ApprovedAuditsQueue",
                "Page/Engine/audit.ApprovedAuditsViewQueue",
                "Page/Engine/audit.RejectedAuditsQueue",
                "Page/Engine/audit.AuditDumpsQueue",
                "Page/Engine/audit.AuditScoresQueue",
                "Page/Engine/audit.AuditsViewQueue",
                "Page/Engine/audit.AssignedIssuesQueue",
                "Page/Engine/audit.AssignedIssuesViewQueue",
                "Page/Engine/audit.OutstandingIssuesQueue",
                "Page/Engine/audit.OutstandingIssuesViewQueue",
                "Page/Engine/audit.ConfirmedIssuesQueue",
                "Page/Engine/audit.UnconfirmedIssuesQueue"
            ]
        }).then(function(resp) {
            $scope.dashboardDefinition = resp;
            if (!SessionStore.session.offline) {
                var auditor_id = SessionStore.getLoginname();
                var bankName = SessionStore.getBankName();
                var banks = formHelper.enum('bank').data;
                for (var i = 0; i < banks.length; i++) {
                    if (banks[i].name == bankName) {
                        var bankId = banks[i].value;
                        var bankName = banks[i].name;
                    }
                }

                var saqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.ScheduledAuditsQueue"];
                var savqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.ScheduledAuditsViewQueue"];
                var daq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.DeferredAuditsQueue"];
                var oraq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.OpenRegularAuditsQueue"];
                var doaq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.DraftOperationQueue"];
                var daaq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.DraftAuditQueue"];
                var osaq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.OpenSnapAuditsQueue"];
                var pavq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.PublishedAuditsViewQueue"];
                var paq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.PublishedAuditsQueue"];
                var raq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.ReviewedAuditsQueue"];
                var ravq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.ReviewedAuditsViewQueue"];
                var aaq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.ApprovedAuditsQueue"];
                var aavq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.ApprovedAuditsViewQueue"];
                var reaq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.RejectedAuditsQueue"];
                var adq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.AuditDumpsQueue"];
                var asq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.AuditScoresQueue"];
                var avq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.AuditsViewQueue"];
                var aiq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.AssignedIssuesQueue"];
                var aivq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.AssignedIssuesViewQueue"];
                var oiq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.OutstandingIssuesQueue"];
                var oivq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.OutstandingIssuesViewQueue"];
                var ciq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.ConfirmedIssuesQueue"];
                var uciq = $scope.dashboardDefinition.$menuMap["Page/Engine/audit.UnconfirmedIssuesQueue"];

                if (saqMenu) saqMenu.data = '-';
                if (savqMenu) savqMenu.data = '-';
                if (daq) daq.data = '-';
                if (oraq) oraq.data = '-';
                if (oraq) oraq.data = '-';
                if (doaq) doaq.data = '-';
                if (daaq) daaq.data = '-';
                if (pavq) pavq.data = '-';
                if (paq) paq.data = '-';
                if (raq) raq.data = '-';
                if (ravq) ravq.data = '-';
                if (aaq) aaq.data = '-';
                if (aavq) aavq.data = '-';
                if (raq) raq.data = '-';
                if (adq) adq.data = '-';
                if (asq) asq.data = '-';
                if (avq) avq.data = '-';
                if (aiq) aiq.data = '-';
                if (aivq) aivq.data = '-';
                if (oiq) oiq.data = '-';
                if (oivq) oivq.data = '-';
                if (ciq) ciq.data = '-';
                if (uciq) uciq.data = '-';

                if (saqMenu) {
                    $q.all([
                        Audit.online.findAuditInfo({
                            'auditor_id': auditor_id,
                            'current_stage': 'scheduled',
                        }).$promise
                    ]).then(function(data) {
                        saqMenu.data = data[0].body.length;
                    });
                }

                if (savqMenu) {
                    $q.all([
                        Audit.online.findAuditInfo({
                            'current_stage': 'scheduled'
                        }).$promise
                    ]).then(function(data) {
                        savqMenu.data = data[0].body.length;
                    });
                }

                if (daq) {
                    $q.all([
                        Audit.online.findAuditInfo({
                            'current_stage': 'postpone'
                        }).$promise,
                        Audit.online.findAuditInfo({
                            'current_stage': 'cancel'
                        }).$promise
                    ]).then(function(data) {
                        daq.data = data[0].body.length + data[1].body.length;
                    });
                }
                if (oraq) {
                    Audit.online.findAuditInfo({
                        'auditor_id': auditor_id,
                        'status': 'O',
                        'audit_type': 1
                    }).$promise.then(function(data) {
                        oraq.data = data.body.length;
                    });
                }
                if (osaq) {
                    Audit.online.findAuditInfo({
                        'auditor_id': auditor_id,
                        'audit_type': 0,
                        'status': 'O'
                    }).$promise.then(function(data) {
                        osaq.data = data.body.length;
                    });
                }

                if (doaq) {
                    Audit.online.findAuditInfo({
                        'current_stage': 'draft',
                        'status': 'D',
                        'bankId': bankId
                    }).$promise.then(function(data) {
                        doaq.data = data.body.length;
                    });
                }

                if (daaq) {
                    Audit.online.findAuditInfo({
                        'auditor_id': auditor_id,
                        'current_stage': 'draft-review',
                        'bankId': bankId,
                        'status': 'D'
                    }).$promise.then(function(data) {
                        daaq.data = data.body.length;
                    });
                }

                if (pavq || paq) {
                    Audit.online.findAuditInfo({
                        'current_stage': 'publish',
                        'bankId': bankId
                    }).$promise.then(function(data) {
                        if (pavq) {
                            pavq.data = data.body.length;
                        }
                        if (paq) {
                            paq.data = data.body.length;
                        }
                    });
                }

                if (raq || ravq) {
                    Audit.online.findAuditInfo({
                        'current_stage': 'L1-approve',
                        'bankId': bankId
                    }).$promise.then(function(data) {
                        if (raq) {
                            raq.data = data.body.length;
                        }
                        if (ravq) {
                            ravq.data = data.body.length;
                        }
                    });
                }

                if (aaq || aavq) {
                    Audit.online.findAuditInfo({
                        'current_stage': 'approve',
                        'bankId': bankId
                    }).$promise.then(function(data) {
                        if (aaq) {
                            aaq.data = data.body.length;
                        }
                        if (aavq) {
                            aavq.data = data.body.length;
                        }
                    });
                }

                if (reaq) {
                    Audit.online.findAuditInfo({
                        'current_stage': 'reject'
                    }).$promise.then(function(data) {
                        reaq.data = data.body.length;
                    });
                }

                if (adq) {
                    Audit.online.findAuditInfo({}).$promise.then(function(data) {
                        adq.data = data.body.length;
                    });
                }

                if (asq) {
                    Audit.online.findAuditScores({
                        'page': 1,
                        'per_page': 100
                    }).$promise.then(function(data) {
                        asq.data = data.body.length;
                    });
                }

                if (avq) {
                    Audit.online.findAuditInfo({
                        'bankId': bankId
                    }).$promise.then(function(data) {
                        avq.data = data.body.length;
                    });
                }

                if (aiq) {
                    Audit.online.findIssues({
                        'current_stage': "assign",
                        "assignee_designation_id": role_id
                    }).$promise.then(function(data) {
                        aiq.data = Number(data.headers['x-total-count']) || data.body.length;
                    });
                }

                if (aivq) {
                    Audit.online.findIssues({
                        'current_stage': "assign"
                    }).$promise.then(function(data) {
                        aivq.data = Number(data.headers['x-total-count']) || data.body.length;
                    });
                }

                if (oiq || oivq) {
                    Audit.online.findIssues({
                        'current_stage': 'close',
                    }).$promise.then(function(data) {
                        if (oiq) {
                            oiq.data = Number(data.headers['x-total-count']) || data.body.length;
                        }
                        if (oivq) {
                            oivq.data = Number(data.headers['x-total-count']) || data.body.length;
                        }
                    });
                }

                if (ciq) {
                    Audit.online.findIssues({
                        'current_stage': "confirm",
                    }).$promise.then(function(data) {
                        ciq.data = Number(data.headers['x-total-count']) || data.body.length;
                    });
                }

                if (uciq) {
                    Audit.online.findIssues({
                        'current_stage': "unconfirm",
                    }).$promise.then(function(data) {
                        uciq.data = Number(data.headers['x-total-count']) || data.body.length;
                    });
                }
            }
        });
    }
]);