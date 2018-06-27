irf.pageCollection.controller(irf.controller("agent.AgentDashboard"),
 ['$log', '$scope', "formHelper", "$state","Agent", "$q", "Utils", 'PagesDefinition', 'SessionStore', "entityManager", "IndividualLoan", "LoanBookingCommons", "Messaging",
    function($log, $scope, formHelper, $state,Agent, $q, Utils, PagesDefinition, SessionStore, entityManager, IndividualLoan, LoanBookingCommons, Messaging) {
        $log.info("Page.AgentDashboard.html loaded");
        $scope.$templateUrl = "process/pages/templates/Page.Dashboard.html";
        var currentBranch = SessionStore.getCurrentBranch();

        var fullDefinition = {
            "title": "Agent Dashboard",
            "iconClass": "fa fa-users-secret",
            "items": [
                "Page/Bundle/agent.IndividualAgentEnrollmentScreening",
                "Page/Bundle/agent.EnterpriseAgentEnrollmentScreening",
                "Page/Engine/agent.EnrollAgent",
                "Page/Engine/agent.ApproveAgent",
                "Page/Engine/agent.AgentSearch",
                "Page/Engine/agent.AgentRejectedQueue"                  
            ]
        };

        PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
            $scope.dashboardDefinition = resp;
            var branchId = SessionStore.getBranchId();
            var branchName = SessionStore.getBranch();
            var centres = SessionStore.getCentres();

            var approveAgent  = $scope.dashboardDefinition.$menuMap["Page/Engine/agent.ApproveAgent"];
            if (approveAgent) {
                approveAgent.data = '-';
                Agent.search({
                    'agentId': '',
                    'currentStage': 'PendingForApproval',
                    'page': 1,
                    'per_page': 1
                }, function(response) {
                    approveAgent.data = Number(response.headers['x-total-count']) || 0;
                });
            }

            var enrollAgent  = $scope.dashboardDefinition.$menuMap["Page/Engine/agent.EnrollAgent"];
            if (enrollAgent) {
                enrollAgent.data = '-';
                Agent.search({
                    'agentId': '',
                    'currentStage': 'AgentInitiation',
                    'page': 1,
                    'per_page': 1
                }, function(response) {
                    enrollAgent.data = Number(response.headers['x-total-count']) || 0;
                });
            }


            var agentSearch = $scope.dashboardDefinition.$menuMap["Page/Engine/agent.AgentSearch"];
            if (agentSearch) {
                agentSearch.data = '-';
                Agent.search({
                    'agentId': '',
                    'currentStage': 'Approved',
                    'page': 1,
                    'per_page': 1
                }, function(response) {
                    agentSearch.data = Number(response.headers['x-total-count']) || 0;
                });
            }

            var agentReject = $scope.dashboardDefinition.$menuMap["Page/Engine/agent.AgentRejectedQueue"];
            if (agentReject) {
                agentReject.data = '-';
                Agent.search({
                    'agentId': '',
                    'currentStage': 'Rejected',
                    'page': 1,
                    'per_page': 1
                }, function(response) {
                    agentReject.data = Number(response.headers['x-total-count']) || 0;
                });
            }
            
        });
    }
]);