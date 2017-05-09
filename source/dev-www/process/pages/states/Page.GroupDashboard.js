irf.pages.controller("PageGroupDashboardCtrl", ['$log', '$scope','PageHelper', '$stateParams','Groups',
    'irfStorageService','SessionStore', 'PagesDefinition',
    function($log, $scope,PageHelper, $stateParams, Groups, irfStorageService, SessionStore, PagesDefinition){
    $log.info("Page.GroupDashboard.html loaded");
    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Actions",
        "items": [
            "Page/Engine/loans.group.CreateGroup",
            "Page/Engine/loans.group.DscQueue",
            "Page/Engine/loans.group.Cgt1Queue",
            "Page/Engine/loans.group.Cgt2Queue",
            "Page/Engine/loans.group.Cgt3Queue",
            "Page/Engine/loans.group.GrtQueue",
            "Page/Engine/DscOverrideQueue",
            "Page/Engine/ApplicationPendingQueue",
            "Page/Engine/JLGDisbursementQueue",
            "Page/Engine/loans.group.CloseGroup",
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
            },
            'ap':{
                name:'StageAP',
                count:0
            },
            'disbursement':{
                name:'Stage08',
                count:0
            },
            'View':{
                name:'',
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
                        case 'ap': $scope.dashboardDefinition.items[7].data = stage.count; break;
                        case 'disbursement': $scope.dashboardDefinition.items[8].data = stage.count; break;
                        case 'View': $scope.dashboardDefinition.items[9].data = stage.count; break;
                    }

                },function(response){
                    switch(key){
                        case 'dsc': $scope.dashboardDefinition.items[1].data = '-'; break;
                        case 'cgt1': $scope.dashboardDefinition.items[2].data = '-'; break;
                        case 'cgt2': $scope.dashboardDefinition.items[3].data = '-'; break;
                        case 'cgt3': $scope.dashboardDefinition.items[4].data = '-'; break;
                        case 'grt': $scope.dashboardDefinition.items[5].data = '-'; break;
                        case 'ap': $scope.dashboardDefinition.items[7].data = '-'; break;
                        case 'disbursement': $scope.dashboardDefinition.items[8].data = '-'; break;
                        case 'View': $scope.dashboardDefinition.items[9].data = '-'; break;
                    }
                });
            });

        });

        //dsc override list
        Groups.getDscOverrideListHead({

            
        },function (resp,headerGetter) {
            var headers = headerGetter();
            $scope.dashboardDefinition.items[6].data = Number(headers['x-total-count']);

        },function(resp){
            $scope.dashboardDefinition.items[6].data = '-';
        });
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        getDashboardCounts();
    });

}]);
