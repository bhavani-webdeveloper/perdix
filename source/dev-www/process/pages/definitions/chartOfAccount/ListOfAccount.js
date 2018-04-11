irf.pageCollection.directive("irfNestedList", function(){
    return {
        restrict: 'E',
        scope: { listData: '=irfNestedListDef'},
        replace: true,
        template: "<ul><member ng-repeat='member in listData' member= 'member'></member></ul>",
        link: function(scope, elem, attrs) {
            console.log("Inside irfNestedList directive");
        }
    }
});

irf.pageCollection.directive("member", function ($compile) {
    return {
        restrict: "E",
        replace: true,
        scope : {
            member: '='
        },
        template: "<li>{{member.glName}}</li>",
        link: function(scope, elem, attrs) {
            console.log("Inside member directive");
            if (angular.isArray(scope.member.children)) {
                elem.append("<irf-nested-list irf-nested-list-def='member.children'></irf-nested-list>");
                $compile(elem.contents())(scope)
            }
        }
    }
});

irf.pageCollection.controller(irf.controller("chartOfAccount.ListOfAccount"), ["$scope","$log", "$q", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
    'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Utils","BundleManager", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator", "ChartOfAccount",
    function($scope, $log, $q, SchemaResource, PageHelper, formHelper, elementsUtils,irfProgressMessage, SessionStore, $state, $stateParams, Utils, BundleManager, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator, ChartOfAccount) {
            console.log("Inside List of Accounts");
            PageHelper.clearErrors();
            $scope.$templateUrl = "process/pages/templates/chartOfAccount/ListOfAccount.html";
            $scope.model = {
                "readonly":1,
                "type": 1
            };

            var list_to_tree = function(list) {
                var node, roots = [], i;
                for (i = 0; i < list.length; i += 1) {
                    list[i].children = [];
                }

                for (i = 0; i < list.length; i += 1) {
                    node = list[i];
                    if (node.parentId != 0) {
                        for (j = 0; j < list.length; j++) {
                            if (node.parentId == list[j].id) {
                                list[j].children.push(node);
                            }
                        }
                    } else {
                        roots.push(node);
                    }
                }
                return roots;
            };


            var promise = ChartOfAccount.list().$promise;
            promise.then((res) => {
                console.log(list_to_tree(res));
                $scope.model.data = list_to_tree(res);

            }, (err) => {
                console.log(err);
                PageHelper.hideLoader();
            })


            $scope.formHelper = formHelper;
            // $scope.formName = irf.form($scope.pageName);
            $scope.initialize = function(model, form, formCtrl) {};
            // $scope.schema = function () {
            //     return ChartOfAccount.getSchema().$promise;
            // }
    }
]);
