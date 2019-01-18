irf.pageCollection.directive("irfQuestionnaire", function() {
    return {
        restrict: 'E',
        scope: {
            telecallingDetail: '='
        },
        templateUrl: 'modules/directives/templates/irf-questionnaire.html',
        controller: 'irfQuestionnaireController'
    }
}).controller('irfQuestionnaireController', ["$scope", "Queries", "Enrollment", function($scope, Queries, Enrollment) {
    $scope.questionnaireDetails = [];
    Queries.questionnaireDetails('TELECALLING', 'Enrollment', 'Stage02').then(
    function(res) {
        $scope.questionnaireDetails = res;
    },
    function(error) {
        console.log(error);
    });
}]);