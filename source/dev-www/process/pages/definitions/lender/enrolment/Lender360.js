irf.pageCollection.controller(irf.controller("lender.enrolment.Lender360"), 
    ['$log','$q', '$scope', 'PageHelper', '$stateParams',
    'irfStorageService', 'SessionStore', 'PagesDefinition', 'GroupProcess', 'Product','LiabilityAccountProcess',
    function($log,$q, $scope, PageHelper, $stateParams,
        irfStorageService, SessionStore, PagesDefinition, GroupProcess, Product,LiabilityAccountProcess) {
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        PageHelper.clearErrors();
        $scope.lenderId = $stateParams.pageId;
        var fullDefinition = {
            "title": "LENDER360_DASHBOARD",
            "items": [
                "Page/Engine/lender.enrolment.Profile",
                {
                "title": "LOANS",
                "iconClass": "fa fa-key",
                "items": [
                    {
                        "title": "NEW_LOAN",
                        "iconClass": "fa fa-key",
                        "items": [
                            ]
                    },
                    "Page/Engine/lender.enrolment.View",
                ]
            }  
            ]
        };
        LiabilityAccountProcess.getLenderSchema().$promise.then(function(lenderSchemaResponse) {
            LiabilityAccountProcess.get({
                id: $scope.lenderId
            }).$promise.then(function(response) {
                PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
                    $scope.dashboardDefinition = resp;
                    $scope.customerSchema = lenderSchemaResponse;
                    $scope.initialize(response);
                });
            }, function(errorResponse) {
                PageHelper.showErrors(errorResponse);
            });
        });

        $scope.initialize = function(data) {
        $log.info(data);
        $scope.model = {liabilityAccount: data};
        $scope.introFormName = "introForm";
        $scope.pageTitle = 'LENDER_360'; 

        if ($scope.dashboardDefinition.$menuMap['Page/Engine/lender.enrolment.Profile'])
            $scope.dashboardDefinition.$menuMap['Page/Engine/lender.enrolment.Profile'].onClick = function(event, menu) {
            menu.stateParams.pageId = $scope.lenderId;
           // entityManager.setModel(menu.stateParams.pageName, $scope.model);
            return $q.resolve(menu);
        };
        if ($scope.dashboardDefinition.$menuMap['Page/Engine/lender.enrolment.View'])
            $scope.dashboardDefinition.$menuMap['Page/Engine/lender.enrolment.View'].onClick = function(event, menu) {
            menu.stateParams.pageId = $scope.lenderId;
           // entityManager.setModel(menu.stateParams.pageName, $scope.model);
            return $q.resolve(menu);
        };
        };

    }
]);