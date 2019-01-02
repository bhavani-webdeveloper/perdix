irf.pageCollection.controller(irf.controller("workflow.CustomerApproval"),
    ["$log", "$scope", "SessionStore", "PagesDefinition", "irfSimpleModal", "$sce",
        function ($log, $scope, SessionStore, PagesDefinition, irfSimpleModal, $sce) {
            $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";

            var fullDefinition = {
                "title": "CUSTOMER_INFO_UPDATE",
                "iconClass": "fa fa-suitcase",
                "items": [
                    "Page/Engine/workflow.CustomerApprovalInit",
                    "Page/Engine/workflow.CustomerApprovalQueue/Init",
                    "Page/Engine/workflow.CustomerApprovalQueue/Approve"
                ]
            };

            PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function (resp) {
                $scope.dashboardDefinition = resp;
            });

        }]);
