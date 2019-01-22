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
    // $scope.questionnaireDetails = [];
    // Queries.questionnaireDetails('TELECALLING', 'Enrollment', 'Stage02').then(
    // function(res) {
    //     $scope.questionnaireDetails = res;
    // },
    // function(error) {
    //     console.log(error);
    // });
    // if($scope.telecallingDetail.telecallingQuestionnaireList.length>0 && $scope.questionnaireDetails.length>0) {
    //     $scope.questionnaireDetails.forEach(function(data) {
    //         var pos = _.findIndex($scope.telecallingDetail.telecallingQuestionnaireList, {'question':data.question});
    //         if(pos!= -1) {
    //             _.merge($scope.telecallingDetail.telecallingQuestionnaireList[0], data);
    //         }
    //     });
    // } else {
    //     $scope.telecallingDetail.telecallingQuestionnaireList = $scope.questionnaireDetails;
    // }
}]);