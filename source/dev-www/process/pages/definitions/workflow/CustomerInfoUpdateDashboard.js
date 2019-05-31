irf.pageCollection.controller(irf.controller("workflow.CustomerInfoUpdateDashboard"),
    ["$log", "$scope", "SessionStore", "PagesDefinition", "irfSimpleModal", "$sce",
        function ($log, $scope, SessionStore, PagesDefinition, irfSimpleModal, $sce) {
            $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";

            var fullDefinition = {
                "title": "CUSTOMER_INFO_UPGRADE",
                "iconClass": "fa fa-suitcase",
                "items": [
                    "Page/Engine/workflow.CustomerInfoUpdateInit",
                    "Page/Engine/workflow.CustomerInfoUpdateApprovalQueue/Init",
                    "Page/Engine/workflow.CustomerInfoUpdateApprovalQueue/Approve"
                ]
            };
            debugger;

            PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function (resp) {
                debugger;
                $scope.dashboardDefinition = resp;
            });

        }]);