irf.pages.controller("Customer360Ctrl",
["$log", "$scope", "$stateParams","Queries", "$q", "formHelper", "SessionStore", "PagesDefinition", "Enrollment", 
"entityManager", "Utils", "PageHelper", "$filter", "$httpParamSerializer", "AuthTokenHelper",
function($log, $scope, $stateParams,Queries, $q, formHelper, SessionStore, PagesDefinition, Enrollment, 
	entityManager, Utils, PageHelper, $filter, $httpParamSerializer, AuthTokenHelper){
	$log.info("Customer360 loaded");

	$scope.branch = SessionStore.getBranch();
	$scope.role = SessionStore.getRole();
	$scope.customerId = $stateParams.pageId;
	var siteCode = SessionStore.getGlobalSetting('siteCode');
	$log.info($stateParams);
	//$scope.siteCode=$stateParams.pageData;
	$scope.formHelper = formHelper;

	var customerDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			(siteCode == 'sambandh') ? "Page/Engine/customer.IndividualEnrollment3" : "Page/Engine/customer360.CustomerProfile",
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
					"Page/Engine/customer360.loans.Service"	
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

	var enrollmentDefinition = {
		"title": "CUSTOMER_360",
		"items": [
			"Page/Engine/customer360.EnrollmentProfile",
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
					"Page/Engine/customer360.loans.Service"	
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
					"Page/Engine/customer360.loans.Service"
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
	}];

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

	var reportBox = {
		"type": "box",
		"title": "REPORTS",
		"colClass": "col-sm-12",
		"items": [{
			"type": "fieldset",
			"title": "Customer Statement"
		},{
			"type": "section",
			"htmlClass": "row",
			"items": [{
				"type": "section",
				"htmlClass": "col-sm-5",
				"items": [{
					"key": "reports.fromDate",
					"title": "FROM_DATE",
					"type": "date"
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-5",
				"items": [{
					"key": "reports.toDate",
					"title": "TO_DATE",
					"type": "date"
				}]
			},{
				"type": "section",
				"htmlClass": "col-sm-2",
				"items": [{
					"notitle": true,
					"title": "DOWNLOAD",
					"type": "button",
					"fieldHtmlClass": "btn-block",
					"onClick": function(model, form) {
						PageHelper.clearErrors();
						if (!model.reports || !model.reports.fromDate || !model.reports.toDate) {
							PageHelper.setError({message:"'From' date & 'To' date are required"});
							return;
						} else if (moment(model.reports.fromDate, SessionStore.getSystemDateFormat()).isAfter(moment(model.reports.toDate, SessionStore.getSystemDateFormat()), 'day')) {
							PageHelper.setError({message:"'From' date should be less than 'To' date"});
							return;
						} else if (moment(model.reports.toDate, SessionStore.getSystemDateFormat()).isAfter(moment(), 'day')) {
							PageHelper.setError({message:"'To' date cannot exceed today"});
							return;
						}
						var requestParams = {
							auth_token: AuthTokenHelper.getAuthData().access_token,
							report_name: "customer_statement",
							customer_id: model.customer.id,
							from_date: model.reports.fromDate,
							to_date: model.reports.toDate
						};
						url = irf.BI_BASE_URL + "/download.php?" + $httpParamSerializer(requestParams);
						Utils.downloadFile(url);
					}
				}]
			}]
		}]
	};

	Enrollment.getSchema().$promise.then(function(customerSchemaResponse) {
		Enrollment.get({
			id: $scope.customerId
		}).$promise.then(function(response) {
			var fullDefinition = customerDefinition;
			if (response.customerType === 'Enterprise') {
				fullDefinition = enterpriseDefinition;
			}
			if (siteCode == "KGFS") {
				fullDefinition = enrollmentDefinition;
			}
			$log.info("siteCode:" + $scope.siteCode);
			PagesDefinition.getUserAllowedDefinition(fullDefinition).then(function(resp) {
				$scope.dashboardDefinition = resp;
				$scope.customerSchema = customerSchemaResponse;
				$scope.initialize(response);
			});
		}, function(errorResponse) {
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

		$scope.introForm.push(reportBox);
		$log.info($scope.pageTitle);

		if($scope.siteCode == "KGFS")
		{
			$scope.introForm = customerPortfolioForm;
		}

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

		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer.IndividualEnrollment3']) {
			$scope.dashboardDefinition.$menuMap['Page/Engine/customer.IndividualEnrollment3'].onClick = function(event, menu) {
				menu.stateParams.pageId = $scope.customerId;
				return $q.resolve(menu);
			};
		}
		
		if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.EnrollmentProfile'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.EnrollmentProfile'].onClick = function(event, menu) {
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

        if ($scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.Service'])
		$scope.dashboardDefinition.$menuMap['Page/Engine/customer360.loans.Service'].onClick = function(event, menu) {
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