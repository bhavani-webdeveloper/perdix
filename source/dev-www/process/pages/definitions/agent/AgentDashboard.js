irf.pageCollection.controller(irf.controller("agent.AgentDashboard"), ['$log', '$scope', "formHelper", "$state", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Messaging",
    function($log, $scope, formHelper, $state, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Messaging) {
        $log.info("Page.AgentDashboard.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();


        /* ScreeningQueue : KYC & CB SUBMISSION queue,
           ScreeningReviewQueue : Kyc and cb review ,
           Application Queue : Appraisal Queue ,
           Application Review Queue : Appraisal Review Queue,
           Zonal RiskReview Queue : Tele Verification ,
           Central Risk Review Queue : Evaluation ,         
        */

        var fullDefinition = {
            "title": "Agent Dashboard",
            "iconClass": "fa fa-users-secret",
            "items": [
                "Page/Bundle/agent.IndividualAgentEnrollmentScreening",
                "Page/Bundle/agent.EnterpriseAgentEnrollmentScreening",
                "Page/Engine/agent.EnrollAgent",
                "Page/Engine/agent.ApproveAgent",
                "Page/Engine/agent.AgentSearch",
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();
        });
    }
]);