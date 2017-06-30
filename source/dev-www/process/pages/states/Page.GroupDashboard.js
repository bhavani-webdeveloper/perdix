irf.pages.controller("PageGroupDashboardCtrl", ['$log', '$scope', 'PageHelper', '$stateParams', 'Groups',
    'irfStorageService', 'SessionStore', 'PagesDefinition',
    function($log, $scope, PageHelper, $stateParams, Groups,
        irfStorageService, SessionStore, PagesDefinition) {
        $log.info("Page.GroupDashboard.html loaded");
        PageHelper.clearErrors();

        var fullDefinition = {
            "title": "Actions",
            "items": [
                "Page/Engine/loans.group.CreateGroup",
                "Page/Engine/loans.group.DscQueue",
                "Page/Engine/loans.group.DscOverrideQueue",
                "Page/Engine/loans.group.Cgt1Queue",
                "Page/Engine/loans.group.Cgt2Queue",
                "Page/Engine/loans.group.Cgt3Queue",
                "Page/Engine/loans.group.GrtQueue",
                "Page/Engine/loans.group.ApplicationPendingQueue",
                "Page/Engine/loans.group.Checker1Queue",
                "Page/Engine/loans.group.Checker2Queue",
                "Page/Engine/loans.group.AgreementUploadPendingQueue",
                "Page/Engine/loans.group.Checker3Queue",
                "Page/Engine/loans.group.Checker4Queue",
                "Page/Engine/loans.group.JLGDisbursementQueue",
                "Page/Engine/loans.group.CloseGroup",
                "Page/Engine/loans.group.GroupLoanRepaymentQueue"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = _.cloneDeep(resp);
            var partners = irfStorageService.getMaster('partner');
            var branch = SessionStore.getCurrentBranch();
            var branchId = "" + SessionStore.getBranchId();
            var centres = SessionStore.getCentres();
            var centreId = [];

            $log.info(partners);
            $log.info(partners.data[0].name);

            if (centres && centres.length) {
                for (var i = 0; i < centres.length; i++) {
                    centreId.push(centres[i].centreId);
                }
            }

            var dscMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.DscQueue"];
            var cgtone = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.Cgt1Queue"];
            var cgttwo = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.Cgt2Queue"];
            var cgtthree = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.Cgt3Queue"];
            var grt = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.GrtQueue"];
            var application = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.ApplicationPendingQueue"];
            var checker1 = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.Checker1Queue"];
            var checker2 = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.Checker2Queue"];
            var checker3 = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.Checker3Queue"];
            var checker4 = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.Checker4Queue"];
            var agmtUpldPendingq = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.AgreementUploadPendingQueue"];
            var application = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.ApplicationPendingQueue"];
            var disbursement = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.JLGDisbursementQueue"];
            var close = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.CloseGroup"];
            var dscoverrideMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.group.DscOverrideQueue"];

            _.forEach(partners.data, function(partners) {


                if (dscMenu) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "DSC",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(dscMenu.data)) {
                            dscMenu.data = 0;
                        }
                        dscMenu.data = dscMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        dscMenu.data = '-';
                    });
                }


                if (cgtone) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "CGT1",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(cgtone.data)) {
                            cgtone.data = 0;
                        }
                        cgtone.data = cgtone.data + Number(response.headers['x-total-count']);
                    }, function() {
                        cgtone.data = '-';
                    });
                }


                if (cgttwo) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "CGT2",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(cgttwo.data)) {
                            cgttwo.data = 0;
                        }
                        cgttwo.data = cgttwo.data + Number(response.headers['x-total-count']);
                    }, function() {
                        cgttwo.data = '-';
                    });
                }


                if (cgtthree) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "CGT3",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(cgtthree.data)) {
                            cgtthree.data = 0;
                        }
                        cgtthree.data = cgtthree.data + Number(response.headers['x-total-count']);
                    }, function() {
                        cgtthree.data = '-';
                    });
                }


                if (grt) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "GRT",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(grt.data)) {
                            grt.data = 0;
                        }
                        grt.data = grt.data + Number(response.headers['x-total-count']);
                    }, function() {
                        grt.data = '-';
                    });
                }


                if (application) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "ApplicationPending",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(application.data)) {
                            application.data = 0;
                        }
                        application.data = application.data + Number(response.headers['x-total-count']);
                    }, function() {
                        application.data = '-';
                    });
                }

                if (checker1) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "Checker1",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(checker1.data)) {
                            checker1.data = 0;
                        }
                        checker1.data = checker1.data + Number(response.headers['x-total-count']);
                    }, function() {
                        checker1.data = '-';
                    });
                }

                if (checker2) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "Checker2",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(checker2.data)) {
                            checker2.data = 0;
                        }
                        checker2.data = checker2.data + Number(response.headers['x-total-count']);
                    }, function() {
                        checker2.data = '-';
                    });
                }

                if (agmtUpldPendingq) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "AgreementUploadPending",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(agmtUpldPendingq.data)) {
                            agmtUpldPendingq.data = 0;
                        }
                        agmtUpldPendingq.data = agmtUpldPendingq.data + Number(response.headers['x-total-count']);
                    }, function() {
                        agmtUpldPendingq.data = '-';
                    });
                }

                if (checker3) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "Checker3",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(checker3.data)) {
                            checker3.data = 0;
                        }
                        checker3.data = checker3.data + Number(response.headers['x-total-count']);
                    }, function() {
                        checker3.data = '-';
                    });
                }

                if (checker4) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "Checker4",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(checker4.data)) {
                            checker4.data = 0;
                        }
                        checker4.data = checker4.data + Number(response.headers['x-total-count']);
                    }, function() {
                        checker4.data = '-';
                    });
                }

                if (disbursement) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'currentStage': "LoanDisbursement",
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(disbursement.data)) {
                            disbursement.data = 0;
                        }
                        disbursement.data = disbursement.data + Number(response.headers['x-total-count']);
                    }, function() {
                        disbursement.data = '-';
                    });
                }

                if (close) {
                    Groups.search({
                        'branchId': branchId,
                        'partner': partners.name,
                        //'groupStatus': true,
                        'page': 1,
                        'per_page': 1
                    }).$promise.then(function(response, headerGetter) {
                        if (!_.isNumber(close.data)) {
                            close.data = 0;
                        }
                        close.data = close.data + Number(response.headers['x-total-count']);
                    }, function() {
                        close.data = '-';
                    });
                }
            })

            if (dscoverrideMenu) {
                Groups.getDscOverrideList({
                    'page': 1,
                    'per_page': 1
                }).$promise.then(function(response, headerGetter) {
                    dscoverrideMenu.data = response.headers['x-total-count'];
                }, function() {
                    dscoverrideMenu.data = '-';
                });
            }
        });
    }
]);