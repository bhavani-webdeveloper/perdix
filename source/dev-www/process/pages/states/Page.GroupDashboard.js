irf.pages.controller("PageGroupDashboardCtrl",
['$log', '$scope', 'PageHelper', '$stateParams', 'GroupProcess', 'Groups',
    'irfStorageService', 'SessionStore', 'PagesDefinition',
function($log, $scope, PageHelper, $stateParams, GroupProcess, Groups,
    irfStorageService, SessionStore, PagesDefinition) {
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
        var userPartner = SessionStore.session.partnerCode;
        var branch = SessionStore.getCurrentBranch();
        var branchId = "" + SessionStore.getBranchId();
        var centres = SessionStore.getCentres();
        var centreId = [];
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

        if (dscMenu) {
            dscMenu.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "DSC"
            }, function(response) {
                dscMenu.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (cgtone) {
            cgtone.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "CGT1",
            }, function(response) {
                cgtone.data = Number(response.headers['x-total-count']) || 0;
            });
        }


        if (cgttwo) {
            cgttwo.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "CGT2"
            }, function(response) {
                cgttwo.data = Number(response.headers['x-total-count']) || 0;
            });
        }


        if (cgtthree) {
            cgtthree.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "CGT3"
            }, function(response) {
                cgtthree.data = Number(response.headers['x-total-count']) || 0;
            });
        }


        if (grt) {
            grt.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "GRT"
            }, function(response) {
                grt.data = Number(response.headers['x-total-count']) || 0;
            });
        }


        if (application) {
            application.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "ApplicationPending"
            }, function(response) {
                application.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (checker1) {
            checker1.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "Checker1"
            }, function(response) {
                checker1.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (checker2) {
            checker2.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "Checker2"
            }, function(response) {
                checker2.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (agmtUpldPendingq) {
            agmtUpldPendingq.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "AgreementUploadPending"
            }, function(response) {
                agmtUpldPendingq.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (checker3) {
            checker3.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "Checker3"
            }, function(response) {
                checker3.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (checker4) {
            checker4.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "Checker4"
            }, function(response) {
                checker4.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (disbursement) {
            disbursement.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'partner': userPartner,
                'currentStage': "LoanDisbursement"
            }, function(response) {
                disbursement.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (close) {
            close.data = '-';
            GroupProcess.search({
                'branchId': branchId,
                'groupStatus': false,
                'partner': userPartner
            }, function(response) {
                close.data = Number(response.headers['x-total-count']) || 0;
            });
        }

        if (dscoverrideMenu) {
            dscoverrideMenu.data = '-';
            Groups.getDscOverrideList({
                'page': 1,
                'per_page': 100
            }, function(response) {
                dscoverrideMenu.data = Number(response.headers['x-total-count']) || 0;
            });
        }
    });
}]);