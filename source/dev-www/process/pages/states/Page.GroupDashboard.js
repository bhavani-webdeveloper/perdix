irf.pages.controller("PageGroupDashboardCtrl", ['$log', '$scope','PageHelper', '$stateParams','Groups',
    'irfStorageService','SessionStore', 'PagesDefinition',
    function($log, $scope,PageHelper, $stateParams, Groups, irfStorageService, SessionStore, PagesDefinition){
    $log.info("Page.GroupDashboard.html loaded");
    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Actions",
        "items": [
            "Page/Engine/GroupCRUD",
            "Page/Engine/DscQueue",
            "Page/Engine/Cgt1Queue",
            "Page/Engine/Cgt2Queue",
            "Page/Engine/Cgt3Queue",
            "Page/Engine/GrtQueue",
            // "Page/Engine/DscOverrideQueue",
            // "Page/Engine/ApplicationPendingQueue",
            // "Page/Engine/JLGDisbursementQueue",
            "Page/Engine/CloseGroup",
            "Page/Engine/loans.groups.GroupLoanRepaymentQueue"

        ]
    };

    var getDashboardCounts = function(){

        var partners = irfStorageService.getMaster('partner');

        var stages = {
            'dsc':{
                name:'Stage03',
                count:0
            },
            'cgt1':{
                name:'Stage04',
                count:0
            },
            'cgt2':{
                name:'Stage05',
                count:0
            },
            'cgt3':{
                name:'Stage06',
                count:0
            },
            'grt':{
                name:'Stage07',
                count:0
            }
        };
        var branchId = ""+SessionStore.getBranchId();
        angular.forEach(partners.data,function(partner){
            angular.forEach(stages,function(stage,key) {
                Groups.searchHeaders({'branchId':branchId,'partner': partner.name,'currentStage':stage.name,'groupStatus':true}, function(response,headerGetter){
                    var headers = headerGetter();

                    stage.count += Number(headers['x-total-count']);

                    switch(key){
                        case 'dsc': $scope.dashboardDefinition.items[1].data = stage.count; break;
                        case 'cgt1': $scope.dashboardDefinition.items[2].data = stage.count; break;
                        case 'cgt2': $scope.dashboardDefinition.items[3].data = stage.count; break;
                        case 'cgt3': $scope.dashboardDefinition.items[4].data = stage.count; break;
                        case 'grt': $scope.dashboardDefinition.items[5].data = stage.count; break;
                    }

                },function(response){
                    switch(key){
                        case 'dsc': $scope.dashboardDefinition.items[1].data = '-'; break;
                        case 'cgt1': $scope.dashboardDefinition.items[2].data = '-'; break;
                        case 'cgt2': $scope.dashboardDefinition.items[3].data = '-'; break;
                        case 'cgt3': $scope.dashboardDefinition.items[4].data = '-'; break;
                        case 'grt': $scope.dashboardDefinition.items[5].data = '-'; break;
                    }
                });
            });
        });
    };

    PagesDefinition.getUserAllowedDefinition(SessionStore.getLoginname(), fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        getDashboardCounts();
    });

}]);
