irf.pageCollection.controller(irf.controller("payment.PaymentDashboardCtrl"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore',"Payment",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, Payment) {
        $log.info("Page.PaymentDashboard.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var fullDefinition = {
            "title": "PAYMENT_DASHBOARD",
            "iconClass": "fa fa-inr",
            "items": [
                "Page/Engine/payment.PaymentInitiation",
                "Page/Engine/payment.paymentInitiationSearch",
                "Page/Engine/payment.PaymentApprovalSearch", 
                "Page/Engine/payment.PaymentCreateBatch",
                "Page/Engine/payment.PaymentConfirmation", 
                "Page/Engine/payment.paymentRejected"
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;

          var pisMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/payment.paymentInitiationSearch"];

            if (pisMenu) {
                pisMenu.data = 0;
                    Payment.search({
                        'currentStage': 'PaymentInitiation'
                    }).$promise.then(function(response, headerGetter) {
                        pisMenu.data = pisMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        pisMenu.data = '-';
                    });
            }
            var pasMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/payment.PaymentApprovalSearch"];

            if (pasMenu) {
                pasMenu.data = 0;
                    Payment.search({
                        'currentStage': 'PaymentApproval'
                    }).$promise.then(function(response, headerGetter) {
                        pasMenu.data = pasMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        pasMenu.data = '-';
                    });
            }
            var prMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/payment.paymentRejected"];

            if (prMenu) {
                prMenu.data = 0;
                    Payment.search({
                        'currentStage': 'PaymentRejected'
                    }).$promise.then(function(response, headerGetter) {
                        prMenu.data = prMenu.data + Number(response.headers['x-total-count']);
                    }, function() {
                        prMenu.data = '-';
                    });
            }
           

        });
    }
]);
