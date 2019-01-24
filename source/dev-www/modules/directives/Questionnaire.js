irf.pageCollection.directive("irfQuestionnaire", function() {
    return {
        restrict: 'E',
        scope: {
            telecallingDetail: '=',
            questionnaireDetails: '='
        },
        templateUrl: 'modules/directives/templates/irf-questionnaire.html',
        controller: 'irfQuestionnaireController'
    }
}).controller('irfQuestionnaireController', ["$scope", "Queries", "Enrollment", function($scope, Queries, Enrollment) {
}]);