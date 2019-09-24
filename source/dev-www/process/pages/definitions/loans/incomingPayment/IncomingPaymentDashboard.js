irf.pageCollection.controller(irf.controller("loans.IncomingPaymentDashboard"),
    ["$log", "$scope", "SessionStore", "PagesDefinition", "irfSimpleModal", "$sce",
        function ($log, $scope, SessionStore, PagesDefinition, irfSimpleModal, $sce) {
            $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";

            var fullDefinition = {
                "title": "INCOMING_PAYMENTS_DASHBORAD",
                "iconClass": "fa fa-suitcase",
                "items": [
                    "Page/Engine/loans.incomingPayment.IncomingPaymentQueue"
                ]
            };

            PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function (resp) {
                $scope.dashboardDefinition = resp;
            });

        }]);
