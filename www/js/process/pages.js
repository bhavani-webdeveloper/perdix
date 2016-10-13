
irf.HOME_PAGE = {
	"url": "Page/Engine",
	"to": "Page.Engine",
	"params": {
		"pageName": "audit.OpenAuditsQueue",
		"pageId": null
	},
	"options": {

	}
};

irf.pages.config([
	"$stateProvider", "irfElementsConfigProvider", "Model_ELEM_FC",
	function($stateProvider, elemConfig, Model_ELEM_FC) {
	var statesDefinition = [{
		name: "Page.Landing", // Favorites
		url: "/Landing",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageLandingCtrl"
	},{
		name: "Page.BIDashboard", // BI Dashboard
		url: "/BIDashboard",
		templateUrl: "process/pages/templates/Page.BIDashboard.html",
		controller: "PageBIDashboardCtrl"
	},{
		name: "Page.Customer360", // Customer360
		url: "/Customer360/:pageId",
		templateUrl: "process/pages/templates/Page.Customer360.html",
		controller: "Customer360Ctrl"
	},{
		name: "Page.CustomerHistory", // Customer360
		url: "/CustomerHistory/:pageId",
		templateUrl: "process/pages/templates/Page.CustomerHistory.html",
		controller: "CustomerHistoryCtrl"
	},{
		name: "Page.GroupDashboard",
		url: "/GroupDashboard",
		templateUrl: "process/pages/templates/Page.GroupDashboard.html",
		controller: "PageGroupDashboardCtrl"
	},{
		name: "Page.LoansDashboard",
		url: "/LoansDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansDashboardCtrl"
	},{
		name: "Page.LoansBookingDashboard",
		url: "/LoansBookingDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansBookingDashboardCtrl"
	},{
		name: "Page.LoansDisbursementDashboard",
		url: "/LoansDisbursementDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansDisbursementDashboardCtrl"
	},{
		name: "Page.LoansACHPDCDashboard",
		url: "/LoansACHPDCDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansACHPDCDashboardCtrl"
	},{
		name: "Page.LoansCollectionsDashboard",
		url: "/LoansCollectionsDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "LoansCollectionsDashboardCtrl"
	},{
		name: "Page.ManagementDashboard",
		url: "/ManagementDashboard",
		templateUrl: "process/pages/templates/Page.Dashboard.html",
		controller: "PageManagementDashboardCtrl"
	}];

	angular.forEach(statesDefinition, function(value, key){
		$stateProvider.state(value);
	});

	elemConfig.configFileUpload(Model_ELEM_FC);

	elemConfig.configPikaday({
		minDate: new Date(1800, 0, 1),
		maxDate: new Date(2050, 12, 31),
		yearRange: [1801, 2040],
		format: 'YYYY-MM-DD'
	});
}]);

irf.pages.controller("PageLandingCtrl",
	["$log", "$scope", "SessionStore", "PagesDefinition",
	function($log, $scope, SessionStore, PagesDefinition){
	$log.info("Page.Landing loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	var fullDefinition = {
		"title": "FAVORITES",
		"items": [
			"Page/Engine/CustomerSearch",
			"Page/Engine/loans.individual.PendingClearingQueue",
			"Page/Engine/loans.individual.PendingCashQueue",
			"Page/Engine/loans.individual.BounceQueue"
		]
	};

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
    });

}]);
irf.pages.controller("Customer360Ctrl",
["$log", "$scope", "$stateParams", "$q", "formHelper", "SessionStore", "PagesDefinition", "Enrollment", 
"entityManager", "Utils", "PageHelper", "$filter",
function($log, $scope, $stateParams, $q, formHelper, SessionStore, PagesDefinition, Enrollment, 
	entityManager, Utils, PageHelper, $filter){
	$log.info("Customer360 loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	$scope.formHelper = formHelper;

	var customerDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			"Page/Engine/customer360.CustomerProfile",
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					{
						"title": "NEW_LOAN",
						"iconClass": "fa fa-key",
						"items": [
							"Page/Engine/Loans.NewJewel",
							"Page/Engine/Loans.NewMEL"
						]
					},
					"Page/Engine/customer360.loans.View",
					"Page/Engine/Loans.Service"
				]
			},
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/CustomerHistory",
			"Page/Engine/customer360.Recapture"
		]
	};

	var enterpriseDefinition = {
		"title": "BUSINESS_360",
		"items": [
			"Page/Engine/customer360.BusinessProfile",
			{
				"title": "LOANS",
				"iconClass": "fa fa-key",
				"items": [
					"Page/Engine/loans.individual.booking.LoanInput",
					"Page/Engine/customer360.loans.View",
					"Page/Engine/Loans.Service"
				]
			},
			{
				"title": "REQUEST_RECAPTURE",
				"shortTitle": "REQUEST",
				"iconClass": "fa fa-lightbulb-o",
				"items": [
					"Page/Engine/customer360.RequestRecapturePhoto",
					"Page/Engine/customer360.RequestRecaptureFingerprint",
					"Page/Engine/customer360.RequestRecaptureGPS"
				]
			},
			"Page/CustomerHistory",
			"Page/Engine/customer360.Recapture"
		]
	};

	var customerPortfolioForm = [{
		"type": "box",
		"title": "PORTFOLIO",
		"colClass": "col-sm-12",
		"readonly": true,
		"items": [{
			"type": "section",
			"htmlClass": "row",
			"items": [{
				"type": "section",
				"htmlClass": "col-sm-4",
				"items": [{
					"key": "customer.photoImageId",
					"type": "file",
					"fileType": "image/*",
					"viewParams": function(modelValue, form, model) {
						return {
							customerId: model.customer.id
						};
					},
					"readonly": true,
					"notitle": true
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-6",
				"items": [{
					"key": "customer.nameWithAge",
					"title": "CUSTOMER_NAME"
				},{
					"key": "customer.dateOfBirth",
					"title": "T_DATEOFBIRTH",
					"type": "date"
				},{
					"key": "customer.mobilePhone",
					"title": "MOBILE_PHONE"
				},{
					"key": "customer.identityProofNo",
					"titleExpr": "model.customer.identityProof | translate"
				},{
					"key": "customer.idAndBcCustId",
					"title": "Id & Legacy Cust Id",
					"titleExpr": "('ID'|translate) + ' & ' + ('BC_CUST_ID'|translate)"
				},{
					"key": "customer.urnNo",
					"title": "URN_NO"
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-2 hidden-xs",
				"items": []
			}]
		}]
	}/*,{
		"type": "box",
		"title": "PRODUCT_SUMMARY",
		"colClass": "col-sm-12",
		"items": []
	}*/];

	var enterprisePortfolioForm = [{
		"type": "box",
		"title": "PORTFOLIO",
		"colClass": "col-sm-12",
		"readonly": true,
		"items": [{
			"type": "section",
			"htmlClass": "row",
			"items": [/*{
				"type": "section",
				"htmlClass": "col-sm-4",
				"items": [{
					"key": "customer.photoImageId",
					"type": "file",
					"fileType": "image/*",
					"viewParams": function(modelValue, form, model) {
						return {
							customerId: model.customer.id
						};
					},
					"readonly": true,
					"notitle": true
				}]
			},*/{
				"type": "section",
				"htmlClass": "col-sm-8",
				"items": [{
					"key": "customer.firstName",
					"title": "ENTITY_NAME"
				},{
					"key": "customer.enterprise.companyOperatingSince",
					"title": "OPERATING_SINCE",
					"type": "date"
				},{
					"key": "customer.latitude",
					"title": "BUSINESS_LOCATION",
					"type": "geotag",
					"latitude": "customer.latitude",
					"longitude": "customer.longitude"
				},{
					"key": "customer.urnNo",
					"title": "URN_NO"
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-2 hidden-xs",
				"items": []
			}]
		}]
	}];

	Enrollment.getSchema().$promise.then(function(customerSchemaResponse){
		Enrollment.get({id:$scope.customerId}).$promise.then(function(response){
			var fullDefinition = customerDefinition;
			if (response.customerType === 'Enterprise') {
				fullDefinition = enterpriseDefinition;
			}
			PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
				$scope.dashboardDefinition = resp;
				$scope.customerSchema = customerSchemaResponse;
				$scope.initialize(response);
			});
		}, function(errorResponse){
			PageHelper.showErrors(errorResponse);
		});
	});

	$scope.initialize = function(data) {
		$log.info(data);
		$scope.model = {customer: data};
		$scope.introFormName = "introForm";
		$scope.pageTitle = 'CUSTOMER_360';
		if (data.customerType === 'Enterprise') {
			$scope.introForm = enterprisePortfolioForm;
			//$scope.pageTitle = 'BUSINESS_360';
		} else {
			$scope.introForm = customerPortfolioForm;
		}
		$log.info($scope.pageTitle);

		$scope.model.customer.idAndBcCustId = data.id + ' / ' + data.bcCustId;
		$scope.model.customer.fullName = Utils.getFullName(data.firstName, data.middleName, data.lastName);

		$scope.dashboardDefinition.title = /*(data.urnNo ? (data.urnNo + ": ") : "") + */$scope.model.customer.fullName;

		$scope.model.customer.idAndUrn = data.id + ' | ' + data.urnNo;

		$scope.model.customer.age = moment().diff(moment(data.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
		$scope.model.customer.nameWithAge = $scope.model.customer.fullName + ' (' + data.age + ')';

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.CustomerProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.BusinessProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.BusinessProfile'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		var requestMenu = [$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecapturePhoto'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureFingerprint'],
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.RequestRecaptureGPS']];
		_.each(requestMenu, function(v,k){
			if (v) {
				v.onClick = function(event, menu) {
					menu.stateParams.pageId = $scope.customerId + menu.stateParams.pageId.substring(menu.stateParams.pageId.indexOf(':'));
					entityManager.setModel(menu.stateParams.pageName, $scope.model);
					return $q.resolve(menu);
				};
			}
		});

		if ($scope.dashboardDefinition.$menuMap['Page/CustomerHistory'])
		$scope.dashboardDefinition.$menuMap['Page/CustomerHistory'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.customerId;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.View'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.View'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.urnNo;
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Recapture'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.Recapture'].onClick = function(event, menu) {
			menu.stateParams.pageId = $scope.model.customer.id + ':FINGERPRINT';
			entityManager.setModel(menu.stateParams.pageName, $scope.model);
			return $q.resolve(menu);
		};

		if ($scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.LoanInput"])
		$scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.LoanInput"].onClick = function(event, menu) {
			var loanInput = {};
			try {
				loanInput = {
					loanAccount: {
						bankId: $filter('filter')(formHelper.enum("bank").data, {name:SessionStore.getBankName()}, true)[0].code,
						branchId: $filter('filter')(formHelper.enum("branch").data, {name:$scope.model.customer.kgfsName}, true)[0].code,
						urnNo: $scope.model.customer.urnNo,
						customerId: $scope.model.customer.id,
						loanCentre: {
							branchId: $scope.model.customer.kgfsName,
							centreId: $scope.model.customer.centreId
						}
					},
					additional: {
						branchName: $scope.model.customer.kgfsName
					},
					customer: {
						firstName: $scope.model.customer.firstName
					}
				};
			} catch (e) {}
			entityManager.setModel(menu.stateParams.pageName, loanInput);
			return $q.resolve(menu);
		};

	};

	$scope.initializeSF = function(model, form, formCtrl) {
	};

	$scope.actions = {};

}]);
irf.pages.controller("CustomerHistoryCtrl",
["$log", "$scope", "$stateParams", "$q", "formHelper", "SessionStore", "Enrollment", 
"entityManager", "Utils",
function($log, $scope, $stateParams, $q, formHelper, SessionStore, Enrollment, 
	entityManager, Utils){
	$log.info("Page.Landing.html loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.userid = SessionStore.getLoginname();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	$scope.formHelper = formHelper;

	var initialize = function(customerHistory) {
		$log.info(customerHistory);
		$scope.model = customerHistory;
		// $scope.model.customer.fullName = Utils.getFullName($scope.model.customer.firstName, $scope.model.customer.middleName, $scope.model.customer.lastName);
		// $scope.title = ($scope.model.customer.urnNo ? ($scope.model.customer.urnNo + ": ") : "") + $scope.model.customer.fullName;

		$scope._versions = [];
		$scope._history = {};
		for (var i = $scope.model.customerSnapshot.length - 1; i >= 0; i--) {
			var snapshot = $scope.model.customerSnapshot[i];
			var key = snapshot.version + ' - ' + snapshot.userId;
			$scope._history[key] = snapshot;
			$scope._versions.push(key);
		};
	};

	Enrollment.getWithHistory({id:$scope.customerId}).$promise.then(function(response){
		initialize(response);
	}, function(errorResponse){

	});

}]);
irf.pages.controller("PageDashboardCtrl", function($log, $scope, $stateParams){
	$log.info("Page.Dashboard.html loaded");

});
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
            "Page/Engine/DscOverrideQueue",
            "Page/Engine/ApplicationPendingQueue",
            "Page/Engine/JLGDisbursementQueue",
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
            },
            'ap':{
                name:'StageAP',
                count:0
            },
            'disbursement':{
                name:'Stage08',
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

irf.pages.controller("PageManagementDashboardCtrl",
	["$log", "$scope", "$stateParams", "formHelper", "SessionStore",
	function($log, $scope, $stateParams, formHelper, SessionStore){
	$log.info("Page.MgmtDash.html loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();

	$scope.dashboardDefinition = {
		"title": "MANAGEMENT_DASHBOARD",
		"items": [
			{
				"id": "VillageSearch",
				"title": "VILLAGE",
				"state": "Page.Engine",
				"iconClass": "fa fa-search",
				"stateParams": {
					"pageName": "VillageSearch",
					"pageId": null
				}
			},
			{
				"id": "VillageCRU",
				"title": "ADD_VILLAGE",
				"state": "Page.Engine",
				"iconClass": "fa fa-tree",
				"stateParams": {
					"pageName": "Management_VillageCRU",
					"pageId": null
				}
			},
			{
				"id": "CentreSearch",
				"title": "CENTRE",
				"state": "Page.Engine",
				"iconClass": "fa fa-search",
				"stateParams": {
					"pageName": "CentreSearch",
					"pageId": null
				}
			},
			{
				"id": "CentreCRU",
				"title": "ADD_CENTRE",
				"state": "Page.Engine",
				"iconClass": "fa fa-home",
				"stateParams": {
					"pageName": "Management_CentreCRU",
					"pageId": null
				}
			}
		]
	};

}]);
irf.pages.controller("LoansDashboardCtrl", ['$log', '$scope','PageHelper', '$stateParams',
    'irfStorageService', 'PagesDefinition',
    function($log, $scope,PageHelper, $stateParams, irfStorageService, PagesDefinition){
    $log.info("Page.LoansDashboard.html loaded");
    PageHelper.clearErrors();
    var fullDefinition = {
        "title": "Loans Dashboard",
        "items": [
            "Page/Engine/loans.individual.booking.LoanBookingQueue",
            "Page/Engine/loans.individual.PendingClearingQueue",
            "Page/Engine/loans.individual.PendingCashQueue",
            "Page/Engine/loans.individual.BounceQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp){
        $scope.dashboardDefinition = resp;
        $log.info(resp);
        $scope.dashboardDefinition.$menuMap['Page/Engine/loans.individual.booking.LoanBookingQueue'].data=10; // TODO remove hardcoding
    });

}]);

irf.pages.controller("LoansBookingDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'IndividualLoan',
function($log, $scope, PagesDefinition, SessionStore, IndividualLoan) {
    $log.info("Page.LoansBookingDashboard.html loaded");

    var fullDefinition = {
        "title": "Loan Booking Dashboard",
        "iconClass": "fa fa-book",
        "items": [
            "Page/Engine/loans.individual.booking.LoanInput",
            "Page/Engine/loans.individual.booking.PendingQueue",
            "Page/Engine/loans.individual.booking.DocumentUploadQueue",
            "Page/Engine/loans.individual.booking.PendingVerificationQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        var pqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.PendingQueue"];
        if (pqMenu) {
            IndividualLoan.search({
                'stage': 'LoanBooking',
                'branchName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var duqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.DocumentUploadQueue"];
        if (duqMenu) {
            IndividualLoan.search({
                'stage': 'DocumentUpload',
                'branchName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                duqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var pvqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.booking.PendingVerificationQueue"];
        if (pvqMenu) {
            IndividualLoan.search({
                'stage': 'DocumentVerification',
                'branchName': '',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pvqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }
    });

}]);
irf.pages.controller("LoansDisbursementDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'IndividualLoan',
function($log, $scope, PagesDefinition, SessionStore, IndividualLoan) {
    $log.info("Page.LoansDisbursementDashboard.html loaded");

    var fullDefinition = {
        "title": "Disbursement Dashboard",
        "iconClass": "fa fa-share",
        "items": [
            "Page/Engine/loans.individual.disbursement.ReadyForDisbursementQueue",
            "Page/Engine/loans.individual.disbursement.DisbursementConfirmationQueue",
            "Page/Engine/loans.individual.disbursement.RejectedDisbursementQueue",
            "Page/Engine/loans.individual.disbursement.MultiTrancheQueue",
            "Page/Engine/loans.individual.disbursement.PendingFROQueue",
            "Page/Engine/loans.individual.disbursement.PendingCROQueue",
            "Page/Engine/loans.individual.disbursement.EMIScheduleGenQueue",
            "Page/Engine/loans.individual.disbursement.MultiDocVerificationQueue"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        var rfdqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.ReadyForDisbursementQueue"];
        if (rfdqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'ReadyForDisbursement',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                rfdqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var dcqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.DisbursementConfirmationQueue"];
        if (dcqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'DisbursementConfirmation',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                dcqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var rdqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.RejectedDisbursementQueue"];
        if (rdqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'RejectedDisbursement',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                rdqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var mtqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.MultiTrancheQueue"];
        if (mtqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'MTDisbursementDataCapture',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                mtqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var pfroqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.PendingFROQueue"];
        if (pfroqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'FROApproval',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pfroqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var pcroqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.PendingCROQueue"];
        if (pcroqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'CROApproval',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                pcroqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var emisgqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.EMIScheduleGenQueue"];
        if (emisgqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'DocumentUpload',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                emisgqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var mdvqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.disbursement.MultiDocVerificationQueue"];
        if (mdvqMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'DocumentVerification',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                mdvqMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }
    });

}]);
irf.pages.controller("LoansACHPDCDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'IndividualLoan',
function($log, $scope, PagesDefinition, SessionStore, IndividualLoan) {
    $log.info("Page.LoansACHPDCDashboard.html loaded");

    var fullDefinition = {
        "title": "ACH / PDC Dashboard",
        "iconClass": "fa fa-cc",
        "items": [
            "Page/Engine/loans.individual.achpdc.ACHPDCQueue",
            "Page/Engine/loans.individual.achpdc.ACHRegistration",
            "Page/Engine/loans.individual.achpdc.ACHMandateDownload",
            "Page/Engine/loans.individual.achpdc.ACHMandateQueue",
            "Page/Engine/loans.individual.achpdc.ACHDemandDownload",
            "Page/Engine/loans.individual.achpdc.ACHClearingCollection",
            "Page/Engine/loans.individual.achpdc.PDCRegistration",
            "Page/Engine/loans.individual.achpdc.PDCDemandDownload",
            "Page/Engine/loans.individual.achpdc.PDCCollections",
            "Page/Engine/loans.individual.achpdc.DemandDownloads"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        var qMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.achpdc.ACHPDCQueue"];
        if (qMenu) {
            IndividualLoan.searchDisbursement({
                'currentStage': 'ReadyForDisbursement',
                'page': 1,
                'per_page': 1
            }).$promise.then(function(response,headerGetter){
                qMenu.data = response.headers['x-total-count'];
            }, function() {
                cvqMenu.data = '-';
            });
        }
    });

}]);
irf.pages.controller("LoansCollectionsDashboardCtrl",
['$log', '$scope', 'PagesDefinition', 'SessionStore', 'LoanProcess',
function($log, $scope, PagesDefinition, SessionStore, LoanProcess) {
    $log.info("Page.LoansCollectionsDashboard.html loaded");

    var fullDefinition = {
        "title": "Collections Dashboard",
        "iconClass": "fa fa-reply",
        "items": [
            "Page/Engine/loans.individual.collections.BounceQueue",
            "Page/Engine/loans.individual.collections.BouncePromiseQueue",
            "Page/Engine/loans.individual.collections.BounceRecoveryQueue",
            "Page/Engine/loans.individual.collections.CreditValidationQueue",
            "Page/Engine/loans.individual.collections.TransactionAuthorizationQueue",
            "Page/Engine/loans.individual.collections.DepositStage"
        ]
    };

    PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
        $scope.dashboardDefinition = resp;
        var branchId = SessionStore.getBranchId();

        var bqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.BounceQueue"];
        if (bqMenu) {
            var centres = SessionStore.getCentres();
            bqMenu.data = 0;
            for (var i = 0; i < centres.length; i++) {
                LoanProcess.bounceCollectionDemand({ 'branchId': branchId, 'centreId': centres[i].id }).$promise.then(function(response,headerGetter){
                    bqMenu.data += response.body.length; // Number(headerGetter()['x-total-count']);
                }, function() {
                    cvqMenu.data = '-';
                });
            };
        }

        var bpqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.BouncePromiseQueue"];
        if (bpqMenu) {
            LoanProcess.bounceCollectionDemand({ 'branchId': branchId }).$promise.then(function(response,headerGetter){
                bpqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var brqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.BounceRecoveryQueue"];
        if (brqMenu) {
            LoanProcess.p2pKGFSList({
                'branchId': branchId,
                'customerCategoryHubManager':'C,D'
            }).$promise.then(function(response,headerGetter){
                brqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var cvqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.CreditValidationQueue"];
        if (cvqMenu) {
            LoanProcess.repaymentList({
                'status': 'Pending'
            }).$promise.then(function(response,headerGetter){
                cvqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                cvqMenu.data = '-';
            });
        }

        var taqMenu = $scope.dashboardDefinition.$menuMap["Page/Engine/loans.individual.collections.TransactionAuthorizationQueue"];
        if (taqMenu) {
            LoanProcess.repaymentList({
                'status': 'PartialPayment'
            }).$promise.then(function(response,headerGetter){
                taqMenu.data = response.body.length; // Number(headerGetter()['x-total-count']);
            }, function() {
                taqMenu.data = '-';
            });
        }
    });

}]);